"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist));
            } catch (error) {
                console.error("Failed to parse wishlist from localStorage", error);
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        if (!wishlist.find(item => item.id === product.id)) {
            setWishlist(prev => [...prev, product]);
            toast.success("Added to wishlist!");
        } else {
            toast.error("Already in wishlist!");
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId));
        toast.success("Removed from wishlist!");
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistCount: wishlist.length,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
