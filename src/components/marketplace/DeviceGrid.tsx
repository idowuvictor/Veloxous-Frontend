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

/**
 * Renders a grid of device products with support for filtering, sorting, and infinite-scroll pagination.
 * It handles fetching product data based on the provided filters and displays loading states.
 * @param {DeviceGridProps} props - The props for the component.
 * @param {DeviceProduct[]} [props.products] - Initial products to display (for server-side rendering).
 * @returns The JSX for the device grid.
 */
export function DeviceGrid({
  products: initialProducts,
  filters,
  onFilterChange,
  onOpenMobileFilters,
  onSelectProduct,
}: DeviceGridProps) {
  const category = filters?.category || 'All'
  const searchQuery = filters?.searchQuery || ''
  const sortBy = filters?.sortBy || 'featured'
  const minPrice = filters?.minPrice || 0
  const maxPrice = filters?.maxPrice || 3500
  const conditions = filters?.conditions || []
  const minTrustScore = filters?.minTrustScore || 0

  const [displayedProducts, setDisplayedProducts] = useState<DeviceProduct[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const requestCounter = useRef(0)

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const loadPageOne = useCallback(async () => {
    const currentRequestId = ++requestCounter.current
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

      if (currentRequestId !== requestCounter.current) return

      const isDefaultState = category === 'All' && !searchQuery && page === 1;
      const items = (isDefaultState && initialProducts) 
        ? initialProducts.slice(0, LIMIT) 
        : res.products;

      setDisplayedProducts(items)
      setHasMore(res.hasMore)
      setTotalItems(res.total)
      if (isDefaultState) setPage(1);
      
    } catch(err) {
      console.error(err)
    } finally {
      setIsInitialLoading(false)
    }
  }, [category, searchQuery, sortBy, minPrice, maxPrice, conditions, minTrustScore, initialProducts])

  useEffect(() => {
    loadPageOne()
  }, [loadPageOne])

const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || isInitialLoading || !hasMore) return;

    const currentRequestId = requestCounter.current
    setIsFetchingNextPage(true);
    const nextPage = page + 1;

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
      });

      if (currentRequestId !== requestCounter.current) return

      setDisplayedProducts((prev) => {
        if (prev.length === 0) return prev;
        return [...prev, ...res.products];
      });
      
      setHasMore(res.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to fetch next page:", err);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [
    isFetchingNextPage, 
    isInitialLoading, 
    hasMore, 
    page, 
    category, 
    searchQuery, 
    sortBy, 
    minPrice, 
    maxPrice, 
    conditions, 
    minTrustScore,
  ]);

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
        rootMargin: '300px', 
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

      {isInitialLoading ? (
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
          {displayedProducts.map((product: DeviceProduct) => (
            <DeviceCard
              key={product.id}
              product={product}
              onSelectQuote={onSelectProduct}
            />
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 4 }).map((_, idx) => (
              <ProductCardSkeleton key={`page-skel-${idx}`} />
            ))}
        </div>
      )}

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
             All {displayedProducts.length} verified devices loaded
          </div>
        )}
      </div>
    </div>
  )
}
