export type ProductCondition =
  | 'Brand New'
  | 'Refurbished - Excellent'
  | 'Refurbished - Good'
  | 'Pre-Owned'

export type ProductCategory =
  | 'All'
  | 'Laptops & MacBooks'
  | 'Smartphones & Tablets'
  | 'Solar & Clean Energy'
  | 'Audio & Consoles'
  | 'Components & Logic Boards'

export interface DeviceProduct {
  id: string
  title: string
  model: string
  category: ProductCategory
  priceUSD: number
  priceUSDC: number
  condition: ProductCondition
  image: string
  rating: number
  reviewsCount: number
  sellerName: string
  sellerAvatar: string
  sellerStellarAddress: string
  escrowProtected: boolean
  warrantyDays: number
  inStock: boolean
  specs: string[]
  discountPercent?: number
}
