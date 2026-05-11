"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiAward, FiCheck } from "react-icons/fi";

/** Set to `true` to show the main hero slider + right-side promo banners again. */
const SHOW_HERO_SLIDER_AND_BANNERS = false;

export default function Hero({ slides = [], banners = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const activeSlides = Array.isArray(slides) ? slides : [];

    useEffect(() => {
        if (!SHOW_HERO_SLIDER_AND_BANNERS || activeSlides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeSlides.length]);

    const prevSlide = () => activeSlides.length && setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    const nextSlide = () => activeSlides.length && setCurrentSlide((prev) => (prev + 1) % activeSlides.length);

    return (
        <div className="w-full bg-brand-paper pt-2 pb-3 md:pt-6 md:pb-8">
            <div className="max-w-[1550px] mx-auto px-3 md:px-8 space-y-3 md:space-y-7">
                <section className="relative overflow-hidden rounded-2xl border border-brand-gray-border shadow-[0_20px_50px_rgba(30,45,74,0.12)] bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy-deep px-3 py-5 text-center md:rounded-3xl md:px-4 md:py-14">
                    <div
                        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-yellow/10 blur-3xl"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-brand-yellow/12 blur-3xl"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[80%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-t from-transparent via-white/[0.04] to-white/[0.07]"
                        aria-hidden
                    />

                    <div className="relative flex flex-col items-center gap-2 md:gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm md:h-28 md:w-28 md:rounded-2xl">
                            <Image
                                src="/icon.svg"
                                alt="Mobile Hat"
                                width={112}
                                height={112}
                                className="h-9 w-9 object-contain md:h-[4.5rem] md:w-[4.5rem]"
                                priority
                                unoptimized
                            />
                        </div>
                        <h1 className="text-lg font-extrabold tracking-tight text-white [text-shadow:0_0_48px_rgba(255,178,51,0.22)] md:text-4xl">
                            MOBILE HAT
                        </h1>
                        <p className="max-w-lg px-0.5 text-[11px] font-medium leading-snug text-white/80 md:px-0 md:text-base md:leading-relaxed md:text-white/75">
                            Your Gadget Hub — curated smartphones, accessories, and tech with dependable delivery nationwide.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3 text-[9px] font-bold uppercase tracking-wider text-white/90 md:text-xs md:tracking-[0.2em]">
                            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 backdrop-blur-sm md:px-3 md:py-1">
                                Trending
                            </span>
                            <span className="hidden text-white/35 font-normal sm:inline">·</span>
                            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 backdrop-blur-sm md:px-3 md:py-1">
                                Trusted
                            </span>
                            <span className="hidden text-white/35 font-normal sm:inline">·</span>
                            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 backdrop-blur-sm md:px-3 md:py-1">
                                Top quality
                            </span>
                        </div>
                        <div className="inline-flex max-w-lg flex-wrap items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold leading-snug text-white/95 shadow-sm backdrop-blur-sm md:gap-2 md:rounded-full md:px-4 md:py-2.5 md:text-sm">
                            <FiAward className="h-3.5 w-3.5 shrink-0 text-brand-yellow md:h-5 md:w-5" aria-hidden />
                            <span>Bangladesh&apos;s curated gadget marketplace</span>
                            <FiCheck className="h-3.5 w-3.5 shrink-0 text-brand-yellow md:h-4 md:w-4" strokeWidth={2.5} aria-hidden />
                        </div>
                    </div>
                </section>

                {SHOW_HERO_SLIDER_AND_BANNERS ? (
                    <div className="flex flex-col lg:flex-row gap-1 lg:gap-1.5 h-full">
                        <div className="w-full lg:w-[67%] relative aspect-[16/7.5] md:aspect-[24/10] rounded-md md:rounded-lg overflow-hidden shadow-sm group bg-white border border-brand-gray-border">
                            {activeSlides.length === 0 && (
                                <div className="absolute inset-0 bg-brand-cream flex flex-col items-center justify-center text-brand-muted text-sm border-2 border-dashed border-brand-gray-border">
                                    <span>Hero slides will appear here</span>
                                </div>
                            )}
                            {activeSlides.map((slide, idx) => (
                                <div
                                    key={slide.id}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out h-full w-full ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"} ${slide.bgColor || "bg-white"}`}
                                >
                                    {slide.image && slide.image !== "/no-image.svg" && (
                                        <Link href={slide.link || "/"} className="absolute inset-0 z-0">
                                            <Image
                                                src={slide.image}
                                                alt={slide.title || "Hero Slide"}
                                                fill
                                                className="object-cover object-center"
                                                unoptimized
                                                priority={idx === 0}
                                            />
                                        </Link>
                                    )}
                                    {(!slide.image || slide.image === "/no-image.svg") && (
                                        <div className="absolute inset-0 bg-brand-cream z-0 flex flex-col items-center justify-center text-brand-muted text-xs text-center border-2 border-dashed border-brand-gray-border">
                                            <span className="bg-white px-2 py-1 rounded">No Image provided</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {activeSlides.length > 0 && (
                                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                                    {activeSlides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setCurrentSlide(idx)}
                                            className="group py-2 px-1"
                                            aria-label={`Go to slide ${idx + 1}`}
                                        >
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-6 bg-brand-navy" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                            {activeSlides.length > 0 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 rounded-full bg-white shadow-md border border-brand-gray-border items-center justify-center text-brand-navy hover:bg-brand-cream transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 rounded-full bg-white shadow-md border border-brand-gray-border items-center justify-center text-brand-navy hover:bg-brand-cream transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="w-full lg:w-[33%] flex flex-col gap-1 md:gap-1.5">
                            {banners.length >= 3 ? (
                                <>
                                    <div className="grid grid-cols-3 gap-1 lg:hidden">
                                        {[0, 1, 2].map((i) => (
                                            <Link
                                                key={i}
                                                href={banners[i].link || "#"}
                                                className="relative aspect-[4/3] rounded-md overflow-hidden group shadow-sm bg-white border border-brand-gray-border block"
                                            >
                                                {banners[i].image && banners[i].image !== "/no-image.svg" ? (
                                                    <Image src={banners[i].image} alt={`Promo ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-brand-navy to-brand-navy-deep p-2 flex flex-col justify-center items-center">
                                                        <h3 className="text-white text-[10px] font-black leading-tight text-center">Promo</h3>
                                                    </div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="hidden lg:flex lg:flex-col lg:gap-1.5 h-full">
                                        <Link href={banners[0].link || "#"} className="relative lg:h-[58%] rounded-md md:rounded-lg overflow-hidden group shadow-sm bg-white border border-brand-gray-border block">
                                            {banners[0].image && banners[0].image !== "/no-image.svg" ? (
                                                <Image src={banners[0].image} alt="Promo 1" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-brand-navy to-brand-navy-deep p-4 md:p-6 flex flex-col justify-center">
                                                    <h3 className="text-white text-sm md:text-xl font-black leading-tight">Flash Sale</h3>
                                                </div>
                                            )}
                                        </Link>
                                        <div className="grid grid-cols-2 gap-1.5 lg:h-[42%]">
                                            <Link href={banners[1].link || "#"} className="relative rounded-md md:rounded-lg overflow-hidden group shadow-sm bg-white border border-brand-gray-border block">
                                                {banners[1].image && banners[1].image !== "/no-image.svg" ? (
                                                    <Image src={banners[1].image} alt="Promo 2" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-brand-yellow to-brand-yellow-bright p-4 flex flex-col justify-center">
                                                        <h3 className="text-brand-navy text-sm font-black leading-tight">New</h3>
                                                    </div>
                                                )}
                                            </Link>
                                            <Link href={banners[2].link || "#"} className="relative rounded-md md:rounded-lg overflow-hidden group shadow-sm bg-white border border-brand-gray-border block">
                                                {banners[2].image && banners[2].image !== "/no-image.svg" ? (
                                                    <Image src={banners[2].image} alt="Promo 3" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-brand-navy-deep to-brand-navy p-4 flex flex-col justify-center">
                                                        <h3 className="text-white text-sm font-black leading-tight">Deals</h3>
                                                    </div>
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="hidden lg:flex w-full h-full bg-brand-cream rounded-md flex flex-col items-center justify-center text-brand-muted text-sm border-2 border-dashed border-brand-gray-border">
                                    <span>Promo Banners</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

            </div>
        </div>
    );
}
