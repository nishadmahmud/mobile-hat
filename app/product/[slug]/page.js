"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProductGallery from '../../../components/Product/ProductGallery';
import ProductInfo from '../../../components/Product/ProductInfo';
import ProductTabs from '../../../components/Product/ProductTabs';
import ApplexCare from '../../../components/Product/ApplexCare';
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
    const [selectedCarePlans, setSelectedCarePlans] = useState([]);
    const [emiOpenTrigger, setEmiOpenTrigger] = useState(0);

    const toggleCarePlan = (plan) => {
        setSelectedCarePlans(prev => {
            const exists = prev.find(p => p.id === plan.id);
            if (exists) {
                return prev.filter(p => p.id !== plan.id);
            }
            return [...prev, plan];
        });
    };

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
                const rawSeed = sessionStorage.getItem(`applex_pdp_seed_${productId}`);
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
            const stored = localStorage.getItem('applex_recently_viewed');
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
            localStorage.setItem('applex_recently_viewed', JSON.stringify(truncated));
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

    return (
        <div className="bg-white min-h-screen pb-12">
            <div className="bg-white border-b border-gray-100 py-3 md:py-4 mb-6 md:mb-8">
                <div className="max-w-[1550px] mx-auto px-4 md:px-6">
                    <div className="text-[10px] md:text-[12px] text-gray-400 flex items-center gap-2 font-black uppercase tracking-widest">
                        <Link href="/" className="hover:text-blue-600 cursor-pointer transition-colors">Home</Link>
                        <span className="text-gray-300">/</span>
                        {productData?.category?.name && (
                            <>
                                <Link
                                    href={`/category/${productData.category.slug}`}
                                    className="hover:text-blue-600 cursor-pointer transition-colors"
                                >
                                    {productData.category.name}
                                </Link>
                                <span className="text-gray-300">/</span>
                            </>
                        )}
                        <span className="text-blue-600 truncate">{productName}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1550px] mx-auto px-4 md:px-6">

                {isLoading && !productData ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gathering details...</p>
                    </div>
                ) : error || !productData ? (
                    <div className="py-20 text-center">
                        <p className="text-sm text-red-500">{error || 'Product not found.'}</p>
                    </div>
                ) : (
                    <>
                        {/* 3-Column Top Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                            {/* Col 1: Gallery (4 Columns) */}
                            <div className="w-full lg:col-span-4 shrink-0 lg:sticky lg:top-32 self-start">
                                <ProductGallery images={galleryImages} showUsedTag={isUsedPhoneProduct} />
                            </div>

                            {/* Col 2: Info (5 Columns) */}
                            <div className="w-full lg:col-span-5">
                                <ProductInfo
                                    product={productData}
                                    onVariantImageChange={setVariantImages}
                                    selectedCarePlans={selectedCarePlans}
                                    toggleCarePlan={toggleCarePlan}
                                    onOpenEmiModal={() => setEmiOpenTrigger((prev) => prev + 1)}
                                    emiOpenTrigger={emiOpenTrigger}
                                />
                            </div>

                            {/* Col 3: Applex Care (3 Columns - Desktop Only) */}
                            <div className="w-full lg:col-span-3 hidden lg:block">
                                <ApplexCare 
                                    product={productData}
                                    currentPrice={productData.rawPrice}
                                    selectedCarePlans={selectedCarePlans}
                                    toggleCarePlan={toggleCarePlan}
                                    openEmiTrigger={emiOpenTrigger}
                                />
                            </div>
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
                            <div className="mt-16 md:mt-24 pt-12 border-t border-gray-200">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center md:text-left">
                                    Related Products
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                                    {relatedProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
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
