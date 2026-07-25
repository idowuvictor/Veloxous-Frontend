'use client'

import { useState, useEffect, useCallback } from 'react'
import { DeviceProduct, ProductCategory, ProductCondition } from '@/types/marketplace'
import { DeviceGrid } from '@/components/marketplace/DeviceGrid'
import { MarketplaceFilterSidebar, FilterState } from '@/components/marketplace/MarketplaceFilterSidebar'
import { Toast, ToastTone } from '@/components/Toast'

export function MarketplaceScreen() {
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null)

  // Mobile Filter Drawer Open State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Default Filter State
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 3500,
    conditions: [],
    minTrustScore: 0,
    sortBy: 'featured',
  })

  // 1. Read Initial Filters from URL Query Parameters
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)

    const urlCategory = (params.get('category') as ProductCategory) || 'All'
    const urlSearch = params.get('search') || ''
    const urlMaxPrice = params.has('maxPrice') ? Number(params.get('maxPrice')) : 3500
    const urlMinTrust = params.has('minTrust') ? Number(params.get('minTrust')) : 0
    const urlSort = (params.get('sortBy') as any) || 'featured'
    const urlConditions = params.has('conditions')
      ? (params.get('conditions')?.split(',') as ProductCondition[])
      : []

    setFilters({
      category: urlCategory,
      searchQuery: urlSearch,
      minPrice: 0,
      maxPrice: urlMaxPrice,
      conditions: urlConditions,
      minTrustScore: urlMinTrust,
      sortBy: urlSort,
    })
  }, [])

  // 2. Automatically Update URL Query Parameters when Filters Change
  const updateUrlQueryParams = useCallback((newFilters: FilterState) => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (newFilters.category !== 'All') params.set('category', newFilters.category)
    if (newFilters.searchQuery) params.set('search', newFilters.searchQuery)
    if (newFilters.maxPrice < 3500) params.set('maxPrice', String(newFilters.maxPrice))
    if (newFilters.minTrustScore > 0) params.set('minTrust', String(newFilters.minTrustScore))
    if (newFilters.sortBy !== 'featured') params.set('sortBy', newFilters.sortBy)
    if (newFilters.conditions.length > 0) params.set('conditions', newFilters.conditions.join(','))

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState(null, '', newUrl)
  }, [])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    updateUrlQueryParams(newFilters)
  }

  const handleResetFilters = () => {
    const resetState: FilterState = {
      category: 'All',
      searchQuery: '',
      minPrice: 0,
      maxPrice: 3500,
      conditions: [],
      minTrustScore: 0,
      sortBy: 'featured',
    }
    setFilters(resetState)
    updateUrlQueryParams(resetState)
  }

  const handleSelectProduct = (product: DeviceProduct) => {
    setToast({
      message: `Quote request opened for ${product.title} ($${product.priceUSD.toLocaleString()} USD / ${product.priceUSDC.toLocaleString()} USDC Escrow)`,
      tone: 'solar',
    })
  }

  return (
    <main
      style={{
        maxWidth: 1380,
        margin: '0 auto',
        padding: '32px 20px 80px 20px',
        minHeight: '85vh',
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 24, zIndex: 1100 }}>
          <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} />
        </div>
      )}

      {/* Marketplace Header Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0b2b23 0%, #174b3e 60%, #0e6f44 100%)',
          borderRadius: 'var(--radius-card)',
          padding: '32px 28px',
          color: '#fff',
          marginBottom: 28,
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
            🛡️ Soroban Smart Escrow Protected
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 800, margin: '0 0 6px 0', lineHeight: 1.1 }}>
            Electronics & Clean-Tech Marketplace
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0, maxWidth: 640, lineHeight: 1.5 }}>
            Browse verified refurbished MacBooks, smartphones, solar microinverters, and power equipment backed by smart contract escrow guarantees.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '10px 18px', borderRadius: 'var(--radius-input)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-data)' }}>32 Devices</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Verified In-Stock</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '10px 18px', borderRadius: 'var(--radius-input)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-data)' }}>100%</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Escrow Security</div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Main Products Area (LEFT) & Sticky Filter Sidebar (RIGHT) */}
      <div className="hb-marketplace-layout">
        {/* Main Products Area (LEFT) */}
        <div className="hb-main-products-area">
          <DeviceGrid
            filters={filters}
            onFilterChange={handleFilterChange}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            onSelectProduct={handleSelectProduct}
          />
        </div>

        {/* Sticky Filter Sidebar (RIGHT) - Controlled Mobile Drawer */}
        <MarketplaceFilterSidebar
          filters={filters}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>
    </main>
  )
}
