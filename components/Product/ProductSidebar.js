"use client";

import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { BsFileEarmarkText, BsGift, BsTruck, BsCreditCard } from 'react-icons/bs';

export default function ProductSidebar() {
    const [selectedWarranties, setSelectedWarranties] = useState([]);

    const toggleWarranty = (id) => {
        setSelectedWarranties(prev =>
            prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
        );
    };

    const warranties = [
        { id: 1, title: "applex Care+ 1 Year", desc: "Brand New Parts Guarantee", price: "BDT 5,100" },
        { id: 2, title: "applex Motor Care+ : 5 Years", desc: "Free motor replacement (excluding physical damage)", price: "BDT 6,120" },
        { id: 3, title: "1 Year Comprehensive Warranty", desc: "", price: "BDT 4,080" },
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* Feature Highlights */}
            <div className="bg-white border text-left border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                <div className="bg-blue-50 text-blue-500 p-3 rounded-full shrink-0">
                    <BsFileEarmarkText size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-extrabold text-[#1a3b34]">Technical Specifications</h4>
                    <p className="text-[12px] text-gray-500">Detailed product specs</p>
                </div>
            </div>

            <div className="bg-white border text-left border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                <div className="bg-purple-50 text-purple-500 p-3 rounded-full shrink-0">
                    <BsGift size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-extrabold text-[#1a3b34]">Perks & Benefits</h4>
                    <p className="text-[12px] text-gray-500">Exclusive rewards & offers</p>
                </div>
            </div>

            <div className="bg-white border text-left border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                <div className="bg-green-50 text-green-500 p-3 rounded-full shrink-0">
                    <BsTruck size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-extrabold text-[#1a3b34]">Delivery Information</h4>
                    <p className="text-[12px] text-gray-500">Shipping methods & times</p>
                </div>
            </div>

            <div className="bg-white border text-left border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                <div className="bg-purple-50 text-brand-purple p-3 rounded-full shrink-0">
                    <BsCreditCard size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-extrabold text-[#1a3b34]">EMI Availability</h4>
                    <p className="text-[12px] text-gray-500">Easy monthly installments</p>
                </div>
            </div>

            {/* Brand Care / Warranties */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-4 shadow-sm">
                <div className="bg-black text-white px-4 py-3 font-bold flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    applex Care
                </div>
                <div className="p-4 flex flex-col gap-3">
                    {warranties.map(warranty => (
                        <label key={warranty.id} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${selectedWarranties.includes(warranty.id) ? 'border-brand-purple bg-purple-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className={`mt-0.5 w-5 h-5 shrink-0 rounded flex items-center justify-center border transition-colors ${selectedWarranties.includes(warranty.id) ? 'bg-brand-purple border-brand-purple' : 'bg-white border-gray-300'}`}>
                                {selectedWarranties.includes(warranty.id) && <FiCheck className="text-white w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start gap-4">
                                    <span className="text-[13px] font-bold text-gray-800 leading-tight">{warranty.title}</span>
                                    <span className="text-[12px] font-extrabold text-[#1a3b34] whitespace-nowrap">{warranty.price}</span>
                                </div>
                                {warranty.desc && (
                                    <p className="text-[10px] text-gray-500 mt-1 leading-snug pr-2">{warranty.desc}</p>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center gap-2">
                    <FiCheck className="text-green-500" />
                    <span className="text-xs text-gray-600 font-medium tracking-wide">I agree to applex's <span className="underline cursor-pointer">terms & conditions</span></span>
                </div>
            </div>
        </div>
    );
}
