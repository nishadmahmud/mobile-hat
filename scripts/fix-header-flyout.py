# -*- coding: utf-8 -*-
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "components" / "Header" / "Header.js"
text = path.read_text(encoding="utf-8")

# --- imports: add createPortal ---
if "createPortal" not in text:
    text = text.replace(
        'import { useState, useEffect, useMemo, useRef } from \'react\';',
        "import { useState, useEffect, useMemo, useRef } from 'react';\nimport { createPortal } from 'react-dom';",
    )

# --- refs ---
if "categoryItemRefs" not in text:
    text = text.replace(
        "  const hoverTimeoutRef = useRef(null);",
        "  const hoverTimeoutRef = useRef(null);\n  const categoryItemRefs = useRef([]);\n  const [categoryFlyoutLayout, setCategoryFlyoutLayout] = useState(null);\n  const [categoryFlyoutMounted, setCategoryFlyoutMounted] = useState(false);",
    )

# --- replace allowed list with API categories ---
old_cat_block = """  const allowedHeaderCategories = new Set([
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
    : [...baseCategories, { name: "Used Phone", slug: "used-phone" }];"""

new_cat_block = """  const getSubcategories = (cat) => {
    if (!cat) return [];
    if (Array.isArray(cat.sub_category) && cat.sub_category.length > 0) return cat.sub_category;
    if (Array.isArray(cat.subcategories) && cat.subcategories.length > 0) return cat.subcategories;
    if (Array.isArray(cat.sub_categories) && cat.sub_categories.length > 0) return cat.sub_categories;
    return [];
  };

  const enrichCategoryWithSubs = (cat) => {
    const slug = cat.slug || String(cat.name || '').toLowerCase().replace(/\\s+/g, '-');
    const fromProps = (Array.isArray(categories) ? categories : []).find((c) => {
      const propSlug = c.slug || String(c.category_name || c.name || '').toLowerCase().replace(/\\s+/g, '-');
      return propSlug === slug || normalizeCategory(c.category_name || c.name) === normalizeCategory(cat.name);
    });
    const subs = getSubcategories(cat);
    if (subs.length > 0) return { ...cat, sub_category: subs };
    const propSubs = getSubcategories(fromProps);
    return propSubs.length > 0 ? { ...cat, sub_category: propSubs } : cat;
  };

  const HEADER_RAIL_CATEGORY_COUNT = 8;

  const allCategories = (() => {
    const source =
      Array.isArray(liveCategories) && liveCategories.length > 0
        ? liveCategories
        : Array.isArray(categories)
          ? categories
          : [];
    return source.map((cat) => ({
      ...cat,
      name: cat.category_name || cat.name || 'Unknown',
      slug:
        cat.slug ||
        cat.category_slug ||
        String(cat.category_name || cat.name || '')
          .toLowerCase()
          .replace(/\\s+/g, '-'),
      image: (cat.image_path || cat.image_url || cat.image || '/no-image.svg').toString().trim(),
      sub_category: cat.sub_category || cat.subcategories || cat.sub_categories || [],
    }));
  })();

  const displayCategories = allCategories
    .slice(0, HEADER_RAIL_CATEGORY_COUNT)
    .map(enrichCategoryWithSubs);"""

if old_cat_block not in text:
    raise SystemExit("category block not found")
text = text.replace(old_cat_block, new_cat_block)

# --- mega menu handlers ---
old_open = """  const openMegaMenu = (idx) => {
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
    setAllMenuCategory(cat);"""

