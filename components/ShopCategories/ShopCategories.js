"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ProductCard from '../Shared/PremiumProductCard';

function FlashSaleCountdown() {
    const [parts, setParts] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            const diff = Math.max(0, end.getTime() - now.getTime());
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setParts({ h, m, s });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="flex flex-col gap-1.5 mt-2 sm:mt-0">
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-brand-navy whitespace-nowrap">
                Ending Soon
            </span>
            <div className="flex items-center gap-1.5 md:gap-2">
                <span className="flex h-8 w-9 md:h-9 md:w-10 items-center justify-center rounded-md bg-brand-navy text-[14px] md:text-[15px] font-bold tabular-nums text-white shadow-sm">
                    {pad(parts.h)}
                </span>
                <span className="text-[18px] md:text-[20px] font-black text-brand-navy">:</span>
                <span className="flex h-8 w-9 md:h-9 md:w-10 items-center justify-center rounded-md bg-brand-navy text-[14px] md:text-[15px] font-bold tabular-nums text-white shadow-sm">
                    {pad(parts.m)}
                </span>
                <span className="text-[18px] md:text-[20px] font-black text-brand-navy">:</span>
                <span className="flex h-8 w-9 md:h-9 md:w-10 items-center justify-center rounded-md bg-brand-navy text-[14px] md:text-[15px] font-bold tabular-nums text-white shadow-sm">
                    {pad(parts.s)}
                </span>
            </div>
        </div>
    );
}

/** Desktop (`md+`): 4 columns × 2 rows = 8 cards when collapsed. */
const DESKTOP_CATEGORY_COLLAPSE_COUNT = 8;
/** Mobile (`<md`): 3 columns × 3 rows = 9 cards when collapsed. */
const MOBILE_CATEGORY_COLLAPSE_COUNT = 9;

export default function ShopCategories({ categories = [], flashSaleProducts = [] }) {
    const [categoriesExpanded, setCategoriesExpanded] = useState(false);
    const list = Array.isArray(categories) ? categories : [];
    const showCategoryToggleMobile = list.length > MOBILE_CATEGORY_COLLAPSE_COUNT;
    const showCategoryToggleDesktop = list.length > DESKTOP_CATEGORY_COLLAPSE_COUNT;

    const categoryGridCollapseClass = [
        !categoriesExpanded && showCategoryToggleMobile && 'max-md:[&>*:nth-child(n+10)]:hidden',
        !categoriesExpanded && showCategoryToggleDesktop && 'md:[&>*:nth-child(n+9)]:hidden',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <section className="w-full bg-brand-paper pt-10 pb-16 border-b border-brand-gray-border/50">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8">

                <div className="flex flex-col items-center text-center mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.1em] text-brand-navy md:tracking-[0.16em]">
                        Shop by collection
                    </h2>
                    <p className="mt-2 max-w-lg text-sm text-brand-muted">Browse the aisles that matter most — phones, audio, wearables, and more.</p>
                    <Link href="/categories" className="mt-4 text-[12px] font-bold text-brand-navy hover:text-brand-yellow-bright px-5 py-2.5 border border-brand-gray-border rounded-full uppercase tracking-widest transition-all bg-white hover:border-brand-yellow">
                        See all collections
                    </Link>
                </div>

                <div className="mb-16 flex flex-col items-stretch gap-4 md:gap-5">
                    <div
                        className={`grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 ${categoryGridCollapseClass}`}
                    >
                        {list.map((cat, idx) => (
                            <Link
                                key={cat.id ? `cat-${cat.id}-${idx}` : `cat-fallback-${idx}`}
                                href={`/category/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}
                                className="group flex flex-col h-full overflow-hidden rounded-xl border border-brand-gray-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(30,45,74,0.1)]"
                            >
                                {/* Card Body - Content centered */}
                                <div className="flex min-h-[72px] flex-1 flex-col items-center justify-center p-2 md:min-h-[130px] md:p-4">
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <Image
                                            src={cat.image || "/no-image.svg"}
                                            alt={cat.name || 'Category'}
                                            width={100}
                                            height={100}
                                            className="h-auto w-auto max-h-[40px] object-contain transition-transform duration-700 ease-out group-hover:scale-110 md:max-h-[85px]"
                                            unoptimized
                                        />
                                    </div>
                                </div>

                                {/* Card Footer - Text at the bottom */}
                                <div className="px-1.5 pb-2.5 text-center md:px-4 md:pb-6">
                                    <span className="block truncate text-[9px] font-bold text-brand-navy transition-colors group-hover:text-brand-yellow-bright md:text-[14px]">
                                        {cat.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {(showCategoryToggleMobile || showCategoryToggleDesktop) && (
                        <div
                            className={`justify-center ${
                                showCategoryToggleMobile && showCategoryToggleDesktop
                                    ? 'flex'
                                    : showCategoryToggleDesktop
                                      ? 'hidden md:flex'
                                      : 'flex md:hidden'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => setCategoriesExpanded((v) => !v)}
                                aria-expanded={categoriesExpanded}
                                className="rounded-full border border-brand-gray-border bg-white px-8 py-2.5 text-[12px] font-bold uppercase tracking-widest text-brand-navy transition-all hover:border-brand-yellow hover:text-brand-yellow-bright"
                            >
                                {categoriesExpanded ? 'Show less' : 'Show all'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Flash Sale — stacked sections with gap (header / each row / CTA separate) */}
                {flashSaleProducts.length > 0 && (() => {
                    const flashItems = flashSaleProducts.slice(0, 10);
                    const rows = [];
                    for (let i = 0; i < flashItems.length; i += 5) {
                        rows.push(flashItems.slice(i, i + 5));
                    }

                    return (
                        <div className="flex flex-col gap-5 md:gap-7">
                            {/* Header: matched to mockup but using brand colors */}
                            <div className="flex flex-col md:flex-row items-stretch overflow-hidden rounded-xl bg-brand-paper border border-brand-gray-border p-4 md:p-5 pl-0 md:pl-0 gap-4 shadow-sm min-h-[110px]">
                                {/* Left side: Sticker & Timer */}
                                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                    <div className="relative w-[110px] h-[75px] md:w-[140px] md:h-[95px] shrink-0">
                                        <Image
                                            src="/flas sss.png"
                                            alt="Flash Sale"
                                            fill
                                            className="object-contain object-left"
                                            unoptimized
                                            priority
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center pt-2">
                                        <FlashSaleCountdown />
                                    </div>
                                </div>
                                
                                {/* Right side: Video placeholder */}
                                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-brand-gray-border bg-white/70 min-h-[80px]">
                                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-brand-muted">
                                        Video
                                    </span>
                                </div>
                            </div>

                            {/* One card per product row (5 per row on large screens) */}
                            {rows.map((row, rowIdx) => (
                                <div
                                    key={`flash-row-${rowIdx}`}
                                    className="rounded-2xl border border-brand-gray-border bg-white p-4 shadow-[0_8px_30px_rgba(30,45,74,0.06)] md:p-6"
                                >
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-5">
                                        {row.map((product, idx) => (
                                            <div key={product.id ?? `${rowIdx}-${idx}`} className="transition-transform duration-300 hover:scale-[1.02]">
                                                <ProductCard product={product} variant="flash" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-center">
                                <Link
                                    href="/flash-sale"
                                    className="rounded-xl bg-brand-navy px-10 py-3.5 text-[13px] font-black uppercase tracking-[0.12em] text-white shadow-md shadow-brand-navy/25 transition-colors hover:bg-brand-navy-deep"
                                >
                                    See More
                                </Link>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </section>
    );
}
