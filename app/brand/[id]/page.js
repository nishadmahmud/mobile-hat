import Image from "next/image";
import Link from "next/link";
import ProductCard from "../../../components/Shared/PremiumProductCard";
import { getBrandwiseProducts } from "../../../lib/api";

export default async function BrandProductsPage({ params, searchParams }) {
  const resolvedParams = (params && typeof params.then === "function") ? await params : params;
  const resolvedSearchParams = (searchParams && typeof searchParams.then === "function") ? await searchParams : searchParams;

  const brandId = Number(resolvedParams?.id);
  const page = Number(resolvedSearchParams?.page || 1);

  if (!Number.isFinite(brandId) || brandId <= 0) {
    return (
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-16">
        <p className="text-sm text-red-500">Invalid brand.</p>
      </div>
    );
  }

  let items = [];
  let brandName = "Brand";
  let brandImage = null;

  try {
    const res = await getBrandwiseProducts(brandId, page, 24);
    const payload = res?.data || res;
    const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

    items = list.map((p) => {
      const basePrice = Number(p.retails_price || p.discounted_price || 0);
      const discountValue = Number(p.discount || 0);
      const discountType = String(p.discount_type || "").toLowerCase();
      const hasDiscount = discountValue > 0 && discountType !== "0";

      const price = hasDiscount
        ? discountType === "percentage"
          ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100)))
          : Math.max(0, basePrice - discountValue)
        : basePrice;

      const imageUrl =
        p.image_path ||
        p.image_path1 ||
        p.image_path2 ||
        (Array.isArray(p.image_paths) && p.image_paths[0]) ||
        "/no-image.svg";

      const inferredBrandName = p.brand_name || p.brands?.name || p.brand?.name;
      if (inferredBrandName) brandName = inferredBrandName;
      const inferredBrandImage = p.brand_image || p.brands?.image || p.brand?.image;
      if (inferredBrandImage) brandImage = inferredBrandImage;

      return {
        id: p.id,
        name: p.name,
        price: `৳ ${price.toLocaleString("en-IN")}`,
        oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString("en-IN")}` : null,
        discount: hasDiscount
          ? discountType === "percentage"
            ? `-${discountValue}%`
            : `৳ ${discountValue.toLocaleString("en-IN")}`
          : null,
        imageUrl: imageUrl?.toString().trim(),
        brand: inferredBrandName || "",
        hasVariants: Number(p.have_variant || p.have_variants || 0) === 1,
      };
    });
  } catch {
    // ignore – show empty state
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-[1550px] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {brandImage ? (
              <div className="w-10 h-10 rounded-full border border-gray-200 bg-white overflow-hidden relative">
                <Image src={brandImage} alt={brandName} fill className="object-contain p-1" unoptimized />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50" />
            )}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Brand</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{brandName}</h1>
            </div>
          </div>

          <Link href="/" className="text-sm font-bold text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>

      <div className="max-w-[1550px] mx-auto px-4 md:px-8 pt-10">
        {items.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No products found for this brand.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
