"use client";

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQ_ITEMS = [
    {
        q: "Are all phones sold by Mobile Hat 100% authentic?",
        a: "Yes. We source devices from official distributors and authorized channels where possible. Every phone is listed with a valid IMEI and warranty details. We do not sell replicas.",
    },
    {
        q: "What warranty do you offer?",
        a: "New phones ship with the official manufacturer warranty where applicable. Our team helps you with claim guidance across Bangladesh.",
    },
    {
        q: "Do you offer delivery?",
        a: "Yes — we ship nationwide via trusted couriers. Dhaka metro is typically fastest; other districts follow courier timelines.",
    },
    {
        q: "Can I return or exchange a product?",
        a: "We offer a 7-day return window for eligible unopened items. Defective items are replaced per policy. See our Refund page for details.",
    },
    {
        q: "Do you accept trade-ins?",
        a: "Trade-in availability depends on stock and inspection. Contact support with your device model for a quick estimate.",
    },
    {
        q: "What payment methods do you accept?",
        a: "Cash on delivery, mobile banking, cards via SSLCommerz, and EMI on select products.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <>
            <div className="w-full bg-brand-navy py-5 md:py-7 text-center border-t border-white/10">
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-[0.14em] text-white md:tracking-[0.2em]">
                    Frequently asked questions
                </h2>
            </div>
            <section className="w-full bg-brand-paper py-12 md:py-16">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <p className="text-center text-brand-muted text-sm md:text-base mb-8 md:mb-10">
                        Everything you need to know before you checkout.
                    </p>

                    <div className="space-y-2">
                        {FAQ_ITEMS.map((item, idx) => (
                            <div
                                key={idx}
                                className={`rounded-xl border transition-all duration-300 ${openIndex === idx
                                    ? 'bg-white border-brand-yellow shadow-md shadow-brand-navy/10'
                                    : 'bg-white border-brand-gray-border hover:border-brand-yellow/60'
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(idx)}
                                    className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 text-left"
                                >
                                    <span className={`text-base md:text-lg font-semibold pr-4 transition-colors ${openIndex === idx ? 'text-brand-navy' : 'text-brand-navy/90'
                                        }`}>
                                        {item.q}
                                    </span>
                                    <FiChevronDown
                                        className={`w-5 h-5 shrink-0 transition-all duration-300 ${openIndex === idx ? 'rotate-180 text-brand-yellow' : 'text-brand-muted'
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-5 md:px-6 pb-5 md:pb-6">
                                        <p className="text-base text-brand-muted leading-relaxed">{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
