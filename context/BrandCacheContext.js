"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const BrandCacheContext = createContext({
    brandsByCategory: {},
    allBrands: [],
    isFetchingBrands: false,
    getBrandsForCategory: () => [],
});

const CACHE_KEY = 'mobile_hat_brands_cache';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Read cached brand data from localStorage
 */
function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL) {
            return parsed.data;
        }
        // Cache expired
        return null;
    } catch {
        return null;
    }
}

/**
 * Write brand data to localStorage
 */
function writeCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data,
        }));
    } catch {
        // localStorage might be full or disabled — fail silently
    }
}

/**
 * Fetch the top brands API to get brand images
 * Returns a Map of lowercase brand name → { id, name, image }
 */
async function fetchBrandImages() {
    const API_BASE = process.env.NEXT_PUBLIC_API;
    const USER_ID = process.env.NEXT_PUBLIC_USER_ID;
    const brandImageMap = new Map();

    try {
        const res = await fetch(`${API_BASE}/public/brands/${USER_ID}`);
        if (!res.ok) return brandImageMap;
        const data = await res.json();

        if (data?.success && Array.isArray(data.data)) {
            data.data.forEach(b => {
                if (b.name) {
                    brandImageMap.set(b.name.trim().toLowerCase(), {
                        id: b.id,
                        name: b.name.trim(),
                        image: (b.image_path && b.image_path.trim()) ? b.image_path.trim() : null,
                    });
                }
            });
        }
    } catch (err) {
        console.error('[BrandCache] Error fetching brand images:', err);
    }

    return brandImageMap;
}

/**
 * Fetch all products for a given category (all pages) and extract unique brand names
 */
async function fetchBrandsForCategory(categoryId) {
    const API_BASE = process.env.NEXT_PUBLIC_API;
    const brands = new Map(); // lowercase name → { name, id? }

    try {
        // Fetch page 1 first
        const firstRes = await fetch(
            `${API_BASE}/public/categorywise-products/${categoryId}?page=1`
        );
        if (!firstRes.ok) return [];
        const firstData = await firstRes.json();

        if (!firstData?.success || !Array.isArray(firstData.data)) return [];

        // Extract brands from page 1
        extractBrandsFromProducts(firstData.data, brands);

        // Get total pages
        const totalPages = firstData.pagination?.last_page || 1;

        // Fetch remaining pages in small chunks (3 at a time to be gentle on API)
        if (totalPages > 1) {
            const remainingPages = [];
            for (let p = 2; p <= totalPages; p++) {
                remainingPages.push(p);
            }

            for (let i = 0; i < remainingPages.length; i += 3) {
                const chunk = remainingPages.slice(i, i + 3);
                const results = await Promise.allSettled(
                    chunk.map(page =>
                        fetch(`${API_BASE}/public/categorywise-products/${categoryId}?page=${page}`)
                            .then(r => r.ok ? r.json() : null)
                    )
                );

                results.forEach(result => {
                    if (result.status === 'fulfilled' && result.value?.success && Array.isArray(result.value.data)) {
                        extractBrandsFromProducts(result.value.data, brands);
                    }
                });
            }
        }
    } catch (err) {
        console.error(`[BrandCache] Error fetching brands for category ${categoryId}:`, err);
    }

    return Array.from(brands.values());
}

/**
 * Extract unique brand names from a list of product objects
 */
function extractBrandsFromProducts(products, brandsMap) {
    products.forEach(p => {
        const brandName = p.brand_name || p.brands?.name || p.brand?.name || '';
        if (brandName && brandName.trim()) {
            const normalized = brandName.trim();
            if (!brandsMap.has(normalized.toLowerCase())) {
                brandsMap.set(normalized.toLowerCase(), {
                    name: normalized,
                    id: p.brand_id || p.brands?.id || null,
                    image: null, // will be enriched later from brands API
                });
            }
        }
    });
}

/**
 * Enrich category brands with image data from the brands API
 */
function enrichBrandsWithImages(brands, brandImageMap) {
    return brands.map(b => {
        const imageData = brandImageMap.get(b.name.toLowerCase());
        if (imageData) {
            return {
                ...b,
                id: b.id || imageData.id,
                image: imageData.image || b.image || null,
            };
        }
        return b;
    });
}

export function BrandCacheProvider({ children, categories = [] }) {
    const [brandsByCategory, setBrandsByCategory] = useState({});
    const [allBrands, setAllBrands] = useState([]);
    const [isFetchingBrands, setIsFetchingBrands] = useState(false);
    const hasStartedRef = useRef(false);

    const getBrandsForCategory = useCallback((catId) => {
        if (!catId) return allBrands;
        const key = String(catId);
        return brandsByCategory[key] || [];
    }, [brandsByCategory, allBrands]);

    useEffect(() => {
        // Avoid running twice in StrictMode or on re-mount
        if (hasStartedRef.current) return;
        if (!categories || categories.length === 0) return;

        hasStartedRef.current = true;

        // Check localStorage cache first
        const cached = readCache();
        if (cached) {
            setBrandsByCategory(cached.categories || {});
            setAllBrands(cached.all || []);
            return; // Cache is fresh, no need to fetch
        }

        // Start background fetching
        let isMounted = true;

        const fetchAll = async () => {
            setIsFetchingBrands(true);

            // Step 1: Fetch brand images from the brands API first
            const brandImageMap = await fetchBrandImages();

            const result = {};
            const globalBrandsMap = new Map();

            // Step 2: Fetch products per category and extract brands
            for (const cat of categories) {
                if (!isMounted) break;

                const catId = cat.category_id || cat.id;
                if (!catId) continue;

                const rawBrands = await fetchBrandsForCategory(catId);

                // Step 3: Enrich with images from the brands API
                const enrichedBrands = enrichBrandsWithImages(rawBrands, brandImageMap);

                const key = String(catId);
                result[key] = enrichedBrands;

                // Merge into global brands
                enrichedBrands.forEach(b => {
                    if (!globalBrandsMap.has(b.name.toLowerCase())) {
                        globalBrandsMap.set(b.name.toLowerCase(), b);
                    }
                });

                // Progressive update — each category that completes immediately shows
                if (isMounted) {
                    setBrandsByCategory(prev => ({ ...prev, [key]: enrichedBrands }));
                    setAllBrands(Array.from(globalBrandsMap.values()));
                }
            }

            // Save to localStorage when complete
            const allBrandsArray = Array.from(globalBrandsMap.values());
            writeCache({
                categories: result,
                all: allBrandsArray,
            });

            if (isMounted) {
                setIsFetchingBrands(false);
            }
        };

        // Small delay so the initial page render isn't blocked
        const timer = setTimeout(fetchAll, 1500);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [categories]);

    return (
        <BrandCacheContext.Provider value={{ brandsByCategory, allBrands, isFetchingBrands, getBrandsForCategory }}>
            {children}
        </BrandCacheContext.Provider>
    );
}

export function useBrandCache() {
    return useContext(BrandCacheContext);
}
