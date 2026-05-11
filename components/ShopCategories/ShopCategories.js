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
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 md:text-xs">
                Ending Soon
            </span>
            <div className="flex items-center gap-1.5 md:gap-2">
                <span className="flex min-w-[2.5rem] items-center justify-center rounded-lg bg-brand-navy px-2 py-1.5 text-[14px] font-black tabular-nums text-white shadow-inner md:min-w-[2.75rem] md:px-2.5 md:py-2 md:text-[15px]">
                    {pad(parts.h)}
                </span>
                <span className="text-sm font-black text-brand-navy md:text-base">:</span>
                <span className="flex min-w-[2.5rem] items-center justify-center rounded-lg bg-brand-navy px-2 py-1.5 text-[14px] font-black tabular-nums text-white shadow-inner md:min-w-[2.75rem] md:px-2.5 md:py-2 md:text-[15px]">
                    {pad(parts.m)}
                </span>
                <span className="text-sm font-black text-brand-navy md:text-base">:</span>
                <span className="flex min-w-[2.5rem] items-center justify-center rounded-lg bg-brand-navy px-2 py-1.5 text-[14px] font-black tabular-nums text-white shadow-inner md:min-w-[2.75rem] md:px-2.5 md:py-2 md:text-[15px]">
                    {pad(parts.s)}
                </span>
            </div>
        </div>
    );
}

export default function ShopCategories({ categories = [], flashSaleProducts = [] }) {
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

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-5 mb-16">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.id ? `cat-${cat.id}-${idx}` : `cat-fallback-${idx}`}
                            href={`/category/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}
                            className="group flex flex-col h-full overflow-hidden rounded-xl border border-brand-gray-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(30,45,74,0.1)]"
                        >
                            {/* Card Body - Content centered */}
                            <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 min-h-[80px] md:min-h-[130px]">
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image
                                        src={cat.image || "/no-image.svg"}
                                        alt={cat.name || 'Category'}
                                        width={100}
                                        height={100}
                                        className="w-auto h-auto max-h-[45px] md:max-h-[85px] object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                                        unoptimized
                                    />
                                </div>
                            </div>

                            {/* Card Footer - Text at the bottom */}
                            <div className="pb-3 md:pb-6 px-2 md:px-4 text-center">
                                <span className="text-[10px] md:text-[14px] font-bold text-brand-navy group-hover:text-brand-yellow-bright transition-colors block truncate">
                                    {cat.name}
                                </span>
                            </div>
                        </Link>
                    ))}
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
                            {/* Header: text + countdown only — no promo image, no video/embed column */}
                            <div className="rounded-2xl border border-brand-gray-border bg-gradient-to-br from-white to-brand-cream/40 px-5 py-5 shadow-[0_8px_30px_rgba(30,45,74,0.06)] md:px-8 md:py-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-8 sm:gap-y-3">
                                    <div className="min-w-0 flex-1 sm:max-w-xl">
                                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-yellow md:text-[11px]">
                                            Limited time
                                        </p>
                                        <h3 className="mt-1 text-2xl font-black tracking-tight text-brand-navy md:text-3xl">
                                            Flash sale
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                                            Daily picks at special prices — while stock lasts.
                                        </p>
                                    </div>
                                    <div className="shrink-0 rounded-xl border border-brand-gray-border bg-white/90 px-4 py-3 shadow-sm md:px-5">
                                        <FlashSaleCountdown />
                                    </div>
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
