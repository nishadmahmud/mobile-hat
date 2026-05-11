"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiMinus, FiPlus, FiShare2, FiHeart, FiCreditCard, FiGift, FiFileText, FiShuffle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useWishlist } from '../../context/WishlistContext';
import { useBrandCache } from '../../context/BrandCacheContext';
import toast from 'react-hot-toast';
import ApplexCare from './ApplexCare';

const BRAND_FALLBACK_LOGOS = [
    { match: ['apple', 'iphone', 'ipad', 'macbook', 'imac'], logo: 'https://cdn.simpleicons.org/apple/111827' },
    { match: ['samsung', 'galaxy'], logo: 'https://cdn.simpleicons.org/samsung/1428A0' },
    { match: ['xiaomi', 'redmi', 'mi'], logo: 'https://cdn.simpleicons.org/xiaomi/FF6900' },
    { match: ['huawei', 'honor'], logo: 'https://cdn.simpleicons.org/huawei/CC0000' },
    { match: ['oppo'], logo: 'https://cdn.simpleicons.org/oppo/2D683D' },
    { match: ['vivo'], logo: 'https://cdn.simpleicons.org/vivo/415FFF' },
    { match: ['oneplus'], logo: 'https://cdn.simpleicons.org/oneplus/F5010C' },
    { match: ['google', 'pixel'], logo: 'https://cdn.simpleicons.org/google/4285F4' },
    { match: ['realme'], logo: 'https://cdn.simpleicons.org/realme/FFC915' },
    { match: ['nokia'], logo: 'https://cdn.simpleicons.org/nokia/005AFF' },
    { match: ['motorola'], logo: 'https://cdn.simpleicons.org/motorola/E1140A' },
    { match: ['sony'], logo: 'https://cdn.simpleicons.org/sony/000000' },
    { match: ['nothing'], logo: 'https://cdn.simpleicons.org/nothing/000000' },
    { match: ['infinix'], logo: 'https://cdn.simpleicons.org/infinix/43B02A' },
    { match: ['tecno'], logo: 'https://cdn.simpleicons.org/tecno/1476FF' },
    { match: ['anker'], logo: 'https://cdn.simpleicons.org/anker/00A7E1' },
    { match: ['baseus'], logo: 'https://cdn.simpleicons.org/baseus/1F2937' },
    { match: ['jbl'], logo: 'https://cdn.simpleicons.org/jbl/FF3300' },
    { match: ['soundcore'], logo: 'https://cdn.simpleicons.org/anker/00A7E1' },
    { match: ['beats'], logo: 'https://cdn.simpleicons.org/beatsbydre/E01F3D' },
];
const getBrandFallbackLogo = (brandName = '') => {
    const normalized = String(brandName || '').toLowerCase().trim();
    if (!normalized) return null;
    const found = BRAND_FALLBACK_LOGOS.find(entry =>
        entry.match.some(token => normalized.includes(token))
    );
    return found?.logo || null;
};
/** Same key as app/category/[slug]/page.js */
const APLEX_LAST_CATEGORY_STORAGE_KEY = 'applex_last_category_context';

const normalizeTaka = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const raw = String(value).replace(/à§³/g, '\u09F3').trim();
    if (!raw) return '';
    if (raw.startsWith('\u09F3')) return raw.replace(/^\u09F3\s*/, '\u09F3');
    const numericPart = raw.replace(/[^\d.,]/g, '');
    return numericPart ? `\u09F3${numericPart}` : raw;
};

/** Pre–product-discount list price for the selected IMEI (product-level discount applies on top). */
function getVariantListPriceNumber(matchedImei) {
    if (!matchedImei) return null;
    const raw = matchedImei.sale_price ?? matchedImei.price ?? matchedImei.discount_price;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
}

/** Same rules as app/product/[slug]/page.js — discount applies on top of variant list price. */
function applyProductLevelDiscount(listPrice, product) {
    const base = Number(listPrice) || 0;
    if (!product?.hasDiscount) return base;
    const discountValue = Number(product.discountValue || 0);
    const discountType = String(product.discountType || '').toLowerCase();
    if (discountValue <= 0 || discountType === '0') return base;
    if (discountType === 'percentage') {
        return Math.max(0, Math.round(base * (1 - discountValue / 100)));
    }
    return Math.max(0, base - discountValue);
}

