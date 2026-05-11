"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiTrash2, FiShoppingCart, FiShoppingBag } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        // Clean up the product object for the cart if needed
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            imageUrl: product.imageUrl,
            brand: product.brand,
            categoryName: product.categoryName
        };
        addToCart(cartProduct);
        removeFromWishlist(product.id);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 md:pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                        <FiHeart className="text-red-500 fill-red-500" /> My Wishlist
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">Products you&apos;ve saved for later.</p>
                </div>
            </div>

            <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 md:py-12">
                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 md:p-20 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiHeart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Add items you love to your wishlist and they will show up here.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <FiShoppingBag /> Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group h-full">
                                {/* Image Container */}
                                <Link
                                    href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                                    className="relative aspect-square bg-gray-50 overflow-hidden shrink-0"
                                >
                                    <Image
                                        src={product.imageUrl || "/no-image.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                                        unoptimized
                                    />
                                    {product.discount && (
                                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg shadow-sm">
                                            {product.discount}
                                        </div>
                                    )}
                                </Link>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
                                        <Link
                                            href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                                            className="text-sm md:text-base font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
                                        >
                                            {product.name}
                                        </Link>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-lg font-black text-gray-900">{product.price}</span>
                                            {product.oldPrice && (
                                                <span className="text-sm text-gray-400 line-through font-medium">{product.oldPrice}</span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
                                            >
                                                <FiShoppingCart className="w-4 h-4" /> Add to Cart
                                            </button>
                                            <button
                                                onClick={() => removeFromWishlist(product.id)}
                                                className="w-10 h-10 flex items-center justify-center border border-gray-100 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all active:scale-95"
                                                title="Remove from wishlist"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
