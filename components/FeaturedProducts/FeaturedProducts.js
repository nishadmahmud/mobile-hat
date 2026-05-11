"use client";

import { useMemo, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../Shared/PremiumProductCard';

export default function FeaturedProducts({
    bestSellers = [],
    newArrivals = [],
    flashDeals = []
}) {
    const [activeTab, setActiveTab] = useState('Best Sellers');
    const tabs = ['Best Sellers', 'New Arrivals', 'Flash Deals'];

    const visibleProducts = useMemo(() => {
        if (activeTab === 'New Arrivals') return newArrivals;
        if (activeTab === 'Flash Deals') return flashDeals;
        return bestSellers;
    }, [activeTab, bestSellers, newArrivals, flashDeals]);

    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center text-center gap-5 mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.1em] text-brand-navy md:tracking-[0.16em]">
                        Shop the look
                    </h2>
                    <p className="text-sm text-brand-muted max-w-lg">Switch tabs to explore bestsellers, new drops, and limited-time flash deals.</p>

                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar justify-center max-w-full">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-brand-navy text-white shadow-md shadow-brand-navy/25 ring-2 ring-brand-yellow/50'
                                    : 'bg-brand-paper text-brand-muted border border-brand-gray-border hover:border-brand-yellow'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-5">
                    {visibleProducts.slice(0, 8).map((product, idx) => (
                        <div key={product.id} className="relative">
                            {idx < 3 ? (
                                <div className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-yellow text-[11px] font-black text-brand-navy shadow-md">
                                    {idx + 1}
                                </div>
                            ) : null}
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <button type="button" className="group inline-flex items-center gap-2 rounded-full border-2 border-brand-navy bg-brand-navy px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-brand-navy-deep">
                        Load more <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}
