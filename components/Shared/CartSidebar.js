"use client";

import { useCart } from "../../context/CartContext";
import { X, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function CartSidebar() {
    const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
                aria-hidden
            />

            <aside
                className="relative flex h-full w-full max-w-md flex-col border-l border-brand-gray-border bg-brand-paper shadow-2xl animate-slide-in-right"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-sidebar-title"
            >
                {/* Header */}
                <div className="z-10 flex shrink-0 items-center justify-between border-b border-brand-gray-border bg-white px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-gray-border bg-brand-paper text-brand-navy">
                            <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div>
                            <h2 id="cart-sidebar-title" className="text-lg font-black tracking-tight text-brand-navy md:text-xl">
                                Your cart
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closeCart}
                        className="rounded-full p-2.5 text-brand-muted transition-colors hover:bg-brand-paper hover:text-brand-navy"
                        aria-label="Close cart"
                    >
                        <X className="h-6 w-6" strokeWidth={2} />
                    </button>
                </div>

                {/* Items */}
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5">
                    {cartItems.length === 0 ? (
                        <div className="flex h-full min-h-[50vh] flex-col items-center justify-center px-4 text-center">
                            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-brand-gray-border bg-white text-brand-muted/40">
                                <ShoppingBag className="h-11 w-11" strokeWidth={1.25} />
                            </div>
                            <h3 className="text-lg font-bold text-brand-navy">Your cart is empty</h3>
                            <p className="mt-2 max-w-[260px] text-sm text-brand-muted">
                                You haven&apos;t added anything yet. Browse the store and tap add to cart when you find something you like.
                            </p>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="mt-6 rounded-full bg-brand-navy px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-navy/20 transition-colors hover:bg-brand-navy-deep"
                            >
                                Continue shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-3 pb-2">
                            {cartItems.map((item, index) => (
                                <li
                                    key={`${item.id}-${item.variantKey}-${index}`}
                                    className="group relative rounded-2xl border border-brand-gray-border bg-white p-4 pr-12 shadow-sm"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id, item.variantKey)}
                                        className="absolute right-3 top-3 rounded-lg p-1.5 text-brand-muted transition-colors hover:bg-red-50 hover:text-red-600"
                                        aria-label={`Remove ${item.name}`}
                                    >
                                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                                    </button>

                                    <div className="flex gap-3">
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-brand-gray-border bg-brand-paper/80">
                                            <Image
                                                src={
                                                    (item.imageUrl || item.images?.[0] || item.image || "/no-image.svg")
                                                        ?.toString()
                                                        .trim() || "/no-image.svg"
                                                }
                                                alt={item.name}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="pr-2 text-sm font-bold leading-snug text-brand-navy">{item.name}</h3>

                                            {item.variants && (
                                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                    {item.variants.storage && (
                                                        <span className="rounded-md border border-brand-gray-border bg-brand-paper px-2 py-0.5 text-[11px] font-semibold text-brand-muted">
                                                            {item.variants.storage}
                                                        </span>
                                                    )}
                                                    {item.variants.colors?.name && (
                                                        <span className="inline-flex items-center gap-1 rounded-md border border-brand-gray-border bg-brand-paper px-2 py-0.5 text-[11px] font-semibold text-brand-muted">
                                                            <span
                                                                className="h-2 w-2 shrink-0 rounded-full border border-brand-gray-border"
                                                                style={{ backgroundColor: item.variants.colors.hex }}
                                                            />
                                                            {item.variants.colors.name}
                                                        </span>
                                                    )}
                                                    {item.variants.region && (
                                                        <span className="rounded-md border border-brand-gray-border bg-brand-paper px-2 py-0.5 text-[11px] font-semibold text-brand-muted">
                                                            {item.variants.region}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-3 flex items-end justify-between gap-2">
                                                <p className="text-sm font-black text-brand-navy">
                                                    ৳{(item.numericPrice * item.quantity).toLocaleString()}
                                                </p>
                                                <div className="flex items-center rounded-lg border border-brand-gray-border bg-brand-paper/80 p-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, item.variantKey, item.quantity - 1)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-navy transition-colors hover:bg-white disabled:opacity-40"
                                                        disabled={item.quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                    </button>
                                                    <span className="min-w-7 text-center text-xs font-black text-brand-navy">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, item.variantKey, item.quantity + 1)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-navy transition-colors hover:bg-white"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="shrink-0 border-t border-brand-gray-border bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_40px_rgba(30,45,74,0.08)] md:pb-5">
                        <div className="mb-1 flex items-baseline justify-between gap-3">
                            <span className="text-sm font-semibold text-brand-muted">
                                Subtotal <span className="text-[10px] font-medium normal-case text-brand-muted/80">(incl. VAT)</span>
                            </span>
                            <span className="text-xl font-black text-brand-navy">৳{cartTotal.toLocaleString()}</span>
                        </div>
                        <p className="mb-4 text-center text-[11px] leading-relaxed text-brand-muted">
                            Shipping and any discounts are confirmed at checkout.
                        </p>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-navy/25 transition-colors hover:bg-brand-navy-deep"
                        >
                            Checkout
                        </Link>
                    </div>
                )}
            </aside>

            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
