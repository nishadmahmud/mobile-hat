"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, FileText, LayoutList } from "lucide-react";

export default function ProductTabs({ description, specifications, recentlyViewed = [] }) {
    const [activeTab, setActiveTab] = useState("specifications");

    const specRows = useMemo(() => {
        if (!Array.isArray(specifications)) return [];
        return specifications;
    }, [specifications]);

    const sections = [
        { id: "specifications", label: "Specifications", icon: LayoutList },
        { id: "description", label: "Description", icon: FileText },
    ];

    const renderSpecifications = () => (
        <section id="specifications" className="w-full">
            <h3 className="mb-4 px-1 text-lg font-black uppercase tracking-[0.12em] text-brand-navy md:text-xl">
                Specifications
            </h3>
            {specRows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand-gray-border bg-brand-paper/50 p-8 text-center font-medium italic text-brand-muted">
                    Product specifications are being updated.
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-brand-gray-border bg-white shadow-[0_12px_40px_rgba(30,45,74,0.06)] md:rounded-3xl">
                    <dl className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                        {specRows.map((spec, idx) => (
                            <div
                                key={idx}
                                className={`border-b border-brand-gray-border/70 px-4 py-3 sm:border-r sm:border-brand-gray-border/60 ${
                                    idx % 2 === 0 ? "bg-brand-paper/50 sm:bg-brand-paper/60" : "bg-white"
                                } last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0`}
                            >
                                <dt className="text-[11px] font-black uppercase tracking-widest text-brand-muted">{spec.name}</dt>
                                <dd className="mt-1 text-[14px] font-semibold leading-snug text-brand-navy md:text-[15px]">
                                    {spec.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </section>
    );

    const renderDescription = () => (
        <section id="description" className="w-full break-words px-1 py-2 md:px-2">
            <h3 className="mb-4 text-lg font-black uppercase tracking-[0.12em] text-brand-navy md:text-xl">Description</h3>
            <div className="prose prose-neutral max-w-none leading-relaxed text-brand-muted md:leading-loose [&_a]:text-brand-navy">
                <div
                    className="w-full overflow-hidden break-words [&>h2]:mb-6 [&>h2]:text-2xl [&>h2]:font-black [&>h2]:text-brand-navy [&>h3]:mb-4 [&>h3]:text-xl [&>h3]:font-black [&>h3]:text-brand-navy [&>p]:mb-6 [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-5 [&_*]:max-w-full [&_*]:break-words [&_img]:mx-auto [&_img]:my-10 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:shadow-lg"
                    dangerouslySetInnerHTML={{
                        __html: description || "<p>No detailed description available yet.</p>",
                    }}
                />
            </div>
        </section>
    );

    const renderActivePanel = () => {
        if (activeTab === "specifications") return renderSpecifications();
        return renderDescription();
    };

    return (
        <div className="mt-12 w-full border-t border-brand-gray-border/80 pt-10 md:mt-20 md:pt-14">
            {/* Mobile — accordion (spec + description open by default; user can close) */}
            <div className="space-y-2 lg:hidden">
                <details open className="group overflow-hidden rounded-2xl border border-brand-gray-border bg-white shadow-sm open:shadow-md">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-left [&::-webkit-details-marker]:hidden">
                        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-navy">
                            <LayoutList className="size-4 shrink-0 text-brand-muted" strokeWidth={2} />
                            Specifications
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-brand-muted transition-transform group-open:rotate-180" strokeWidth={2} />
                    </summary>
                    <div className="border-t border-brand-gray-border/80 px-3 pb-4 pt-2">{renderSpecifications()}</div>
                </details>
                <details open className="group overflow-hidden rounded-2xl border border-brand-gray-border bg-white shadow-sm open:shadow-md">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-left [&::-webkit-details-marker]:hidden">
                        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-navy">
                            <FileText className="size-4 shrink-0 text-brand-muted" strokeWidth={2} />
                            Description
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-brand-muted transition-transform group-open:rotate-180" strokeWidth={2} />
                    </summary>
                    <div className="border-t border-brand-gray-border/80 px-3 pb-4 pt-2">{renderDescription()}</div>
                </details>
            </div>

            {/* Desktop — vertical nav + panel */}
            <div className="hidden lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
                <nav className="flex flex-col gap-1" aria-label="Product information sections">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeTab === section.id;
                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => setActiveTab(section.id)}
                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[11px] font-black uppercase tracking-widest transition-all ${
                                    isActive
                                        ? "border-brand-navy bg-brand-navy text-white shadow-md shadow-brand-navy/20"
                                        : "border-brand-gray-border bg-white text-brand-muted hover:border-brand-yellow hover:text-brand-navy"
                                }`}
                            >
                                <Icon className={`size-4 shrink-0 ${isActive ? "text-brand-yellow" : "text-brand-muted"}`} strokeWidth={2} />
                                {section.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300">{renderActivePanel()}</div>
            </div>

            {/* Recently viewed — horizontal strip */}
            <section className="mt-10 border-t border-brand-gray-border/80 pt-8 md:mt-12 md:pt-10" aria-labelledby="recently-viewed-heading">
                <div className="mb-4 flex items-center justify-between gap-3 px-0.5">
                    <h2 id="recently-viewed-heading" className="text-lg font-black uppercase tracking-[0.1em] text-brand-navy md:text-xl">
                        Recently viewed
                    </h2>
                    <Link
                        href="/"
                        className="shrink-0 text-[10px] font-black uppercase tracking-widest text-brand-navy transition-colors hover:text-brand-yellow-bright"
                    >
                        View shop
                    </Link>
                </div>
                <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto pb-2 pt-1 md:gap-4">
                    {recentlyViewed.length > 0 ? (
                        recentlyViewed.map((product, idx) => (
                            <Link
                                key={product.id || idx}
                                href={`/product/${product.slug || product.id}`}
                                className="group flex w-[min(280px,78vw)] shrink-0 items-stretch gap-3 rounded-2xl border border-brand-gray-border bg-white p-3 transition-all duration-300 hover:border-brand-navy/40 hover:shadow-[0_14px_32px_rgba(30,45,74,0.08)] md:w-[260px] md:p-4"
                            >
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-brand-gray-border bg-brand-paper p-2 md:h-24 md:w-24">
                                    <Image
                                        src={product.image || "/no-image.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                                        unoptimized
                                    />
                                </div>
                                <div className="min-w-0 flex-1 py-0.5">
                                    <h4 className="line-clamp-2 text-[13px] font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-yellow-bright md:text-[14px]">
                                        {product.name}
                                    </h4>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span className="text-[15px] font-black tabular-nums text-brand-navy md:text-[16px]">{product.price}</span>
                                        {product.oldPrice && (
                                            <span className="text-[11px] font-bold text-brand-muted line-through">{product.oldPrice}</span>
                                        )}
                                    </div>
                                    {product.discount && (
                                        <div className="mt-2">
                                            <span className="inline-flex items-center rounded-lg border border-brand-gray-border bg-brand-paper px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-brand-navy">
                                                {product.discount} OFF
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="w-full rounded-2xl border-2 border-dashed border-brand-gray-border bg-brand-paper/50 p-8 text-center md:p-10">
                            <p className="text-[10px] font-black uppercase leading-relaxed tracking-[0.18em] text-brand-muted">
                                Recently viewed items appear here
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
