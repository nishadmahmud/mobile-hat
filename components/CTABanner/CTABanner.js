"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";

const perks = [
    "Launch-day deals & restock alerts",
    "Short reads: buying guides & care tips",
    "No spam — unsubscribe anytime",
];

export default function CTABanner() {
    return (
        <section className="w-full bg-brand-paper py-14 md:py-20">
            <div className="max-w-[1100px] mx-auto px-4 md:px-8">
                <div className="overflow-hidden rounded-3xl border border-brand-gray-border bg-white shadow-[0_20px_50px_rgba(30,45,74,0.08)]">
                    <div className="grid lg:grid-cols-[1fr_1.05fr]">
                        <div className="relative flex flex-col justify-center gap-6 bg-brand-navy px-8 py-10 md:px-12 md:py-14 lg:min-h-[340px]">
                            <div
                                className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand-yellow/15 blur-3xl"
                                aria-hidden
                            />
                            <div className="relative flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                                    <Image src="/icon.svg" alt="" width={40} height={40} className="h-10 w-10 object-contain" unoptimized />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-yellow">Newsletter</p>
                            </div>
                            <h2 className="relative text-3xl font-black tracking-tight text-white md:text-4xl lg:text-[2.35rem] lg:leading-tight">
                                Get the good stuff first.
                            </h2>
                            <p className="relative max-w-md text-base leading-relaxed text-white/75">
                                Join the list for drops, discounts, and honest gadget picks from Mobile Hat.
                            </p>
                            <ul className="relative space-y-2.5 text-sm text-white/90">
                                {perks.map((line) => (
                                    <li key={line} className="flex items-start gap-2.5">
                                        <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" strokeWidth={2.5} aria-hidden />
                                        <span>{line}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/special-offers"
                                className="relative inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-yellow hover:text-white transition-colors"
                            >
                                Browse current offers
                                <FiArrowRight className="h-4 w-4" aria-hidden />
                            </Link>
                        </div>

                        <div className="flex flex-col justify-center border-t border-brand-gray-border bg-brand-cream/60 px-8 py-10 md:px-12 md:py-14 lg:border-t-0 lg:border-l lg:min-h-[340px]">
                            <div className="mx-auto w-full max-w-md rounded-2xl border border-brand-gray-border bg-white p-6 shadow-sm md:p-8">
                                <p className="text-sm font-semibold text-brand-navy">Your email</p>
                                <p className="mt-1 text-xs text-brand-muted">We&apos;ll only send things worth opening.</p>
                                <form
                                    className="mt-6 flex flex-col gap-3"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <label htmlFor="cta-email" className="sr-only">
                                        Email address
                                    </label>
                                    <input
                                        id="cta-email"
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-3.5 text-sm font-medium text-brand-navy outline-none transition-shadow placeholder:text-brand-muted/70 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15"
                                    />
                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy py-3.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-navy-deep"
                                    >
                                        Subscribe free
                                        <FiArrowRight className="h-4 w-4" aria-hidden />
                                    </button>
                                </form>
                                <p className="mt-4 text-center text-[11px] leading-relaxed text-brand-muted">
                                    By subscribing you agree to our{" "}
                                    <Link href="/privacy" className="font-semibold text-brand-navy underline-offset-2 hover:underline">
                                        Privacy
                                    </Link>{" "}
                                    practices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
