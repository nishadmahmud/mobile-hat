"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductTabs({ description, specifications, videoUrl, recentlyViewed = [] }) {
    const [activeTab, setActiveTab] = useState('specifications');

    const specRows = useMemo(() => {
        if (!Array.isArray(specifications)) return [];
        return specifications;
    }, [specifications]);

    const sections = [
        { id: 'specifications', label: 'SPECIFICATION' },
        { id: 'description', label: 'DESCRIPTION' },
        { id: 'video', label: 'VIDEO' },
    ];

    return (
        <div className="mt-12 md:mt-24 w-full">
            {/* Header Row: Tabs and Recently Viewed Heading synchronized */}
            <div className="lg:grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-8">
                <div className="lg:col-span-8 flex items-center gap-3 md:gap-4 flex-wrap">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`px-6 py-2.5 md:px-10 md:py-3.5 rounded-md text-[11px] md:text-[13px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                activeTab === section.id 
                                ? 'bg-[#FF8A00] text-white border-[#FF8A00] shadow-xl shadow-orange-500/20' 
                                : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200 hover:text-orange-600 shadow-sm'
                            }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-4 hidden lg:block">
                    {/* Empty placeholder to maintain grid alignment with tabs */}
                </div>
            </div>

            {/* Content Row: Main Content and Sticky Sidebar Content */}
            <div className="lg:grid lg:grid-cols-12 gap-10 lg:gap-14">
                
                {/* LEFT Content (8 Columns) */}
                <div className="lg:col-span-8 w-full overflow-hidden">
                    {activeTab === 'specifications' && (
                        <section
                            id="specifications"
                            className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full overflow-hidden"
                        >
                            <h3 className="text-xl md:text-2xl font-black text-[#B05B1E] mb-4 tracking-tight px-4">Specifications</h3>
                            <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-xl shadow-gray-100/50 w-full overflow-x-auto">
                                {specRows.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 font-medium italic">
                                        Product specifications are being updated.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 bg-white">
                                        {specRows.map((spec, idx) => (
                                            <div key={idx} className={`flex flex-col sm:flex-row group transition-all ${idx % 2 === 0 ? 'bg-[#F4F4F4]' : 'bg-white'}`}>
                                                <div className="w-full sm:w-[28%] p-2.5 md:p-3 text-[12px] md:text-[13px] font-semibold text-gray-500 uppercase tracking-wide flex items-start sm:items-center border-r border-gray-100">
                                                    {spec.name}
                                                </div>
                                                <div className="w-full sm:flex-1 p-2.5 md:p-3 text-[14px] md:text-[16px] text-gray-900 font-semibold leading-snug break-words">
                                                    {spec.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'description' && (
                        <section
                            id="description"
                            className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-2 md:px-4 py-2 w-full overflow-hidden break-words"
                        >
                            <h3 className="text-xl md:text-2xl font-black text-[#B05B1E] mb-8 tracking-tight">Description</h3>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed md:leading-loose w-full overflow-hidden break-words">
                                <div 
                                    className="w-full overflow-hidden break-words [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6 [&>h2]:text-2xl [&>h2]:font-black [&>h2]:mb-6 [&>h3]:text-xl [&>h3]:font-black [&>h3]:mb-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-3xl [&_img]:my-10 [&_img]:mx-auto [&_img]:shadow-lg [&_*]:max-w-full [&_*]:break-words"
                                    dangerouslySetInnerHTML={{ __html: description || '<p>No detailed description available yet.</p>' }} 
                                />
                            </div>
                        </section>
                    )}

                    {activeTab === 'video' && (
                        <section
                            id="video"
                            className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-2 md:px-4 py-2 w-full overflow-hidden"
                        >
                            <h3 className="text-xl md:text-2xl font-black text-[#B05B1E] mb-8 tracking-tight">Video</h3>
                            <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                                {videoUrl ? (
                                    <div className="aspect-video w-full">
                                        <iframe
                                            src={videoUrl}
                                            title="Product Video"
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-400 font-medium">
                                        Product video will be added soon.
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT Sidebar Content (4 Columns) */}
                <div className="lg:col-span-4 w-full">
                    {/* Unified Sidebar Container */}
                    <div className="lg:sticky lg:top-40 pt-8 lg:pt-0">
                        {/* Always Visible Header */}
                        <div className="flex items-center justify-between mb-8 px-2">
                             <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                Recently Viewed
                            </h2>
                            <Link href="/" className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                                View Shop
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {recentlyViewed.length > 0 ? (
                                recentlyViewed.slice(0, 4).map((product, idx) => (
                                    <Link 
                                        key={product.id || idx}
                                        href={`/product/${product.slug || product.id}`}
                                        className="flex items-start gap-4 bg-white p-4 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group"
                                    >
                                        <div className="w-20 h-20 relative shrink-0 bg-gray-50/50 rounded-2xl overflow-hidden p-2 flex items-center justify-center border border-gray-100">
                                            <Image 
                                                src={product.image || "/no-image.svg"} 
                                                alt={product.name}
                                                fill
                                                className="object-contain group-hover:scale-110 transition-transform duration-700"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <h4 className="text-[13px] md:text-[14px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[15px] md:text-[16px] font-black text-gray-900">
                                                    {product.price}
                                                </span>
                                                {product.oldPrice && (
                                                    <span className="text-[11px] text-gray-400 line-through font-bold">
                                                        {product.oldPrice}
                                                    </span>
                                                )}
                                            </div>
                                            {product.discount && (
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-widest">
                                                        {product.discount} OFF
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 md:p-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center bg-gray-50/30">
                                    <div className="w-14 h-14 rounded-full bg-white shadow-sm mx-auto mb-6 flex items-center justify-center">
                                        <span className="text-gray-200 text-2xl font-black">?</span>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                                        Your recently <br/> viewed items <br/> show up here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
