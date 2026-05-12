"use client";

import Link from "next/link";
import { Share2, ArrowLeftRight, Heart } from "lucide-react";

/**
 * PDP title row: brand, optional product title (H1), compare + share.
 * When `suppressProductTitle`, the page provides the H1 in the editorial band.
 */
export default function PdpHeaderRail({
    suppressProductTitle = false,
    product,
    matchedBrand,
    brandListingHref,
    handleAddToCompare,
    handleShare,
    isWishlisted,
    onToggleWishlist,
}) {
    const brandBlock = matchedBrand?.name ? (
        brandListingHref ? (
            <Link
                href={brandListingHref}
                className="mb-2 inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            >
                {matchedBrand.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={matchedBrand.image} alt={matchedBrand.name} className="h-4 w-4 object-contain" />
                ) : (
                    <span className="h-4 w-4 rounded-full bg-brand-gray-border" />
                )}
                <span className="text-[12px] font-black uppercase tracking-tight text-brand-navy">{matchedBrand.name}</span>
            </Link>
        ) : matchedBrand.id ? (
            <Link href={`/brand/${matchedBrand.id}`} className="mb-2 inline-flex items-center gap-2 transition-opacity hover:opacity-80">
                {matchedBrand.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={matchedBrand.image} alt={matchedBrand.name} className="h-4 w-4 object-contain" />
                ) : (
                    <span className="h-4 w-4 rounded-full bg-brand-gray-border" />
                )}
                <span className="text-[12px] font-black uppercase tracking-tight text-brand-navy">{matchedBrand.name}</span>
            </Link>
        ) : (
            <div className="mb-2 inline-flex items-center gap-2">
                {matchedBrand.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={matchedBrand.image} alt={matchedBrand.name} className="h-4 w-4 object-contain" />
                ) : (
                    <span className="h-4 w-4 rounded-full bg-brand-gray-border" />
                )}
                <span className="text-[12px] font-black uppercase tracking-tight text-brand-navy">{matchedBrand.name}</span>
            </div>
        )
    ) : null;

    return (
        <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
                {brandBlock}
                {!suppressProductTitle && (
                    <h1 className="text-[22px] font-bold leading-tight tracking-tight text-brand-navy md:text-[28px]">
                        {product.name}
                    </h1>
                )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    onClick={handleAddToCompare}
                    className="inline-flex items-center gap-1.5 px-1 py-1 text-[13px] font-bold text-brand-navy transition-colors hover:text-brand-yellow-bright md:text-[14px]"
                >
                    <ArrowLeftRight className="size-4 shrink-0" strokeWidth={2} />
                    Add to Compare
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    className="rounded-lg border border-brand-gray-border bg-white p-2.5 text-brand-muted transition-colors hover:border-brand-navy hover:text-brand-navy"
                    aria-label="Share product"
                >
                    <Share2 className="size-4" strokeWidth={2} />
                </button>
                <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    className="rounded-lg border border-brand-gray-border bg-white p-2.5 text-brand-muted transition-colors hover:border-brand-navy hover:text-red-500"
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        className={`size-4 transition-all ${isWishlisted ? "scale-110 fill-red-500 text-red-500" : ""}`}
                        strokeWidth={2}
                    />
                </button>
            </div>
        </div>
    );
}