new_open = """  const updateCategoryFlyoutLayout = (idx, el) => {
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const alignEnd = idx >= displayCategories.length - 2;
    setCategoryFlyoutLayout({
      top: rect.bottom + 6,
      left: alignEnd ? undefined : Math.max(8, rect.left),
      right: alignEnd ? Math.max(8, window.innerWidth - rect.right) : undefined,
    });
  };

  const openMegaMenu = (idx, el) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (allMenuTimeoutRef.current) {
      clearTimeout(allMenuTimeoutRef.current);
      allMenuTimeoutRef.current = null;
    }
    setAllMenuCategory(null);
    setHoverCategoryIndex(idx);
    const anchor = el || categoryItemRefs.current[idx];
    if (anchor) updateCategoryFlyoutLayout(idx, anchor);
  };

  const scheduleCloseMegaMenu = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverCategoryIndex(null);
      setCategoryFlyoutLayout(null);
    }, 280);
  };

  const cancelCloseMegaMenu = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    setCategoryFlyoutMounted(true);
  }, []);

  useEffect(() => {
    if (hoverCategoryIndex === null) return undefined;
    const reflow = () => {
      const el = categoryItemRefs.current[hoverCategoryIndex];
      if (el) updateCategoryFlyoutLayout(hoverCategoryIndex, el);
    };
    window.addEventListener('resize', reflow);
    window.addEventListener('scroll', reflow, true);
    return () => {
      window.removeEventListener('resize', reflow);
      window.removeEventListener('scroll', reflow, true);
    };
  }, [hoverCategoryIndex, displayCategories.length]);

  const openAllMenu = (cat) => {
    if (allMenuTimeoutRef.current) {
      clearTimeout(allMenuTimeoutRef.current);
      allMenuTimeoutRef.current = null;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoverCategoryIndex(null);
    setCategoryFlyoutLayout(null);
    setAllMenuCategory(cat);"""

if old_open not in text:
    raise SystemExit("openMegaMenu block not found")
text = text.replace(old_open, new_open)

# --- category rail: add overflow visible + mouse leave on rail only ---
text = text.replace(
    'className="relative z-40 hidden border-t border-slate-200/90 bg-slate-50/90 md:block"',
    'className="relative z-40 hidden overflow-visible border-t border-slate-200/90 bg-slate-50/90 md:block"',
    1,
)

# Find category rail div and add onMouseLeave if missing on outer rail
marker = '        {/* Category rail'
idx = text.find(marker)
if idx == -1:
    raise SystemExit("category rail marker not found")

# --- replace nav + items block ---
start = text.find('            <div className="flex min-h-9 min-w-0 flex-1 items-center justify-center py-0.5 lg:min-h-10">')
end = text.find('            <motion.div className="flex shrink-0 items-center">', start)
if end == -1:
    end = text.find('            <div className="flex shrink-0 items-center">', start)
if start == -1 or end == -1:
    raise SystemExit(f"nav block not found start={start} end={end}")

new_nav = '''            <motion.div className="flex min-h-9 min-w-0 flex-1 items-center justify-center overflow-visible py-0.5 lg:min-h-10">
              <nav className="no-scrollbar flex w-max max-w-full items-center justify-center overflow-visible lg:gap-1">
                <motion.div className="no-scrollbar flex shrink-0 flex-wrap items-center justify-center gap-0.5 overflow-visible lg:gap-1">
                {displayCategories.map((cat, idx) => {
                  const catSlug = cat.slug || cat.name?.toLowerCase().replace(/\\s+/g, '-');
                  return (
                  <motion.div
                    key={cat.id || cat.category_id || idx}
                    ref={(el) => {
                      categoryItemRefs.current[idx] = el;
                    }}
                    className="relative shrink-0"
                    onMouseEnter={(e) => openMegaMenu(idx, e.currentTarget)}
                  >
                    <Link
                      href={`/category/${catSlug}`}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] transition lg:gap-1.5 lg:px-2.5 lg:py-2 lg:text-[13px] ${
                        hoverCategoryIndex === idx
                          ? 'bg-white font-medium text-slate-900 shadow-sm ring-1 ring-slate-200/90'
                          : 'font-normal text-slate-600 hover:bg-white/80 hover:text-slate-900'
                      }`}
                    >
                      <span className="opacity-70 grayscale contrast-[0.9]">{getCategoryIcon(cat.name || cat.category_name)}</span>
                      <span>{cat.name || cat.category_name}</span>
                    </Link>
                  </motion.div>
                  );
                })}
                </motion.div>
              </nav>
            </motion.div>

'''.replace('motion.div', 'motion.div')

