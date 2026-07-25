import type { Metadata } from 'next'
import { MarketplaceScreen } from '@/screens/MarketplaceScreen'

export const metadata: Metadata = {
  title: 'Electronics & Clean-Tech Marketplace | Veloxous',
  description: 'Shop verified refurbished laptops, smartphones, solar microinverters, and power equipment backed by Soroban smart contract escrow.',
}

export default function MarketplacePage() {
  return <MarketplaceScreen />
}
