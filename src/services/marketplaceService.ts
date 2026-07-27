import { DeviceProduct, ProductCategory, ProductCondition } from '@/types/marketplace'
import { MARKETPLACE_PRODUCTS } from '@/data/marketplaceData'

export interface FetchProductsPageParams {
  page: number
  limit: number
  category?: ProductCategory
  searchQuery?: string
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating'
  minPrice?: number
  maxPrice?: number
  conditions?: ProductCondition[]
  minTrustScore?: number
}

export interface FetchProductsPageResult {
  products: DeviceProduct[]
  hasMore: boolean
  total: number
  page: number
}

/**
 * Fetches a paginated, filtered, and sorted list of marketplace products.
 * This is a mock service that simulates a network request and operates on in-memory data.
 * @param params - The parameters for filtering, sorting, and pagination.
 * @returns A promise that resolves to a page of products and pagination metadata.
 */
export async function fetchMarketplaceProductsPage({
  page = 1,
  limit = 6,
  category = 'All',
  searchQuery = '',
  sortBy = 'featured',
  minPrice = 0,
  maxPrice = 3500,
  conditions = [],
  minTrustScore = 0,
}: FetchProductsPageParams): Promise<FetchProductsPageResult> {
  await new Promise((res) => setTimeout(res, 300))

  const filtered = MARKETPLACE_PRODUCTS.filter((prod) => {
    if (category !== 'All' && prod.category !== category) return false
    if (prod.priceUSD < minPrice || prod.priceUSD > maxPrice) return false
    if (conditions.length > 0 && !conditions.includes(prod.condition)) return false
    if (minTrustScore > 0 && prod.rating < minTrustScore / 20) return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        prod.title.toLowerCase().includes(q) ||
        prod.model.toLowerCase().includes(q) ||
        prod.sellerName.toLowerCase().includes(q) ||
        prod.specs.some((s) => s.toLowerCase().includes(q))
      )
    }
    return true
  })

  filtered.sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD
    if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const maxTotalPages = 5
  const total = filtered.length * maxTotalPages
  const start = (page - 1) * limit

  const pagedItems: DeviceProduct[] = []
  if (filtered.length > 0 && page <= maxTotalPages) {
    for (let i = start; i < start + limit; i++) {
      const baseIndex = i % filtered.length
      const base = filtered[baseIndex]
      const batchNum = Math.floor(i / filtered.length) + 1
      pagedItems.push({
        ...base,
        id: `${base.id}-p${page}-i${i}`,
        title: batchNum > 1 ? `${base.title} (Batch #${batchNum})` : base.title,
      })
    }
  }

  const hasMore = page < maxTotalPages && pagedItems.length > 0

  return {
    products: pagedItems,
    hasMore,
    total,
    page,
  }
}
