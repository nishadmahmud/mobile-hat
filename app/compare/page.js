"use client";

import { useEffect, useMemo, useState } from "react";
import { useCompare } from "../../context/CompareContext";
import { getProductById, searchProducts } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";

const MAX_COMPARE_SLOTS = 3;
const EMPTY_SLOTS = Array(MAX_COMPARE_SLOTS).fill(null);

const toSlug = (name = "", id = "") =>
  name ? `${name.toLowerCase().replace(/\s+/g, "-")}-${id}` : String(id || "");

function mapSearchResult(p) {
  const basePrice = Number(p.retails_price || p.discounted_price || 0);
  const discountValue = Number(p.discount || 0);
  const discountType = String(p.discount_type || "").toLowerCase();
  const hasDiscount = discountValue > 0 && discountType !== "0";

  const finalPrice = hasDiscount
    ? discountType === "percentage"
      ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100)))
      : Math.max(0, basePrice - discountValue)
    : basePrice;

  return {
    id: p.id,
    name: p.name,
    brand: p.brand_name || p.brands?.name || "",
    price: finalPrice,
    oldPrice: hasDiscount ? basePrice : 0,
    imageUrl:
      p.image_path ||
      p.image_path1 ||
      p.image_path2 ||
      (Array.isArray(p.image_paths) && p.image_paths[0]) ||
      "/no-image.svg",
  };
}

function mapDetailedProduct(p) {
  const basePrice = Number(p.retails_price || 0);
  const discountValue = Number(p.discount || 0);
  const discountType = String(p.discount_type || "").toLowerCase();
  const hasDiscount = discountValue > 0 && discountType !== "0";
  const finalPrice = hasDiscount
    ? discountType === "percentage"
      ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100)))
      : Math.max(0, basePrice - discountValue)
    : basePrice;

  const specsFromApi = Array.isArray(p.specifications)
    ? p.specifications
        .filter(
          (s) =>
            s &&
            typeof s.name === "string" &&
            s.name.trim() &&
            String(s.description || "").trim()
        )
        .map((s) => ({
          name: s.name.trim(),
          value: String(s.description || "").replace(/<[^>]+>/g, " ").trim(),
        }))
    : [];

  const fallbackSpecs = [
    { name: "Brand", value: p.brand_name || p.brands?.name || "—" },
    { name: "Model", value: p.name || "—" },
    { name: "SKU", value: p.sku || p.product_code || "—" },
    {
      name: "Status",
      value: p.status || (Number(p.current_stock || 0) > 0 ? "In Stock" : "Stock Out"),
    },
  ];

  return {
    id: p.id,
    name: p.name || "Product",
    brand: p.brand_name || p.brands?.name || "—",
    price: finalPrice,
    oldPrice: hasDiscount ? basePrice : 0,
    imageUrl:
      (Array.isArray(p.images) && p.images[0]) ||
      p.image_path ||
      (Array.isArray(p.image_paths) && p.image_paths[0]) ||
      "/no-image.svg",
    specs: specsFromApi.length > 0 ? specsFromApi : fallbackSpecs,
  };
}

