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
        <div className="border-b border-gray-200 pb-5">
            <button
                onClick={onToggleExpand}
                className="w-full flex items-center justify-between mb-3 text-left"
            >
                <span className="text-[13px] font-bold text-gray-900">{title}</span>
                {isExpanded ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
            </button>

            {isExpanded && (
                <div className="space-y-3">
                    {searchable && (
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Search ${title}`}
                            className="w-full h-9 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-brand-navy"
                        />
                    )}

                    <div className="space-y-2">
                        {visible.map((opt) => (
                            <label key={`${sectionKey}-${opt}`} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(opt)}
                                    onChange={() => onToggleValue(opt)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-navy focus:ring-brand-navy"
                                />
                                <span className="text-sm font-medium text-gray-800">{opt}</span>
                            </label>
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            type="button"
                            onClick={() => setShowAll((prev) => !prev)}
                            className="inline-flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-brand-navy"
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
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:w-full lg:shadow-none lg:border lg:border-gray-200 lg:rounded-xl lg:bg-white
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="text-[18px] font-bold text-gray-900">Filters</span>
                    <div className="flex items-center gap-2">
                        <button onClick={handleReset} className="text-xs font-semibold bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700">
                            Reset
                        </button>
                        <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-5 overflow-y-auto h-[calc(100%-72px)] lg:h-auto lg:max-h-[80vh]">
                    <div className="border-b border-gray-200 pb-5">
                        <button
                            onClick={() => toggleSection('price_range')}
                            className="w-full flex items-center justify-between mb-3 text-left"
                        >
                            <span className="text-[13px] font-bold text-gray-900">Price Range</span>
                            {expandedSections.price_range ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
                        </button>

                        {expandedSections.price_range && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={selectedPrice.min}
                                        placeholder={String(globalMinPrice)}
                                        onChange={(e) => setSelectedPrice({ ...selectedPrice, min: e.target.value })}
                                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-brand-navy"
                                    />
                                    <input
                                        type="number"
                                        value={selectedPrice.max}
                                        placeholder={String(globalMaxPrice)}
                                        onChange={(e) => setSelectedPrice({ ...selectedPrice, max: e.target.value })}
                                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-brand-navy"
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
                        <div className="border-b border-gray-200 pb-5">
                            <button
                                onClick={() => toggleSection('color')}
                                className="w-full flex items-center justify-between mb-3 text-left"
                            >
                                <span className="text-[13px] font-bold text-gray-900">Color</span>
                                {isSectionExpanded('color') ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
                            </button>
                            {isSectionExpanded('color') && (
                                <div className="flex flex-wrap gap-3">
                                    {derivedFilters.colorList.map((color) => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => toggleListValue(color.name, selectedColor, setSelectedColor)}
                                            className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 relative ${
                                                selectedColor.includes(color.name)
                                                    ? 'ring-2 ring-brand-navy ring-offset-2 border-brand-navy'
                                                    : 'border-gray-200'
                                            }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {(color.hex === '#ffffff' || color.hex?.toLowerCase() === '#fff') ? (
                                                <span className="absolute inset-0 rounded-full border border-gray-200"></span>
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

                    <div className="border-b border-gray-200 pb-5">
                        <button
                            onClick={() => toggleSection('availability')}
                            className="w-full flex items-center justify-between mb-3 text-left"
                        >
                            <span className="text-[13px] font-bold text-gray-900">Availability</span>
                            {isSectionExpanded('availability') ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
                        </button>
                        {isSectionExpanded('availability') && (
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="availability"
                                        checked={selectedAvailability === 'All'}
                                        onChange={() => setSelectedAvailability('All')}
                                        className="h-4 w-4 text-brand-navy border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-800">All</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="availability"
                                        checked={selectedAvailability === 'In Stock'}
                                        onChange={() => setSelectedAvailability('In Stock')}
                                        className="h-4 w-4 text-brand-navy border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-800">In Stock</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:hidden p-4 border-t border-gray-100 bg-white flex gap-3 mt-auto">
                    <button onClick={handleReset} className="flex-1 py-3 border border-gray-200 rounded-xl text-brand-navy font-bold text-sm">
                        Reset
                    </button>
                    <button onClick={onClose} className="flex-1 py-3 bg-brand-navy text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-navy/25">
                        Apply Filters
                    </button>
                </div>
            </aside>
        </>
    );
}
