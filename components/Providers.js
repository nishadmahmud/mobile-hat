"use client";

import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { CompareProvider } from "../context/CompareContext";
import { WishlistProvider } from "../context/WishlistContext";
import { BrandCacheProvider } from "../context/BrandCacheContext";
import CartSidebar from "./Shared/CartSidebar";
import AuthModal from "./Auth/AuthModal";
import { Toaster } from "react-hot-toast";

export default function Providers({ children, categories = [] }) {
    return (
        <BrandCacheProvider categories={categories}>
            <AuthProvider>
                <CartProvider>
                    <CompareProvider>
                        <WishlistProvider>
                            {children}
                            <CartSidebar />
                            <AuthModal />
                            <Toaster
                                position="top-center"
                                toastOptions={{
                                    duration: 3000,
                                    style: {
                                        background: '#1e2d4a',
                                        color: '#fff',
                                        fontSize: '14px',
                                        borderRadius: '12px',
                                    },
                                }}
                            />
                        </WishlistProvider>
                    </CompareProvider>
                </CartProvider>
            </AuthProvider>
        </BrandCacheProvider>
    );
}

