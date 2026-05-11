"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch } from 'react-icons/fi';
import { getCategoriesFromServer, getCategoryWiseProducts, getProductsBySubcategory } from '../../../lib/api';
import CategorySidebar from '../../../components/Category/CategorySidebar';
import ProductGrid from '../../../components/Category/ProductGrid';

/** Synced with ProductInfo (`applex_last_category_context`) for brand links back from PDP */
const APLEX_LAST_CATEGORY_STORAGE_KEY = 'applex_last_category_context';

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
    const [bannerImage, setBannerImage] = useState("https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2000&auto=format&fit=crop");

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

                            // Use banner from API with fallbacks
                            const apiBanner = found.banner || found.banner_image || found.image_path || found.image_url;
                            if (apiBanner) {
                                setBannerImage(typeof apiBanner === 'string' ? apiBanner.trim() : apiBanner);
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
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-6 md:py-8">

                {/* Top Banner Image */}
                <div className="w-full relative rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8" style={{ aspectRatio: '24/5' }}>
                    <Image
                        src={bannerImage}
                        alt={`${categoryName} Banner`}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </div>

                {/* Breadcrumbs */}
                <div className="text-[12px] md:text-sm text-gray-500 mb-6 md:mb-10 flex items-center gap-2 font-medium">
                    <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
                    <span>/</span>
                    <span className="hover:text-brand-blue transition-colors cursor-pointer">Categories</span>
                    <span>/</span>
                    <span className="text-brand-blue font-bold capitalize">{categoryName}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 pt-2 lg:pt-0">

                    {/* Sidebar (Filters) - Left Side on Desktop */}
                    <aside className="lg:w-1/4 order-1">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase mb-6 md:mb-8">
                            {categoryName}
                        </h2>
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
                    </aside>

                    {/* Main Content (Product Grid) - Right Side on Desktop */}
                    <main className="lg:w-3/4 order-2">
                        {categoryName === 'Used Phone' && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Battery Health</h3>
                                <div className="overflow-x-auto pb-2 scrollbar-hide">
                                    <div className="flex items-center gap-2 min-w-max">
                                        {batteryRanges.map((range) => (
                                            <button
                                                key={range.label}
                                                onClick={() => setSelectedBatteryRange(
                                                    selectedBatteryRange?.label === range.label ? null : range
                                                )}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${selectedBatteryRange?.label === range.label
                                                        ? "bg-brand-blue text-white border-brand-blue shadow-md"
                                                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mb-6 md:mb-8">
                            <div className="w-full relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={`Search ${categoryName.toLowerCase()}...`}
                                    className="w-full h-12 md:h-14 rounded-2xl border border-gray-300 bg-white pl-11 pr-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-shadow"
                                />
                            </div>
                            {searchQuery.trim() && (
                                <div className="mt-2 text-xs md:text-sm text-gray-500 font-medium">
                                    Showing results for <span className="font-bold text-gray-900">&quot;{searchQuery.trim()}&quot;</span>
                                </div>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                                <div className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400 font-medium">Loading products...</p>
                            </div>
                        ) : paginatedProductsForScreen.length > 0 ? (
                            <ProductGrid
                                products={paginatedProductsForScreen}
                                onOpenFilter={() => setIsMobileFilterOpen(true)}
                                brandsList={derivedFilters.brandsList}
                                activeBrand={selectedBrands[0] || 'All'}
                                onSelectBrand={(b) => setSelectedBrands([b])}
                                totalItems={filteredProducts.length}
                                showUsedTag={isUsedPhoneCategory}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                                <p className="text-gray-400 font-medium">
                                    {allProducts.length === 0 
                                        ? `No products found in ${categoryName}.` 
                                        : "No products match your active filters."}
                                </p>
                            </div>
                        )}

                        {/* Pagination Overlay logic is now entirely Client-side aware */}
                        {!isLoading && totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                                {Array.from({ length: totalPages }, (_, i) => {
                                    let pageNum = i + 1;

                                    // Basic slicing window to prevent hundred page spans wrapping.
                                    if (totalPages > 6) {
                                        if (pageNum < validCurrentPage - 2 && pageNum !== 1) return null;
                                        if (pageNum > validCurrentPage + 2 && pageNum !== totalPages) return null;
                                        if (pageNum === validCurrentPage - 2 && pageNum > 2) return <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>;
                                        if (pageNum === validCurrentPage + 2 && pageNum < totalPages - 1) return <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>;
                                    }

                                    return (
                                        <Link
                                            key={pageNum}
                                            href={buildCategoryPageHref(pageNum)}
                                            scroll={true}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${pageNum === validCurrentPage
                                                ? 'bg-brand-blue text-white shadow-md'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}
