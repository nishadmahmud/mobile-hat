"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Zap, Package } from "lucide-react";
import { getSpecialOffers } from "../../lib/api";

export default function SpecialOffersPage() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOffers() {
            try {
                const res = await getSpecialOffers();
                if (res?.success && Array.isArray(res.data)) {
                    setOffers(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch special offers:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOffers();
    }, []);

    const getGradientColor = (index) => {
        const colors = [
            "from-brand-navy to-brand-navy-deep",
            "from-brand-navy-deep to-brand-navy",
            "from-brand-navy via-brand-navy-deep to-brand-navy-deep",
            "from-brand-navy-deep via-brand-navy to-brand-navy",
        ];
        return colors[index % colors.length];
    };

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
            <div className="relative overflow-hidden border-b border-brand-navy-deep bg-brand-navy py-4 md:py-6">
                <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-1/4 translate-x-1/2 bg-brand-yellow/10 blur-[80px]"
                    aria-hidden
                />
                <div className="relative z-10 mx-auto flex max-w-[1550px] items-center justify-between px-4 md:px-8">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                        <h1 className="text-xl font-black tracking-tight text-white md:text-3xl">
                            Special <span className="text-brand-yellow-bright">Offers</span>
                        </h1>
                        <span className="hidden h-6 w-px bg-white/15 md:block" aria-hidden />
                        <p className="text-xs font-medium text-white/70 md:text-sm">
                            Premium tech at unbeatable prices.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1550px] px-4 py-8 md:px-8 md:py-12">
                {offers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
                        {offers.map((offer, index) => (
                            <div
                                key={offer.id}
                                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-gray-border bg-white shadow-sm transition-all duration-500 hover:border-brand-navy/20 hover:shadow-2xl"
                            >
                                <div className={`relative h-56 bg-gradient-to-br ${getGradientColor(index)}`}>
                                    <Image
                                        src={offer.image || "/no-image.svg"}
                                        alt={offer.title}
                                        fill
                                        className="object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-80"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                                    <div className="absolute left-6 top-6 flex flex-col gap-2">
                                        <span className="rounded-full border border-white/10 bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                                            Special Offer
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 text-white/20 transition-colors group-hover:text-white/40">
                                        <Package className="h-20 w-20" strokeWidth={1} aria-hidden />
                                    </div>
                                </div>

                                <div className="flex flex-grow flex-col p-8">
                                    <h3 className="mb-3 text-xl font-black text-brand-navy transition-colors group-hover:text-brand-navy-deep">
                                        {offer.title}
                                    </h3>
                                    <p className="mb-6 flex-grow text-sm leading-relaxed text-brand-muted">{offer.description}</p>

                                    <div className="flex items-center justify-between border-t border-brand-gray-border/80 pt-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                                                Added On
                                            </span>
                                            <span className="text-xs font-black text-brand-yellow-bright">
                                                {new Date(offer.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <Link
                                            href={offer.url || "/offers"}
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-white shadow-lg transition-all hover:scale-110 hover:bg-brand-navy-deep"
                                            aria-label="View offer"
                                        >
                                            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[3rem] border border-dashed border-brand-gray-border bg-white py-24 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-brand-gray-border bg-brand-paper">
                            <Zap className="h-10 w-10 text-brand-muted/50" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-black text-brand-navy">No special offers at the moment</h3>
                        <p className="mx-auto mt-3 max-w-md font-medium text-brand-muted">
                            We&apos;re cooking up something amazing. Check back soon for exclusive hardware deals and bundle offers!
                        </p>
                    </div>
                )}

                <div className="mt-20 rounded-[40px] border border-brand-gray-border bg-brand-navy p-8 text-center text-white shadow-2xl shadow-brand-navy/25 md:p-16">
                    <h2 className="mb-4 text-3xl font-black md:text-4xl">Want first access to new deals?</h2>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-white/80">
                        Our most exclusive offers often sell out in minutes. Join our community and get notified the moment they drop.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md placeholder:text-white/50 focus:outline-none focus:ring-4 focus:ring-brand-yellow/25 sm:w-80"
                        />
                        <button
                            type="button"
                            className="rounded-2xl bg-white px-10 py-4 font-black uppercase tracking-widest text-brand-navy shadow-xl transition-transform hover:scale-105"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
