"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function ProductGallery({ images = [] }) {
    const imageArray =
        images && images.length > 0
            ? images.map((img) => (typeof img === "string" ? img.trim() : img))
            : ["/no-image.svg"];

    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

    useEffect(() => {
        setActiveIndex(0);
        if (trackRef.current) {
            trackRef.current.scrollTo({ left: 0, behavior: "auto" });
        }
    }, [images]);

    const scrollToIndex = useCallback((idx) => {
        const el = trackRef.current;
        if (!el) return;
        const clamped = Math.max(0, Math.min(imageArray.length - 1, idx));
        const slide = el.children[clamped];
        if (slide) {
            slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        }
        setActiveIndex(clamped);
    }, [imageArray.length]);

    const onScrollSnap = useCallback(() => {
        const el = trackRef.current;
        if (!el || !imageArray.length) return;
        const slideW = el.offsetWidth || 1;
        const next = Math.round(el.scrollLeft / slideW);
        setActiveIndex(Math.max(0, Math.min(imageArray.length - 1, next)));
    }, [imageArray.length]);

    return (
        <div className="flex w-full flex-col gap-3 md:gap-4 lg:flex-row lg:items-stretch">
            {/* Vertical thumbnails — desktop only */}
            <div className="no-scrollbar order-2 hidden max-h-[min(72vh,640px)] w-[76px] shrink-0 flex-col gap-2 overflow-y-auto pr-1 lg:order-1 lg:flex">
                {imageArray.map((img, idx) => (
                    <button
                        key={`vt-${idx}`}
                        type="button"
                        onClick={() => scrollToIndex(idx)}
                        className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-xl border-2 bg-brand-paper transition-all ${
                            activeIndex === idx
                                ? "border-brand-navy shadow-md shadow-brand-navy/15 ring-2 ring-brand-yellow/80"
                                : "border-brand-gray-border hover:border-brand-navy/40"
                        }`}
                    >
                        <Image src={img} alt={`View image ${idx + 1}`} fill unoptimized className="object-contain p-1.5" />
                    </button>
                ))}
            </div>

            <div className="order-1 flex min-w-0 flex-1 flex-col gap-3 lg:order-2">
                <div className="relative w-full lg:mx-auto lg:max-w-[min(100%,600px)] xl:max-w-[min(100%,680px)] 2xl:max-w-[min(100%,760px)]">
                    <div
                        ref={trackRef}
                        onScroll={onScrollSnap}
                        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-2xl border border-brand-gray-border bg-brand-paper shadow-sm aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3]"
                    >
                        {imageArray.map((img, idx) => (
                            <div
                                key={`slide-${idx}`}
                                className="relative h-full w-full min-w-full shrink-0 snap-start snap-always p-3 md:p-4"
                            >
                                <div
                                    className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl ${
                                        idx === activeIndex && isZooming ? "cursor-zoom-out" : "cursor-zoom-in"
                                    }`}
                                    onMouseEnter={() => idx === activeIndex && setIsZooming(true)}
                                    onMouseLeave={() => {
                                        setIsZooming(false);
                                        setZoomOrigin({ x: 50, y: 50 });
                                    }}
                                    onMouseMove={(e) => {
                                        if (idx !== activeIndex) return;
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        setZoomOrigin({
                                            x: Math.max(0, Math.min(100, x)),
                                            y: Math.max(0, Math.min(100, y)),
                                        });
                                    }}
                                >
                                    <Image
                                        src={img}
                                        alt={`Product image ${idx + 1}`}
                                        fill
                                        unoptimized
                                        priority={idx === 0}
                                        className="pointer-events-none select-none object-contain transition-transform duration-150 ease-out"
                                        style={{
                                            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                                            transform: idx === activeIndex && isZooming ? "scale(2)" : "scale(1)",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>



                    {imageArray.length > 1 && (
                        <>
                            <button
                                type="button"
                                aria-label="Previous image"
                                onClick={() => scrollToIndex(activeIndex - 1)}
                                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gray-border bg-white/95 text-brand-navy shadow-md backdrop-blur-sm transition-colors hover:bg-brand-navy hover:text-white md:left-3 md:h-11 md:w-11"
                            >
                                <ChevronLeft className="size-5" strokeWidth={2.25} />
                            </button>
                            <button
                                type="button"
                                aria-label="Next image"
                                onClick={() => scrollToIndex(activeIndex + 1)}
                                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gray-border bg-white/95 text-brand-navy shadow-md backdrop-blur-sm transition-colors hover:bg-brand-navy hover:text-white md:right-3 md:h-11 md:w-11"
                            >
                                <ChevronRight className="size-5" strokeWidth={2.25} />
                            </button>
                        </>
                    )}

                    <div
                        className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1 rounded-full border border-brand-gray-border/80 bg-white/90 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-brand-muted backdrop-blur-sm md:flex"
                        aria-hidden
                    >
                        <ZoomIn className="size-3.5" strokeWidth={2} />
                        Hover to zoom
                    </div>
                </div>

                {/* Horizontal thumbnails — mobile / sm; hidden on lg where vertical strip is primary */}
                <div className="no-scrollbar flex shrink-0 flex-row gap-2 overflow-x-auto pb-1 md:gap-3 lg:hidden">
                    {imageArray.map((img, idx) => (
                        <button
                            key={`ht-${idx}`}
                            type="button"
                            onClick={() => scrollToIndex(idx)}
                            className={`relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl border-2 bg-brand-paper transition-all md:h-[72px] md:w-[72px] ${
                                activeIndex === idx
                                    ? "border-brand-navy shadow-md shadow-brand-navy/15 ring-2 ring-brand-yellow/80"
                                    : "border-brand-gray-border hover:border-brand-navy/40"
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                unoptimized
                                className="object-contain p-1.5 md:p-2"
                            />
                        </button>
                    ))}
                </div>

                {/* Dot indicators */}
                {imageArray.length > 1 && imageArray.length <= 12 && (
                    <div className="flex justify-center gap-1.5" role="tablist" aria-label="Gallery slides">
                        {imageArray.map((_, idx) => (
                            <button
                                key={`dot-${idx}`}
                                type="button"
                                role="tab"
                                aria-selected={activeIndex === idx}
                                aria-label={`Go to image ${idx + 1}`}
                                onClick={() => scrollToIndex(idx)}
                                className={`h-2 rounded-full transition-all ${
                                    activeIndex === idx ? "w-6 bg-brand-navy" : "w-2 bg-brand-gray-border hover:bg-brand-navy/40"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
