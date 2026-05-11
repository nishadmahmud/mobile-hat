"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronRight, FiHeadphones, FiTruck, FiFileText, FiCopy, FiZap, FiInfo, FiBatteryCharging, FiMonitor, FiCreditCard, FiSmartphone, FiHeart } from 'react-icons/fi';
import { FaApple, FaAndroid, FaTabletAlt, FaLaptop, FaClock } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useBrandCache } from '../../context/BrandCacheContext';
import { searchProducts, getBestSellersFromServer } from '../../lib/api';
import ProductCard from '../Shared/PremiumProductCard';

export default function Header({ categories = [] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [liveCategories, setLiveCategories] = useState(Array.isArray(categories) ? categories : []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [activeSearchCategory, setActiveSearchCategory] = useState('all');
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [isFetchingTrending, setIsFetchingTrending] = useState(false);

  const trendingSearches = [
    "iPhone 16 Pro Max",
    "AirPods Pro 2",
    "Galaxy S24 Ultra",
    "MacBook Air M3",
    "Apple Watch Ultra 2",
    "Google Pixel 9 Pro"
  ];


  const { cartCount, openCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const { wishlistCount } = useWishlist();
  const { getBrandsForCategory, isFetchingBrands } = useBrandCache();
  const router = useRouter();

  const searchContainerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setLiveCategories(Array.isArray(categories) ? categories : []);
  }, [categories]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API;
    const userId = process.env.NEXT_PUBLIC_USER_ID;
    if (!baseUrl || !userId) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const loadLiveCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/public/categories/${userId}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) return;
        const payload = await res.json();
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        if (list.length === 0) return;
        const mapped = list.map((cat) => ({
          ...cat,
          name: cat.category_name || cat.name || 'Unknown',
          slug: cat.slug || cat.category_slug || String(cat.category_name || cat.name || '').toLowerCase().replace(/\s+/g, '-'),
          image: (cat.image_path || cat.image_url || cat.image || '/no-image.svg').toString().trim(),
        }));
        const mappedAllowed = mapped.filter((cat) =>
          allowedHeaderCategories.has(normalizeCategory(cat?.name))
        );
        if (mappedAllowed.length >= 4) {
          setLiveCategories(mapped);
        }
      } catch {
        // Keep SSR/fallback categories if live refresh fails
      } finally {
        clearTimeout(timeout);
      }
    };

    loadLiveCategories();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const normalizeCategory = (name = '') =>
    String(name).toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();

  const allowedHeaderCategories = new Set([
    'iphone',
    'andriod',
    'android',
    'macbook',
    'ipad',
    'earbuds',
    'power bank',
    'smart watch',
    'adapters',
    'used phone',
  ]);

  const defaultCategories = [
    { name: "iPhone", slug: "iphone" },
    { name: "Android", slug: "andriod" },
    { name: "MacBook", slug: "macbook" },
    { name: "iPad", slug: "ipad" },
    { name: "Earbuds", slug: "earbuds" },
    { name: "Power Bank", slug: "power-bank" },
    { name: "Smart Watch", slug: "smart-watch" },
    { name: "Adapters", slug: "adapters" },
    { name: "Used Phone", slug: "used-phone" },
  ];

  const filteredHeaderCategories = (Array.isArray(liveCategories) ? liveCategories : []).filter((cat) =>
    allowedHeaderCategories.has(normalizeCategory(cat?.name))
  );

  const baseCategories = filteredHeaderCategories.length >= 4 ? filteredHeaderCategories : defaultCategories;
  
  // Force show "Used Phone" if not already present in the list
  const displayCategories = baseCategories.some(cat => normalizeCategory(cat?.name) === 'used phone')
    ? baseCategories
    : [...baseCategories, { name: "Used Phone", slug: "used-phone" }];

  const categoryIconMap = {
    'iphone': '/svg/apple logo.svg',
    'andriod': '/svg/android.svg',
    'android': '/svg/android.svg',
    'macbook': '/svg/laptop.svg',
    'ipad': '/svg/mobile.svg',
    'tab': '/svg/mobile.svg',
    'tablet': '/svg/mobile.svg',
    'earbuds': '/svg/earbuds.svg',
    'earbud': '/svg/earbuds.svg',
    'power bank': '/svg/power bank.svg',
    'smart watch': '/svg/watch.svg',
    'charger combo': '/svg/cable.svg',
    'adapters': '/svg/cable.svg',
    'used phone': '/svg/used phone.svg',
    'adapter': '/svg/cable.svg',
    'cable': '/svg/cable.svg',
    'cover': '/svg/mobile.svg',
    'screen protector': '/svg/mobile.svg',
    'camera lens': '/svg/mobile.svg',
    'speakers': '/svg/earbuds.svg',
    'speaker': '/svg/earbuds.svg',
    'accessories': '/svg/mobile.svg',
  };

  const getCategoryIcon = (name) => {
    const normalized = normalizeCategory(name);
    const singular = normalized.endsWith('s') ? normalized.slice(0, -1) : normalized;
    const iconSrc = categoryIconMap[normalized] || categoryIconMap[singular];
    if (!iconSrc) return null;
    return (
      <Image
        src={iconSrc}
        alt={`${name || 'Category'} icon`}
        width={18}
        height={18}
        className="h-[16px] w-[16px] object-contain opacity-80 md:opacity-70"
        unoptimized
      />
    );
  };

  const handleUserClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      openAuthModal('login');
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const toggleMobileCategory = (catId) => {
    setExpandedMobileCategory(prev => prev === catId ? null : catId);
  };

  const [hoverCategoryIndex, setHoverCategoryIndex] = useState(null);
  const [allMenuCategory, setAllMenuCategory] = useState(null);
  const [allMenuSubcategoryId, setAllMenuSubcategoryId] = useState(null);
  const allMenuTimeoutRef = useRef(null);

  const openMegaMenu = (idx) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoverCategoryIndex(idx);
  };

  const scheduleCloseMegaMenu = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverCategoryIndex(null);
    }, 300);
  };

  const openAllMenu = (cat) => {
    if (allMenuTimeoutRef.current) {
      clearTimeout(allMenuTimeoutRef.current);
      allMenuTimeoutRef.current = null;
    }
    setAllMenuCategory(cat);
    const firstSub = Array.isArray(cat?.sub_category) && cat.sub_category.length > 0 ? cat.sub_category[0] : null;
    setAllMenuSubcategoryId(firstSub?.id ?? null);
  };

  const scheduleCloseAllMenu = () => {
    if (allMenuTimeoutRef.current) clearTimeout(allMenuTimeoutRef.current);
    allMenuTimeoutRef.current = setTimeout(() => {
      setAllMenuCategory(null);
      setAllMenuSubcategoryId(null);
    }, 180);
  };

  // ── Search Logic ──
  const runSearch = async (q) => {
    if (!q) {
      setSearchResults([]);
      setSearchCategories([]);
      setSearchError('');
      return;
    }

    setIsSearchOpen(true);
    setIsSearching(true);
    setSearchError('');

    try {
      const res = await searchProducts(q);
      const payload = res?.data || res;
      const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

      const mapped = items.map((p) => {
        const basePrice = Number(p.retails_price || p.discounted_price || 0);
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

        const imageUrl =
          p.image_path || p.image_path1 || p.image_path2 ||
          (Array.isArray(p.image_paths) && p.image_paths[0]) || '/no-image.svg';

        return {
          id: p.id,
          name: p.name,
          price: `৳ ${price.toLocaleString('en-IN')}`,
          oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null,
          discount: discountLabel,
          imageUrl: imageUrl?.toString().trim(),
          brand: p.brands?.name || '',
          categoryName: p.category?.name || 'Others',
          raw: p,
        };
      });

      setSearchResults(mapped);
      const cats = Array.from(new Set(mapped.map((m) => m.categoryName))).sort();
      setSearchCategories(cats);
      setActiveSearchCategory('all');
    } catch {
      setSearchError('Something went wrong. Please try again.');
      setSearchResults([]);
      setSearchCategories([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    runSearch(q);
  };

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { 
      setSearchResults([]); 
      setSearchCategories([]); 
      setSearchError(''); 
      return; 
    }
    const timeout = setTimeout(() => runSearch(q), 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    const loadTrending = async () => {
      setIsFetchingTrending(true);
      try {
        const res = await getBestSellersFromServer();
        const payload = res?.data || res;
        const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        
        const mapped = items.map((p) => {
          const basePrice = Number(p.retails_price || p.discounted_price || 0);
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

          const imageUrl =
            p.image_path || p.image_path1 || p.image_path2 ||
            (Array.isArray(p.image_paths) && p.image_paths[0]) || '/no-image.svg';

          return {
            id: p.id,
            name: p.name,
            price: `৳ ${price.toLocaleString('en-IN')}`,
            oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null,
            discount: discountLabel,
            imageUrl: imageUrl?.toString().trim(),
            brand: p.brands?.name || '',
            categoryName: p.category?.name || 'Others',
            raw: p,
          };
        });
        setTrendingProducts(mapped.slice(0, 10));
      } catch (e) {
        console.error("Failed to load trending products", e);
      } finally {
        setIsFetchingTrending(false);
      }
    };
    loadTrending();
  }, []);


  const closeSearchModal = () => setIsSearchOpen(false);

  const filteredSearchResults = useMemo(() => {
    if (activeSearchCategory === 'all') return searchResults;
    return searchResults.filter((p) => p.categoryName === activeSearchCategory);
  }, [searchResults, activeSearchCategory]);

  return (
    <>
      {/* Top strip — quiet, editorial (desktop) */}
      <div className="relative hidden w-full border-b border-slate-200/90 bg-slate-50 md:block">
        <p className="mx-auto max-w-[1550px] px-6 py-2 text-center text-[13px] font-medium leading-snug text-slate-800">
          Trusted tech, fair pricing, nationwide delivery
        </p>
      </div>
      <header className="sticky top-0 z-50 flex w-full flex-col border-b border-slate-200/90 bg-white shadow-[0_1px_0_rgba(15,23,42,0.06)]">

        {/* Primary bar — navy on all breakpoints so utility icons stay white; desktop header shell above picks up white below category rail */}
        <div className="relative border-b border-white/10 bg-gradient-to-b from-brand-navy to-brand-navy-deep py-3 md:py-3.5">
          <div className="relative mx-auto flex max-w-[1550px] items-center gap-2.5 px-3 min-[400px]:gap-3 min-[400px]:px-4 md:gap-6 md:px-8">
            <Link
              href="/"
              aria-label="Mobile Hat Home"
              className="order-1 flex shrink-0 items-center gap-2 min-[400px]:gap-2.5 md:gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Image src="/icon.svg" alt="" width={64} height={64} className="h-7 w-7 object-contain md:h-8 md:w-8" unoptimized priority />
              </span>
              <span className="hidden min-[360px]:flex shrink-0 flex-col leading-tight">
                <span className="whitespace-nowrap text-[13px] font-bold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] md:text-[16px] md:font-semibold">
                  Mobile Hat
                </span>
                <span className="whitespace-nowrap text-[11px] font-medium text-brand-yellow-bright/95 md:text-[13px] md:font-normal md:text-brand-yellow-bright/90">
                  Gadgets & accessories
                </span>
              </span>
            </Link>

            <div ref={searchContainerRef} className="relative order-2 min-w-0 flex-1 md:order-2">
              <form
                onSubmit={handleSearchSubmit}
                className="flex h-10 w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-white/25 bg-white shadow-sm md:h-11 md:border md:border-slate-200 md:shadow-sm md:transition-colors md:focus-within:border-slate-300 md:focus-within:ring-2 md:focus-within:ring-slate-900/[0.06]"
              >
                <div
                  className="hidden shrink-0 items-center justify-center text-slate-400 md:flex md:w-11"
                  aria-hidden
                >
                  <FiSearch className="h-[18px] w-[18px]" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search phones, accessories…"
                  className="h-full min-w-0 flex-1 border-0 bg-white px-3 text-[15px] font-normal text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:ring-0 min-[400px]:px-3.5 md:px-2 md:pr-3 md:text-[15px]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); closeSearchModal(); }}
                    className="shrink-0 bg-white px-2 text-slate-400 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <FiX className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                )}
                <button
                  type="submit"
                  className="flex h-10 w-9 shrink-0 items-center justify-center border-l border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 md:hidden"
                  aria-label="Search"
                >
                  <FiSearch className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </button>
                <button
                  type="submit"
                  className="hidden shrink-0 bg-slate-900 px-4 text-[12px] font-semibold text-white transition-colors hover:bg-slate-800 md:inline-flex md:items-center"
                  aria-label="Search"
                >
                  Search
                </button>
              </form>
              {isSearchOpen && (
                <div className="fixed left-1/2 top-[76px] z-[80] flex max-h-[min(78vh,820px)] w-[calc(100vw-12px)] max-w-[min(1120px,calc(100vw-12px))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl md:top-[4.75rem] md:max-h-[min(76vh,800px)] md:w-[min(1120px,calc(100vw-1.5rem))]">
                  {isSearching ? (
                    <div className="p-12 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-navy"></div></div>
                  ) : searchError ? (
                    <div className="p-6 text-center text-red-500">{searchError}</div>
                  ) : (
                    /* Showroom / Trending View Controller */
                    <>
                      {searchQuery.trim() ? (
                        /* Results View when typing */
                        searchResults.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">No results found for &quot;{searchQuery}&quot;</div>
                        ) : (
                          <div className="flex min-h-0 flex-1 flex-col md:flex-row md:max-h-[min(76vh,800px)]">
                            <div className="w-full shrink-0 border-b border-gray-100 bg-gray-50 p-3 md:w-52 md:border-b-0 md:border-r md:p-4 md:overflow-y-auto no-scrollbar">
                              <div className="flex gap-1.5 overflow-x-auto pb-1 min-w-0 md:flex-col md:space-y-1.5 md:overflow-x-visible md:pb-0">
                                <button onClick={() => setActiveSearchCategory('all')} className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-left text-[13px] transition-all md:w-full md:rounded-md md:px-3 md:py-2.5 md:text-sm ${activeSearchCategory === 'all' ? 'bg-white font-bold text-brand-navy shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>All ({searchResults.length})</button>
                                {searchCategories.map(cat => (
                                  <button key={cat} onClick={() => setActiveSearchCategory(cat)} className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-left text-[13px] transition-all md:w-full md:rounded-md md:px-3 md:py-2.5 md:text-sm ${activeSearchCategory === cat ? 'bg-white font-bold text-brand-navy shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>{cat}</button>
                                ))}
                              </div>
                            </div>
                            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-3 md:p-5">
                              <div className="hidden md:grid md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] md:gap-4 lg:gap-5">
                                {filteredSearchResults.map(product => (
                                  <div key={product.id} className="min-w-0" onClick={closeSearchModal}>
                                    <ProductCard product={product} />
                                  </div>
                                ))}
                              </div>

                              <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredSearchResults.map(product => (
                                  <Link
                                    key={product.id}
                                    href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                                    onClick={closeSearchModal}
                                    className="group flex flex-row items-center gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
                                  >
                                    <div className="w-16 h-16 relative bg-white border border-gray-100 rounded-lg shrink-0 overflow-hidden">
                                      <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2 hover:scale-110 transition-transform duration-300" unoptimized />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-brand-navy transition-colors">
                                        {product.name}
                                      </h4>
                                      <p className="text-base font-extrabold text-gray-900">{product.price}</p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        /* Trending View when search bar is focused but empty */
                        <div className="flex min-h-0 max-h-[min(78vh,820px)] flex-col divide-y divide-gray-100 md:max-h-[min(76vh,800px)] md:flex-row md:divide-x md:divide-y-0">
                          {/* Left: Trending Keywords */}
                          <div className="w-full shrink-0 bg-gray-50/50 p-4 md:w-56 md:p-6 lg:w-64">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-1">Trending Search</h3>
                            <div className="flex flex-wrap md:flex-col gap-2 md:gap-3">
                              {trendingSearches.map((term) => (
                                <button
                                  key={term}
                                  onClick={() => {
                                    setSearchQuery(term);
                                    runSearch(term);
                                  }}
                                  className="text-[13px] md:text-[14px] font-bold text-gray-700 hover:text-brand-navy bg-white md:bg-transparent border border-gray-200 md:border-0 px-4 py-2 md:p-0 rounded-full md:rounded-none flex items-center gap-2 group transition-all text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"></span>
                                  {term}
                                </button>
                              ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-200 hidden md:block">
                              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Quick Links</p>
                              <div className="space-y-4">
                                <Link href="/offers" onClick={closeSearchModal} className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-brand-navy transition-colors">
                                  <FiZap className="text-brand-yellow" /> Flash Sales
                                </Link>
                                <Link href="/track-order" onClick={closeSearchModal} className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-brand-navy transition-colors">
                                  <FiTruck className="text-brand-yellow" /> Track Order
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Right: Trending Products Grid */}
                          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-5">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Trending Products</h3>
                                <Link href="/" onClick={closeSearchModal} className="text-[11px] font-black uppercase tracking-widest text-brand-navy hover:underline">View Shop</Link>
                            </div>

                            {isFetchingTrending ? (
                              <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy"></div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4 lg:gap-5">
                                {trendingProducts.map(product => (
                                  <div key={product.id} className="min-w-0" onClick={closeSearchModal}>
                                    <ProductCard product={product} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="order-3 flex shrink-0 items-center gap-2 md:order-3">
              <div className="hidden items-center gap-0.5 md:flex">
                <Link
                  href="/offers"
                  className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <FiZap className="h-5 w-5 shrink-0 text-white" strokeWidth={2.25} />
                  <span className="hidden lg:inline">Offers</span>
                </Link>

                <span className="mx-0.5 hidden h-6 w-px bg-white/25 lg:block" aria-hidden />

                <Link
                  href="/wishlist"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
                  aria-label="Wishlist"
                >
                  <FiHeart className="h-5 w-5" strokeWidth={2.25} />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-yellow px-0.5 text-[9px] font-bold text-brand-navy">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/compare"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
                  aria-label="Compare"
                >
                  <FiCopy className="h-5 w-5" strokeWidth={2.25} />
                </Link>

                <button
                  type="button"
                  onClick={openCart}
                  className="relative inline-flex h-10 items-center gap-2 rounded-lg px-2 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
                  aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
                >
                  <FiShoppingCart className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                  <span className="hidden lg:inline text-white">{cartCount > 0 ? `Cart (${cartCount})` : 'Cart'}</span>
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-yellow px-0.5 text-[9px] font-bold text-brand-navy lg:hidden">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleUserClick}
                  className="ml-0.5 inline-flex h-10 items-center gap-2 rounded-lg border border-white/35 bg-white/10 px-3 text-[13px] font-semibold text-white backdrop-blur-[2px] transition-colors hover:bg-white/15"
                  aria-label={user ? 'Profile' : 'Login'}
                >
                  <FiUser className="h-5 w-5 shrink-0 text-white" strokeWidth={2.25} />
                  <span className="hidden xl:inline">{user ? 'Account' : 'Sign in'}</span>
                </button>
              </div>

              {/* Mobile — plain hamburger (no frame / bg) */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="shrink-0 p-2 text-white opacity-95 transition-opacity hover:opacity-100 md:hidden"
                aria-label="Open menu"
              >
                <FiMenu className="h-6 w-6" strokeWidth={2.25} />
              </button>
            </div>
          </div>

        </div>

        {/* Category rail — desktop: light, typographic (matches retail “pro” patterns) */}
        <div className="relative z-40 hidden border-t border-slate-200/90 bg-slate-50/90 md:block">
          <div className="mx-auto flex max-w-[1550px] flex-wrap items-center gap-2 px-4 py-2 md:px-8 lg:flex-nowrap lg:gap-4 lg:py-2.5">

            <div className="relative shrink-0">
              <div
                className="group relative inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 lg:px-3 lg:py-2"
                onMouseEnter={() => openAllMenu(displayCategories?.[0] ?? null)}
                onMouseLeave={scheduleCloseAllMenu}
              >
                <FiMenu size={16} strokeWidth={2} className="text-slate-500" />
                <span className="text-[12px] font-medium lg:text-[13px]">Categories</span>

                <div
                  className={`mega-split-shell absolute left-0 top-full z-50 w-[min(1080px,calc(100vw-1.5rem))] pt-2 ${
                    allMenuCategory ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'
                  } transition-opacity duration-150`}
                  onMouseEnter={() => {
                    if (allMenuTimeoutRef.current) {
                      clearTimeout(allMenuTimeoutRef.current);
                      allMenuTimeoutRef.current = null;
                    }
                  }}
                  onMouseLeave={scheduleCloseAllMenu}
                >
                  <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                      <p className="text-[12px] font-medium text-slate-600">Shop by department</p>
                      <Link
                        href={`/category/${allMenuCategory?.slug || allMenuCategory?.name?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                        className="text-[12px] font-medium text-slate-900 underline-offset-4 hover:underline"
                      >
                        View category
                      </Link>
                    </div>

                    <div className="flex max-h-[min(62vh,640px)]">
                      <div className="w-[min(220px,32vw)] shrink-0 overflow-y-auto border-r border-slate-100 bg-white p-2">
                        {displayCategories.map((cat, idx) => {
                          const isActive =
                            (allMenuCategory?.id || allMenuCategory?.category_id || allMenuCategory?.name) ===
                            (cat.id || cat.category_id || cat.name);
                          return (
                            <button
                              key={cat.id || idx}
                              type="button"
                              onMouseEnter={() => openAllMenu(cat)}
                              className={`mb-0.5 flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[13px] transition ${
                                isActive
                                  ? 'bg-slate-100 font-medium text-slate-900'
                                  : 'font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              <span className="truncate">{cat.name}</span>
                              {cat.sub_category && cat.sub_category.length > 0 && (
                                <FiChevronRight size={14} className={`shrink-0 ${isActive ? 'text-slate-500' : 'text-slate-300'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="min-w-0 flex-1 overflow-y-auto bg-slate-50/50 p-4">
                        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                          <p className="text-base font-semibold tracking-tight text-slate-900">{allMenuCategory?.name}</p>
                          <Link
                            href={`/category/${allMenuCategory?.slug || allMenuCategory?.name?.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-[12px] font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
                          >
                            See all products
                          </Link>
                        </div>

                        {(() => {
                          const catId = allMenuCategory?.category_id || allMenuCategory?.id;
                          const brands = getBrandsForCategory(catId);
                          if (brands.length === 0) {
                            if (isFetchingBrands) {
                              return (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                  {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="aspect-[5/4] rounded-lg bg-white animate-pulse ring-1 ring-slate-200/80" style={{ animationDelay: `${i * 80}ms` }} />
                                  ))}
                                </div>
                              );
                            }
                            return (
                              <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-14 text-[14px] text-slate-500">
                                No brands listed for this category yet
                              </div>
                            );
                          }
                          const catSlug = allMenuCategory?.slug || allMenuCategory?.name?.toLowerCase().replace(/\s+/g, '-');
                          return (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                              {brands.map((brand, bIdx) => (
                                <Link
                                  key={brand.name}
                                  href={`/category/${catSlug}?brand=${encodeURIComponent(brand.name)}`}
                                  className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200/90 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                                  style={{ animationDelay: `${bIdx * 25}ms` }}
                                >
                                  {brand.image ? (
                                    <div className="flex h-14 w-full items-center justify-center overflow-hidden rounded-md bg-slate-50">
                                      <Image src={brand.image} alt={brand.name} width={120} height={56} className="max-h-full max-w-full object-contain" unoptimized />
                                    </div>
                                  ) : (
                                    <div className="flex h-14 w-full items-center justify-center rounded-md bg-slate-100 text-xl font-semibold text-slate-400">
                                      {brand.name.charAt(0)}
                                    </div>
                                  )}
                                  <span className="text-center text-[11px] font-medium leading-tight text-slate-600 group-hover:text-slate-900">{brand.name}</span>
                                </Link>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nav className="no-scrollbar flex min-h-9 flex-1 items-center gap-0.5 overflow-x-auto py-0.5 lg:min-h-10 lg:gap-1">
              <div className="flex min-w-0 items-center gap-0.5 lg:gap-1">
                {displayCategories.map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    className="relative shrink-0"
                    onMouseEnter={() => openMegaMenu(idx)}
                    onMouseLeave={scheduleCloseMegaMenu}
                  >
                    <Link
                      href={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] transition lg:gap-1.5 lg:px-2.5 lg:py-2 lg:text-[13px] ${
                        hoverCategoryIndex === idx
                          ? 'bg-white font-medium text-slate-900 shadow-sm ring-1 ring-slate-200/90'
                          : 'font-normal text-slate-600 hover:bg-white/80 hover:text-slate-900'
                      }`}
                    >
                      <span className="opacity-70 grayscale contrast-[0.9]">{getCategoryIcon(cat.name || cat.category_name)}</span>
                      <span>{cat.name || cat.category_name}</span>
                    </Link>
                    {hoverCategoryIndex === idx && (
                      <div
                        className="flyout-submenu absolute left-0 top-full z-50 w-[min(288px,calc(100vw-1.5rem))] pt-1.5"
                        onMouseEnter={() => openMegaMenu(idx)}
                        onMouseLeave={scheduleCloseMegaMenu}
                      >
                        <div className="overflow-hidden rounded-lg border border-slate-200/90 bg-white text-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                          <div className="border-b border-slate-100 px-3 py-2">
                            <p className="text-[12px] font-medium text-slate-900">{cat.name || cat.category_name}</p>
                            <p className="text-[11px] text-slate-500">Subcategories</p>
                          </div>

                          {(() => {
                            const catSlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
                            const subcategories = Array.isArray(cat?.sub_category) ? cat.sub_category : [];

                            if (subcategories.length === 0) {
                              return (
                                <div className="px-4 py-5 text-center">
                                  <p className="text-[13px] text-slate-500">No subcategories</p>
                                  <Link
                                    href={`/category/${catSlug}`}
                                    className="mt-2 inline-block text-[12px] font-medium text-slate-900 underline-offset-4 hover:underline"
                                  >
                                    Browse category
                                  </Link>
                                </div>
                              );
                            }

                            return (
                              <div className="max-h-[min(300px,48vh)] overflow-y-auto py-0.5">
                                {subcategories.map((subcat, sIdx) => (
                                  <Link
                                    key={subcat.id || subcat.name}
                                    href={`/category/${catSlug}?subcategory_id=${subcat.id}`}
                                    className="group flex items-center justify-between gap-2 px-3 py-2 text-[13px] text-slate-700 transition hover:bg-slate-50"
                                    style={{ animationDelay: `${sIdx * 12}ms` }}
                                  >
                                    <span className="text-left leading-snug">{subcat.name}</span>
                                    <FiChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" aria-hidden />
                                  </Link>
                                ))}
                                <div className="border-t border-slate-100 bg-slate-50/80 px-3 py-2">
                                  <Link
                                    href={`/category/${catSlug}`}
                                    className="text-[12px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
                                  >
                                    View all in this category
                                  </Link>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            <div className="ml-auto flex shrink-0 items-center">
              <Link
                href="/special-offers"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 lg:px-3.5 lg:py-2"
              >
                <FiZap className="h-3.5 w-3.5 text-amber-600/90" strokeWidth={2} />
                <span>Deals</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-[3px] md:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-[70] flex w-[min(100vw-0.75rem,20.5rem)] max-w-[min(100vw-0.75rem,20.5rem)] flex-col overflow-hidden rounded-r-2xl border border-slate-200/80 bg-white shadow-[8px_0_40px_rgba(15,23,42,0.15)] transition-transform duration-300 ease-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative shrink-0 border-b border-white/10 bg-gradient-to-b from-brand-navy to-brand-navy-deep px-4 pb-4 pt-[max(0.875rem,env(safe-area-inset-top))]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                <Image src="/icon.svg" alt="" width={48} height={48} className="h-8 w-8 object-contain" unoptimized />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[15px] font-semibold text-white">Mobile Hat</p>
                <p className="truncate text-[12px] text-brand-yellow-bright/90">Browse categories and brands</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeSidebar}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
              aria-label="Close menu"
            >
              <FiX className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50">
          <div className="space-y-5 px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <section>
              <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Shop by category</h2>
              <div className="space-y-2">
                {displayCategories.map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm"
                  >
                    <div className="flex min-h-[52px] items-stretch">
                      <Link
                        href={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={closeSidebar}
                        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left text-[14px] font-medium text-slate-800 active:bg-slate-50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-100">
                          <Image
                            src={(cat.image || cat.image_path || cat.image_url || '/no-image.svg').toString().trim()}
                            alt=""
                            width={22}
                            height={22}
                            className="h-[22px] w-[22px] object-contain"
                            unoptimized
                          />
                        </span>
                        <span className="truncate">{cat.name || cat.category_name}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMobileCategory(cat.id || idx);
                        }}
                        className="flex w-12 shrink-0 items-center justify-center border-l border-slate-100 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        aria-expanded={expandedMobileCategory === (cat.id || idx)}
                        aria-label={`Brands in ${cat.name || cat.category_name}`}
                      >
                        <FiChevronRight
                          size={18}
                          className={`transition-transform ${expandedMobileCategory === (cat.id || idx) ? 'rotate-90' : ''}`}
                        />
                      </button>
                    </div>

                    {expandedMobileCategory === (cat.id || idx) && (
                      <div className="border-t border-slate-100 bg-slate-50/90 px-2 py-2">
                        {(() => {
                          const catId = cat.category_id || cat.id;
                          const brands = getBrandsForCategory(catId);
                          const catSlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
                          if (brands.length === 0) {
                            return isFetchingBrands ? (
                              <p className="px-2 py-3 text-center text-[12px] text-slate-500">Loading brands…</p>
                            ) : (
                              <p className="px-2 py-3 text-center text-[12px] text-slate-500">No brands listed yet</p>
                            );
                          }
                          return (
                            <ul className="flex max-h-56 flex-col gap-0.5 overflow-y-auto">
                              {brands.map((brand) => (
                                <li key={brand.name}>
                                  <Link
                                    href={`/category/${catSlug}?brand=${encodeURIComponent(brand.name)}`}
                                    onClick={closeSidebar}
                                    className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-[13px] text-slate-700 transition-colors hover:bg-white hover:text-slate-900"
                                  >
                                    {brand.image ? (
                                      <Image
                                        src={brand.image}
                                        alt=""
                                        width={24}
                                        height={24}
                                        className="h-6 w-6 shrink-0 rounded-md bg-white object-contain ring-1 ring-slate-200/80"
                                        unoptimized
                                      />
                                    ) : (
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-200 text-[10px] font-bold text-slate-600">
                                        {brand.name.charAt(0)}
                                      </span>
                                    )}
                                    <span className="min-w-0 truncate">{brand.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quick links</h2>
              <nav className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                {[
                  { href: '/track-order', icon: FiTruck, label: 'Track order' },
                  { href: '/compare', icon: FiCopy, label: 'Compare' },
                  { href: '/wishlist', icon: FiHeart, label: `Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}` },
                  { href: '/special-offers', icon: FiZap, label: 'Deals & offers' },
                  { href: '/blogs', icon: FiFileText, label: 'Blog' },
                  { href: '/emi-policy', icon: FiCreditCard, label: 'EMI policy' },
                  { href: '/about', icon: FiInfo, label: 'About' },
                  { href: '/contact', icon: FiHeadphones, label: 'Contact' },
                ].map(({ href, icon: Icon, label }, i, arr) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-3 py-3 text-[14px] font-medium text-slate-800 transition-colors hover:bg-slate-50 active:bg-slate-100 ${
                      i < arr.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    {label}
                  </Link>
                ))}
              </nav>
            </section>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => {
              closeSidebar();
              handleUserClick();
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-[13px] font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <FiUser className="h-4 w-4 text-slate-600" strokeWidth={2.25} />
            {user ? 'Account' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={() => {
              closeSidebar();
              openCart();
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-navy to-brand-navy-deep py-3.5 text-[13px] font-semibold text-white shadow-md shadow-brand-navy/20 transition-opacity hover:opacity-95 active:opacity-90"
          >
            <FiShoppingCart className="h-4 w-4" strokeWidth={2.25} />
            Cart
          </button>
        </div>
      </div>
      <style jsx>{`
        .flyout-submenu {
          animation: flyoutIn 0.22s ease-out;
          transform-origin: top left;
          will-change: transform, opacity;
        }

        .mega-split-shell {
          animation: megaReveal 0.18s ease-out;
          transform-origin: top left;
        }

        @keyframes flyoutIn {
          from {
            opacity: 0;
            transform: translateY(-6px) translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes megaReveal {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
