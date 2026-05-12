"use client";

import { useMemo, useState } from "react";
import { FiSliders } from "react-icons/fi";
import ProductCard from "../Shared/PremiumProductCard";
import CustomDropdown from "../Shared/CustomDropdown";

export default function ProductGrid({
    products,
    onOpenFilter,
    brandsList = ["All"],
    activeBrand = "All",
    onSelectBrand,
    totalItems = 0,
    showUsedTag = false,
}) {
    const [sortBy, setSortBy] = useState("Default");

    const sortOptions = [
        { label: "Default", value: "Default" },
        { label: "Price: Low to High", value: "Price: Low to High" },
        { label: "Price: High to Low", value: "Price: High to Low" },
        { label: "Newest Arrivals", value: "Newest Arrivals" },
    ];

    const sortedProducts = useMemo(() => {
        const list = [...products];

        if (sortBy === "Price: Low to High") {
            return list.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
        }
        if (sortBy === "Price: High to Low") {
            return list.sort((a, b) => (b.rawPrice || 0) - (a.rawPrice || 0));
        }
        if (sortBy === "Newest Arrivals") {
            return list.sort((a, b) => (b.id || 0) - (a.id || 0));
        }

        return list;
    }, [products, sortBy]);

    return (
        <div>
            {/* Mobile: one tight strip — brands + tiny count. Desktop: roomier brand lane. */}
            <div className="-mx-4 mb-3 border-y border-white/10 bg-brand-navy md:-mx-8 md:mb-6">
                <div className="flex items-center gap-2 px-3 py-2 md:gap-3 md:px-8 md:py-3.5">
                    <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-brand-yellow md:text-[10px]">
                        Brands
                    </span>
                    <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex w-max items-center gap-1.5 pr-1 md:gap-2">
                            {brandsList.map((brand) => (
                                <button
                                    key={brand}
                                    type="button"
                                    onClick={() => onSelectBrand && onSelectBrand(brand)}
                                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-all md:px-4 md:py-1.5 md:text-xs ${
                                        activeBrand === brand
                                            ? "border-brand-yellow bg-brand-yellow text-brand-navy"
                                            : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                                    }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                    <span
                        className="shrink-0 rounded-md bg-white/15 px-2 py-0.5 text-center text-[10px] font-black tabular-nums text-white md:hidden"
                        aria-live="polite"
                    >
                        {totalItems}
                    </span>
                </div>
                <p className="hidden px-8 pb-3 text-xs text-white/70 md:block">Tap a brand to filter the grid.</p>
            </div>

            {/* Mobile: single row — count + sort + icon refine. Desktop: larger count + helper copy + controls. */}
            <div className="mb-5 flex items-center gap-2 border-b border-brand-gray-border pb-4 md:mb-8 md:items-end md:justify-between md:gap-6 md:pb-7">
                <div className="flex min-w-0 flex-1 items-center gap-2 md:block md:flex-none">
                    <p className="hidden text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted md:block">Inventory</p>
                    <div className="flex items-baseline gap-1.5 md:mt-1 md:gap-2">
                        <span className="text-xl font-black tabular-nums leading-none text-brand-navy md:text-4xl lg:text-5xl">
                            {totalItems}
                        </span>
                        <span className="text-[11px] font-semibold text-brand-muted md:hidden">items</span>
                    </div>
                    <p className="mt-2 hidden max-w-sm text-sm leading-snug text-brand-muted md:block">
                        Filters (storage, region, price) live in Refine — brands are above.
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <div className="w-[min(11rem,calc(100vw-8.5rem))] md:w-[168px]">
                        <CustomDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
                    </div>
                    <button
                        type="button"
                        onClick={onOpenFilter}
                        aria-label="Open filters and refine results"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white shadow-md shadow-brand-navy/20 transition-colors hover:bg-brand-navy-deep md:h-auto md:w-auto md:gap-2 md:rounded-xl md:px-4 md:py-2.5"
                    >
                        <FiSliders className="h-4 w-4 md:h-[18px] md:w-[18px]" aria-hidden />
                        <span className="hidden pl-0.5 text-xs font-black uppercase tracking-wider md:inline">Refine</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-4">
                {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showUsedTag={showUsedTag} />
                ))}
            </div>
        </div>
    );
}
