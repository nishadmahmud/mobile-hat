"use client";

import Link from "next/link";
import Image from "next/image";
import { FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

export default function PremiumProductCard({
    product,
    variant = "default",
    showUsedTag = false,
    /** Small corner mark on the product image (off by default). */
    showBrandCornerBadge = false,
}) {
    const isFlash = variant === "flash";
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    const slug = product.name
        ? `${product.name.toLowerCase().replace(/\s+/g, "-")}-${product.id}`
        : String(product.id);

    const displayPrice =
        product.price ||
        (product.retails_price ? `৳ ${Number(product.retails_price).toLocaleString("en-IN")}` : "");
    const displayOldPrice = product.oldPrice || null;

    const badge = product.discount || null;
    const discountBadge = badge
        ? String(badge).toUpperCase().includes("OFF")
            ? String(badge)
            : `${badge} OFF`
        : null;

    const imgSrc = (product.imageUrl || product.image_path || product.image || "/no-image.svg")
        ?.toString()
        .trim();

    const seedProductDetails = () => {
        if (typeof window === "undefined" || !product?.id) return;
        try {
            sessionStorage.setItem(
                `mobile_hat_pdp_seed_${product.id}`,
                JSON.stringify({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.oldPrice || null,
                    discount: product.discount || null,
                    imageUrl: imgSrc,
                    brand: product.brand || product.rawSource?.brand_name || null,
                    rawPrice: product.rawPrice,
                    retails_price: product.retails_price || product.rawSource?.retails_price,
                    rawImeis: product.rawImeis || product.imeis || [],
                    category: product.category || product.rawSource?.category || null,
                    category_id: product.rawSource?.category_id,
                    category_name: product.rawSource?.category_name,
                    category_slug: product.rawSource?.category_slug,
                    sku: product.sku || product.rawSource?.sku || product.rawSource?.product_code || "",
                })
            );
        } catch {
            // ignore storage errors
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product?.id) return;
        const line = {
            id: product.id,
            name: product.name || "Product",
            price: displayPrice,
            imageUrl: imgSrc,
            oldPrice: displayOldPrice,
            discount: product.discount || discountBadge,
            brand: product.brand,
            retails_price: product.retails_price || product.rawSource?.retails_price,
            rawSource: product.rawSource,
        };
        addToCart(line, 1, null, true);
        toast.success("Added to cart");
    };

    const rounded = isFlash ? "rounded-xl md:rounded-2xl" : "rounded-2xl";

    return (
        <div
            className={`group relative flex h-full flex-col overflow-hidden border border-brand-gray-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(30,45,74,0.12)] ${rounded} shadow-[0_2px_10px_rgba(30,45,74,0.06)]`}
        >
            <div className="relative aspect-square w-full bg-gradient-to-b from-brand-paper to-white">
                <Link
                    href={`/product/${slug}`}
                    onClick={seedProductDetails}
                    className="absolute inset-0 z-0 block"
                    aria-label={`View ${product.name || "product"}`}
                >
                    <Image
                        src={imgSrc}
                        alt={product.name || "Product"}
                        fill
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                        unoptimized
                    />
                </Link>

                <div className="pointer-events-none absolute inset-0 z-[1]">
                    {showBrandCornerBadge && (
                        <div className="pointer-events-auto absolute left-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-white shadow-md ring-1 ring-brand-gray-border/80">
                            <Image
                                src="/icon.svg"
                                alt=""
                                width={32}
                                height={32}
                                className="h-7 w-7 object-contain"
                                unoptimized
                            />
                        </div>
                    )}

                    {discountBadge && (
                        <div className="pointer-events-none absolute right-0 top-0 z-10 min-w-[3.25rem] rounded-bl-xl bg-brand-navy px-2.5 py-1.5 text-center shadow-md">
                            <span className="text-[10px] font-extrabold uppercase leading-tight tracking-wide text-white md:text-[11px]">
                                {discountBadge}
                            </span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        className={`pointer-events-auto absolute bottom-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-brand-gray-border bg-white/95 shadow-sm backdrop-blur-sm transition-all ${
                            isInWishlist(product.id)
                                ? "text-red-500"
                                : "text-brand-muted opacity-90 hover:text-red-500"
                        }`}
                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={isInWishlist(product.id) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth={isInWishlist(product.id) ? 0 : 1.5}
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                        </svg>
                    </button>
                </div>

                {showUsedTag && (
                    <Image
                        src="/used_tag.png"
                        alt="Used product"
                        width={80}
                        height={25}
                        className="pointer-events-none absolute left-3 bottom-10 z-10 h-auto w-[64px] md:w-[72px]"
                    />
                )}
            </div>

            <div className="flex flex-1 flex-col px-3 pb-3 pt-2 text-center md:px-4">
                <Link
                    href={`/product/${slug}`}
                    onClick={seedProductDetails}
                    className="min-h-0 flex-1 hover:opacity-90"
                >
                    <h3 className="line-clamp-2 min-h-[2.5em] text-[15px] font-bold leading-snug tracking-tight text-brand-navy md:text-[16px]">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-2 space-y-1">
                    <div>
                        <span className="text-lg font-extrabold tracking-tight text-brand-navy md:text-xl">
                            {displayPrice}
                        </span>
                    </div>
                    {displayOldPrice && (
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className="text-xs font-semibold text-red-500 line-through md:text-sm">
                                {displayOldPrice}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-brand-navy-deep md:py-3 md:text-[13px]"
                >
                    <FiShoppingBag className="h-4 w-4 shrink-0 text-brand-yellow" aria-hidden />
                    Add to cart
                </button>
            </div>
        </div>
    );
}
