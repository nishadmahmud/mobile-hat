"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            imageUrl: product.imageUrl,
            brand: product.brand,
            categoryName: product.categoryName,
        };
        addToCart(cartProduct);
        removeFromWishlist(product.id);
    };

    return (
        <div className="min-h-screen bg-brand-paper pb-20 md:pb-12">
            <div className="border-b border-brand-gray-border/80 bg-white py-8">
                <div className="mx-auto max-w-[1550px] px-4 md:px-8">
                    <h1 className="flex items-center gap-3 text-2xl font-black text-brand-navy md:text-3xl">
                        <Heart className="size-8 shrink-0 fill-red-500 text-red-500 md:size-9" strokeWidth={2} aria-hidden />
                        My wishlist
                    </h1>
                    <p className="mt-2 text-sm text-brand-muted md:text-base">Products you&apos;ve saved for later.</p>
                </div>
            </div>

            <div className="mx-auto max-w-[1550px] px-4 py-8 md:px-8 md:py-12">
                {wishlist.length === 0 ? (
                    <div className="mx-auto max-w-2xl rounded-3xl border border-brand-gray-border bg-white p-12 text-center shadow-sm md:p-20">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-brand-gray-border bg-brand-paper">
                            <Heart className="size-10 text-brand-muted/40" strokeWidth={1.5} />
                        </div>
                        <h2 className="mb-4 text-2xl font-black text-brand-navy">Your wishlist is empty</h2>
                        <p className="mx-auto mb-8 max-w-sm text-brand-muted">Add items you love to your wishlist and they will show up here.</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-2xl bg-brand-navy px-8 py-3.5 font-black uppercase tracking-widest text-white shadow-lg shadow-brand-navy/25 transition-all hover:bg-brand-navy-deep active:scale-[0.98]"
                        >
                            <ShoppingBag className="size-5 shrink-0" strokeWidth={2} />
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {wishlist.map((product) => (
                            <div
                                key={product.id}
                                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-gray-border bg-white shadow-sm"
                            >
                                <Link
                                    href={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}-${product.id}`}
                                    className="relative aspect-square shrink-0 overflow-hidden bg-brand-paper"
                                >
                                    <Image
                                        src={product.imageUrl || "/no-image.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                                        unoptimized
                                    />
                                    {product.discount && (
                                        <div className="absolute left-3 top-3 rounded-lg bg-red-600 px-2.5 py-1 text-[10px] font-black text-white shadow-sm">
                                            {product.discount}
                                        </div>
                                    )}
                                </Link>

                                <div className="flex flex-1 flex-col p-5">
                                    <div className="mb-2">
                                        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-brand-muted">{product.brand}</p>
                                        <Link
                                            href={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}-${product.id}`}
                                            className="line-clamp-2 text-sm font-bold leading-snug text-brand-navy transition-colors hover:text-brand-yellow-bright md:text-base"
                                        >
                                            {product.name}
                                        </Link>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="mb-4 flex items-baseline gap-2">
                                            <span className="text-lg font-black text-brand-navy">{product.price}</span>
                                            {product.oldPrice && (
                                                <span className="text-sm font-medium text-brand-muted line-through">{product.oldPrice}</span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(product)}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-navy py-2.5 text-xs font-black uppercase tracking-wide text-white transition-all hover:bg-brand-navy-deep active:scale-[0.98]"
                                            >
                                                <ShoppingCart className="size-4 shrink-0" strokeWidth={2} />
                                                Add to cart
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeFromWishlist(product.id)}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-gray-border bg-brand-paper text-brand-muted transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-95"
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 className="size-4" strokeWidth={2} />
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