export default function ComparePage() {
  const { items, addToCompare, removeFromCompare } = useCompare();
  const [slotQueries, setSlotQueries] = useState(["", "", ""]);
  const [slotSearching, setSlotSearching] = useState([false, false, false]);
  const [slotResults, setSlotResults] = useState([[], [], []]);
  const [slotProducts, setSlotProducts] = useState(EMPTY_SLOTS);

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      const padded = [...items].slice(0, MAX_COMPARE_SLOTS);
      while (padded.length < MAX_COMPARE_SLOTS) padded.push(null);

      const details = await Promise.all(
        padded.map(async (item) => {
          if (!item?.id) return null;
          try {
            const res = await getProductById(item.id);
            const payload = res?.data || res;
            return payload?.id ? mapDetailedProduct(payload) : null;
          } catch {
            return null;
          }
        })
      );

      if (active) setSlotProducts(details);
    };
    hydrate();
    return () => {
      active = false;
    };
  }, [items]);

  const handleSearch = async (idx, query) => {
    const q = query.trim();
    setSlotQueries((prev) => prev.map((v, i) => (i === idx ? query : v)));
    if (!q) {
      setSlotResults((prev) => prev.map((v, i) => (i === idx ? [] : v)));
      return;
    }

    setSlotSearching((prev) => prev.map((v, i) => (i === idx ? true : v)));
    try {
      const res = await searchProducts(q);
      const payload = res?.data || res;
      const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      setSlotResults((prev) =>
        prev.map((v, i) => (i === idx ? list.slice(0, 8).map(mapSearchResult) : v))
      );
    } catch {
      setSlotResults((prev) => prev.map((v, i) => (i === idx ? [] : v)));
    } finally {
      setSlotSearching((prev) => prev.map((v, i) => (i === idx ? false : v)));
    }
  };

  const handlePickProduct = async (idx, product) => {
    if (!product?.id) return;
    const existingAtSlot = slotProducts[idx];
    if (existingAtSlot?.id && existingAtSlot.id !== product.id) {
      removeFromCompare(existingAtSlot.id);
    }
    addToCompare({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: `৳ ${Number(product.price || 0).toLocaleString("en-IN")}`,
      oldPrice: product.oldPrice ? `৳ ${Number(product.oldPrice).toLocaleString("en-IN")}` : null,
      imageUrl: product.imageUrl,
    });
    setSlotQueries((prev) => prev.map((v, i) => (i === idx ? "" : v)));
    setSlotResults((prev) => prev.map((v, i) => (i === idx ? [] : v)));
  };

  const compareRows = useMemo(() => {
    const rowOrder = [];
    const rowMap = new Map();

    slotProducts.forEach((p) => {
      if (!p?.specs) return;
      p.specs.forEach((s) => {
        const key = String(s.name || "").trim();
        if (!key) return;
        if (!rowMap.has(key)) {
          rowMap.set(key, ["", "", ""]);
          rowOrder.push(key);
        }
      });
    });

    slotProducts.forEach((p, idx) => {
      if (!p) return;
      rowMap.set("Brand", rowMap.get("Brand") || ["", "", ""]);
      rowMap.set("Model", rowMap.get("Model") || ["", "", ""]);
      rowMap.set("Price", rowMap.get("Price") || ["", "", ""]);
      rowMap.get("Brand")[idx] = p.brand || "—";
      rowMap.get("Model")[idx] = p.name || "—";
      rowMap.get("Price")[idx] = `৳ ${Number(p.price || 0).toLocaleString("en-IN")}`;

      p.specs.forEach((s) => {
        const key = String(s.name || "").trim();
        if (!key) return;
        rowMap.get(key)[idx] = s.value || "—";
      });
    });

    const leading = ["Brand", "Model", "Price"];
    const ordered = [...leading, ...rowOrder.filter((r) => !leading.includes(r))];

    return ordered
      .filter((name) => rowMap.has(name))
      .map((name) => ({ label: name, values: rowMap.get(name) || ["", "", ""] }));
  }, [slotProducts]);

  return (
    <div className="bg-white min-h-screen pb-10">
      <div className="max-w-[1550px] mx-auto px-2 md:px-4 pt-3 md:pt-6">
        <h1 className="text-[44px] md:text-[52px] leading-[1.05] font-extrabold tracking-tight text-[#1f2937] mb-4">
          Compare Selected Product
        </h1>

        <div className="border border-[#d9d9d9] rounded-md overflow-visible">
          <div className="grid grid-cols-4">
            <div className="border-r border-[#d9d9d9] p-4 bg-[#f7f7f7]">
              <h2 className="text-[22px] md:text-[24px] font-extrabold leading-tight text-[#27272a] mb-2">Compare Products</h2>
              <p className="text-[20px] md:text-[22px] text-[#52525b] leading-[1.25] font-normal">
                Find and select products to see the differences and similarities between them
              </p>
            </div>

            {[0, 1, 2].map((idx) => {
              const selected = slotProducts[idx];
              return (
                <div key={idx} className="relative border-r last:border-r-0 border-[#d9d9d9] p-4 overflow-visible">
                  <div className="relative z-20">
                    <input
                      type="text"
                      value={slotQueries[idx]}
                      onChange={(e) => handleSearch(idx, e.target.value)}
                      placeholder="Search..."
                      className="w-full h-9 rounded-full border border-[#e4e4e7] pl-9 pr-3 text-[13px] outline-none"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] w-4 h-4" />
                  </div>

                  {slotQueries[idx].trim() && slotResults[idx].length > 0 && (
                    <div className="absolute left-4 right-4 top-[56px] z-40 border border-[#e4e4e7] rounded-lg bg-white shadow-[0_12px_32px_rgba(15,23,42,0.16)] max-h-52 overflow-y-auto">
                      {slotResults[idx].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handlePickProduct(idx, r)}
                          className="w-full text-left px-3 py-2 border-b last:border-b-0 hover:bg-orange-50"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-10 h-10 rounded-md border border-[#e5e7eb] bg-white overflow-hidden shrink-0">
                              <Image
                                src={r.imageUrl || "/no-image.svg"}
                                alt={r.name}
                                fill
                                className="object-contain p-1"
                                unoptimized
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13px] font-semibold text-[#111827] truncate">{r.name}</div>
                              <div className="mt-0.5 flex items-center gap-2">
                                <span className="text-[12px] text-[#6b7280] truncate">{r.brand || "—"}</span>
                                <span className="text-[12px] font-bold text-[#111827]">
                                  ৳ {Number(r.price || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {slotSearching[idx] && (
                    <p className="mt-2 text-[11px] text-[#71717a]">Searching...</p>
                  )}

                  <div className="mt-6">
                    {selected ? (
                      <>
                        <div className="w-full h-[112px] relative mb-4">
                          <Image
                            src={selected.imageUrl || "/no-image.svg"}
                            alt={selected.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>

                        <h3 className="text-[18px] font-semibold text-[#27272a] line-clamp-2 min-h-[52px] leading-[1.2]">
                          {selected.name}
                        </h3>

                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-[28px] md:text-[30px] font-extrabold text-[#111827] leading-none">
                            ৳ {Number(selected.price || 0).toLocaleString("en-IN")}
                          </span>
                          {selected.oldPrice > selected.price && (
                            <span className="text-[17px] text-[#7c8595] line-through mb-0.5">
                              {Number(selected.oldPrice).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => selected?.id && removeFromCompare(selected.id)}
                            className="h-9 px-4 rounded-full border border-[#e4e4e7] text-[14px] text-[#3f3f46] hover:bg-gray-50"
                          >
                            Remove
                          </button>
                          <Link
                            href={`/product/${toSlug(selected.name, selected.id)}`}
                            className="h-9 px-5 rounded-full bg-[#ff8a1f] text-white text-[14px] font-semibold inline-flex items-center"
                          >
                            Shop Now
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="h-[210px] flex items-center justify-center text-[14px] text-[#a1a1aa]">
                        Select product
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {compareRows.map((row) => (
            <div key={row.label} className="grid grid-cols-4 border-t border-[#d9d9d9]">
              <div className="bg-[#f7f7f7] border-r border-[#d9d9d9] px-4 py-3 text-[14px] font-medium text-[#52525b]">
                {row.label}
              </div>
              {[0, 1, 2].map((idx) => (
                <div
                  key={`${row.label}-${idx}`}
                  className="border-r last:border-r-0 border-[#d9d9d9] px-4 py-3 text-[14px] text-[#3f3f46] leading-5"
                >
                  {row.values[idx] || ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

