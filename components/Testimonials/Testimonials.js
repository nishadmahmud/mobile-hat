"use client";

import { useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DUMMY_REVIEWS = [
    {
        id: 1,
        name: "Rahim Uddin",
        rating: 5,
        review: "Bought my iPhone 16 Pro Max from Mobile Hat. 100% authentic product with all original accessories. Delivery was super fast too!",
        date: "February 2026",
        product: "iPhone 16 Pro Max",
    },
    {
        id: 2,
        name: "Sarah Ahmed",
        rating: 5,
        review: "Best place to buy Samsung phones in Bangladesh. The Galaxy S25 Ultra I got is absolutely genuine. Great customer service!",
        date: "March 2026",
        product: "Samsung Galaxy S25 Ultra",
    },
    {
        id: 3,
        name: "Kamal Hossain",
        rating: 4,
        review: "Got my OnePlus 13 at a great price. Packaging was premium and the warranty process is straightforward. Highly recommended.",
        date: "January 2026",
        product: "OnePlus 13",
    },
    {
        id: 4,
        name: "Nadia Islam",
        rating: 5,
        review: "I was skeptical about buying phones online, but Mobile Hat changed my mind. The Pixel 9 Pro I ordered arrived perfectly sealed. Will buy again!",
        date: "February 2026",
        product: "Google Pixel 9 Pro",
    },
];

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const reviews = DUMMY_REVIEWS;

    const prev = () => setActiveIndex((i) => (i - 1 + reviews.length) % reviews.length);
    const next = () => setActiveIndex((i) => (i + 1) % reviews.length);

    return (
        <section className="w-full bg-white py-16 md:py-20 overflow-hidden border-y border-brand-gray-border/50">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.08em] text-brand-navy">Loved by shoppers</h2>
                    <p className="text-brand-muted text-sm mt-2">Real reviews from verified buyers</p>
                </div>

                {/* Reviews Grid (Desktop) */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {reviews.map((review) => (
                        <div key={review.id} className="rounded-2xl bg-brand-paper border border-brand-gray-border p-5 md:p-6 flex flex-col gap-4 hover:border-brand-yellow hover:shadow-md hover:shadow-brand-navy/10 transition-all duration-300">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed flex-1">&ldquo;{review.review}&rdquo;</p>

                            <div className="border-t border-gray-100 pt-3 mt-auto">
                                <p className="text-sm font-bold text-gray-900">{review.name}</p>
                                <p className="text-xs text-brand-navy font-semibold">{review.product}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{review.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Carousel */}
                {reviews.length > 0 && (
                    <div className="md:hidden">
                        <div className="rounded-2xl bg-brand-paper border border-brand-gray-border p-5 flex flex-col gap-4 shadow-sm">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={`w-4 h-4 ${i < reviews[activeIndex].rating ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{reviews[activeIndex].review}&rdquo;</p>
                            <div className="border-t border-gray-100 pt-3">
                                <p className="text-sm font-bold text-gray-900">{reviews[activeIndex].name}</p>
                                <p className="text-xs text-brand-navy font-semibold">{reviews[activeIndex].product}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 mt-4">
                            <button onClick={prev} className="w-9 h-9 rounded-full bg-white border border-brand-gray-border flex items-center justify-center text-brand-navy hover:border-brand-yellow transition-colors shadow-sm">
                                <FiChevronLeft size={18} />
                            </button>
                            <span className="text-xs text-gray-400 font-medium">{activeIndex + 1} / {reviews.length}</span>
                            <button onClick={next} className="w-9 h-9 rounded-full bg-white border border-brand-gray-border flex items-center justify-center text-brand-navy hover:border-brand-yellow transition-colors shadow-sm">
                                <FiChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
