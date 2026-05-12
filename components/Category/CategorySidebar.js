"use client";

import { useEffect, useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX, FiPlus } from 'react-icons/fi';

function normalizeKey(label) {
    return String(label || '').toLowerCase().replace(/\s+/g, '_');
}

function FilterSection({
    sectionKey,
    title,
    options = [],
    selectedValues = [],
    onToggleValue,
    isExpanded,
    onToggleExpand,
    searchable = true,
}) {
    const [query, setQuery] = useState('');
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        setShowAll(false);
        setQuery('');
    }, [sectionKey]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((opt) => String(opt).toLowerCase().includes(q));
    }, [query, options]);

    const visible = showAll ? filtered : filtered.slice(0, 5);
    const hasMore = filtered.length > 5;

    if (!Array.isArray(options) || options.length === 0) return null;

    return (
        <div className="border-b border-brand-gray-border/80 pb-5 last:border-b-0 last:pb-0">
            <button
                onClick={onToggleExpand}
                className="mb-3 flex w-full items-center justify-between text-left"
            >
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-navy">{title}</span>
                {isExpanded ? <FiChevronUp className="text-brand-muted" size={18} /> : <FiChevronDown className="text-brand-muted" size={18} />}
            </button>

            {isExpanded && (
                <div className="space-y-3">
                    {searchable && (
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Search ${title}`}
                            className="h-9 w-full rounded-full border border-brand-gray-border bg-brand-paper px-4 text-sm text-brand-navy outline-none transition-shadow focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
                        />
                    )}

                    <div className="space-y-2">
                        {visible.map((opt) => (
                            <label key={`${sectionKey}-${opt}`} className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(opt)}
                                    onChange={() => onToggleValue(opt)}
                                    className="h-4 w-4 rounded border-brand-gray-border text-brand-navy focus:ring-brand-navy"
                                />
                                <span className="text-sm font-medium text-brand-navy/90">{opt}</span>
                            </label>
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            type="button"
                            onClick={() => setShowAll((prev) => !prev)}
                            className="inline-flex items-center gap-1 text-sm font-bold text-brand-navy hover:text-brand-yellow-bright"
                        >
                            <FiPlus />
                            {showAll ? 'Less' : 'More'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function CategorySidebar({
    isOpen,
    onClose,
    derivedFilters = { storageList: [], regionList: [], colorList: [], extraFilterSections: [] },
    globalMinPrice = 0,
    globalMaxPrice = 1000000,
    selectedPrice,
    setSelectedPrice,
    selectedStorage,
    setSelectedStorage,
    selectedRegion,
    setSelectedRegion,
    selectedColor,
    setSelectedColor,
    selectedAvailability,
    setSelectedAvailability,
    selectedExtraFilters = {},
    setSelectedExtraFilters
}) {
    const [expandedSections, setExpandedSections] = useState({
        price_range: true,
        storage: true,
        model: true,
        type: true,
        warranty: true,
        sim: true,
        plug: true,
        network: true,
        qty: true,
        keyboard: true,
        region: true,
        color: true,
        availability: true,
    });

    const toggleSection = (key) => {
        setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isSectionExpanded = (key) => {
        const normalized = normalizeKey(key);
        return expandedSections[normalized] ?? true;
    };

    const toggleListValue = (value, list, setList) => {
        if (list.includes(value)) {
            setList(list.filter((v) => v !== value));
        } else {
            setList([...list, value]);
        }
    };

    const handleExtraFilterToggle = (key, value) => {
        const current = Array.isArray(selectedExtraFilters[key]) ? selectedExtraFilters[key] : [];
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];

        setSelectedExtraFilters((prev) => ({
            ...prev,
            [key]: next,
        }));
    };

    const handleReset = () => {
        setSelectedPrice({ min: '', max: '' });
        setSelectedStorage([]);
        setSelectedRegion([]);
        setSelectedColor([]);
        setSelectedAvailability('All');
        setSelectedExtraFilters({});
    };

    const primaryOrderedSections = [
        { key: 'storage', label: 'Storage', options: derivedFilters.storageList, selected: selectedStorage, onToggle: (v) => toggleListValue(v, selectedStorage, setSelectedStorage), searchable: true },
        { key: 'region', label: 'Region', options: derivedFilters.regionList, selected: selectedRegion, onToggle: (v) => toggleListValue(v, selectedRegion, setSelectedRegion), searchable: true },
    ];

    const postColorSections = (derivedFilters.extraFilterSections || [])
        .filter((section) => !['storage', 'region', 'color', 'availability'].includes(section.key))
        .map((section) => ({
            key: section.key,
            label: section.label,
            options: section.options,
            selected: selectedExtraFilters[section.key] || [],
            onToggle: (v) => handleExtraFilterToggle(section.key, v),
            searchable: true,
        }));

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            <aside
                className={`
                fixed inset-y-0 right-0 z-50 flex w-full max-w-[min(100vw,420px)] flex-col bg-white shadow-[-12px_0_40px_rgba(30,45,74,0.18)]
                transition-transform duration-300 ease-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
                role="dialog"
                aria-modal="true"
                aria-label="Filters"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-brand-gray-border px-4 py-4 md:px-5">
                    <span className="text-base font-black uppercase tracking-[0.12em] text-brand-navy">Refine</span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-full border border-brand-gray-border bg-brand-paper px-3 py-1.5 text-xs font-bold text-brand-navy transition-colors hover:border-brand-yellow"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-2 text-brand-navy transition-colors hover:bg-brand-paper"
                            aria-label="Close filters"
                        >
                            <FiX size={22} />
                        </button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 md:p-5">
                    <div className="border-b border-brand-gray-border/80 pb-5">
                        <button
                            type="button"
                            onClick={() => toggleSection('price_range')}
                            className="mb-3 flex w-full items-center justify-between text-left"
                        >
                            <span className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-navy">Price range</span>
                            {expandedSections.price_range ? <FiChevronUp className="text-brand-muted" size={18} /> : <FiChevronDown className="text-brand-muted" size={18} />}
                        </button>

                        {expandedSections.price_range && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={selectedPrice.min}
                                        placeholder={String(globalMinPrice)}
                                        onChange={(e) => setSelectedPrice({ ...selectedPrice, min: e.target.value })}
                                        className="h-10 w-full rounded-xl border border-brand-gray-border bg-white px-3 text-sm text-brand-navy outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
                                    />
                                    <input
                                        type="number"
                                        value={selectedPrice.max}
                                        placeholder={String(globalMaxPrice)}
                                        onChange={(e) => setSelectedPrice({ ...selectedPrice, max: e.target.value })}
                                        className="h-10 w-full rounded-xl border border-brand-gray-border bg-white px-3 text-sm text-brand-navy outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {primaryOrderedSections.map((section) => (
                        <FilterSection
                            key={section.key}
                            sectionKey={section.key}
                            title={section.label}
                            options={section.options}
                            selectedValues={section.selected}
                            onToggleValue={section.onToggle}
                            isExpanded={isSectionExpanded(section.key)}
                            onToggleExpand={() => toggleSection(normalizeKey(section.key))}
                            searchable={section.searchable !== false}
                        />
                    ))}

                    {/* Color with real swatches */}
                    {(derivedFilters.colorList || []).length > 0 && (
                        <div className="border-b border-brand-gray-border/80 pb-5">
                            <button
                                type="button"
                                onClick={() => toggleSection('color')}
                                className="mb-3 flex w-full items-center justify-between text-left"
                            >
                                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-navy">Color</span>
                                {isSectionExpanded('color') ? <FiChevronUp className="text-brand-muted" size={18} /> : <FiChevronDown className="text-brand-muted" size={18} />}
                            </button>
                            {isSectionExpanded('color') && (
                                <div className="flex flex-wrap gap-3">
                                    {derivedFilters.colorList.map((color) => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => toggleListValue(color.name, selectedColor, setSelectedColor)}
                                            className={`relative h-8 w-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                                                selectedColor.includes(color.name)
                                                    ? 'border-brand-navy ring-2 ring-brand-navy ring-offset-2'
                                                    : 'border-brand-gray-border'
                                            }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {(color.hex === '#ffffff' || color.hex?.toLowerCase() === '#fff') ? (
                                                <span className="absolute inset-0 rounded-full border border-brand-gray-border" />
                                            ) : null}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {postColorSections.map((section) => (
                        <FilterSection
                            key={section.key}
                            sectionKey={section.key}
                            title={section.label}
                            options={section.options}
                            selectedValues={section.selected}
                            onToggleValue={section.onToggle}
                            isExpanded={isSectionExpanded(section.key)}
                            onToggleExpand={() => toggleSection(normalizeKey(section.key))}
                            searchable={section.searchable !== false}
                        />
                    ))}

                    <div className="border-b border-brand-gray-border/80 pb-5 last:border-b-0">
                        <button
                            type="button"
                            onClick={() => toggleSection('availability')}
                            className="mb-3 flex w-full items-center justify-between text-left"
                        >
                            <span className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-navy">Availability</span>
                            {isSectionExpanded('availability') ? <FiChevronUp className="text-brand-muted" size={18} /> : <FiChevronDown className="text-brand-muted" size={18} />}
                        </button>
                        {isSectionExpanded('availability') && (
                            <div className="space-y-2">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="availability"
                                        checked={selectedAvailability === 'All'}
                                        onChange={() => setSelectedAvailability('All')}
                                        className="h-4 w-4 border-brand-gray-border text-brand-navy focus:ring-brand-navy"
                                    />
                                    <span className="text-sm font-medium text-brand-navy/90">All</span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="availability"
                                        checked={selectedAvailability === 'In Stock'}
                                        onChange={() => setSelectedAvailability('In Stock')}
                                        className="h-4 w-4 border-brand-gray-border text-brand-navy focus:ring-brand-navy"
                                    />
                                    <span className="text-sm font-medium text-brand-navy/90">In stock</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 gap-3 border-t border-brand-gray-border bg-brand-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
                    <button type="button" onClick={handleReset} className="flex-1 rounded-xl border border-brand-gray-border py-3 text-sm font-bold text-brand-navy transition-colors hover:border-brand-yellow">
                        Reset
                    </button>
                    <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-brand-navy py-3 text-sm font-bold text-white shadow-lg shadow-brand-navy/25 transition-colors hover:bg-brand-navy-deep">
                        Done
                    </button>
                </div>
            </aside>
        </>
    );
}
