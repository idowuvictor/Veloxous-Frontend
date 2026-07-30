'use client'

import { DualPaneSwap } from '../components/swaps'
import type { Swap } from '../components/swaps'

const mockSwap: Swap = {
  id: 'swap-demo-123',
  userDevice: {
    id: 'device-1',
    name: 'iPhone 13 Pro',
    model: 'A2639',
    condition: 'good',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    valueUsd: 200,
    collateralUsdc: 200,
    ownerId: 'user-1',
    ownerName: 'John Doe',
  },
  targetDevice: {
    id: 'device-2',
    name: 'iPhone 15 Pro',
    model: 'A3102',
    condition: 'like_new',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    valueUsd: 500,
    collateralUsdc: 500,
    ownerId: 'user-2',
    ownerName: 'Jane Smith',
  },
  state: 'negotiation',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  collateralDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

export function SwapEngine() {
  return (
    <DualPaneSwap
      swap={mockSwap}
      isUserInitiator={true}
      userUsdcBalance={750}
      onCounter={() => console.log('Counter offer')}
      onAccept={() => console.log('Accept swap')}
      onReject={() => console.log('Reject swap')}
      onCancel={() => console.log('Cancel swap')}
      onFiatOnRamp={() => console.log('Navigate to fiat on-ramp')}
    />
  )
}