new_nav = new_nav.replace('motion.div', 'div')

text = text[:start] + new_nav + text[end:]

# --- portal flyout before closing header ---
portal_marker = "      </header>"
if "categoryFlyoutMounted && hoverCategoryIndex" in text:
    print("portal already present")
else:
    portal = """
      {categoryFlyoutMounted &&
        hoverCategoryIndex !== null &&
        categoryFlyoutLayout &&
        createPortal(
          (() => {
            const cat = displayCategories[hoverCategoryIndex];
            if (!cat) return null;
            const catSlug = cat.slug || cat.name?.toLowerCase().replace(/\\s+/g, '-');
            const subcategories = getSubcategories(cat);
            return (
              <motion.div
                className="flyout-submenu fixed z-[200] w-[min(240px,calc(100vw-1.5rem))]"
                style={{
                  top: categoryFlyoutLayout.top,
                  left: categoryFlyoutLayout.left,
                  right: categoryFlyoutLayout.right,
                }}
                onMouseEnter={cancelCloseMegaMenu}
                onMouseLeave={scheduleCloseMegaMenu}
              >
                <motion.div className="overflow-hidden rounded-lg border border-slate-200/90 bg-white text-slate-800 shadow-[0_12px_36px_rgba(15,23,42,0.12)]">
                  <motion.div className="border-b border-slate-100 bg-slate-50/80 px-3 py-2">
                    <p className="text-[12px] font-semibold text-slate-900">{cat.name || cat.category_name}</p>
                    <p className="text-[10px] text-slate-500">Subcategories</p>
                  </motion.div>
                  {subcategories.length > 0 ? (
                    <ul className="max-h-[min(240px,40vh)] overflow-y-auto py-0.5">
                      {subcategories.map((subcat) => (
                        <li key={subcat.id || subcat.name}>
                          <Link
                            href={`/category/${catSlug}?subcategory_id=${subcat.id}`}
                            className="group flex items-center justify-between gap-2 px-3 py-2 text-[13px] text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                          >
                            <span className="truncate text-left leading-snug">{subcat.name}</span>
                            <FiChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-slate-500" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <motion.div className="px-3 py-4 text-center">
                      <p className="text-[12px] text-slate-500">No subcategories</p>
                      <Link
                        href={`/category/${catSlug}`}
                        className="mt-2 inline-block text-[12px] font-medium text-slate-900 underline-offset-4 hover:underline"
                      >
                        Browse category
                      </Link>
                    </motion.div>
                  )}
                  <motion.div className="border-t border-slate-100 bg-slate-50/80 px-3 py-2">
                    <Link
                      href={`/category/${catSlug}`}
                      className="text-[11px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
                    >
                      View all in this category
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })(),
          document.body
        )}

"""
    portal = portal.replace('motion.div', 'div')
    text = text.replace(portal_marker, portal + portal_marker, 1)

# allCategories in Categories mega menu sidebar
text = text.replace(
    "{displayCategories.map((cat, idx) => {\n                          const isActive =",
    "{allCategories.map((cat, idx) => {\n                          const isActive =",
    1,
)

# rail onMouseLeave
rail_start = text.find('        {/* Category rail')
if rail_start != -1:
    chunk = text[rail_start:rail_start + 400]
    if "onMouseLeave={scheduleCloseMegaMenu}" not in chunk:
        text = text.replace(
            'className="relative z-40 hidden overflow-visible border-t border-slate-200/90 bg-slate-50/90 md:block"\n        >',
            'className="relative z-40 hidden overflow-visible border-t border-slate-200/90 bg-slate-50/90 md:block"\n          onMouseLeave={scheduleCloseMegaMenu}\n        >',
            1,
        )

path.write_text(text, encoding="utf-8")
print("Header.js patched OK")
