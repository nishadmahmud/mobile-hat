"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiZap, FiPackage } from "react-icons/fi";
import { getSpecialOffers } from '../../lib/api';

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
            "from-blue-600 to-indigo-700",
            "from-purple-600 to-pink-700",
            "from-emerald-600 to-teal-700",
            "from-orange-500 to-red-600"
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header / Hero - Minimalist Slim Banner */}
            <div className="bg-[#111827] py-4 md:py-6 relative overflow-hidden border-b border-gray-800">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-600/10 blur-[80px] -rotate-12 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex items-center justify-between">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <h1 className="text-xl md:text-3xl font-black text-white tracking-tight">
                            Special <span className="text-blue-500">Offers</span>
                        </h1>
                        <span className="hidden md:block w-px h-6 bg-gray-800"></span>
                        <p className="text-gray-400 text-xs md:text-sm font-medium">
                            Premium tech at unbeatable prices.
                        </p>
                    </div>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 md:py-12">
                {offers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {offers.map((offer, index) => (
                            <div key={offer.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-all duration-500 flex flex-col h-full">
                                <div className={`h-56 relative bg-gradient-to-br ${getGradientColor(index)}`}>
                                    <Image
                                        src={offer.image || "/no-image.svg"}
                                        alt={offer.title}
                                        fill
                                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                                            Special Offer
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 text-white/20 group-hover:text-white/40 transition-colors">
                                        <FiPackage size={80} strokeWidth={1} />
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {offer.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                                        {offer.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added On</span>
                                            <span className="text-xs font-black text-blue-600">{new Date(offer.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <Link
                                            href={offer.url || "/offers"}
                                            className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all shadow-lg"
                                        >
                                            <FiChevronRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiZap size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">No special offers at the moment</h3>
                        <p className="text-gray-500 mt-3 font-medium max-w-md mx-auto">
                            We're cooking up something amazing. Check back soon for exclusive hardware deals and bundle offers!
                        </p>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-20 rounded-[40px] bg-blue-600 p-8 md:p-16 text-center text-white shadow-2xl shadow-blue-600/30">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Want First Access to New Deals?</h2>
                    <p className="text-blue-100 max-w-xl mx-auto mb-10 text-lg">
                        Our most exclusive offers often sell out in minutes. Join our community and get notified the moment they drop.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl text-white text-base placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 sm:w-80 font-bold"
                        />
                        <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
