"use client";

import { useMemo, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import ProductCard from '../Shared/PremiumProductCard';
import CustomDropdown from '../Shared/CustomDropdown';

export default function ProductGrid({
    products,
    onOpenFilter,
    brandsList = ["All"],
    activeBrand = "All",
    onSelectBrand,
    totalItems = 0,
    showUsedTag = false
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
            {/* Toolbar: fixed count (left), scrollable brands (middle), fixed sort/filter (right) */}
            <div className="mb-6 md:mb-8 border border-brand-gray-border bg-white rounded-2xl p-3 md:p-4">
                <div className="flex items-center gap-3">
                    <div className="shrink-0 text-xs md:text-sm text-gray-600 font-semibold whitespace-nowrap">
                        Showing: ({totalItems} Items)
                    </div>

                    <div className="min-w-0 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="flex items-center gap-2 md:gap-3 w-max">
                            {brandsList.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => onSelectBrand && onSelectBrand(brand)}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors border ${activeBrand === brand
                                        ? 'bg-brand-navy text-white border-brand-navy shadow-md shadow-brand-navy/25'
                                        : 'bg-white text-gray-700 border-brand-gray-border hover:border-brand-yellow hover:text-brand-navy'
                                        }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 md:gap-3">
                        <div className="w-[124px] md:w-[160px]">
                            <CustomDropdown
                                options={sortOptions}
                                value={sortBy}
                                onChange={setSortBy}
                            />
                        </div>

                        <button
                            onClick={onOpenFilter}
                            className="lg:hidden flex items-center justify-center gap-1.5 bg-brand-navy text-white border-0 py-[9px] px-4 rounded-lg shadow-md shadow-brand-navy/25 hover:bg-brand-navy-deep shrink-0 text-xs md:text-sm font-bold transition-all"
                        >
                            <FiFilter size={15} />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} showUsedTag={showUsedTag} />
                ))}
            </div>

        </div>
    );
}
