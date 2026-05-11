"use client";

import Image from "next/image";

export default function ServiceHighlightsStrip({ className = "" }) {
  const serviceHighlights = [
    { label: "36 Months EMI", icon: "/site-svg/emi%20applex%201.svg" },
    { label: "Fastest Home Delivery", icon: "/site-svg/Delivery-applex.svg" },
    { label: "Exchange Facility", icon: "/site-svg/exchange%20-%20applex%201.svg" },
    { label: "Best Price Deals", icon: "/site-svg/best-price_applex.svg" },
    { label: "After-Sales Service", icon: "/site-svg/help-call_applex.svg" },
  ];

  return (
    <div className={className}>
      <div className="rounded-2xl border border-brand-gray-border bg-white shadow-[0_4px_20px_rgba(30,45,74,0.06)] px-4 md:px-8 py-4 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 md:gap-x-7 gap-y-1 md:gap-y-3">
          {serviceHighlights.map((item, idx) => (
            <div
              key={item.label}
              className={`flex items-center justify-center lg:justify-start gap-3 md:gap-4 min-h-[52px] md:min-h-[62px] ${
                idx === serviceHighlights.length - 1 && serviceHighlights.length % 2 === 1
                  ? "col-span-2 md:col-span-1"
                  : ""
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={30}
                height={30}
                className="h-[24px] w-[24px] md:h-[30px] md:w-[30px] object-contain shrink-0 opacity-90"
              />
              <span className="text-[14px] md:text-[16px] font-semibold leading-tight text-brand-navy whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
