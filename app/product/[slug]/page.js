"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import ProductGallery from '../../../components/Product/ProductGallery';
import ProductInfo from '../../../components/Product/ProductInfo';
import ProductTabs from '../../../components/Product/ProductTabs';
import ProductCard from '../../../components/Shared/PremiumProductCard';
import { getProductById, getRelatedProduct } from '../../../lib/api';

function mapSeedProductForPdp(seed) {
    if (!seed || !seed.id) return null;

    const discountValueFromText = Number(String(seed.discount || '').replace(/[^\d.]/g, '')) || 0;
    const priceNumber =
        Number(seed.rawPrice) ||
        Number(String(seed.price || '').replace(/[^\d.]/g, '')) ||
        0;
    const originalPriceFromOld =
        Number(String(seed.oldPrice || '').replace(/[^\d.]/g, '')) ||
        Number(seed.retails_price) ||
        priceNumber;
    const hasDiscount = !!(seed.oldPrice || (discountValueFromText > 0 && originalPriceFromOld > priceNumber));

    const categoryName = seed.category?.name || seed.category_name || null;
    const categorySlug =
        seed.category?.slug ||
        seed.category_slug ||
        (categoryName ? String(categoryName).toLowerCase().replace(/\s+/g, '-') : null);

    return {
        id: seed.id,
        name: seed.name || 'Product',
        sku: seed.sku || '',
        brand: {
            id: seed.brand?.id ?? null,
            name: seed.brand?.name || seed.brand_name || (typeof seed.brand === 'string' ? seed.brand : null),
            image: seed.brand?.image || null,
        },
        price: seed.price || `৳ ${priceNumber.toLocaleString('en-IN')}`,
        rawPrice: priceNumber,
        originalPrice: originalPriceFromOld,
        oldPrice: seed.oldPrice || null,
        discount: seed.discount || null,
        discountValue: discountValueFromText,
        discountType: seed.discountType || null,
        hasDiscount,
        videoUrl: '',
        images: [String(seed.imageUrl || '/no-image.svg').trim()],
        rawImeis: Array.isArray(seed.rawImeis) ? seed.rawImeis : [],
        description: '',
        specifications: [],
        category: {
            id: seed.category?.id || seed.category_id || null,
            name: categoryName,
            slug: categorySlug,
        }
    };
}

