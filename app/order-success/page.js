import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Home, ShieldCheck, Truck } from "lucide-react";

export default async function OrderSuccessPage({ searchParams }) {
    const params = await searchParams;
    const invoiceId = params?.invoice?.trim() || "";

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_45%),linear-gradient(180deg,#f8fbff_0%,#ffffff_50%,#f3f7ff_100%)]">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
                <div className="rounded-[32px] border border-blue-100 bg-white/90 backdrop-blur shadow-[0_30px_80px_rgba(37,99,235,0.12)] overflow-hidden">
                    <div className="relative px-6 md:px-10 pt-10 md:pt-14 pb-8 border-b border-blue-50">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 mb-6">
                            <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
                        </div>

                        <div className="max-w-2xl">
                            <p className="text-xs md:text-sm font-extrabold uppercase tracking-[0.28em] text-blue-600 mb-3">
                                Order Confirmed
                            </p>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                                Your order has been placed successfully.
                            </h1>
                            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
                                We have received your order and started processing it. Keep your invoice number handy to track the status anytime.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 md:px-10 py-8 md:py-10">
                        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 md:p-7">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-blue-600">
                                        <ClipboardList className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                                            Invoice Number
                                        </p>
                                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 break-all">
                                            {invoiceId ? `#${invoiceId}` : "Will be available shortly"}
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {invoiceId
                                        ? "Use this invoice number on the track order page to check delivery progress."
                                        : "Your order was placed, but the invoice number was not found in the redirect URL."}
                                </p>
                            </div>

                            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 md:p-7">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200/80 mb-4">
                                    What Happens Next
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="w-5 h-5 text-emerald-300 mt-0.5" />
                                        <p className="text-sm text-blue-50/90">Your order details have been saved securely.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Truck className="w-5 h-5 text-cyan-300 mt-0.5" />
                                        <p className="text-sm text-blue-50/90">Delivery updates will appear on the tracking page as the order moves forward.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-white font-extrabold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                <Home className="w-5 h-5" />
                                Back To Home
                            </Link>
                            <Link
                                href={invoiceId ? `/track-order?invoice=${encodeURIComponent(invoiceId)}` : "/track-order"}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-gray-900 font-extrabold hover:border-blue-200 hover:text-blue-700 transition-colors"
                            >
                                Track Order
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
