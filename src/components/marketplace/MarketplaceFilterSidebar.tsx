'use client'

import { useState, useEffect } from 'react'
import { ProductCategory, ProductCondition } from '@/types/marketplace'
import { useDebounce } from '@/hooks/useDebounce'

export interface FilterState {
  category: ProductCategory
  searchQuery: string
  minPrice: number
  maxPrice: number
  conditions: ProductCondition[]
  minTrustScore: number
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating'
}

interface MarketplaceFilterSidebarProps {
  filters: FilterState
  mobileOpen?: boolean
  onMobileClose?: () => void
  onChange: (newFilters: FilterState) => void
  onReset: () => void
}

const CATEGORIES: ProductCategory[] = [
  'All',
  'Laptops & MacBooks',
  'Smartphones & Tablets',
  'Solar & Clean Energy',
  'Audio & Consoles',
]

const CONDITIONS: ProductCondition[] = [
  'Brand New',
  'Refurbished - Excellent',
  'Refurbished - Good',
  'Pre-Owned',
]

export function MarketplaceFilterSidebar({
  filters,
  mobileOpen = false,
  onMobileClose,
  onChange,
  onReset,
}: MarketplaceFilterSidebarProps) {
  // Local search state for 500ms debouncing
  const [searchInput, setSearchInput] = useState(filters.searchQuery)
  const debouncedSearch = useDebounce(searchInput, 500)

  // Sync debounced search to parent filter state
  useEffect(() => {
    if (debouncedSearch !== filters.searchQuery) {
      onChange({ ...filters, searchQuery: debouncedSearch })
    }
  }, [debouncedSearch])

  // Sync external search updates (e.g. from URL load) to local input
  useEffect(() => {
    setSearchInput(filters.searchQuery)
  }, [filters.searchQuery])

  const handleCategoryChange = (category: ProductCategory) => {
    onChange({ ...filters, category })
  }

  const handlePriceChange = (maxPrice: number) => {
    onChange({ ...filters, maxPrice })
  }

  const handleConditionToggle = (condition: ProductCondition) => {
    const nextConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter((c) => c !== condition)
      : [...filters.conditions, condition]
    onChange({ ...filters, conditions: nextConditions })
  }

  const handleTrustScoreChange = (minTrustScore: number) => {
    onChange({ ...filters, minTrustScore })
  }

  return (
    <aside className="hb-filter-sidebar-wrapper">
      {/* Mobile Backdrop Overlay (< 768px) */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1200,
          }}
          onClick={onMobileClose}
        />
      )}

      {/* Main Filter Sidebar Container */}
      <div
        className={`hb-filter-sidebar ${mobileOpen ? 'hb-drawer-open' : ''}`}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--ink-12)',
          borderRadius: 'var(--radius-card)',
          padding: 20,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
        }}
      >
        {/* Sidebar Header & Close / Reset */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ink-12)', paddingBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>
            Filter Electronics
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              onClick={onReset}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--growth)',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>

            {/* Close Button on Mobile Drawer */}
            {mobileOpen && (
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close Filters"
                style={{
                  background: 'var(--bg-sunken)',
                  border: '1px solid var(--ink-12)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  fontSize: 14,
                  cursor: 'pointer',
                  color: 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 1. Debounced Search Input (500ms) */}
        <div>
          <label htmlFor="debounced-search" style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-60)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Search (500ms debounce)
          </label>
          <input
            id="debounced-search"
            type="text"
            placeholder="Specs, model, brand..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--ink-12)',
              background: 'var(--bg-sunken)',
              color: 'var(--ink)',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>

        {/* 2. Category Selection */}
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-60)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Category
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-input)',
                  border: filters.category === cat ? '1.5px solid var(--solar)' : '1px solid var(--ink-12)',
                  background: filters.category === cat ? 'var(--solar-12)' : 'transparent',
                  color: 'var(--ink)',
                  fontSize: 12.5,
                  fontWeight: filters.category === cat ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{cat}</span>
                {filters.category === cat && <span style={{ fontSize: 11, color: 'var(--solar)', fontWeight: 800 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Price Range Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Max Price
            </span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>
              ${filters.maxPrice.toLocaleString()} USD
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={3500}
            step={50}
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--solar)', cursor: 'pointer' }}
          />
        </div>

        {/* 4. Condition Checkboxes */}
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-60)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Condition
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CONDITIONS.map((cond) => {
              const checked = filters.conditions.includes(cond)
              return (
                <label
                  key={cond}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12.5,
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleConditionToggle(cond)}
                    style={{ accentColor: 'var(--growth)' }}
                  />
                  <span>{cond}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* 5. Minimum Seller Trust Score */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Min Trust Score
            </span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, fontWeight: 700, color: 'var(--growth)' }}>
              {filters.minTrustScore === 0 ? 'All Ratings' : `≥ ${(filters.minTrustScore / 20).toFixed(1)} ★`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.minTrustScore}
            onChange={(e) => handleTrustScoreChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--growth)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </aside>
  )
}
