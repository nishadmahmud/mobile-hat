"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [], showUsedTag = false }) {
    const imageArray = images && images.length > 0 
        ? images.map(img => typeof img === 'string' ? img.trim() : img) 
        : ['/no-image.svg'];
    const [mainImage, setMainImage] = useState(imageArray[0]);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

    // When images prop changes (e.g., variant color selected), reset to first image
    useEffect(() => {
        if (imageArray.length > 0) {
            setMainImage(imageArray[0]);
        }
    }, [images]);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Container */}
            <div
                className={`flex-1 aspect-square relative bg-[#f5f5f5] rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-4 ${isZooming ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => {
                    setIsZooming(false);
                    setZoomOrigin({ x: 50, y: 50 });
                }}
                onMouseMove={(e) => {
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
                    src={mainImage}
                    alt="Product Image"
                    fill
                    unoptimized
                    className="object-contain select-none pointer-events-none transition-transform duration-150 ease-out"
                    style={{
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        transform: isZooming ? 'scale(2)' : 'scale(1)',
                    }}
                />
                {showUsedTag && (
                    <Image
                        src="/used_tag.png"
                        alt="Used product"
                        width={118}
                        height={36}
                        className="absolute left-8 bottom-18 z-20 h-auto w-[90px] md:w-[118px]"
                    />
                )}
            </div>

            {/* Thumbnail Strip (Always Bottom) */}
            <div className="flex flex-row gap-3 overflow-x-auto pb-2 no-scrollbar shrink-0">
                {imageArray.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`relative w-[72px] h-[72px] md:w-[92px] md:h-[92px] aspect-square shrink-0 rounded-xl border-2 overflow-hidden bg-[#f5f5f5] transition-all ${
                            mainImage === img ? 'border-blue-600 shadow-lg shadow-blue-500/10' : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            unoptimized
                            className="object-contain p-2"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
