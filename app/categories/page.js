"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronRight, FiGrid } from 'react-icons/fi';
import { getCategoriesFromServer } from '../../lib/api';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategoriesFromServer();
                const data = res?.data || (Array.isArray(res) ? res : []);
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pb-20 md:pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-8">
                <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                        <FiGrid className="text-blue-600" /> All Categories
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">Explore our wide range of premium tech gear and gadgets.</p>
                </div>
            </div>

            <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8">
                {isLoading ? (
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
                        {[...Array(14)].map((_, i) => (
                            <div key={`loader-${i}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3"></div>
                                <div className="h-3 bg-gray-100 rounded w-12 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
                        {categories.map((cat, index) => (
                            <div key={cat.id || `cat-${index}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col">
                                <Link
                                    href={`/category/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex flex-col items-center text-center p-4 hover:bg-gray-50 transition-colors h-full"
                                >
                                    <div className="w-12 h-12 md:w-16 md:h-16 relative bg-blue-50 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform mb-3">
                                        <Image
                                            src={cat.image_url || cat.image_path || "/no-image.svg"}
                                            alt={cat.name || "Category"}
                                            fill
                                            className="object-contain p-2"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-[10px] md:text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                            {cat.name}
                                        </h2>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
