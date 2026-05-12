"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, MessageCircle, ShoppingCart, Truck } from 'lucide-react';
import PdpHeaderRail from './pdp/PdpHeaderRail';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useWishlist } from '../../context/WishlistContext';
import { useBrandCache } from '../../context/BrandCacheContext';
import toast from 'react-hot-toast';

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
const APLEX_LAST_CATEGORY_STORAGE_KEY = 'mobile_hat_last_category_context';

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
    suppressProductTitle = false,
    onVariantImageChange,
    selectedCarePlans = [],
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

        const emiMonthly = Math.max(1, Math.round(regularPrice / 12));

        return { offerPrice, regularPrice, emiMonthly };
    }, [currentPriceNumber, product.originalPrice]);

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
            <PdpHeaderRail
                suppressProductTitle={suppressProductTitle}
                product={product}
                matchedBrand={matchedBrand}
                brandListingHref={brandListingHref}
                handleAddToCompare={handleAddToCompare}
                handleShare={handleShare}
                isWishlisted={isWishlisted}
                onToggleWishlist={toggleWishlist}
            />

            {/* Price section */}
            <div className="mb-6 border-b border-brand-gray-border/80 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-baseline gap-3">
                        <span className="inline-flex items-baseline gap-0.5 text-[26px] font-bold tracking-tight text-brand-navy md:text-[30px]">
                            <span
                                className="font-black leading-none"
                                style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali','Arial',sans-serif" }}
                            >
                                ৳
                            </span>
                            <span>{displayPriceAmount}</span>
                        </span>
                        <span className="text-xs font-bold text-brand-muted md:text-sm">
                            (Cash Price)
                        </span>
                        {displayOldPrice && (
                            <span className="inline-flex items-baseline gap-0.5 text-xs font-medium text-brand-muted line-through md:text-sm">
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
                            <span className="rounded-md bg-brand-yellow px-2.5 py-1 text-xs font-black uppercase tracking-wide text-brand-navy">
                                Save {saveAmount.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-brand-muted md:text-[12px]">
                        <span className="inline-flex items-center gap-1">
                            <span className="font-bold">Availability:</span>
                            <span className="font-bold text-brand-navy">In Stock</span>
                        </span>
                        <span className="text-brand-gray-border">|</span>
                        <span className="inline-flex items-center gap-1">
                            <span className="font-bold">Code:</span>
                            <span className="font-bold text-brand-navy">{product.sku || 'N/A'}</span>
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
                            <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-brand-muted md:mb-4">
                                Pick a Color: <span className="text-brand-navy">{selectedColor || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {allColors.map(color => {
                                    const isSelected = selectedColor === color.name;
                                    const isWhite = color.hex?.toLowerCase() === '#ffffff' || color.hex?.toLowerCase() === '#fff';
                                    return (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`flex cursor-pointer items-center rounded-lg border-2 transition-all duration-300 gap-2 px-2.5 py-1.5 md:gap-3 md:px-4 md:py-3 ${
                                                isSelected
                                                    ? 'border-brand-navy bg-white shadow-md shadow-brand-navy/15'
                                                    : 'border-brand-gray-border bg-white hover:border-brand-yellow hover:shadow-sm'
                                            }`}
                                            title={color.name}
                                        >
                                            <span
                                                className={`h-4 w-4 shrink-0 rounded-full shadow-inner md:h-6 md:w-6 ${isWhite ? 'border border-brand-gray-border' : ''}`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className={`text-[11px] font-black leading-tight md:text-sm ${isSelected ? 'text-brand-navy' : 'text-brand-muted'}`}>
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
                            <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-brand-muted md:mb-4">
                                Storage: <span className="text-brand-navy">{selectedStorage || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allStorages.map(size => {
                                    const isAvailable = availableStorages.includes(size);
                                    const isSelected = selectedStorage === size;
                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => isAvailable && setSelectedStorage(size)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer rounded-lg border px-6 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 ${isSelected
                                                ? 'border-brand-navy bg-brand-navy text-white shadow-lg shadow-brand-navy/25'
                                                : isAvailable
                                                    ? 'border-brand-gray-border bg-white text-brand-muted hover:border-brand-yellow hover:shadow-sm'
                                                    : 'cursor-not-allowed border-brand-gray-border/50 bg-brand-paper/80 text-brand-muted/50'
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
                            <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-brand-muted md:mb-4">
                                Region: <span className="text-brand-navy">{selectedRegion || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {allRegions.map(region => {
                                    const isAvailable = availableRegions.includes(region);
                                    const isSelected = selectedRegion === region;
                                    return (
                                        <button
                                            key={region}
                                            type="button"
                                            onClick={() => isAvailable && setSelectedRegion(region)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer rounded-lg border px-5 py-3 text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${isSelected
                                                ? 'border-brand-navy bg-brand-paper text-brand-navy shadow-md shadow-brand-navy/10'
                                                : isAvailable
                                                    ? 'border-brand-gray-border bg-white text-brand-muted hover:border-brand-yellow hover:shadow-sm'
                                                    : 'cursor-not-allowed border-brand-gray-border/50 bg-brand-paper/80 text-brand-muted/50 grayscale'
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

            {/* Primary commerce — after variant selection */}
            <div className="mb-6 border-b border-brand-gray-border/80 pb-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
                    <div className="flex h-12 w-full shrink-0 items-center justify-between self-center rounded-lg border border-brand-gray-border bg-brand-paper px-1 sm:h-auto sm:min-h-12 sm:w-[112px] sm:self-stretch sm:py-0">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="flex size-10 cursor-pointer items-center justify-center rounded-md text-brand-muted transition-all hover:bg-white hover:text-brand-navy sm:size-9"
                        >
                            <Minus className="size-4" strokeWidth={2} />
                        </button>
                        <span className="min-w-8 text-center text-sm font-black tabular-nums text-brand-navy">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="flex size-10 cursor-pointer items-center justify-center rounded-md text-brand-muted transition-all hover:bg-white hover:text-brand-navy sm:size-9"
                        >
                            <Plus className="size-4" strokeWidth={2} />
                        </button>
                    </div>

                    <div className="flex min-h-12 min-w-0 flex-1 gap-2">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="inline-flex h-12 min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-brand-navy bg-white px-3 text-[13px] font-bold leading-none tracking-tight text-brand-navy transition-all hover:bg-brand-paper sm:min-h-12"
                        >
                            <ShoppingCart className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
                            <span className="whitespace-nowrap">Add to Cart</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleBuyNow}
                            className="inline-flex h-12 min-h-12 min-w-0 flex-[1.2] cursor-pointer items-center justify-center rounded-xl bg-brand-navy px-3 text-[13px] font-bold leading-none tracking-tight text-white shadow-lg shadow-brand-navy/25 transition-all hover:bg-brand-navy-deep sm:min-h-12"
                        >
                            <span className="whitespace-nowrap">Buy Now</span>
                        </button>
                    </div>
                </div>

                <p className="mt-3 flex items-center justify-center gap-2 border-t border-brand-gray-border/60 pt-3 text-center text-[11px] font-semibold leading-snug text-brand-muted sm:justify-start md:text-xs">
                    <Truck className="size-3.5 shrink-0 text-brand-navy" strokeWidth={2} aria-hidden />
                    <span>
                        Shipping within <span className="font-black text-brand-navy">0–3 business days</span>
                    </span>
                </p>
            </div>

            {/* Contact + Social row (icons only — links removed) */}
            <div className="mt-3 flex items-center gap-3">
                <span
                    className="inline-flex flex-1 cursor-default items-center justify-center gap-2 rounded-xl border border-brand-gray-border bg-white px-4 py-3 text-gray-900 select-none"
                    aria-label="WhatsApp"
                >
                    <MessageCircle className="size-5 shrink-0 text-emerald-600" strokeWidth={2} />
                    <span className="text-sm font-bold">WhatsApp</span>
                </span>
                <div className="flex items-center gap-2">
                    <span
                        className="flex h-12 w-14 cursor-default items-center justify-center rounded-md border border-brand-gray-border bg-white select-none"
                        aria-label="Facebook"
                    >
                        <Image
                            src="/product-details-svg/2023_Facebook_icon.svg"
                            alt=""
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                        />
                    </span>
                    <span
                        className="flex h-12 w-14 cursor-default items-center justify-center rounded-md border border-brand-gray-border bg-white select-none"
                        aria-label="TikTok"
                    >
                        <Image
                            src="/product-details-svg/tiktok-solo-icon.svg"
                            alt=""
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                        />
                    </span>
                    <span
                        className="flex h-12 w-14 cursor-default items-center justify-center rounded-md border border-brand-gray-border bg-white select-none"
                        aria-label="YouTube"
                    >
                        <Image
                            src="/product-details-svg/youtube-color-icon.svg"
                            alt=""
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}



