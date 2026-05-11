"use client";

import { useCart } from "../../context/CartContext";
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function CartSidebar() {
    const {
        cartItems,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        cartTotal
    } = useCart();

    // Prevent body scroll when cart is open
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
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            ></div>

            {/* Sidebar content */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <FiShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900">Your Cart</h2>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</p>
                        </div>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Cart Items / Empty State */}
                <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600/30 mb-2">
                                <FiShoppingBag size={48} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                            <p className="text-sm text-gray-500 max-w-[250px]">Looks like you haven't added anything to your cart yet.</p>
                            <button
                                onClick={closeCart}
                                className="mt-4 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 relative">
                            {cartItems.map((item, index) => (
                                <div key={`${item.id}-${item.variantKey}-${index}`} className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative pr-10">

                                    {/* Delete Button (Absolute top right of card) */}
                                    <button
                                        onClick={() => removeFromCart(item.id, item.variantKey)}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>

                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
                                            <Image
                                                src={
                                                    (item.imageUrl ||
                                                    item.images?.[0] ||
                                                    item.image ||
                                                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400")?.toString().trim()
                                                }
                                                alt={item.name}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 leading-tight pr-6">{item.name}</h3>

                                                {/* Variants */}
                                                {item.variants && (
                                                    <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500">
                                                        {item.variants.storage && (
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded-md">{item.variants.storage}</span>
                                                        )}
                                                        {item.variants.colors?.name && (
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.variants.colors.hex }}></span>
                                                                {item.variants.colors.name}
                                                            </span>
                                                        )}
                                                        {item.variants.region && (
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded-md">{item.variants.region}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price and Quantity row */}
                                            <div className="flex items-end justify-between mt-3">
                                                <div className="font-extrabold text-blue-600 text-sm relative top-1">
                                                    ৳{(item.numericPrice * item.quantity).toLocaleString()}
                                                </div>

                                                {/* Qty Controls */}
                                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.variantKey, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white hover:text-black hover:shadow-sm rounded-md transition-all disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <FiMinus size={12} />
                                                    </button>
                                                    <span className="w-6 text-center text-xs font-bold text-gray-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.variantKey, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white hover:text-black hover:shadow-sm rounded-md transition-all"
                                                    >
                                                        <FiPlus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Checkout */}
                {cartItems.length > 0 && (
                    <div className="pt-5 pb-24 md:pb-5 px-5 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 font-medium">Subtotal <span className="text-xs ml-1">(incl. VAT)</span></span>
                            <span className="text-xl font-extrabold text-gray-900">৳{cartTotal.toLocaleString()}</span>
                        </div>

                        <p className="text-xs text-gray-400 mb-5 text-center">Shipping and discount warnings calculated at checkout.</p>

                        <div className="flex flex-col gap-3">
                            <Link href="/checkout" onClick={closeCart} className="w-full">
                                <button className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                                    Checkout Now
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Slide In Animation CSS */}
            <style jsx>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
