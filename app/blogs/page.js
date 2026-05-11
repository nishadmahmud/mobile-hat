"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCalendar, FiClock, FiSearch } from 'react-icons/fi';
import { getBlogs } from '../../lib/api';


export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const res = await getBlogs();
                if (res?.success && res.data && res.data.length > 0) {
                    setPosts(res.data);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-blue-600 py-16 md:py-24">
                <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Applex Insights
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Your go-to source for smartphone reviews, tech guides, and industry news.
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-4 md:p-6 border border-gray-100">
                    <div className="relative max-w-xl mx-auto">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse bg-white rounded-3xl h-[400px] border border-gray-100"></div>
                        ))}
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blogs/${post.id}`}
                                className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500"
                            >
                                <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                                    <Image
                                        src={post.image || "/no-image.svg"}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        unoptimized
                                    />
                                </div>
                                <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors text-center">
                                        {post.title}
                                    </h2>
                                    <div className="mt-6 flex items-center justify-center text-blue-600 font-bold text-sm gap-2">
                                        Read Article <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">No matching articles found</h3>
                        <p className="text-gray-500 mt-2">Try searching with a different keyword.</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-6 text-blue-600 font-bold hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