export default function ProductInfo({
    product,
    onVariantImageChange,
    selectedCarePlans = [],
    toggleCarePlan,
    onOpenEmiModal,
    emiOpenTrigger = 0,
}) {
    const { addToCart } = useCart();
    const router = useRouter();
    const { addToCompare } = useCompare();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { allBrands } = useBrandCache();
    const isWishlisted = product ? isInWishlist(product.id) : false;
    const [quantity, setQuantity] = useState(1);
    const [selectedPricingMode, setSelectedPricingMode] = useState('offer');

    const imeis = product.rawImeis || [];
    const hasVariants = imeis.length > 0;

    // Extract unique color options with their hex codes
    const allColors = useMemo(() => {
        const colorMap = new Map();
        imeis.forEach(i => {
            if (i.color && !colorMap.has(i.color)) {
                colorMap.set(i.color, { name: i.color, hex: i.color_code || '#e5e7eb' });
            }
        });
        return Array.from(colorMap.values());
    }, [imeis]);

    // Extract unique storage options
    const allStorages = useMemo(() => {
        return [...new Set(imeis.map(i => i.storage).filter(Boolean))];
    }, [imeis]);

    // Extract unique region options
    const allRegions = useMemo(() => {
        return [...new Set(imeis.map(i => i.region).filter(Boolean))];
    }, [imeis]);

    // Selection state
    const [selectedColor, setSelectedColor] = useState(allColors[0]?.name || null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    useEffect(() => {
        setSelectedPricingMode('offer');
    }, [product?.id]);


    // When color is selected, auto-select the first available storage and region for that color
    useEffect(() => {
        if (!hasVariants) return;

        const matchingImeis = imeis.filter(i => !selectedColor || i.color === selectedColor);

        const availableStorages = [...new Set(matchingImeis.map(i => i.storage).filter(Boolean))];
        if (availableStorages.length > 0) {
            if (!selectedStorage || !availableStorages.includes(selectedStorage)) {
                setSelectedStorage(availableStorages[0]);
            }
        } else {
            setSelectedStorage(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor]);

    // When color+storage changes, auto-select region
    useEffect(() => {
        if (!hasVariants) return;

        const matchingImeis = imeis.filter(i => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            return match;
        });

        const availableRegions = [...new Set(matchingImeis.map(i => i.region).filter(Boolean))];
        if (availableRegions.length > 0) {
            if (!selectedRegion || !availableRegions.includes(selectedRegion)) {
                setSelectedRegion(availableRegions[0]);
            }
        } else {
            setSelectedRegion(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor, selectedStorage]);

    // Compute available options based on current selection state
    const availableStorages = useMemo(() => {
        const matchingImeis = imeis.filter(i => !selectedColor || i.color === selectedColor);
        return [...new Set(matchingImeis.map(i => i.storage).filter(Boolean))];
    }, [imeis, selectedColor]);

    const availableRegions = useMemo(() => {
        const matchingImeis = imeis.filter(i => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            return match;
        });
        return [...new Set(matchingImeis.map(i => i.region).filter(Boolean))];
    }, [imeis, selectedColor, selectedStorage]);

    // Get the best matching IMEI for the current selection to determine price
    const matchedImei = useMemo(() => {
        if (!hasVariants) return null;

        // Try exact match first
        let match = imeis.find(i =>
            (!selectedColor || i.color === selectedColor) &&
            (!selectedStorage || i.storage === selectedStorage) &&
            (!selectedRegion || i.region === selectedRegion)
        );

        // Fallback: color + storage
        if (!match) {
            match = imeis.find(i =>
                (!selectedColor || i.color === selectedColor) &&
                (!selectedStorage || i.storage === selectedStorage)
            );
        }

        // Fallback: color only
        if (!match) {
            match = imeis.find(i => !selectedColor || i.color === selectedColor);
        }

        return match;
    }, [imeis, selectedColor, selectedStorage, selectedRegion, hasVariants]);

    const variantListPriceNumber = useMemo(
        () => getVariantListPriceNumber(matchedImei),
        [matchedImei]
    );

    const currentPriceNumber = useMemo(() => {
        if (variantListPriceNumber != null) {
            return applyProductLevelDiscount(variantListPriceNumber, product);
        }
        return Number(product.rawPrice) || 0;
    }, [variantListPriceNumber, product]);

    const displayPrice = useMemo(
        () => normalizeTaka(`\u09F3${Math.round(currentPriceNumber).toLocaleString('en-IN')}`),
        [currentPriceNumber]
    );

    const displayOldPrice = useMemo(() => {
        if (variantListPriceNumber != null) {
            if (product.hasDiscount && currentPriceNumber < variantListPriceNumber) {
                return normalizeTaka(`\u09F3${variantListPriceNumber.toLocaleString('en-IN')}`);
            }
            if (product.hasDiscount && Number(product.originalPrice || 0) > variantListPriceNumber) {
                return normalizeTaka(`\u09F3${Number(product.originalPrice).toLocaleString('en-IN')}`);
            }
        }
        return normalizeTaka(product.oldPrice);
    }, [variantListPriceNumber, currentPriceNumber, product]);

    const displayPriceAmount = useMemo(
        () => String(displayPrice || '').replace(/^\u09F3\s*/, ''),
        [displayPrice]
    );
    const displayOldPriceAmount = useMemo(
        () => String(displayOldPrice || '').replace(/^\u09F3\s*/, ''),
        [displayOldPrice]
    );

    // Memoized variant images based on selected color
    const currentVariantImages = useMemo(() => {
        if (!hasVariants || !selectedColor) return null;
        const colorImeis = imeis.filter(i => i.color === selectedColor && i.image_path);
        return [...new Set(colorImeis.map(i => i.image_path))].filter(Boolean);
    }, [hasVariants, selectedColor, imeis]);

    // When color changes, update the gallery images in the parent component
    useEffect(() => {
        if (!onVariantImageChange || !hasVariants) return;
        
        if (currentVariantImages && currentVariantImages.length > 0) {
            onVariantImageChange(currentVariantImages);
        } else {
            // No IMEI images for this color — fall back to default product images
            onVariantImageChange(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVariantImages]);

    const getCartPayloadAndVariants = () => {
        const variants = {};
        if (selectedStorage) variants.storage = selectedStorage;
        if (selectedColor) variants.colors = { name: selectedColor, hex: allColors.find(c => c.name === selectedColor)?.hex };
        if (selectedRegion) variants.region = selectedRegion;
        variants.paymentPlan = selectedPricingMode;

        // Use the selected variant image if available, otherwise fallback to default product image
        const currentImageUrl = (currentVariantImages && currentVariantImages.length > 0) 
            ? currentVariantImages[0] 
            : (product.images && product.images.length > 0 ? product.images[0] : null);

        return {
            cartProduct: {
                ...product,
                price: `\u09F3${selectedCheckoutPrice.toLocaleString('en-IN')}`,
                rawPrice: selectedCheckoutPrice,
                imageUrl: currentImageUrl,
                carePlans: selectedCarePlans,
                selectedPricingMode,
                emiMonthly: pricingStats.emiMonthly,
            },
            cartVariants: Object.keys(variants).length > 0 ? variants : null,
        };
    };

    const handleAddToCart = () => {
        const { cartProduct, cartVariants } = getCartPayloadAndVariants();
        addToCart(cartProduct, quantity, cartVariants);
    };

    const handleBuyNow = () => {
        const { cartProduct, cartVariants } = getCartPayloadAndVariants();
        addToCart(cartProduct, quantity, cartVariants, false);
        router.push('/checkout');
    };

    const saveAmount = useMemo(() => {
        if (!product.hasDiscount || Number(product.discountValue || 0) <= 0) return 0;
        const listBase = variantListPriceNumber ?? Number(product.originalPrice || 0);
        return Math.max(0, Math.round(listBase - currentPriceNumber));
    }, [product.hasDiscount, product.discountValue, variantListPriceNumber, product.originalPrice, currentPriceNumber]);

    const pricingStats = useMemo(() => {
        const offerPrice = Math.max(0, Math.round(currentPriceNumber));
        const regularPriceFromData = Number(product.originalPrice || 0);
        const regularPrice = regularPriceFromData > offerPrice
            ? regularPriceFromData
            : Math.round(offerPrice * 1.1);

        const catBlob = `${product?.category?.name || ''} ${product?.category?.slug || ''}`.toLowerCase();
        const isPhoneCategory = (() => {
            if (!catBlob.trim()) return false;
            if (catBlob.includes('headphone') || catBlob.includes('earphone') || catBlob.includes('airpods')) return false;
            if (catBlob.includes('iphone')) return true;
            if (catBlob.includes('smartphone') || catBlob.includes('smart phone')) return true;
            if (catBlob.includes('mobile')) return true;
            if (/\bphones?\b/.test(catBlob)) return true;
            return false;
        })();

        let minBooking = Math.max(1000, Math.floor((offerPrice * 0.12) / 500) * 500);
        let purchasePoints = Math.max(10, Math.floor((offerPrice / 1200) / 10) * 10);
        if (isPhoneCategory) {
            minBooking = 10000;
            purchasePoints = 15;
        }

        const emiMonthly = Math.max(1, Math.round(regularPrice / 12));

        return { offerPrice, regularPrice, minBooking, purchasePoints, emiMonthly };
    }, [currentPriceNumber, product.originalPrice, product?.category?.name, product?.category?.slug]);

    const matchedBrand = useMemo(() => {
        const currentBrandName = product.brand?.name?.trim();
        if (!currentBrandName) return null;

        const fromCache = (allBrands || []).find(
            (b) => b?.name?.trim().toLowerCase() === currentBrandName.toLowerCase()
        );

        return {
            id: fromCache?.id || product.brand?.id || product.brand?.brand_id || null,
            name: currentBrandName,
            image: fromCache?.image || product.brand?.image || getBrandFallbackLogo(currentBrandName) || null,
        };
    }, [allBrands, product.brand]);

    const categoryBrandHrefFromProduct = useMemo(() => {
        const slug = product?.category?.slug?.trim();
        if (!slug || !matchedBrand?.name) return '';
        const p = new URLSearchParams();
        p.set('brand', matchedBrand.name);
        return `/category/${slug}?${p.toString()}`;
    }, [product?.category?.slug, matchedBrand?.name]);

    const [brandListingHref, setBrandListingHref] = useState(categoryBrandHrefFromProduct);

    useEffect(() => {
        if (!matchedBrand?.name) {
            setBrandListingHref('');
            return;
        }
        let slug = (product?.category?.slug || '').trim();
        let subId = 0;
        if (typeof window !== 'undefined') {
            try {
                const raw = sessionStorage.getItem(APLEX_LAST_CATEGORY_STORAGE_KEY);
                if (raw) {
                    const ctx = JSON.parse(raw);
                    if (ctx?.slug && String(ctx.slug).trim()) {
                        slug = String(ctx.slug).trim();
                        subId = Math.max(0, parseInt(String(ctx.subcategoryId || '0'), 10) || 0);
                    }
                }
            } catch {
                // ignore invalid JSON
            }
        }
        if (!slug) {
            setBrandListingHref('');
            return;
        }
        const p = new URLSearchParams();
        p.set('brand', matchedBrand.name);
        if (subId > 0) p.set('subcategory_id', String(subId));
        setBrandListingHref(`/category/${slug}?${p.toString()}`);
    }, [matchedBrand?.name, product?.category?.slug, product?.id, categoryBrandHrefFromProduct]);

    const selectedCheckoutPrice = selectedPricingMode === 'regular'
        ? pricingStats.regularPrice
        : pricingStats.offerPrice;

    const handleShare = async () => {
        if (typeof window === 'undefined') return;
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied');
        } catch {
            toast.error('Copy failed');
        }
    };

    const handleAddToCompare = () => {
        addToCompare({
            id: product.id,
            name: product.name,
            brand: product.brand?.name || '',
            price: displayPrice,
            oldPrice: displayOldPrice || null,
            discount: saveAmount > 0 ? `Save ${saveAmount.toLocaleString('en-IN')}` : null,
            imageUrl: (currentVariantImages && currentVariantImages[0]) || product.images?.[0] || '/no-image.svg',
        });
    };

    return (
        <div className="flex flex-col">
            {/* Header: Title + Compare/Share */}
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    {matchedBrand?.name && (
                        brandListingHref ? (
                            <Link
                                href={brandListingHref}
                                className="mb-2 inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                {matchedBrand.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={matchedBrand.image}
                                        alt={matchedBrand.name}
                                        className="w-4 h-4 object-contain"
                                    />
                                ) : (
                                    <span className="w-4 h-4 rounded-full bg-gray-200" />
                                )}
                                <span className="text-[12px] font-black text-gray-900 uppercase tracking-tight">
                                    {matchedBrand.name}
                                </span>
                            </Link>
                        ) : matchedBrand.id ? (
                            <Link
                                href={`/brand/${matchedBrand.id}`}
                                className="mb-2 inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                {matchedBrand.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={matchedBrand.image}
                                        alt={matchedBrand.name}
                                        className="w-4 h-4 object-contain"
                                    />
                                ) : (
                                    <span className="w-4 h-4 rounded-full bg-gray-200" />
                                )}
                                <span className="text-[12px] font-black text-gray-900 uppercase tracking-tight">
                                    {matchedBrand.name}
                                </span>
                            </Link>
                        ) : (
                            <div className="mb-2 inline-flex items-center gap-2">
                                {matchedBrand.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={matchedBrand.image}
                                        alt={matchedBrand.name}
                                        className="w-4 h-4 object-contain"
                                    />
                                ) : (
                                    <span className="w-4 h-4 rounded-full bg-gray-200" />
                                )}
                                <span className="text-[12px] font-black text-gray-900 uppercase tracking-tight">
                                    {matchedBrand.name}
                                </span>
                            </div>
                        )
                    )}
                    <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 tracking-tight leading-tight">
                        {product.name}
                    </h1>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                    <button
                        onClick={handleAddToCompare}
                        className="inline-flex items-center gap-1.5 px-1 py-1 text-[13px] md:text-[14px] font-bold text-[#ff7a00] hover:text-[#e66e00] transition-colors"
                    >
                        <FiShuffle size={16} />
                        Add to Compare
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2.5 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                        aria-label="Share product"
                    >
                        <FiShare2 size={16} />
                    </button>
                </div>
            </div>

            {/* Price section */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-baseline gap-3">
                        <span className="inline-flex items-baseline gap-0.5 text-[26px] md:text-[30px] font-bold text-gray-900 tracking-tight">
                            <span
                                className="font-black leading-none"
                                style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}
                            >
                                ৳
                            </span>
                            <span>{displayPriceAmount}</span>
                        </span>
                        <span className="text-xs md:text-sm text-gray-900 font-bold">
                            (Cash Price)
                        </span>
                        {displayOldPrice && (
                            <span className="inline-flex items-baseline gap-0.5 text-xs md:text-sm text-gray-900 font-medium line-through">
                                <span
                                    className="font-semibold leading-none"
                                    style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}
                                >
                                    ৳
                                </span>
                                <span>{displayOldPriceAmount}</span>
                            </span>
                        )}
                        {product.hasDiscount && saveAmount > 0 && (
                            <span className="text-xs font-black text-white bg-[#ff7a00] px-2.5 py-1 rounded-md uppercase tracking-wide">
                                Save {saveAmount.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-[12px] text-gray-800">
                        <span className="inline-flex items-center gap-1">
                            <span className="font-bold">Availability:</span>
                            <span className="font-bold text-gray-900">In Stock</span>
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="inline-flex items-center gap-1">
                            <span className="font-bold">Code:</span>
                            <span className="font-bold text-gray-900">{product.sku || 'N/A'}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Variants */}
            {hasVariants && (
                <div className="space-y-6 mb-6">

                    {/* Colors — use actual color swatches */}
                    {allColors.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">
                                Pick a Color: <span className="text-[#ff8a00]">{selectedColor || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allColors.map(color => {
                                    const isSelected = selectedColor === color.name;
                                    const isWhite = color.hex?.toLowerCase() === '#ffffff' || color.hex?.toLowerCase() === '#fff';
                                    const selectedAccent = isWhite ? '#d1d5db' : color.hex || '#ff8a00';
                                    return (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 ${isSelected
                                                ? 'bg-white shadow-md'
                                                : 'border-gray-200 hover:border-[#ffb347] bg-white hover:shadow-sm'
                                                }`}
                                            style={
                                                isSelected
                                                    ? {
                                                        borderColor: selectedAccent,
                                                        backgroundColor: `${selectedAccent}14`,
                                                        boxShadow: `0 6px 14px ${selectedAccent}22`,
                                                    }
                                                    : undefined
                                            }
                                            title={color.name}
                                        >
                                            <span
                                                className={`w-6 h-6 rounded-full shadow-inner ${isWhite ? 'border border-gray-200' : ''}`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className={`text-sm font-black ${isSelected ? 'text-black' : 'text-gray-500'}`}>
                                                {color.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Storage / Size */}
                    {allStorages.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">
                                Storage: <span className="text-[#ff8a00]">{selectedStorage || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allStorages.map(size => {
                                    const isAvailable = availableStorages.includes(size);
                                    const isSelected = selectedStorage === size;
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => isAvailable && setSelectedStorage(size)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest border transition-all duration-300 ${isSelected
                                                ? 'border-[#ff8a00] bg-[#ff8a00] text-white shadow-lg shadow-[#ff8a00]/25'
                                                : isAvailable
                                                    ? 'border-gray-200 bg-white text-gray-600 hover:border-[#ffb347] hover:shadow-sm'
                                                    : 'border-gray-50 text-gray-300 cursor-not-allowed bg-gray-50/50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Region */}
                    {allRegions.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">
                                Region: <span className="text-[#ff8a00]">{selectedRegion || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {allRegions.map(region => {
                                    const isAvailable = availableRegions.includes(region);
                                    const isSelected = selectedRegion === region;
                                    return (
                                        <button
                                            key={region}
                                            onClick={() => isAvailable && setSelectedRegion(region)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer px-5 py-3 rounded-lg text-[11px] font-black uppercase tracking-wider border transition-all duration-300 ${isSelected
                                                ? 'border-[#ff8a00] text-[#ff8a00] bg-[#fff7ed] shadow-md shadow-[#ff8a00]/10'
                                                : isAvailable
                                                    ? 'border-gray-200 bg-white text-gray-500 hover:border-[#ffb347] hover:shadow-sm'
                                                    : 'border-gray-50 text-gray-300 cursor-not-allowed bg-gray-50/50 grayscale'
                                                }`}
                                        >
                                            {region}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Price Benefits */}
            <div className="mb-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {/* Minimum Booking */}
                    <div className="flex items-center gap-3 rounded-lg bg-[#fef8ee] border border-[#f3ead8] px-3 py-3.5 transition-all hover:shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#ff8a00] shadow-sm">
                            <FiCreditCard size={16} />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-gray-500 leading-tight">Minimum Booking</p>
                            <p className="text-[14px] md:text-[15px] font-black text-gray-900 leading-tight">
                                {pricingStats.minBooking.toLocaleString('en-IN')} BDT
                            </p>
                        </div>
                    </div>

                    {/* Purchase Points */}
                    <div className="flex items-center gap-3 rounded-lg bg-[#fef8ee] border border-[#f3ead8] px-3 py-3.5 transition-all hover:shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#ff8a00] shadow-sm">
                            <FiGift size={16} />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-gray-500 leading-tight">Purchase Points</p>
                            <p className="text-[14px] md:text-[15px] font-black text-gray-900 leading-tight">
                                {pricingStats.purchasePoints} Points
                            </p>
                        </div>
                    </div>
                </div>

                {/* 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <button
                        type="button"
                        onClick={() => setSelectedPricingMode('offer')}
                        className={`flex items-center gap-4 text-left rounded-xl border-2 p-4 transition-all ${selectedPricingMode === 'offer'
                            ? 'border-[#3b82f6] bg-white shadow-md'
                            : 'border-gray-100 bg-[#f8f9fa] hover:border-gray-200'
                            }`}
                    >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selectedPricingMode === 'offer'
                            ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]'
                            : 'border-gray-300 bg-white text-gray-300'
                            }`}>
                            {selectedPricingMode === 'offer' ? (
                                <div className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                            ) : (
                                <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                            )}
                        </div>
                        <div>
                            <p className="text-[12px] font-medium text-gray-500 mb-0.5">Offer Price</p>
                            <p className={`text-[18px] md:text-[20px] font-black leading-tight ${selectedPricingMode === 'offer' ? 'text-gray-900' : 'text-gray-700'}`}>
                                {pricingStats.offerPrice.toLocaleString('en-IN')} BDT
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">Cash/Card/MFS Payment</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedPricingMode('regular')}
                        className={`flex items-center gap-4 text-left rounded-xl border-2 p-4 transition-all ${selectedPricingMode === 'regular'
                            ? 'border-[#3b82f6] bg-white shadow-md'
                            : 'border-gray-100 bg-[#f8f9fa] hover:border-gray-200'
                            }`}
                    >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selectedPricingMode === 'regular'
                            ? 'border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]'
                            : 'border-gray-300 bg-white text-gray-300'
                            }`}>
                            {selectedPricingMode === 'regular' ? (
                                <div className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                            ) : (
                                <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                            )}
                        </div>
                        <div>
                            <p className="text-[12px] font-medium text-gray-500 mb-0.5">Regular Price</p>
                            <p className={`text-[18px] md:text-[20px] font-black leading-tight ${selectedPricingMode === 'regular' ? 'text-gray-900' : 'text-gray-700'}`}>
                                {pricingStats.regularPrice.toLocaleString('en-IN')} BDT
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                EMI starts at {pricingStats.emiMonthly.toLocaleString('en-IN')} BDT
                            </p>
                        </div>
                    </button>
                </div>
                */}
            </div>

            {/* Mobile-only Applex Care (Hidden on Desktop) */}
            <div className="lg:hidden mb-10">
                <ApplexCare 
                    product={product} 
                    currentPrice={currentPriceNumber}
                    selectedCarePlans={selectedCarePlans}
                    toggleCarePlan={toggleCarePlan}
                    openEmiTrigger={emiOpenTrigger}
                />
            </div>

            {/* Add to Cart / Buy Now */}
            <div className="flex flex-row items-stretch gap-3 mt-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-gray-200 rounded-md py-1 px-1 w-[120px] shrink-0 bg-[#f5f5f5]">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="cursor-pointer w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#ff8a00] hover:bg-white rounded-md transition-all"
                    >
                        <FiMinus size={16} />
                    </button>
                    <span className="font-black text-gray-900 w-8 text-center text-sm">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="cursor-pointer w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#ff8a00] hover:bg-white rounded-md transition-all"
                    >
                        <FiPlus size={16} />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="cursor-pointer flex-1 bg-white border border-[#ffd8ad] text-gray-800 font-bold py-4 px-3 rounded-md hover:bg-[#fff7ed] transition-all text-[13px] tracking-tight inline-flex items-center justify-center gap-2"
                >
                    <Image
                        src="/product-details-svg/add%20to%20crat.svg"
                        alt="Add to cart"
                        width={18}
                        height={18}
                        className="w-[18px] h-[18px] object-contain"
                    />
                    Add to Cart
                </button>

                <button
                    onClick={handleBuyNow}
                    className="cursor-pointer flex-[1.4] bg-[#ff8a00] text-white font-bold py-4 px-2 rounded-md hover:bg-[#ea7f00] shadow-lg shadow-[#ff8a00]/30 transition-all text-[13px] tracking-tight"
                >
                    Buy Now
                </button>
            </div>

            {/* Shipping row */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="w-full border border-gray-200 rounded-xl bg-white px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-sm md:text-base font-bold text-gray-900">
                        Reach you within <span className="text-[#ff8a00]">0-3 business days</span>
                    </p>
                    <button
                        onClick={() => toggleWishlist(product)}
                        className="h-10 w-10 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center hover:text-red-500 transition-colors shrink-0"
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <FiHeart
                            className={`transition-all ${isWishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-500'}`}
                            size={18}
                        />
                    </button>
                </div>
            </div>

            {/* Contact + Social row */}
            <div className="mt-3 flex items-center gap-3">
                <a
                    href="https://wa.me/8801704212066"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-gray-200 bg-[#dcfce7] text-gray-900 hover:text-[#25d366] hover:border-[#25d366]/40 transition-colors"
                    aria-label="WhatsApp"
                >
                    <FaWhatsapp size={20} />
                    <span className="text-sm font-bold">WhatsApp</span>
                </a>
                <div className="flex items-center gap-2">
                    <a
                        href="https://web.facebook.com/Applex.bd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-12 rounded-md border border-gray-200 bg-white flex items-center justify-center transition-all duration-200 hover:border-[#ffb347] hover:bg-[#fff7ed]"
                        aria-label="Applex Facebook"
                    >
                        <Image
                            src="/product-details-svg/2023_Facebook_icon.svg"
                            alt="Facebook"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                        />
                    </a>
                    <a
                        href="https://www.tiktok.com/@applexofficialbd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-12 rounded-md border border-gray-200 bg-white flex items-center justify-center transition-all duration-200 hover:border-[#ffb347] hover:bg-[#fff7ed]"
                        aria-label="Applex TikTok"
                    >
                        <Image
                            src="/product-details-svg/tiktok-solo-icon.svg"
                            alt="TikTok"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                        />
                    </a>
                    <a
                        href="https://www.youtube.com/@user-lh5pe6ug2b"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-12 rounded-md border border-gray-200 bg-white flex items-center justify-center transition-all duration-200 hover:border-[#ffb347] hover:bg-[#fff7ed]"
                        aria-label="Applex YouTube"
                    >
                        <Image
                            src="/product-details-svg/youtube-color-icon.svg"
                            alt="YouTube"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}



