'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { DeviceProduct } from '@/types/marketplace'
import { fetchMarketplaceProductsPage } from '@/services/marketplaceService'
import { DeviceCard } from './DeviceCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import { FilterState } from './MarketplaceFilterSidebar'

interface DeviceGridProps {
  products?: DeviceProduct[]
  filters?: FilterState
  onFilterChange?: (newFilters: FilterState) => void
  onOpenMobileFilters?: () => void
  onSelectProduct?: (product: DeviceProduct) => void
}

const LIMIT = 8

export function DeviceGrid({
  products: initialProducts,
  filters,
  onFilterChange,
  onOpenMobileFilters,
  onSelectProduct,
}: DeviceGridProps) {
  // Local fallback if filters prop is not provided
  const category = filters?.category || 'All'
  const searchQuery = filters?.searchQuery || ''
  const sortBy = filters?.sortBy || 'featured'
  const minPrice = filters?.minPrice || 0
  const maxPrice = filters?.maxPrice || 3500
  const conditions = filters?.conditions || []
  const minTrustScore = filters?.minTrustScore || 0

  // Infinite Scroll State
  const [displayedProducts, setDisplayedProducts] = useState<DeviceProduct[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  // IntersectionObserver Sentinel Ref
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Load initial page (Page 1) or reset when category/search/sort/filters change
  const loadPageOne = useCallback(async () => {
    setIsInitialLoading(true)
    try {
      const res = await fetchMarketplaceProductsPage({
        page: 1,
        limit: LIMIT,
        category,
        searchQuery,
        sortBy,
        minPrice,
        maxPrice,
        conditions,
        minTrustScore,
      })

      // Use initialProducts as fallback if provided on first render with default filters
      const items = initialProducts && category === 'All' && !searchQuery && sortBy === 'featured' && page === 1 && conditions.length === 0
        ? initialProducts.slice(0, LIMIT)
        : res.products

      setDisplayedProducts(items)
      setHasMore(res.hasMore)
      setTotalItems(res.total)
      setPage(1)
    } catch {
      /* ignore */
    } finally {
      setIsInitialLoading(false)
    }
  }, [category, searchQuery, sortBy, minPrice, maxPrice, conditions, minTrustScore, initialProducts])

  useEffect(() => {
    loadPageOne()
  }, [loadPageOne])

  // Fetch Next Page handler (Page 2, 3...)
  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || isInitialLoading || !hasMore) return

    setIsFetchingNextPage(true)
    const nextPage = page + 1

    try {
      const res = await fetchMarketplaceProductsPage({
        page: nextPage,
        limit: LIMIT,
        category,
        searchQuery,
        sortBy,
        minPrice,
        maxPrice,
        conditions,
        minTrustScore,
      })

      // Append new results seamlessly without re-rendering existing items
      setDisplayedProducts((prev) => [...prev, ...res.products])
      setHasMore(res.hasMore)
      setPage(nextPage)
    } catch {
      /* ignore */
    } finally {
      setIsFetchingNextPage(false)
    }
  }, [isFetchingNextPage, isInitialLoading, hasMore, page, category, searchQuery, sortBy, minPrice, maxPrice, conditions, minTrustScore])

  // IntersectionObserver API Setup (Re-activates when isInitialLoading turns false)
  useEffect(() => {
    const sentinelEl = loadMoreRef.current
    if (!sentinelEl || isInitialLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry && firstEntry.isIntersecting && hasMore && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: null,
        rootMargin: '300px', // Trigger 300px before reaching bottom
        threshold: 0,
      }
    )

    observer.observe(sentinelEl)

    return () => {
      observer.unobserve(sentinelEl)
      observer.disconnect()
    }
  }, [fetchNextPage, hasMore, isFetchingNextPage, isInitialLoading])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Product Results Counter & Sort Header Bar with Mobile Filter Icon Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          background: 'var(--surface)',
          border: '1px solid var(--ink-12)',
          borderRadius: 'var(--radius-card)',
          padding: '12px 18px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Mobile Filter Toggle Icon Button (Visible ONLY on small screens < 768px) */}
          {onOpenMobileFilters && (
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="hb-mobile-filter-btn"
              aria-label="Open Filters"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span>Filters</span>
            </button>
          )}

          <span style={{ fontSize: 13.5, color: 'var(--ink-60)' }}>
            Showing <strong style={{ color: 'var(--ink)' }}>{displayedProducts.length}</strong> of{' '}
            <strong style={{ color: 'var(--ink)' }}>{totalItems || displayedProducts.length}</strong> verified devices
            {conditions.length > 0 && <span style={{ marginLeft: 6, color: 'var(--growth)', fontWeight: 600 }}>({conditions.join(', ')})</span>}
          </span>
        </div>

        {/* Sort By Selector */}
        {filters && onFilterChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--ink-12)',
                background: 'var(--bg-sunken)',
                color: 'var(--ink)',
                fontSize: 13,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        )}
      </div>

      {/* RESPONSIVE CSS GRID ARCHITECTURE (4 CARDS PER ROW: grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6) */}
      {isInitialLoading ? (
        /* INITIAL LOAD STATE: Display 8 Skeleton Cards (2 full rows of 4 cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hb-responsive-device-grid" data-testid="initial-skeletons-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={`initial-skel-${idx}`} />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px dashed var(--ink-12)',
            color: 'var(--ink-60)',
          }}
        >
          No devices found matching your search filters. Try adjusting your category or price range.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hb-responsive-device-grid">
          {/* Real Rendered Cards */}
          {displayedProducts.map((product: DeviceProduct) => (
            <DeviceCard
              key={product.id}
              product={product}
              onSelectQuote={onSelectProduct}
            />
          ))}

          {/* INFINITE SCROLL PAGINATION APPEND: Display 4 Skeleton Cards while fetching next page */}
          {isFetchingNextPage &&
            Array.from({ length: 4 }).map((_, idx) => (
              <ProductCardSkeleton key={`page-skel-${idx}`} />
            ))}
        </div>
      )}

      {/* HIDDEN SENTINEL ELEMENT FOR INTERSECTION OBSERVER INFINITE SCROLL */}
      <div
        ref={loadMoreRef}
        data-testid="load-more-sentinel"
        style={{
          minHeight: 50,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
        }}
      >
        {isFetchingNextPage && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink-60)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--surface)',
              border: '1px solid var(--ink-12)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid var(--ink-12)',
                borderTopColor: 'var(--solar)',
                animation: 'hb-spin 0.6s linear infinite',
              }}
            />
            Fetching next page of devices (Page {page + 1})...
          </div>
        )}

        {!hasMore && displayedProducts.length > 0 && !isInitialLoading && (
          <div style={{ fontSize: 12, color: 'var(--ink-60)', fontWeight: 600 }}>
            ✓ All {displayedProducts.length} verified devices loaded
          </div>
        )}
      </div>
    </div>
  )
}
