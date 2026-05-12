"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaYoutube, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import { FiTruck, FiShield, FiHeadphones, FiRefreshCcw, FiSend } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="mt-auto flex flex-col border-t border-brand-gray-border bg-brand-paper">
            {/* Trust strip */}
            <div className="border-b border-brand-gray-border bg-white">
                <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 md:py-10">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                        <div className="flex items-center gap-4 rounded-xl border border-brand-gray-border/80 bg-brand-paper/50 px-4 py-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-brand-navy">
                                <FiTruck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-brand-navy">Free delivery</h4>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-brand-muted">Orders over ৳1000</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl border border-brand-gray-border/80 bg-brand-paper/50 px-4 py-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-brand-navy">
                                <FiShield className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-brand-navy">Secure checkout</h4>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-brand-muted">Encrypted payments</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl border border-brand-gray-border/80 bg-brand-paper/50 px-4 py-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-brand-yellow">
                                <FiRefreshCcw className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-brand-navy">7-day returns</h4>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-brand-muted">Simple policy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl border border-brand-gray-border/80 bg-brand-paper/50 px-4 py-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-brand-navy">
                                <FiHeadphones className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-brand-navy">Support</h4>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-brand-muted">We&apos;re here to help</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer — flat layout, no wave */}
            <div className="bg-white">
                <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-12 md:py-16">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
                        <div className="lg:col-span-4 flex flex-col gap-5">
                            <Link href="/" className="inline-flex items-center gap-3 w-fit" aria-label="Mobile Hat home">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-navy shadow-md ring-2 ring-brand-yellow/30">
                                    <Image src="/icon.svg" alt="" width={36} height={36} className="h-9 w-9 object-contain" unoptimized />
                                </span>
                                <span className="flex flex-col leading-tight">
                                    <span className="text-lg font-black tracking-tight text-brand-navy">MOBILE HAT</span>
                                    <span className="text-xs font-semibold italic text-brand-muted">Your Gadget Hub</span>
                                </span>
                            </Link>
                            <p className="max-w-sm text-[14px] leading-relaxed text-brand-muted">
                                Genuine phones, accessories, and tech — fair pricing and dependable delivery across Bangladesh.
                            </p>
                            <div className="flex flex-wrap gap-2" aria-hidden="true">
                                <span className="flex h-10 w-10 cursor-default items-center justify-center rounded-xl bg-brand-cream text-[#1877f2] transition-transform hover:-translate-y-0.5 hover:bg-brand-navy hover:text-white">
                                    <FaFacebook size={18} />
                                </span>
                                <span className="flex h-10 w-10 cursor-default items-center justify-center rounded-xl bg-brand-cream text-brand-navy transition-transform hover:-translate-y-0.5 hover:bg-brand-navy hover:text-white">
                                    <FaTiktok size={18} />
                                </span>
                                <span className="flex h-10 w-10 cursor-default items-center justify-center rounded-xl bg-brand-cream text-red-600 transition-transform hover:-translate-y-0.5 hover:bg-red-600 hover:text-white">
                                    <FaYoutube size={18} />
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-5 grid grid-cols-2 gap-8 sm:gap-10">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Company</h3>
                                <ul className="mt-4 space-y-2.5">
                                    <li>
                                        <Link href="/about" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            About us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/categories" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            Shop categories
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/blogs" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            Blog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/special-offers" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            Special offers
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Help</h3>
                                <ul className="mt-4 space-y-2.5">
                                    <li>
                                        <Link href="/contact" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            Contact us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/track-order" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            Track order
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/warranty" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            Warranty
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            Privacy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className="text-sm font-semibold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                                            Terms
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="lg:col-span-3 flex flex-col gap-6">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">
                                    <Link href="/contact" className="transition-colors hover:text-brand-navy">
                                        Contact
                                    </Link>
                                </h3>
                                <ul className="mt-4 space-y-4 text-sm">
                                    <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-cream text-brand-navy">
                                            <FaMapMarkerAlt size={14} />
                                        </span>
                                        <span className="text-brand-muted leading-snug">
                                            Your store or office address, area, city
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-cream text-brand-navy">
                                            <FaPhoneAlt size={14} />
                                        </span>
                                        <span className="font-bold text-brand-navy">
                                            Your customer care number
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-cream text-brand-navy">
                                            <FaClock size={14} />
                                        </span>
                                        <span className="text-brand-muted">11:00 am – 9:00 pm</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-2xl border border-brand-gray-border bg-brand-paper/60 p-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Newsletter</h3>
                                <p className="mt-1 text-xs text-brand-muted">Deals &amp; tips in your inbox.</p>
                                <form className="mt-3 space-y-2" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full rounded-lg border border-brand-gray-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                                    />
                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-navy py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-brand-navy-deep"
                                    >
                                        <FiSend className="h-3.5 w-3.5" />
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-brand-gray-border py-8">
                    <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                        <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-brand-muted">Payment partners</p>
                        <div className="relative mx-auto mt-4 h-12 w-full max-w-3xl md:h-16">
                            <Image
                                src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png"
                                alt="SSLCommerz"
                                fill
                                className="object-contain px-4"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-brand-navy py-5 text-center">
                <p className="text-[13px] text-white/80">
                    © {new Date().getFullYear()}{" "}
                    <span className="font-bold text-brand-yellow">Mobile Hat</span>
                    <span className="text-white/50"> · </span>
                    Your Gadget Hub. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
