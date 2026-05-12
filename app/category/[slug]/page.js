"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { getCategoriesFromServer, getCategoryWiseProducts, getProductsBySubcategory } from '../../../lib/api';
import CategorySidebar from '../../../components/Category/CategorySidebar';
import ProductGrid from '../../../components/Category/ProductGrid';

/** Synced with ProductInfo (`mobile_hat_last_category_context`) for brand links back from PDP */
const APLEX_LAST_CATEGORY_STORAGE_KEY = 'mobile_hat_last_category_context';

const batteryRanges = [
    { label: '96-100%', min: 96, max: 100 },
    { label: '91-95%', min: 91, max: 95 },
    { label: '86-90%', min: 86, max: 90 },
    { label: '81-85%', min: 81, max: 85 },
    { label: '76-80%', min: 76, max: 80 },
    { label: '71-75%', min: 71, max: 75 },
    { label: '66-70%', min: 66, max: 70 }
];

function mapProduct(p) {
    const originalPrice = Number(p.retails_price || 0);
    const discountValue = Number(p.discount || 0);
    const discountType = p.discount_type;
    const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

    const discountedPrice = hasDiscount
        ? (String(discountType).toLowerCase() === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue))
        : originalPrice;

    const discount = hasDiscount
        ? (String(discountType).toLowerCase() === 'percentage' ? `-${discountValue}%` : `৳ ${discountValue}`)
        : null;

    return {
        id: p.id,
        name: p.name,
        price: `৳ ${discountedPrice.toLocaleString('en-IN')}`,
        oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString('en-IN')}` : null,
        discount,
        imageUrl: (p.image_path || p.image_path1 || p.image_path2 || p.image_url || '/no-image.svg')?.toString().trim(),
        brand: p.brand_name || '',
        stock: p.current_stock || 0,
        rawPrice: discountedPrice,
        rawImeis: p.imeis || [],
        rawSource: p
    };
}

export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug || '';
    const subcategoryIdFromUrl = Math.max(0, parseInt(searchParams?.get('subcategory_id') || '0', 10));
    const brandParam = searchParams?.get('brand') || '';

    // Read the requested page exclusively from URL parameters.
    const urlPage = Math.max(1, parseInt(searchParams?.get('page') || '1', 10));

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [categoryId, setCategoryId] = useState(rawSlug);
    const [categoryName, setCategoryName] = useState(() =>
        decodeURIComponent(rawSlug)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
    );
    const normalizedCategorySlug = String(rawSlug).toLowerCase();
    const normalizedCategoryName = String(categoryName).toLowerCase();
    const isUsedPhoneCategory =
        normalizedCategorySlug === 'used-phone' ||
        normalizedCategoryName === 'used phone';

    // Instead of holding 1 page, we hold ALL products for this category.
    const [allProducts, setAllProducts] = useState([]);
    const [filterOptions, setFilterOptions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filter State
    const [selectedBrands, setSelectedBrands] = useState(() => {
        const b = (searchParams?.get('brand') || '').trim();
        if (b) return [b];
        return ['All'];
    });
    const [selectedPrice, setSelectedPrice] = useState({ min: '', max: '' });
    const [selectedStorage, setSelectedStorage] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState('All');
    const [selectedExtraFilters, setSelectedExtraFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBatteryRange, setSelectedBatteryRange] = useState(null);

    useEffect(() => {
        setSelectedExtraFilters({});
        setSelectedStorage([]);
        setSelectedRegion([]);
        setSelectedColor([]);
        setSelectedAvailability('All');
        setSelectedPrice({ min: '', max: '' });
        setSelectedBatteryRange(null);
    }, [rawSlug]);

    useEffect(() => {
        if (typeof window === 'undefined' || !rawSlug) return;
        try {
            sessionStorage.setItem(
                APLEX_LAST_CATEGORY_STORAGE_KEY,
                JSON.stringify({ slug: rawSlug, subcategoryId: subcategoryIdFromUrl })
            );
        } catch {
            // ignore quota / private mode
        }
    }, [rawSlug, subcategoryIdFromUrl]);

    useEffect(() => {
        const b = brandParam.trim();
        setSelectedBrands(b ? [b] : ['All']);
    }, [rawSlug, brandParam]);

    const buildCategoryPageHref = useCallback(
        (pageNum) => {
            const p = new URLSearchParams();
            if (pageNum > 1) p.set('page', String(pageNum));
            const brandQs =
                searchParams?.get('brand')?.trim() ||
                (selectedBrands[0] && selectedBrands[0] !== 'All' ? selectedBrands[0] : '');
            if (brandQs) p.set('brand', brandQs);
            const subQs = searchParams?.get('subcategory_id');
            if (subQs && parseInt(subQs, 10) > 0) p.set('subcategory_id', subQs);
            const qs = p.toString();
            return qs ? `/category/${rawSlug}?${qs}` : `/category/${rawSlug}`;
        },
        [rawSlug, searchParams, selectedBrands]
    );

    useEffect(() => {
        let isMounted = true;

        const fetchCategoryData = async () => {
            setIsLoading(true);
            let resolvedCatId = rawSlug;

            try {
                const catRes = await getCategoriesFromServer();
                if (catRes?.success && Array.isArray(catRes.data)) {
                    const normalize = (val) => val ? String(val).toLowerCase().trim().replace(/\s+/g, '-') : '';
                    const slugLower = String(rawSlug).toLowerCase();

                    const found = catRes.data.find((c) =>
                        String(c.category_id) === String(rawSlug) ||
                        String(c.id) === String(rawSlug) ||
                        normalize(c.name) === slugLower
                    );

                    if (found) {
                        resolvedCatId = found.category_id ?? found.id ?? resolvedCatId;
                        if (isMounted) {
                            setCategoryId(resolvedCatId);
                            if (found.name) {
                                if (subcategoryIdFromUrl > 0 && Array.isArray(found.sub_category)) {
                                    const matchedSubcat = found.sub_category.find((s) => Number(s?.id) === Number(subcategoryIdFromUrl));
                                    setCategoryName(matchedSubcat?.name || found.name);
                                } else {
                                    setCategoryName(found.name);
                                }
                            }
                        }
                    } else {
                        // CRITICAL: If the category doesn't exist in the API list (like a forced 'Used Phone' link),
                        // we stop here and don't attempt to fetch products from the server.
                        if (isMounted) {
                            setAllProducts([]);
                            setIsLoading(false);
                        }
                        return; 
                    }
                }
            } catch (err) {
                console.error('Failed to resolve category:', err);
                // On error, we still want to be safe and stop if it's likely a missing category
                if (isMounted) {
                    setIsLoading(false);
                    return;
                }
            }

            try {
                // Fetch the FIRST page to get initial data and pagination limits fast
                const firstPageData = subcategoryIdFromUrl > 0
                    ? await getProductsBySubcategory(subcategoryIdFromUrl, 1)
                    : await getCategoryWiseProducts(resolvedCatId, 1);

                if (isMounted && firstPageData?.success && Array.isArray(firstPageData.data)) {
                    // Start rendering first page immediately
                    let globalProductsArray = [...firstPageData.data];
                    setAllProducts(globalProductsArray.map(mapProduct).sort((a, b) => b.stock - a.stock));

                    if (firstPageData.filter_options) setFilterOptions(firstPageData.filter_options);
                    setIsLoading(false); // First render ready!

                    // Now, fetch all remaining pages in the background
                    const totalPages = firstPageData.pagination?.last_page || 1;
                    if (totalPages > 1) {
                        const remainingPagesToFetch = [];
                        for (let p = 2; p <= totalPages; p++) {
                            remainingPagesToFetch.push(p);
                        }

                        // We fetch them in chunks of 5 pages directly.
                        for (let i = 0; i < remainingPagesToFetch.length; i += 5) {
                            if (!isMounted) break; // abort if unmounted
                            const chunk = remainingPagesToFetch.slice(i, i + 5);

                            const chunkResults = await Promise.allSettled(
                                chunk.map(page =>
                                    subcategoryIdFromUrl > 0
                                        ? getProductsBySubcategory(subcategoryIdFromUrl, page)
                                        : getCategoryWiseProducts(resolvedCatId, page)
                                )
                            );

                            chunkResults.forEach((res) => {
                                if (res.status === 'fulfilled' && res.value?.success && Array.isArray(res.value.data)) {
                                    globalProductsArray.push(...res.value.data);
                                }
                            });

                            // Aggressively append the background-fetched products into state 
                            // so that user doesn't even notice it buffering behind the scenes.
                            if (isMounted) {
                                setAllProducts([...globalProductsArray].map(mapProduct).sort((a, b) => b.stock - a.stock));
                            }
                        }
                    }
                } else if (isMounted) {
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch category products:', err);
                if (isMounted) setIsLoading(false);
            }
        };

        if (rawSlug) fetchCategoryData();

        return () => { isMounted = false; };
    }, [rawSlug, subcategoryIdFromUrl]); // Notice 'currentPage/urlPage' is not here: it only fetches on component mount/category/subcategory change

    // Compute dynamic filter lists using ALL background-fetched products + Server rules.
    const derivedFilters = useMemo(() => {
        const brandsList = ['All'];
        if (filterOptions?.brands) {
            brandsList.push(...Object.values(filterOptions.brands));
        } else {
            brandsList.push(...new Set(allProducts.map(p => p.brand).filter(Boolean)));
        }

        // Storage List
        let storageList = [];
        if (filterOptions?.storages) {
            storageList = Object.values(filterOptions.storages);
        } else {
            const allImeis = allProducts.flatMap(p => p.rawImeis || []);
            storageList = [...new Set(allImeis.map(i => i.storage).filter(Boolean))].sort();
        }

        // Region List
        let regionList = [];
        if (filterOptions?.regions) {
            regionList = Object.values(filterOptions.regions);
        } else {
            const allImeis = allProducts.flatMap(p => p.rawImeis || []);
            regionList = [...new Set(allImeis.map(i => i.region).filter(Boolean))].sort();
        }

        // Color List
        let colorList = [];
        if (filterOptions?.colors && Array.isArray(filterOptions.colors) && filterOptions.colors.length > 0) {
            colorList = filterOptions.colors.map(c => ({
                name: c,
                hex: c.toLowerCase() === 'black' ? '#000000' :
                    c.toLowerCase() === 'white' ? '#ffffff' : '#cccccc'
            }));
        } else {
            const allImeis = allProducts.flatMap(p => p.rawImeis || []);
            const colorMap = new Map();
            allImeis.forEach(i => {
                if (i.color) {
                    if (!colorMap.has(i.color) || colorMap.get(i.color) === '#cccccc') {
                        colorMap.set(i.color, i.color_code || '#cccccc');
                    }
                }
            });
            colorList = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
        }

        // Price Boundary Calculation
        let minPrice = Infinity;
        let maxPrice = 0;

        allProducts.forEach(p => {
            if (p.rawPrice > 0 && p.rawPrice < minPrice) minPrice = p.rawPrice;
            if (p.rawPrice > maxPrice) maxPrice = p.rawPrice;

            if (p.rawImeis && p.rawImeis.length > 0) {
                p.rawImeis.forEach(imei => {
                    const imeiPrice = Number(imei.discount_price || imei.price || 0);
                    if (imeiPrice > 0) {
                        if (imeiPrice < minPrice) minPrice = imeiPrice;
                        if (imeiPrice > maxPrice) maxPrice = imeiPrice;
                    }
                });
            }
        });

        if (minPrice === Infinity) minPrice = 0;

        const roundDown = val => Math.floor(val / 100) * 100;
        const roundUp = val => Math.ceil(val / 100) * 100;

        const globalMinPrice = roundDown(minPrice);
        const globalMaxPrice = roundUp(maxPrice);

        const toTitle = (key) =>
            String(key || '')
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (ch) => ch.toUpperCase());

        const extraFilterMap = new Map();
        const upsertExtra = (key, value) => {
            if (!key || !value) return;
            const v = String(value).trim();
            if (!v) return;
            if (!extraFilterMap.has(key)) {
                extraFilterMap.set(key, new Set());
            }
            extraFilterMap.get(key).add(v);
        };

        // Server-driven attributes if API sends any
        if (Array.isArray(filterOptions?.attributes)) {
            filterOptions.attributes.forEach((attr) => {
                const attrName = attr?.name || attr?.attribute_name || attr?.title;
                if (!attrName) return;
                const key = String(attrName).toLowerCase().replace(/\s+/g, '_');
                const values = attr?.values || attr?.attribute_values || attr?.options || [];
                values.forEach((v) => upsertExtra(key, v?.name || v?.value || v?.label || v));
            });
        }

        // Fallback inference from product + imei data
        allProducts.forEach((p) => {
            const raw = p.rawSource || {};
            const imeis = p.rawImeis || [];

            upsertExtra('model', raw.name);
            upsertExtra('warranty', raw.warranty_name);

            const lowerName = String(raw.name || '').toLowerCase();
            if (lowerName.includes('5g')) upsertExtra('type', '5G');
            if (lowerName.includes('wireless')) upsertExtra('type', 'Wireless');
            if (lowerName.includes('wired')) upsertExtra('type', 'Wired');
            if (lowerName.includes('wifi')) upsertExtra('network', 'Wi-Fi');

            imeis.forEach((i) => {
                upsertExtra('model', i.model);
                upsertExtra('warranty', i.warranty);
                upsertExtra('sim', i.sim);
                upsertExtra('plug', i.plug);
                upsertExtra('network', i.network);
                upsertExtra('qty', i.qty);
                upsertExtra('keyboard', i.keyboard);
                upsertExtra('type', i.item_condition);
                upsertExtra('type', i.product_condition);
                upsertExtra('type', i.box_status);
            });
        });

        const orderedExtraKeys = ['model', 'type', 'warranty', 'sim', 'plug', 'network', 'qty', 'keyboard'];
        const extraFilterSections = orderedExtraKeys
            .filter((key) => (extraFilterMap.get(key)?.size || 0) > 0)
            .map((key) => ({
                key,
                label: toTitle(key),
                options: Array.from(extraFilterMap.get(key)).sort((a, b) => a.localeCompare(b)),
            }));

        return {
            brandsList: [...new Set(brandsList)],
            storageList,
            regionList,
            colorList,
            globalMinPrice,
            globalMaxPrice,
            extraFilterSections
        };
    }, [allProducts, filterOptions]);

    const getExtraFilterValuesForProduct = (product, key) => {
        const raw = product?.rawSource || {};
        const imeis = product?.rawImeis || [];
        const values = new Set();
        const add = (val) => {
            if (val === undefined || val === null) return;
            const str = String(val).trim();
            if (str) values.add(str);
        };

        if (key === 'model') add(raw.name);
        if (key === 'warranty') add(raw.warranty_name);

        const lowerName = String(raw.name || '').toLowerCase();
        if (key === 'type') {
            if (lowerName.includes('5g')) add('5G');
            if (lowerName.includes('wireless')) add('Wireless');
            if (lowerName.includes('wired')) add('Wired');
        }
        if (key === 'network' && lowerName.includes('wifi')) add('Wi-Fi');

        imeis.forEach((i) => {
            if (key === 'model') add(i.model);
            if (key === 'warranty') add(i.warranty);
            if (key === 'sim') add(i.sim);
            if (key === 'plug') add(i.plug);
            if (key === 'network') add(i.network);
            if (key === 'qty') add(i.qty);
            if (key === 'keyboard') add(i.keyboard);
            if (key === 'type') {
                add(i.item_condition);
                add(i.product_condition);
                add(i.box_status);
            }
        });

        return Array.from(values);
    };

    // Apply Filters front-end across the ENTIRE product dataset
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            if (searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase();
                const name = (p.name || '').toLowerCase();
                const brand = (p.brand || '').toLowerCase();
                if (!name.includes(q) && !brand.includes(q)) return false;
            }
            if (selectedBrands.length > 0 && selectedBrands[0] !== 'All') {
                if (!selectedBrands.includes(p.brand)) return false;
            }
            if (selectedPrice.min !== '' && p.rawPrice < Number(selectedPrice.min)) return false;
            if (selectedPrice.max !== '' && p.rawPrice > Number(selectedPrice.max)) return false;
            if (selectedAvailability === 'In Stock' && p.stock <= 0) return false;

            const hasImeiFilters = selectedStorage.length > 0 || selectedRegion.length > 0 || selectedColor.length > 0;
            if (hasImeiFilters) {
                const hasMatchingImei = (p.rawImeis || []).some(i => {
                    let match = true;
                    if (selectedStorage.length > 0 && !selectedStorage.includes(i.storage)) match = false;
                    if (selectedRegion.length > 0 && !selectedRegion.includes(i.region)) match = false;
                    if (selectedColor.length > 0 && !selectedColor.includes(i.color)) match = false;
                    return match;
                });
                if (!hasMatchingImei) return false;
            }

            for (const [filterKey, selectedValues] of Object.entries(selectedExtraFilters || {})) {
                if (!Array.isArray(selectedValues) || selectedValues.length === 0) continue;
                const productValues = getExtraFilterValuesForProduct(p, filterKey);
                const matched = selectedValues.some((v) => productValues.includes(v));
                if (!matched) return false;
            }

            // Battery Health Filter Logic
            const showBatteryFilter = categoryName === 'Used Phone';
            if (selectedBatteryRange && showBatteryFilter) {
                const hasMatchingBattery = (p.rawImeis || []).some(variant => {
                    if (!variant.battery_life) return false;
                    // 1. Parse string to integer (handles "95%" etc.)
                    let batteryValue = parseInt(variant.battery_life);
                    // 2. Handle Semantic Values (e.g., "Brand New" -> 100%)
                    if (isNaN(batteryValue) &&
                        typeof variant.battery_life === 'string' &&
                        variant.battery_life.toLowerCase().includes('brand new')) {
                        batteryValue = 100;
                    }
                    // 3. Range Verification
                    return !isNaN(batteryValue) &&
                        batteryValue >= selectedBatteryRange.min &&
                        batteryValue <= selectedBatteryRange.max;
                });
                if (!hasMatchingBattery) return false;
            }

            return true;
        });
    }, [allProducts, searchQuery, selectedBrands, selectedPrice, selectedStorage, selectedRegion, selectedColor, selectedAvailability, selectedExtraFilters, selectedBatteryRange, categoryName]);

    // Frontend pagination limits
    const itemsPerPage = 20;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const validCurrentPage = Math.min(urlPage, totalPages); // Protect against invalid out-of-bounds ?page= variables.

    // Splice ONLY what is needed onto the screen instantly!
    const paginatedProductsForScreen = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, validCurrentPage, itemsPerPage]);

    return (
        <div className="min-h-screen bg-brand-paper pb-16 md:pb-20">
            <div className="max-w-[1550px] mx-auto px-4 pb-4 pt-4 md:px-8 md:pt-8">

                {/* Category title — text only, short on desktop and mobile */}
                <header className="mb-4 rounded-2xl border border-brand-gray-border bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy-deep px-4 py-3 shadow-[0_12px_32px_rgba(30,45,74,0.12)] md:mb-5 md:rounded-3xl md:px-5 md:py-3.5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-yellow md:text-[10px]">Collection</p>
                    <h1 className="mt-0.5 text-lg font-black uppercase tracking-tight text-white md:text-xl">{categoryName}</h1>
                    {!isLoading ? (
                        <p className="mt-1 text-[11px] font-semibold text-white/75 md:text-xs">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                            {filteredProducts.length !== allProducts.length && allProducts.length > 0
                                ? ` · ${allProducts.length} in category`
                                : null}
                        </p>
                    ) : (
                        <p className="mt-1 text-[11px] text-white/60 md:text-xs">Loading…</p>
                    )}
                </header>

                {/* Breadcrumbs */}
                <nav
                    className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold text-brand-muted md:mb-6 md:text-sm"
                    aria-label="Breadcrumb"
                >
                    <Link href="/" className="transition-colors hover:text-brand-navy">
                        Home
                    </Link>
                    <span className="text-brand-gray-border select-none" aria-hidden>
                        /
                    </span>
                    <Link href="/categories" className="transition-colors hover:text-brand-navy">
                        Categories
                    </Link>
                    <span className="text-brand-gray-border select-none" aria-hidden>
                        /
                    </span>
                    <span className="font-black uppercase tracking-wide text-brand-navy">{categoryName}</span>
                </nav>

                <main className="w-full min-w-0">
                    {categoryName === "Used Phone" && (
                        <div className="mb-4 grid gap-2 sm:mb-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy sm:pt-1">Battery</span>
                            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <div className="flex min-w-max items-center gap-2">
                                    {batteryRanges.map((range) => (
                                        <button
                                            key={range.label}
                                            type="button"
                                            onClick={() =>
                                                setSelectedBatteryRange(
                                                    selectedBatteryRange?.label === range.label ? null : range
                                                )
                                            }
                                            className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-bold transition-all md:rounded-xl md:px-4 md:text-sm ${
                                                selectedBatteryRange?.label === range.label
                                                    ? "border-brand-navy bg-brand-navy text-white shadow-md shadow-brand-navy/20"
                                                    : "border-brand-gray-border bg-white text-brand-navy hover:border-brand-yellow"
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search — minimal “command line” */}
                    <div className="mb-4 md:mb-8">
                        <label className="group flex items-center gap-2 border-b-2 border-brand-navy/15 pb-2 transition-colors focus-within:border-brand-navy md:gap-3 md:pb-3">
                            <FiSearch className="h-4 w-4 shrink-0 text-brand-navy/50 group-focus-within:text-brand-navy md:h-5 md:w-5" aria-hidden />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search in ${categoryName.toLowerCase()}…`}
                                className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-brand-navy outline-none placeholder:text-brand-muted/70 md:text-base lg:text-lg"
                            />
                        </label>
                        {searchQuery.trim() ? (
                            <p className="mt-2 text-xs font-medium text-brand-muted md:text-sm">
                                Matching{" "}
                                <span className="font-black text-brand-navy">&quot;{searchQuery.trim()}&quot;</span>
                            </p>
                        ) : null}
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-gray-border bg-white py-20 shadow-inner md:py-24">
                            <div
                                className="mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-brand-navy/20 border-t-brand-navy"
                                role="status"
                                aria-label="Loading"
                            />
                            <p className="text-sm font-bold uppercase tracking-wider text-brand-muted">Loading products…</p>
                        </div>
                    ) : paginatedProductsForScreen.length > 0 ? (
                        <ProductGrid
                            products={paginatedProductsForScreen}
                            onOpenFilter={() => setIsMobileFilterOpen(true)}
                            brandsList={derivedFilters.brandsList}
                            activeBrand={selectedBrands[0] || "All"}
                            onSelectBrand={(b) => setSelectedBrands([b])}
                            totalItems={filteredProducts.length}
                            showUsedTag={isUsedPhoneCategory}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-gray-border bg-white px-6 py-20 text-center shadow-[0_8px_24px_rgba(30,45,74,0.04)]">
                            <p className="max-w-md text-sm font-semibold leading-relaxed text-brand-muted">
                                {allProducts.length === 0
                                    ? `No products in ${categoryName} yet. Try another collection.`
                                    : "No products match your filters. Reset filters or broaden your search."}
                            </p>
                        </div>
                    )}

                    {!isLoading && totalPages > 1 ? (
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => {
                                let pageNum = i + 1;

                                if (totalPages > 6) {
                                    if (pageNum < validCurrentPage - 2 && pageNum !== 1) return null;
                                    if (pageNum > validCurrentPage + 2 && pageNum !== totalPages) return null;
                                    if (pageNum === validCurrentPage - 2 && pageNum > 2)
                                        return (
                                            <span key={`ellipsis-before-${pageNum}`} className="px-2 text-brand-muted">
                                                …
                                            </span>
                                        );
                                    if (pageNum === validCurrentPage + 2 && pageNum < totalPages - 1)
                                        return (
                                            <span key={`ellipsis-after-${pageNum}`} className="px-2 text-brand-muted">
                                                …
                                            </span>
                                        );
                                }

                                return (
                                    <Link
                                        key={pageNum}
                                        href={buildCategoryPageHref(pageNum)}
                                        scroll={true}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                                            pageNum === validCurrentPage
                                                ? "bg-brand-navy text-white shadow-md shadow-brand-navy/25"
                                                : "border border-brand-gray-border bg-white text-brand-navy hover:border-brand-yellow"
                                        }`}
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}
                </main>
            </div>

            <CategorySidebar
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                derivedFilters={derivedFilters}
                globalMinPrice={derivedFilters.globalMinPrice}
                globalMaxPrice={derivedFilters.globalMaxPrice}
                selectedPrice={selectedPrice}
                setSelectedPrice={setSelectedPrice}
                selectedStorage={selectedStorage}
                setSelectedStorage={setSelectedStorage}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedAvailability={selectedAvailability}
                setSelectedAvailability={setSelectedAvailability}
                selectedExtraFilters={selectedExtraFilters}
                setSelectedExtraFilters={setSelectedExtraFilters}
            />
        </div>
    );
}
