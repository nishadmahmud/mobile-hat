"use client";

import { useState, useMemo, useEffect } from 'react';
import { 
    FiShield, 
    FiCheckCircle, 
    FiTruck, 
    FiSmartphone, 
    FiCreditCard, 
    FiX,
} from 'react-icons/fi';
import { bankEmiData } from '../../lib/emiData';

const APPLEX_CARE_PLUS_ONE_YEAR_IMG =
    '/product-details-svg/1%20YER%20garanty%20ff%20balk.png';

// ── FULL Bank EMI Data ──────────────────────────────────────────────

// ── Original EMI Calculator (exact original logic + UI) ─────────────
function EMICalculator({ currentPrice }) {
    const [selectedBank, setSelectedBank] = useState(bankEmiData[0]);
    const [customAmount, setCustomAmount] = useState(currentPrice);

    const calculateEMI = (price, months, chargePercent) => {
        if (!chargePercent) return null;
        const chargeAmount = (price * chargePercent) / 100;
        const totalAmount = price + chargeAmount;
        const monthlyEMI = totalAmount / months;
        return { emi: monthlyEMI, charge: chargePercent, effectiveCost: totalAmount };
    };

    const getEmiPlans = (bank) => {
        const plans = [];
        const months = [
            { key: 'm3', label: 3 }, { key: 'm6', label: 6 }, { key: 'm9', label: 9 },
            { key: 'm12', label: 12 }, { key: 'm18', label: 18 }, { key: 'm24', label: 24 }, { key: 'm36', label: 36 }
        ];
        months.forEach(({ key, label }) => {
            if (bank[key]) {
                const calc = calculateEMI(customAmount, label, bank[key]);
                if (calc) plans.push({ months: label, ...calc });
            }
        });
        return plans;
    };

    const plans = getEmiPlans(selectedBank);

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 tracking-tight">EMI Options</h3>

            <div className="flex flex-row gap-2 md:gap-4 h-[500px] md:h-[600px]">
                {/* Left: Bank List */}
                <div className="w-[110px] md:w-1/3 border border-gray-100 rounded-2xl flex flex-col h-full sticky top-0 overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-100 font-black text-[10px] text-gray-400 uppercase tracking-widest sticky top-0 z-10">
                        Select Bank
                    </div>
                    <div className="overflow-y-auto flex-1 bg-white">
                        {bankEmiData.map((bank, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedBank(bank)}
                                className={`w-full flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 p-3 text-center md:text-left border-b border-gray-50 last:border-0 transition-all ${selectedBank.bank === bank.bank
                                    ? 'bg-blue-50 border-r-4 md:border-r-0 md:border-l-4 border-blue-600'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-8 h-8 md:w-10 md:h-10 ${!bank.logo && bank.color} rounded-xl flex items-center justify-center text-white font-black text-xs md:text-sm flex-shrink-0 mx-auto md:mx-0 overflow-hidden bg-white shadow-sm`}>
                                    {bank.logo ? (
                                        <img
                                            src={bank.logo}
                                            alt={bank.bank}
                                            className="w-full h-full object-contain p-1"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.remove('bg-white');
                                                e.target.parentElement.classList.add(bank.color.split(' ')[0]);
                                                e.target.parentElement.innerHTML = bank.initial;
                                            }}
                                        />
                                    ) : (
                                        <div className={`w-full h-full ${bank.color} flex items-center justify-center font-black`}>
                                            {bank.initial}
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[10px] md:text-[13px] font-bold ${selectedBank.bank === bank.bank ? 'text-blue-600' : 'text-gray-600'} truncate w-full md:w-auto`}>{bank.bank}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: EMI Details */}
                <div className="flex-1 space-y-4 h-full overflow-y-auto pr-1">
                    {/* Amount Input */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Purchase Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-black text-lg">৳</span>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(Number(e.target.value))}
                                className="w-full py-3 px-4 pl-9 bg-white border-2 border-transparent rounded-xl text-lg font-black text-gray-900 focus:outline-none focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* EMI Table */}
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-[13px] whitespace-nowrap">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-center p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Plan</th>
                                    <th className="text-left p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Monthly EMI</th>
                                    <th className="text-right p-3 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {plans.length > 0 ? plans.map((plan, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-center align-middle font-black text-gray-900">
                                            {plan.months} <span className="text-[10px] text-gray-400">Months</span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="text-blue-600 font-black text-sm">৳ {plan.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                                <span className="text-[10px] font-bold text-gray-400">Charge {plan.charge}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right align-middle text-gray-900 font-black">
                                            ৳ {plan.effectiveCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-gray-400 font-bold italic uppercase tracking-tighter">No EMI plans available for this bank</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <FiCheckCircle className="text-blue-600 w-4 h-4 shrink-0" />
                        <p className="text-[11px] font-bold text-blue-600 leading-tight">
                            EMI facility is available for purchases over ৳5,000. Terms and conditions apply based on bank policies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main ApplexCare Component ───────────────────────────────────────
export default function ApplexCare({ product, currentPrice, selectedCarePlans, toggleCarePlan, openEmiTrigger = 0 }) {
    const [activeDrawer, setActiveDrawer] = useState(null);
    const categoryLower = (product?.category?.name || '').toLowerCase();
    const categorySlugLower = (product?.category?.slug || '').toLowerCase();
    const productNameLower = (product?.name || '').toLowerCase();
    
    const phoneCategoryBlob = `${categoryLower} ${categorySlugLower} ${productNameLower}`;
    const isPhoneCategory =
        phoneCategoryBlob.includes('iphone') ||
        phoneCategoryBlob.includes('smartphone') ||
        phoneCategoryBlob.includes('smart phone') ||
        phoneCategoryBlob.includes('mobile') ||
        /\bphones?\b/.test(phoneCategoryBlob);
    const isAdapter = productNameLower.includes('adaptar') || productNameLower.includes('adapter');
    const isCable = productNameLower.includes('cable');
    const isLaptop = categoryLower.includes('laptop') || categoryLower.includes('macbook') ||
                    productNameLower.includes('macbook') || productNameLower.includes('laptop');

    const price = Number(currentPrice || 0);

    const carePlansToShow = useMemo(() => {
        if (isAdapter) return [{ id: 'warranty_adapter', name: '12 Month Instant Replacement', description: 'Instant replacement for issues', price: 0 }];
        if (isCable) return [{ id: 'warranty_cable', name: '6 Month Instant Replacement', description: 'Instant replacement for issues', price: 0 }];
        if (isLaptop) return [{ id: 'care_laptop', name: 'Applex Care+ 1 Year', description: 'Brand New Replacement Guarantee', price: Math.round(price * 0.05) }];
        if (isPhoneCategory) return [
            { id: 'care_phone', name: 'Applex Care+ 1 Year', description: 'Brand New Replacement Guarantee', price: Math.round(price * 0.05) },
            { id: 'screen_care', name: 'Applex Screen Care+ : 730 days', description: 'One time display replacement', price: Math.round(price * 0.10) },
        ];
        return [{ id: 'warranty_12', name: '6 Months Extended Warranty', description: 'Extended hardware coverage', price: Math.round(price * 0.10) }];
    }, [isAdapter, isCable, isLaptop, isPhoneCategory, price]);

    const closeDrawer = () => setActiveDrawer(null);

    useEffect(() => {
        if (openEmiTrigger > 0) {
            setActiveDrawer('emi');
        }
    }, [openEmiTrigger]);

    const renderDrawerContent = () => {
        switch (activeDrawer) {
            case 'shipping':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Shipping Details</h3>
                        <div className="grid gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                                <div><span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Inside Dhaka</span><p className="text-sm font-black">24–48 Hours</p></div>
                                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Fast</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                                <div><span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Outside Dhaka</span><p className="text-sm font-black">3–5 Business Days</p></div>
                                <span className="bg-gray-200 text-gray-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Standard</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                            * Delivery charges vary based on location and parcel weight. Standard rates apply.
                        </p>
                    </div>
                );
            case 'emi':
                return <EMICalculator currentPrice={price} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-2">
                {[
                    { id: 'shipping', icon: FiTruck, title: 'Shipping', sub: '0-3 Day Fast Delivery' },
                    { id: 'emi', icon: FiCreditCard, title: 'EMI Plans', sub: 'All Banks & Calculations' }
                ].map((item) => (
                    <button key={item.id} onClick={() => setActiveDrawer(item.id)} className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group text-left">
                        <div className="bg-gray-50 p-2.5 rounded-lg group-hover:bg-blue-600 transition-colors">
                            <item.icon className="text-gray-400 w-4 h-4 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <h4 className="font-black text-[11px] text-gray-900 uppercase tracking-widest leading-none mb-0.5">{item.title}</h4>
                            <p className="text-[10px] font-bold text-gray-400">{item.sub}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Care Section - Moved to bottom */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-black text-white h-[64px] px-3 py-0 flex items-center gap-2 overflow-hidden">
                    <FiShield className="h-5 w-5 text-blue-500 shrink-0" />
                    <div className="min-w-0 flex-1 h-full overflow-hidden rounded-sm bg-black flex items-center">
                        <img
                            src={APPLEX_CARE_PLUS_ONE_YEAR_IMG}
                            alt="Applex Care+"
                            className="h-full w-auto max-w-full object-contain object-left"
                        />
                    </div>
                </div>
                <div className="p-3 space-y-2">
                    {carePlansToShow.map((plan) => {
                        const isSelected = selectedCarePlans.some(p => p.id === plan.id);
                        return (
                            <label key={plan.id} className={`cursor-pointer group flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${isSelected ? "border-blue-600 bg-blue-50/50" : "border-gray-50 bg-gray-50/30 hover:border-gray-200"}`}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleCarePlan(plan)}
                                    className="mt-1 w-4 h-4 shrink-0 border-2 rounded-md border-gray-300 accent-blue-600"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-baseline gap-2 mb-0.5">
                                        <h4 className={`font-black text-[12px] ${isSelected ? "text-blue-600" : "text-gray-900"}`}>{plan.name}</h4>
                                        <span className="font-black text-[12px]">{plan.price === 0 ? "FREE" : `৳ ${plan.price.toLocaleString()}`}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 leading-tight">{plan.description}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Drawer Overlay — matches original ProductExtras Premium Overlay */}
            {activeDrawer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={closeDrawer} />
                    <div className={`
                        relative bg-white shadow-[0_32px_128px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col 
                        transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-5
                        ${activeDrawer === 'emi'
                            ? 'w-full max-w-5xl rounded-[3rem] h-[90vh]'
                            : 'w-full max-w-lg rounded-[3rem] h-fit max-h-[85vh]'
                        }
                    `}>
                        <div className="absolute top-6 right-6 z-20">
                            <button onClick={closeDrawer} className="p-3 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all active:scale-95">
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-8 md:p-12">
                            {renderDrawerContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