export default function ProductDetailsPage() {
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';

    // Parse product ID from slug (supports "product-name-12345" or just "12345")
    const productId = useMemo(() => {
        if (!slug) return null;
        const decoded = decodeURIComponent(slug).trim();

        // Case 1: slug is just the numeric ID
        if (/^\d+$/.test(decoded)) {
            const directId = Number(decoded);
            return Number.isFinite(directId) && directId > 0 ? directId : null;
        }

        // Case 2: slug is "name-<id>"
        const parts = decoded.split('-');
        const maybeId = parts[parts.length - 1];
        const idNum = Number(maybeId);
        return Number.isFinite(idNum) && idNum > 0 ? idNum : null;
    }, [slug]);

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [variantImages, setVariantImages] = useState(null);
    const [fromCategory, setFromCategory] = useState(null); // { name, slug }

    useEffect(() => {
        // Check if we came from a category page
        if (typeof document !== 'undefined' && document.referrer) {
            const referrer = document.referrer;
            if (referrer.includes('/category/')) {
                // Try to extract category slug from referrer if needed, 
                // but we'll get the real name from product data
                setFromCategory(true);
            }
        }
    }, []);

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            setError('Invalid product.');
            return;
        }

        // Instant paint: use lightweight card/category payload if available.
        try {
            if (typeof window !== 'undefined') {
                const rawSeed = sessionStorage.getItem(`mobile_hat_pdp_seed_${productId}`);
                if (rawSeed) {
                    const seed = JSON.parse(rawSeed);
                    const mappedSeed = mapSeedProductForPdp(seed);
                    if (mappedSeed) {
                        setProductData(prev => prev || mappedSeed);
                    }
                }
            }
        } catch {
            // ignore parse/storage errors
        }

        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await getProductById(productId);
                const payload = res?.data || res;
                if (!payload || !payload.id) {
                    throw new Error('Product not found');
                }

                const p = payload;

                const originalPrice = Number(p.retails_price || 0);
                const discountValue = Number(p.discount || 0);
                const discountType = String(p.discount_type || '').toLowerCase();
                const hasDiscount = discountValue > 0 && discountType !== '0';

                const price = hasDiscount
                    ? discountType === 'percentage'
                        ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
                        : Math.max(0, originalPrice - discountValue)
                    : originalPrice;

                const discountLabel = hasDiscount
                    ? discountType === 'percentage'
                        ? `-${discountValue}%`
                        : `৳ ${discountValue.toLocaleString('en-IN')}`
                    : null;

                const images =
                    (Array.isArray(p.images) && p.images.length > 0 && p.images.map(img => typeof img === 'string' ? img.trim() : img)) ||
                    (Array.isArray(p.imei_image) && p.imei_image.filter(Boolean).map(img => typeof img === 'string' ? img.trim() : img)) ||
                    (p.image_path ? [p.image_path.trim()] : []) ||
                    ['/no-image.svg'];

                // Pass the raw imeis array for dynamic variant logic
                const rawImeis = Array.isArray(p.imeis) ? p.imeis.filter(i => i.in_stock === 1) : [];

                // Use structured specifications array directly from API (filtering out brand row)
                const apiSpecifications = Array.isArray(p.specifications)
                    ? p.specifications.filter(
                        (s) =>
                            s &&
                            typeof s.name === 'string' &&
                            s.name.trim().length > 0 &&
                            s.description &&
                            String(s.description).trim().length > 0 &&
                            s.name.toLowerCase() !== 'brand'
                    )
                    : [];

                const mappedProduct = {
                    id: p.id,
                    name: p.name,
                    sku: p.sku || p.product_code || p.model || '',
                    brand: {
                        id: p.brand_id ?? null,
                        name: p.brand_name || p.brands?.name || null,
                        image: p.brand_image || p.brands?.image || null,
                    },
                    price: `৳ ${price.toLocaleString('en-IN')}`,
                    rawPrice: price,
                    originalPrice,
                    oldPrice: hasDiscount
                        ? `৳ ${originalPrice.toLocaleString('en-IN')}`
                        : null,
                    discount: discountLabel,
                    discountValue,
                    discountType,
                    hasDiscount,
                    videoUrl: p.video_url || p.video || '',
                    images,
                    rawImeis,
                    description: p.description || '',
                    specifications: apiSpecifications,
                    category: {
                        id: p.category_id || p.category?.id,
                        name: p.category_name || p.category?.name,
                        slug: p.category_slug || p.category?.slug || (p.category_name || p.category?.name)?.toLowerCase().replace(/\s+/g, '-')
                    }
                };

                if (!cancelled) {
                    setProductData(mappedProduct);
                    setVariantImages(null); // reset on new product load
                }

                // Load related products
                try {
                    const relatedRes = await getRelatedProduct(p.id);
                    const relatedPayload = relatedRes?.data || relatedRes;
                    const relatedItems = Array.isArray(relatedPayload?.data)
                        ? relatedPayload.data
                        : Array.isArray(relatedPayload)
                            ? relatedPayload
                            : [];

                    if (!cancelled) {
                        const mappedRelated = relatedItems.map((rp) => {
                            const rpPrice = Number(rp.retails_price || 0);
                            return {
                                id: rp.id,
                                name: rp.name,
                                price: `৳ ${rpPrice.toLocaleString('en-IN')}`,
                                oldPrice: null,
                                discount: null,
                                imageUrl: (rp.image_path || rp.image_path1 || rp.image_path2 || '/no-image.svg')?.toString().trim(),
                            };
                        });
                        setRelatedProducts(mappedRelated.slice(0, 8));
                    }
                } catch {
                    // ignore related errors
                }
            } catch (err) {
                console.error('Failed to load product details', err);
                if (!cancelled) {
                    setError('Failed to load product details.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [productId]);

    const [recentlyViewed, setRecentlyViewed] = useState([]);

    // Tracking for Recently Viewed
    useEffect(() => {
        if (!productData || !productData.id) return;
        
        try {
            const stored = localStorage.getItem('mobile_hat_recently_viewed');
            let list = stored ? JSON.parse(stored) : [];
            
            // Remove current product if it exists to bring it to top
            list = list.filter(p => p.id !== productData.id);
            
            // Add current product at the beginning
            list.unshift({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                oldPrice: productData.oldPrice,
                discount: productData.discount,
                image: productData.images?.[0] || '/no-image.svg',
                slug: slug
            });
            
            // Limit to 10
            const truncated = list.slice(0, 10);
            localStorage.setItem('mobile_hat_recently_viewed', JSON.stringify(truncated));
            setRecentlyViewed(truncated);
        } catch (e) {
            console.error("Failed to update recently viewed", e);
        }
    }, [productData, slug]);

    const productName =
        productData?.name ||
        (slug
            ? decodeURIComponent(slug)
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (ch) => ch.toUpperCase())
            : 'Product');

    // Determine which images to show in gallery
    const galleryImages = variantImages && variantImages.length > 0
        ? variantImages
        : productData?.images;
    const normalizedProductCategorySlug = String(productData?.category?.slug || '').toLowerCase();
    const normalizedProductCategoryName = String(productData?.category?.name || '').toLowerCase();
    const isUsedPhoneProduct =
        normalizedProductCategorySlug === 'used-phone' ||
        normalizedProductCategoryName === 'used phone';

    const categoryBackHref =
        productData?.category?.slug != null && String(productData.category.slug).length > 0
            ? `/category/${productData.category.slug}`
            : null;

    return (
        <div className="min-h-screen bg-brand-paper pb-12">
            <div className="mb-6 border-b border-brand-gray-border/80 bg-white md:mb-8">
                <div className="mx-auto max-w-[1550px] px-4 py-4 md:px-8 md:py-5">
                    <div className="flex flex-col gap-3 md:gap-4">
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2">
                            {categoryBackHref ? (
                                <Link
                                    href={categoryBackHref}
                                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand-gray-border bg-brand-paper px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-navy transition-colors hover:border-brand-navy hover:bg-white md:px-3 md:text-[11px]"
                                >
                                    <ChevronLeft className="size-3.5 shrink-0 md:size-4" strokeWidth={2.5} aria-hidden />
                                    Back
                                </Link>
                            ) : null}
                            <nav
                                className="flex min-w-0 flex-1 items-center gap-x-2 gap-y-1 text-[10px] font-black uppercase tracking-widest text-brand-muted md:text-xs"
                                aria-label="Breadcrumb"
                            >
                                <Link href="/" className="shrink-0 transition-colors hover:text-brand-navy">
                                    Home
                                </Link>
                                <span className="shrink-0 text-brand-gray-border" aria-hidden>
                                    /
                                </span>
                                {productData?.category?.name && categoryBackHref ? (
                                    <>
                                        <Link
                                            href={categoryBackHref}
                                            className="min-w-0 shrink truncate transition-colors hover:text-brand-navy"
                                        >
                                            {productData.category.name}
                                        </Link>
                                        <span className="shrink-0 text-brand-gray-border" aria-hidden>
                                            /
                                        </span>
                                    </>
                                ) : null}
                                <span className="min-w-0 truncate font-black text-brand-navy">{productName}</span>
                            </nav>
                        </div>
                        <h1 className="text-xl font-black uppercase leading-tight tracking-[0.06em] text-brand-navy md:text-2xl md:tracking-[0.08em]">
                            {productName}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1550px] px-4 md:px-8">

                {isLoading && !productData ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-gray-border bg-white py-28">
                        <div
                            className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-brand-navy/15 border-t-brand-navy"
                            role="status"
                            aria-label="Loading"
                        />
                        <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">Gathering details…</p>
                    </div>
                ) : error || !productData ? (
                    <div className="rounded-2xl border border-dashed border-brand-gray-border bg-white py-20 text-center">
                        <p className="text-sm font-semibold text-red-600">{error || 'Product not found.'}</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile: gallery first under title band; desktop: gallery left + sticky rail right */}
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                            <div className="order-1 min-w-0 flex-1">
                                <ProductGallery images={galleryImages} showUsedTag={isUsedPhoneProduct} />
                            </div>

                            <aside className="order-2 w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,460px)] xl:w-[min(100%,500px)]">
                                <div className="rounded-2xl border border-brand-gray-border/80 bg-white p-5 shadow-[0_12px_40px_rgba(30,45,74,0.06)] md:p-6">
                                    <ProductInfo
                                        product={productData}
                                        suppressProductTitle
                                        onVariantImageChange={setVariantImages}
                                    />
                                </div>
                            </aside>
                        </div>

                        {/* Bottom: Tabs & Sidebar */}
                        <ProductTabs
                            description={productData.description}
                            specifications={productData.specifications}
                            videoUrl={productData.videoUrl}
                            recentlyViewed={recentlyViewed.filter(p => p.id !== productData.id)}
                        />

                        {/* Related Products Section */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-16 border-t border-brand-gray-border/80 pt-10 md:mt-24 md:pt-12">
                                <div className="mb-5 flex flex-col gap-1 md:mb-6 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <h2 className="text-xl font-black uppercase tracking-[0.12em] text-brand-navy md:text-2xl md:tracking-[0.14em]">
                                            Related products
                                        </h2>
                                        <p className="mt-1 text-sm text-brand-muted">More you might like from our catalog.</p>
                                    </div>
                                </div>
                                <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto pb-2 pt-1 md:gap-4 md:pb-3">
                                    {relatedProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="w-[min(260px,78vw)] shrink-0 sm:w-[240px] md:w-[260px]"
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
