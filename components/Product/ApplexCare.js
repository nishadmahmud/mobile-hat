"use client";

import { useState, useMemo, useEffect } from 'react';
import { Truck, CreditCard, X, CircleCheck, Shield } from 'lucide-react';
import { bankEmiData } from '../../lib/emiData';

const CARE_PLUS_ONE_YEAR_IMG =
    '/product-details-svg/1%20YER%20garanty%20ff%20balk.png';

/** Set to `true` when the Care+ plan cards (warranty add-ons) should show again. */
const SHOW_CARE_PLAN_CARDS = false;

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
            <h3 className="text-lg font-bold tracking-tight text-brand-navy">EMI Options</h3>

            <div className="flex min-h-0 flex-row gap-2 md:gap-4 h-[min(480px,68vh)] md:h-[min(560px,72vh)]">
                {/* Left: Bank List */}
                <div className="flex h-full w-[110px] shrink-0 flex-col overflow-hidden rounded-2xl border border-brand-gray-border md:w-1/3">
                    <div className="sticky top-0 z-10 border-b border-brand-gray-border bg-brand-paper p-3 font-black text-[10px] uppercase tracking-widest text-brand-muted">
                        Select Bank
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto bg-white">
                        {bankEmiData.map((bank, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedBank(bank)}
                                className={`flex w-full flex-col items-center gap-1 border-b border-brand-gray-border/60 p-3 text-center transition-all last:border-0 md:flex-row md:items-center md:gap-3 md:text-left ${
                                    selectedBank.bank === bank.bank
                                        ? "border-l-4 border-brand-navy bg-brand-paper md:border-l-4 md:border-r-0"
                                        : "hover:bg-brand-paper/80"
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
                                <span
                                    className={`w-full truncate text-[10px] font-bold md:w-auto md:text-[13px] ${
                                        selectedBank.bank === bank.bank ? "text-brand-navy" : "text-brand-muted"
                                    }`}
                                >
                                    {bank.bank}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: EMI Details */}
                <div className="flex h-full min-h-0 flex-1 flex-col space-y-4 overflow-y-auto pr-1">
                    {/* Amount Input */}
                    <div className="rounded-2xl border border-brand-gray-border bg-brand-paper p-4">
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-brand-muted">
                            Purchase Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-brand-navy">৳</span>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(Number(e.target.value))}
                                className="w-full rounded-xl border-2 border-transparent bg-white py-3 pl-9 pr-4 text-lg font-black text-brand-navy shadow-sm transition-all focus:border-brand-navy/30 focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                            />
                        </div>
                    </div>

                    {/* EMI Table */}
                    <div className="overflow-hidden rounded-2xl border border-brand-gray-border shadow-sm">
                        <table className="w-full whitespace-nowrap text-[13px]">
                            <thead className="bg-brand-paper">
                                <tr>
                                    <th className="border-b border-brand-gray-border p-3 text-center font-black uppercase tracking-widest text-brand-muted">
                                        Plan
                                    </th>
                                    <th className="border-b border-brand-gray-border p-3 text-left font-black uppercase tracking-widest text-brand-muted">
                                        Monthly EMI
                                    </th>
                                    <th className="border-b border-brand-gray-border p-3 text-right font-black uppercase tracking-widest text-brand-muted">
                                        Total Cost
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {plans.length > 0 ? (
                                    plans.map((plan, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b border-brand-gray-border/60 transition-colors last:border-0 hover:bg-brand-paper/50"
                                        >
                                            <td className="p-4 align-middle text-center font-black text-brand-navy">
                                                {plan.months} <span className="text-[10px] text-brand-muted">Months</span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-brand-navy">
                                                        ৳ {plan.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-brand-muted">
                                                        Charge {plan.charge}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right align-middle font-black text-brand-navy">
                                                ৳ {plan.effectiveCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="p-8 text-center font-bold uppercase tracking-tighter text-brand-muted italic"
                                        >
                                            No EMI plans available for this bank
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-brand-gray-border bg-brand-paper p-3">
                        <CircleCheck className="h-4 w-4 shrink-0 text-brand-navy" strokeWidth={2} />
                        <p className="text-[11px] font-bold leading-tight text-brand-navy">
                            EMI facility is available for purchases over ৳5,000. Terms and conditions apply based on bank
                            policies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main extended care / EMI block ──────────────────────────────────
export default function DeviceCareEmiPanel({ product, currentPrice, selectedCarePlans, toggleCarePlan, openEmiTrigger = 0 }) {
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
        if (isLaptop) return [{ id: 'care_laptop', name: 'Care+ 1 Year', description: 'Brand New Replacement Guarantee', price: Math.round(price * 0.05) }];
        if (isPhoneCategory) return [
            { id: 'care_phone', name: 'Care+ 1 Year', description: 'Brand New Replacement Guarantee', price: Math.round(price * 0.05) },
            { id: 'screen_care', name: 'Screen Care+ : 730 days', description: 'One time display replacement', price: Math.round(price * 0.10) },
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
                        <h3 className="text-xl font-black tracking-tight text-brand-navy">Shipping Details</h3>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between rounded-2xl border border-brand-gray-border bg-brand-paper p-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted">
                                        Inside Dhaka
                                    </span>
                                    <p className="text-sm font-black text-brand-navy">24–48 Hours</p>
                                </div>
                                <span className="rounded-lg bg-brand-navy px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                    Fast
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-brand-gray-border bg-brand-paper p-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted">
                                        Outside Dhaka
                                    </span>
                                    <p className="text-sm font-black text-brand-navy">3–5 Business Days</p>
                                </div>
                                <span className="rounded-lg bg-brand-gray-border px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-navy">
                                    Standard
                                </span>
                            </div>
                        </div>
                        <p className="text-center text-[10px] font-black uppercase leading-relaxed tracking-widest text-brand-muted">
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
                    { id: 'shipping', icon: Truck, title: 'Shipping', sub: '0-3 Day Fast Delivery' },
                    { id: 'emi', icon: CreditCard, title: 'EMI Plans', sub: 'All Banks & Calculations' }
                ].map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveDrawer(item.id)}
                        className="group flex w-full items-center gap-3 rounded-xl border border-brand-gray-border bg-white p-3 text-left shadow-sm transition-all hover:border-brand-navy/40 hover:shadow-md"
                    >
                        <div className="rounded-lg bg-brand-paper p-2.5 transition-colors group-hover:bg-brand-navy">
                            <item.icon className="h-4 w-4 text-brand-navy transition-colors group-hover:text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h4 className="mb-0.5 text-[11px] font-black uppercase leading-none tracking-widest text-brand-navy">
                                {item.title}
                            </h4>
                            <p className="text-[10px] font-bold text-brand-muted">{item.sub}</p>
                        </div>
                    </button>
                ))}
            </div>

            {SHOW_CARE_PLAN_CARDS ? (
                <div className="overflow-hidden rounded-2xl border-2 border-brand-gray-border bg-white shadow-sm">
                    <div className="flex h-[64px] items-center gap-2 overflow-hidden bg-brand-navy px-3 py-0">
                        <Shield className="h-5 w-5 shrink-0 text-brand-yellow" strokeWidth={2} />
                        <div className="flex h-full min-w-0 flex-1 items-center overflow-hidden rounded-sm bg-brand-navy">
                            <img
                                src={CARE_PLUS_ONE_YEAR_IMG}
                                alt="Care+"
                                className="h-full w-auto max-w-full object-contain object-left"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 p-3">
                        {carePlansToShow.map((plan) => {
                            const isSelected = selectedCarePlans.some((p) => p.id === plan.id);
                            return (
                                <label
                                    key={plan.id}
                                    className={`group flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-all duration-300 ${
                                        isSelected
                                            ? "border-brand-navy bg-brand-paper"
                                            : "border-brand-gray-border/60 bg-brand-paper/40 hover:border-brand-gray-border"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleCarePlan(plan)}
                                        className="mt-1 h-4 w-4 shrink-0 rounded-md border-2 border-brand-gray-border accent-brand-navy"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-0.5 flex items-baseline justify-between gap-2">
                                            <h4 className="text-[12px] font-black text-brand-navy">{plan.name}</h4>
                                            <span className="text-[12px] font-black text-brand-navy">
                                                {plan.price === 0 ? "FREE" : `৳ ${plan.price.toLocaleString()}`}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold leading-tight text-brand-muted">{plan.description}</p>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            {/* Drawer Overlay — matches original ProductExtras Premium Overlay */}
            {activeDrawer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 animate-in fade-in bg-brand-navy/50 backdrop-blur-sm duration-300" onClick={closeDrawer} />
                    <div className={`
                        relative bg-white shadow-[0_32px_128px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col 
                        transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-5
                        ${activeDrawer === 'emi'
                            ? 'w-full max-w-5xl rounded-[3rem] h-[90vh]'
                            : 'w-full max-w-lg rounded-[3rem] h-fit max-h-[85vh]'
                        }
                    `}>
                        <div className="absolute top-6 right-6 z-20">
                            <button
                                type="button"
                                onClick={closeDrawer}
                                className="rounded-2xl bg-brand-paper p-3 text-brand-muted transition-all hover:bg-red-50 hover:text-red-500 active:scale-95"
                            >
                                <X className="h-6 w-6" strokeWidth={2} />
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
