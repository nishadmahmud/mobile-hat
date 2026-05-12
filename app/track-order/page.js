"use client";

import { Suspense, useEffect, useState } from "react";
import { trackOrder } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Home, Package, Truck, PackageCheck, ClipboardList, CheckCircle2, Search, MapPin } from "lucide-react";

const timelineStages = [
    { id: 1, label: "Order Received", icon: ClipboardList },
    { id: 2, label: "Confirmed", icon: PackageCheck },
    { id: 3, label: "Processing", icon: Truck },
    { id: 4, label: "Delivered", icon: Home },
];

const OrderTimeline = ({ currentStatus }) => {
    const status = Number(currentStatus);
    return (
        <div className="px-2 py-6">
            <div className="hidden sm:block">
                <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-brand-gray-border" />
                    <div
                        className="absolute left-0 top-5 h-1 rounded-full bg-gradient-to-r from-brand-navy to-brand-yellow-bright transition-all duration-500"
                        style={{ width: `${((Math.min(status, 4) - 1) / 3) * 100}%` }}
                    />
                    {timelineStages.map((stage) => {
                        const isCompleted = status >= stage.id;
                        const isCurrent = status === stage.id;
                        const StageIcon = stage.icon;
                        return (
                            <div key={stage.id} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                                        isCompleted
                                            ? "bg-gradient-to-br from-brand-navy to-brand-navy-deep text-white shadow-lg shadow-brand-navy/30"
                                            : "border-2 border-brand-gray-border bg-white text-brand-muted"
                                    } ${isCurrent ? "scale-110 ring-4 ring-brand-yellow/40" : ""}`}
                                >
                                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-sm font-semibold">{stage.id}</span>}
                                </div>
                                <div className={`mt-4 flex flex-col items-center ${isCompleted ? "text-brand-navy" : "text-brand-muted"}`}>
                                    <StageIcon className={`mb-1 h-5 w-5 ${isCompleted ? "text-brand-yellow-bright" : ""}`} />
                                    <span className={`max-w-[90px] text-center text-xs font-medium ${isCurrent ? "font-bold" : ""}`}>{stage.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="space-y-4 sm:hidden">
                {timelineStages.map((stage, index) => {
                    const isCompleted = status >= stage.id;
                    const isCurrent = status === stage.id;
                    const StageIcon = stage.icon;
                    const isLast = index === timelineStages.length - 1;
                    return (
                        <div key={stage.id} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                        isCompleted
                                            ? "bg-gradient-to-br from-brand-navy to-brand-navy-deep text-white shadow-md"
                                            : "border-2 border-brand-gray-border bg-white text-brand-muted"
                                    } ${isCurrent ? "ring-3 ring-brand-yellow/50" : ""}`}
                                >
                                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm">{stage.id}</span>}
                                </div>
                                {!isLast && <div className={`h-8 w-0.5 ${isCompleted ? "bg-brand-navy" : "bg-brand-gray-border"}`} />}
                            </div>
                            <div className={`flex items-center gap-2 pt-2 ${isCompleted ? "text-brand-navy" : "text-brand-muted"}`}>
                                <StageIcon className={`h-5 w-5 ${isCompleted ? "text-brand-yellow-bright" : ""}`} />
                                <span className={`text-sm ${isCurrent ? "font-bold" : "font-medium"}`}>{stage.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const [invoiceId, setInvoiceId] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const getStatusLabel = (s) => {
        s = Number(s);
        if (s === 1) return "Order Received";
        if (s === 2) return "Confirmed";
        if (s === 3) return "Processing";
        if (s === 4) return "Delivered";
        if (s === 5) return "Canceled";
        if (s === 6) return "On Hold";
        return "Pending";
    };
    const getStatusColor = (s) => {
        s = Number(s);
        if (s === 1) return "border-brand-gray-border bg-brand-paper text-brand-navy";
        if (s === 2) return "border-brand-gray-border bg-brand-paper text-brand-navy";
        if (s === 3) return "border-brand-yellow/60 bg-brand-paper text-brand-navy";
        if (s === 4) return "border-green-200 bg-green-50 text-green-800";
        if (s === 5) return "border-red-200 bg-red-50 text-red-800";
        if (s === 6) return "border-amber-200 bg-amber-50 text-amber-900";
        return "border-brand-gray-border bg-brand-paper text-brand-muted";
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!invoiceId.trim()) {
            toast.error("Please enter an Invoice ID");
            return;
        }
        setLoading(true);
        setOrderData(null);
        setSearched(true);
        try {
            const response = await trackOrder({ invoice_id: invoiceId.trim() });
            if (response.success && response.data?.data?.length > 0) {
                setOrderData(response.data.data[0]);
                toast.success("Order found!");
            } else {
                toast.error("Order not found. Please check your Invoice ID.");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const invoiceFromUrl = searchParams.get("invoice")?.trim();
        if (invoiceFromUrl) {
            setInvoiceId(invoiceFromUrl);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-brand-paper pb-20 md:pb-10">
            <div className="border-b border-brand-gray-border/80 bg-white">
                <div className="mx-auto max-w-4xl px-4 py-10 text-center md:px-8 md:py-16">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-gray-border bg-brand-paper md:h-20 md:w-20">
                        <Truck className="h-8 w-8 text-brand-navy md:h-10 md:w-10" strokeWidth={2} />
                    </div>
                    <h1 className="mb-3 text-3xl font-black tracking-tight text-brand-navy md:text-4xl">Track your order</h1>
                    <p className="mx-auto max-w-md text-sm text-brand-muted md:text-base">Enter your invoice ID to see the real-time status of your order.</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
                <div className="mb-6 rounded-2xl border border-brand-gray-border bg-white p-5 shadow-sm md:p-8">
                    <form onSubmit={handleTrack} className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted" />
                            <input
                                type="text"
                                value={invoiceId}
                                onChange={(e) => setInvoiceId(e.target.value)}
                                placeholder="Enter Invoice ID (e.g. INV-12345)"
                                className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 py-4 pl-12 pr-4 text-sm text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10 md:text-base"
                                style={{ fontSize: "16px" }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="whitespace-nowrap rounded-xl bg-brand-navy px-8 py-4 font-extrabold text-white transition-colors hover:bg-brand-navy-deep disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Tracking...
                                </span>
                            ) : (
                                "Track order"
                            )}
                        </button>
                    </form>
                </div>

                {orderData && (
                    <div className="overflow-hidden rounded-2xl border border-brand-gray-border bg-white shadow-sm">
                        <div className="border-b border-brand-gray-border/80 p-5 md:p-8">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-muted">Invoice ID</p>
                                    <h2 className="text-xl font-extrabold text-brand-navy md:text-2xl">#{orderData.invoice_id}</h2>
                                    <p className="mt-1 text-sm text-brand-muted">
                                        {new Date(orderData.created_at).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className={`rounded-full border px-5 py-2.5 text-sm font-bold ${getStatusColor(orderData.tran_status || orderData.status)}`}>
                                    {getStatusLabel(orderData.tran_status || orderData.status)}
                                </div>
                            </div>
                        </div>

                        {![5, 6].includes(Number(orderData.tran_status || orderData.status)) && (
                            <div className="px-5 md:px-8">
                                <OrderTimeline currentStatus={orderData.tran_status || orderData.status} />
                            </div>
                        )}

                        {[5, 6].includes(Number(orderData.tran_status || orderData.status)) && (
                            <div className="px-5 py-8 md:px-8">
                                <div className="rounded-xl border border-brand-gray-border bg-brand-paper px-6 py-8 text-center">
                                    <h3 className="mb-2 text-xl font-bold text-brand-navy">
                                        {Number(orderData.tran_status || orderData.status) === 5 ? "Order canceled" : "Order on hold"}
                                    </h3>
                                    <p className="text-sm text-brand-muted">
                                        {Number(orderData.tran_status || orderData.status) === 5
                                            ? "This order has been canceled."
                                            : "This order is currently on hold."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {orderData.sales_details?.length > 0 && (
                            <div className="px-5 pb-6 md:px-8">
                                <h3 className="mb-4 flex items-center gap-2 font-bold text-brand-navy">
                                    <Package size={18} />
                                    Products ({orderData.sales_details.length})
                                </h3>
                                <div className="space-y-3">
                                    {orderData.sales_details.map((item, i) => (
                                        <div key={i} className="flex gap-4 rounded-xl border border-brand-gray-border/80 bg-brand-paper/50 p-3">
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-brand-paper">
                                                {item.product_info?.image_path ? (
                                                    <Image src={item.product_info.image_path} alt="Product" fill className="object-cover" unoptimized />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-brand-muted">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-1 text-sm font-medium text-brand-navy">{item.product_info?.name || "Product"}</p>
                                                <p className="mt-1 text-xs text-brand-muted">
                                                    Qty: {item.qty}
                                                    {item.size ? ` • Size: ${item.size}` : ""}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="font-bold text-brand-navy">৳{item.price * item.qty}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="px-5 pb-6 md:px-8">
                            <div className="rounded-xl border border-brand-gray-border bg-brand-paper/80 p-4">
                                <h3 className="mb-3 flex items-center gap-2 font-bold text-brand-navy">
                                    <MapPin size={18} />
                                    Delivery address
                                </h3>
                                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                    <div>
                                        <p className="mb-0.5 text-xs text-brand-muted">Name</p>
                                        <p className="font-medium text-brand-navy">{orderData.delivery_customer_name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="mb-0.5 text-xs text-brand-muted">Phone</p>
                                        <p className="font-medium text-brand-navy">{orderData.delivery_customer_phone || "N/A"}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="mb-0.5 text-xs text-brand-muted">Address</p>
                                        <p className="font-medium text-brand-navy">{orderData.delivery_customer_address || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 pb-8 md:px-8">
                            <div className="space-y-2 rounded-xl border border-brand-gray-border bg-brand-paper/50 p-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-brand-muted">Subtotal</span>
                                    <span className="font-medium text-brand-navy">৳{orderData.sub_total || orderData.total || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-muted">Delivery fee</span>
                                    <span className="font-medium text-brand-navy">৳{orderData.delivery_fee || 0}</span>
                                </div>
                                {Number(orderData.coupon_discount || 0) > 0 && (
                                    <div className="flex justify-between text-green-700">
                                        <span>Coupon discount</span>
                                        <span>-৳{orderData.coupon_discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-brand-gray-border pt-2 text-lg font-bold">
                                    <span className="text-brand-navy">Grand total</span>
                                    <span className="text-brand-navy">
                                        ৳
                                        {Number(orderData.sub_total ?? orderData.total ?? 0) +
                                            Number(orderData.delivery_fee ?? 0) -
                                            Number(orderData.coupon_discount ?? 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {searched && !loading && !orderData && (
                    <div className="rounded-2xl border border-brand-gray-border bg-white p-10 text-center shadow-sm md:p-16">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-gray-border bg-brand-paper">
                            <Search className="h-10 w-10 text-brand-muted/50" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-brand-navy">Order not found</h3>
                        <p className="mx-auto max-w-sm text-sm text-brand-muted">
                            We couldn&apos;t find an order with that invoice ID. Please double-check and try again.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-brand-paper" />}>
            <TrackOrderContent />
        </Suspense>
    );
}
