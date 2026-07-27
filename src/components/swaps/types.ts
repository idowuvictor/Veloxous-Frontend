export type SwapState =
  | 'negotiation'
  | 'counter_offer'
  | 'agreed_awaiting_collateral'
  | 'collateral_deposited'
  | 'completed'
  | 'cancelled'
  | 'rejected'

export type TransactionStep = 'waiting' | 'signing' | 'submitting' | 'confirmed' | 'failed'

export interface Device {
  id: string
  name: string
  model: string
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
  imageUrl?: string
  valueUsd: number
  collateralUsdc: number
  ownerId: string
  ownerName: string
}

export interface Swap {
  id: string
  userDevice: Device
  targetDevice: Device
  state: SwapState
  createdAt: string
  expiresAt: string
  collateralDeadline: string
}

export interface SwapAction {
  type: 'propose' | 'counter' | 'accept' | 'reject' | 'cancel' | 'deposit_collateral'
  payload?: any
}
