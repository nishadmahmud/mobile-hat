"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiTag, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import { getCampaigns } from '../../lib/api';
import ProductCard from '../../components/Shared/PremiumProductCard';

export default function OffersPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOffers() {
            try {
                const res = await getCampaigns();
                // Based on provided structure: res.success, res.campaigns.data
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Hero - Minimalist Slim Banner */}
            <div className="bg-[#111827] py-4 md:py-6 relative overflow-hidden border-b border-gray-800">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-600/10 blur-[80px] -rotate-12 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex items-center justify-between">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <h1 className="text-xl md:text-3xl font-black text-white tracking-tight">
                            Special <span className="text-blue-500">Campaigns</span>
                        </h1>
                        <span className="hidden md:block w-px h-6 bg-gray-800"></span>
                        <p className="text-gray-400 text-xs md:text-sm font-medium">
                            Exclusive deals and grand opening celebrations.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-10 space-y-12">
                {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                        <div key={campaign.id} className="space-y-8">
                            {/* Campaign Banner Card */}
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-white">
                                <div className="aspect-[21/9] md:aspect-[25/7] relative">
                                    <Image
                                        src={campaign.bg_image || "/no-image.svg"}
                                        alt={campaign.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                                        <div className="p-8 md:p-16 max-w-2xl">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Active Campaign</span>
                                                {campaign.end_at && (
                                                    <span className="flex items-center gap-1.5 text-white/90 text-xs font-bold bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
                                                        <FiClock className="w-3.5 h-3.5" /> Ends: {new Date(campaign.end_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{campaign.name}</h2>
                                            <p className="text-gray-200 text-sm md:text-lg mb-8 leading-relaxed line-clamp-3 font-medium">
                                                {campaign.description}
                                            </p>
                                            {campaign.button_text && (
                                                <Link
                                                    href={campaign.link || "#"}
                                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20 group"
                                                >
                                                    {campaign.button_text} <FiChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Products Grid */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <FiTag className="text-blue-600" /> Featured Products
                                    </h3>
                                    <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">{campaign.products?.length || 0} Deals</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                    {campaign.products?.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiTag size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">No active campaigns right now</h3>
                        <p className="text-gray-500 mt-3 font-medium max-w-md mx-auto">
                            Check back soon for exciting new offers, grand opening celebrations, and exclusive deals!
                        </p>
                        <Link
                            href="/"
                            className="mt-8 inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
