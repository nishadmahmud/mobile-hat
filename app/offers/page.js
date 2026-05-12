"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Tag, ChevronRight } from "lucide-react";
import { getCampaigns } from "../../lib/api";
import ProductCard from "../../components/Shared/PremiumProductCard";

export default function OffersPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOffers() {
            try {
                const res = await getCampaigns();
                if (res?.success && res.campaigns?.data) {
                    setCampaigns(res.campaigns.data);
                } else if (res?.data) {
                    setCampaigns(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch offers:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOffers();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-brand-paper">
                <div
                    className="h-12 w-12 animate-spin rounded-full border-4 border-brand-navy/15 border-t-brand-navy"
                    role="status"
                    aria-label="Loading"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-paper pb-20">
            <div className="relative overflow-hidden border-b border-brand-navy-deep bg-brand-navy py-5 md:py-7">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 translate-x-1/4 bg-brand-yellow/10 blur-[80px]" aria-hidden />
                <div className="relative z-10 mx-auto flex max-w-[1550px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                        <h1 className="text-xl font-black tracking-tight text-white md:text-3xl">
                            Special <span className="text-brand-yellow-bright">Campaigns</span>
                        </h1>
                        <span className="hidden h-6 w-px bg-white/15 md:block" aria-hidden />
                        <p className="text-xs font-medium text-white/70 md:text-sm">Exclusive deals and grand opening celebrations.</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-6 max-w-[1550px] space-y-12 px-4 sm:px-6 md:mt-10 lg:px-8">
                {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                        <div key={campaign.id} className="space-y-8">
                            <div className="relative overflow-hidden rounded-[2rem] border border-brand-gray-border shadow-[0_24px_60px_rgba(30,45,74,0.12)]">
                                <div className="relative aspect-[21/9] md:aspect-[25/7]">
                                    <Image
                                        src={campaign.bg_image || "/no-image.svg"}
                                        alt={campaign.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/80 via-black/45 to-transparent">
                                        <div className="max-w-2xl p-8 md:p-16">
                                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-brand-navy px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                                    Active campaign
                                                </span>
                                                {campaign.end_at && (
                                                    <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/90 backdrop-blur-md">
                                                        <Clock className="size-3.5 shrink-0" strokeWidth={2} />
                                                        Ends: {new Date(campaign.end_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-5xl">{campaign.name}</h2>
                                            <p className="mb-8 line-clamp-3 text-sm font-medium leading-relaxed text-white/85 md:text-lg">
                                                {campaign.description}
                                            </p>
                                            {campaign.button_text && (
                                                <Link
                                                    href={campaign.link || "#"}
                                                    className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-black text-brand-navy shadow-xl shadow-black/25 transition-colors hover:bg-brand-paper"
                                                >
                                                    {campaign.button_text}{" "}
                                                    <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="flex items-center gap-3 text-xl font-black text-brand-navy md:text-2xl">
                                        <Tag className="size-6 shrink-0 text-brand-yellow-bright md:size-7" strokeWidth={2} />
                                        Featured products
                                    </h3>
                                    <span className="text-xs font-black uppercase tracking-widest text-brand-muted">
                                        {campaign.products?.length || 0} deals
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                                    {campaign.products?.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-brand-gray-border bg-white py-24 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-brand-gray-border bg-brand-paper">
                            <Tag className="size-10 text-brand-muted/50" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-black text-brand-navy">No active campaigns right now</h3>
                        <p className="mx-auto mt-3 max-w-md font-medium text-brand-muted">
                            Check back soon for exciting new offers, grand opening celebrations, and exclusive deals!
                        </p>
                        <Link
                            href="/"
                            className="mt-8 inline-block rounded-2xl bg-brand-navy px-8 py-3 font-black uppercase tracking-widest text-white shadow-lg shadow-brand-navy/25 transition-colors hover:bg-brand-navy-deep"
                        >
                            Back to home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
