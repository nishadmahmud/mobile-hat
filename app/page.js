import Hero from "../components/Hero/Hero";
import ShopCategories from "../components/ShopCategories/ShopCategories";
import NewArrivals from "../components/NewArrivals/NewArrivals";
import PromoBanners from "../components/PromoBanners/PromoBanners";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import BestDeals from "../components/BestDeals/BestDeals";
import BrandsMarquee from "../components/Brands/BrandsMarquee";
import Testimonials from "../components/Testimonials/Testimonials";
import FAQ from "../components/FAQ/FAQ";
import BlogTips from "../components/BlogTips/BlogTips";
import CTABanner from "../components/CTABanner/CTABanner";
import SEOContent from "../components/Footer/SEOContent";

import {
  getSlidersFromServer,
  getCategoriesFromServer,
  getNewArrivalsFromServer,
  getBlogs,
  getBannerFromServer,
  getBestDealsFromServer,
  getBestSellersFromServer,
  getTopBrands,
  normalizeBlogPosts,
} from "../lib/api";

export default async function Home() {
  // Fetch API Data safely
  const [
    slidersRes,
    bannersRes,
    categoriesRes,
    newArrivalsRes,
    bestSellersRes,
    bestDealsRes,
    blogsRes,
    brandsRes
  ] = await Promise.all([
    getSlidersFromServer().catch(() => ({ success: false, data: [] })),
    getBannerFromServer().catch(() => ({ success: false, data: [] })),
    getCategoriesFromServer().catch(() => ({ success: false, data: [] })),
    getNewArrivalsFromServer().catch(() => ({ success: false, data: [] })),
    getBestSellersFromServer().catch(() => ({ success: false, data: [] })),
    getBestDealsFromServer().catch(() => ({ success: false, data: [] })),
    getBlogs().catch(() => ({ success: false, data: [] })),
    getTopBrands().catch(() => ({ success: false, data: [] }))
  ]);

  // ═══════════════════════════════════════════
  // API DATA MAPPING
  // ═══════════════════════════════════════════

  const mapProductData = (p) => {
    const basePrice = Number(p.retails_price || p.price || 0);
    const discountValue = Number(p.discount || 0);
    const discountType = String(p.discount_type || '').toLowerCase();
    const hasDiscount = discountValue > 0 && discountType !== '0';

    const price = hasDiscount
      ? discountType === 'percentage'
        ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100)))
        : Math.max(0, basePrice - discountValue)
      : basePrice;

    const discountLabel = hasDiscount
      ? discountType === 'percentage'
        ? `-${discountValue}%`
        : `৳ ${discountValue.toLocaleString('en-IN')}`
      : null;

    // Prioritize image_path or image_paths[0] for real products, fallback to image_url (which might be a placeholder)
    let imageUrl =
      p.image_path ||
      (Array.isArray(p.image_paths) && p.image_paths.length > 0 ? p.image_paths[0] : null) ||
      p.image_url ||
      '/no-image.svg';

    if (typeof imageUrl === 'string') {
      imageUrl = imageUrl.trim();
    }

    const mapped = {
      id: p.id,
      name: p.name,
      price: `৳ ${price.toLocaleString('en-IN')}`,
      oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null,
      discount: discountLabel,
      imageUrl: imageUrl,
      brand: p.brands?.name || p.brand_name || '',
      categoryName: p.category_name || 'Others',
      hasVariants: p.have_variant === 1 || (Array.isArray(p.imeis) && p.imeis.length > 0),
    };

    // Also inject properties specifically needed by BestDeals component to prevent "missing alt" errors
    mapped.title = mapped.name;
    mapped.description = `${mapped.brand} • ${mapped.categoryName}`;
    mapped.badge = hasDiscount ? 'SALE' : null;
    mapped.link = `/product/${mapped.name.toLowerCase().replace(/\s+/g, '-')}-${mapped.id}`;
    if (hasDiscount) {
      mapped.savings = `Save ৳ ${(basePrice - price).toLocaleString('en-IN')}`;
    }

    return mapped;
  };

  const mapCategoryData = (c) => {
    const rawImage = c.image_url || c.image_path || c.image || '/no-image.svg';
    return {
      ...c,
      image: typeof rawImage === 'string' ? rawImage.trim() : rawImage,
    };
  };

  const mapSliderData = (s) => {
    if (Array.isArray(s.image_path) && s.image_path.length > 0) {
      return s.image_path.map((imgUrl, idx) => ({
        id: `${s.id}-${idx}`,
        image: typeof imgUrl === 'string' ? imgUrl.trim() : (imgUrl || '/no-image.svg'),
        title: s.title || s.name || 'Featured Item',
        subtitle: s.subtitle || s.description || 'Discover our top picks',
        link: s.link || '#',
      }));
    }
    const rawImage = s.image_url || s.image_path || s.image || '/no-image.svg';
    return [{
      id: s.id,
      image: typeof rawImage === 'string' ? rawImage.trim() : rawImage,
      title: s.title || s.name || 'Featured Item',
      subtitle: s.subtitle || s.description || 'Discover our top picks',
      link: s.link || '#',
    }];
  };

  const mapBannerData = (b) => {
    const rawImage = b.image_url || b.image_path || b.image || '/no-image.svg';
    return {
      ...b,
      image: typeof rawImage === 'string' ? rawImage.trim() : rawImage,
      link: b.link || '#',
    };
  };

  const mapBrandData = (b) => {
    const rawImage = b.image_path || b.image || "/no-image.svg";
    return {
      id: b.id,
      name: b.name || "Brand",
      image: typeof rawImage === "string" ? rawImage.trim() : rawImage,
    };
  };

  const extractDataArray = (res, specificKey) => {
    if (!res) return null;

    // Direct keyed array (legacy payloads)
    if (specificKey && Array.isArray(res[specificKey]) && res[specificKey].length > 0) {
      return res[specificKey];
    }

    // Top-level array
    if (Array.isArray(res) && res.length > 0) {
      return res;
    }

    // Common direct array shapes
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }

    // Nested data array shape: { data: { data: [...] } }
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }

    // Paginated shape: { data: { data: { current_page, data: [...] } } }
    if (
      res.data &&
      res.data.data &&
      Array.isArray(res.data.data.data) &&
      res.data.data.data.length > 0
    ) {
      return res.data.data.data;
    }

    return null;
  };

  // Extract data from response or default to null to trigger dummy data fallback
  const rawSliders = extractDataArray(slidersRes, 'sliders');
  const apiSliders = rawSliders ? rawSliders.flatMap(mapSliderData) : null;

  const rawBanners = extractDataArray(bannersRes, 'banners');
  const apiBanners = rawBanners ? rawBanners.map(mapBannerData) : null;

  const rawCategories = extractDataArray(categoriesRes);
  const apiCategories = rawCategories ? rawCategories.map(mapCategoryData) : null;

  const rawNewArrivals = extractDataArray(newArrivalsRes);
  const apiNewArrivals = rawNewArrivals ? rawNewArrivals.map(mapProductData) : null;

  const rawBestSellers = extractDataArray(bestSellersRes);
  const apiBestSellers = rawBestSellers ? rawBestSellers.map(mapProductData) : null;

  const rawBestDeals = extractDataArray(bestDealsRes);
  const apiBestDeals = rawBestDeals ? rawBestDeals.map(mapProductData) : null;

  const rawBrands = extractDataArray(brandsRes);
  const apiBrands = rawBrands ? rawBrands.map(mapBrandData) : [];

  const apiBlogs = normalizeBlogPosts(blogsRes);

  // Construct final array of 5 banners (API data + high-quality fallbacks)
  const dummyBanners = [
    { id: 'd1', image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1964', link: '#', title: 'Premium Accessories' },
    { id: 'd2', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2030', link: '#', title: 'New Mac Arrivals' },
    { id: 'd3', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964', link: '#', title: 'Work From Home Setup' },
    { id: 'd4', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1780', link: '#', title: 'Smart Mobile Deals' },
    { id: 'd5', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015', link: '#', title: 'Gadget Showcase' }
  ];

  const allBanners = Array.from({ length: 5 }, (_, i) => {
    return (apiBanners && apiBanners[i]) ? apiBanners[i] : dummyBanners[i];
  });

  // Flash sale strip: use best deals first, else first 4 of new arrivals (API only)
  const flashSaleProducts = (apiBestDeals && apiBestDeals.length > 0)
    ? apiBestDeals.slice(0, 4)
    : (apiNewArrivals && apiNewArrivals.length > 0 ? apiNewArrivals.slice(0, 4) : []);

  return (
    <div className="bg-brand-paper">
      <Hero slides={apiSliders ?? []} banners={allBanners} />
      <ShopCategories categories={apiCategories ?? []} flashSaleProducts={flashSaleProducts} />
      <BrandsMarquee brands={apiBrands} />
      <BestDeals deals={apiBestDeals ?? []} />
      <NewArrivals products={apiNewArrivals ?? []} />
      
      {/* Banner 3 Section after New Arrival */}
      <PromoBanners banners={[allBanners[2]]} />

      <FeaturedProducts
        bestSellers={apiBestSellers ?? []}
        newArrivals={apiNewArrivals ?? []}
        flashDeals={apiBestDeals ?? []}
      />
      <BlogTips posts={apiBlogs} />

      <Testimonials />
      <FAQ />
      <CTABanner />
      <SEOContent />
    </div>
  );
}
