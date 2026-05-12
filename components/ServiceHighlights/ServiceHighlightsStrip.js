"use client";

import { CreditCard, Truck, RefreshCw, Tag, Headphones } from "lucide-react";

export default function ServiceHighlightsStrip({ className = "" }) {
  const serviceHighlights = [
    { label: "36 Months EMI", icon: CreditCard },
    { label: "Fastest Home Delivery", icon: Truck },
    { label: "Exchange Facility", icon: RefreshCw },
    { label: "Best Price Deals", icon: Tag },
    { label: "After-Sales Service", icon: Headphones },
  ];

  return (
    <div className={className}>
      <div className="rounded-2xl border border-brand-gray-border bg-white shadow-[0_4px_20px_rgba(30,45,74,0.06)] px-4 py-4 md:px-8 md:py-6">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 md:grid-cols-3 md:gap-x-7 md:gap-y-3 lg:grid-cols-5">
          {serviceHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex min-h-[52px] items-center justify-center gap-3 md:min-h-[62px] md:gap-4 lg:justify-start ${
                  idx === serviceHighlights.length - 1 && serviceHighlights.length % 2 === 1
                    ? "col-span-2 md:col-span-1"
                    : ""
                }`}
              >
                <Icon
                  className="h-6 w-6 shrink-0 text-brand-navy opacity-90 md:h-[30px] md:w-[30px]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="whitespace-nowrap text-[14px] font-semibold leading-tight text-brand-navy md:text-[16px]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
