'use client'

import { Button } from '../Button'
import { SwapState } from './types'

interface SwapActionsProps {
  state: SwapState
  onPropose: () => void
  onCounter: () => void
  onAccept: () => void
  onReject: () => void
  onCancel: () => void
  onDepositCollateral: () => void
  isUserInitiator?: boolean
}

export function SwapActions({
  state,
  onPropose,
  onCounter,
  onAccept,
  onReject,
  onCancel,
  onDepositCollateral,
  isUserInitiator = true,
}: SwapActionsProps) {
  const getButtonVariant = (action: string): 'primary' | 'secondary' | 'ghost' => {
    if (action === 'accept' || action === 'deposit_collateral') return 'primary'
    if (action === 'reject' || action === 'cancel') return 'ghost'
    return 'secondary'
  }

  const getButtonColor = (action: string): string => {
    if (action === 'accept' || action === 'deposit_collateral') return 'var(--solar)'
    if (action === 'reject' || action === 'cancel') return '#ef4444'
    return 'var(--ink)'
  }

  const renderActions = () => {
    switch (state) {
      case 'negotiation':
        return (
          <>
            {isUserInitiator ? (
              <>
                <Button
                  variant={getButtonVariant('counter')}
                  onClick={onCounter}
                  style={{ borderColor: getButtonColor('counter') }}
                >
                  Counter Offer
                </Button>
                <Button
                  variant={getButtonVariant('cancel')}
                  onClick={onCancel}
                  style={{ color: getButtonColor('cancel') }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={getButtonVariant('accept')}
                  onClick={onAccept}
                  style={{ background: getButtonColor('accept'), color: 'var(--ink)' }}
                >
                  Accept
                </Button>
                <Button
                  variant={getButtonVariant('counter')}
                  onClick={onCounter}
                  style={{ borderColor: getButtonColor('counter') }}
                >
                  Counter Offer
                </Button>
                <Button
                  variant={getButtonVariant('reject')}
                  onClick={onReject}
                  style={{ color: getButtonColor('reject') }}
                >
                  Reject
                </Button>
              </>
            )}
          </>
        )

      case 'counter_offer':
        return (
          <>
            {isUserInitiator ? (
              <>
                <Button
                  variant={getButtonVariant('accept')}
                  onClick={onAccept}
                  style={{ background: getButtonColor('accept'), color: 'var(--ink)' }}
                >
                  Accept Counter
                </Button>
                <Button
                  variant={getButtonVariant('counter')}
                  onClick={onCounter}
                  style={{ borderColor: getButtonColor('counter') }}
                >
                  New Counter
                </Button>
                <Button
                  variant={getButtonVariant('cancel')}
                  onClick={onCancel}
                  style={{ color: getButtonColor('cancel') }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant={getButtonVariant('cancel')}
                onClick={onCancel}
                style={{ color: getButtonColor('cancel') }}
              >
                Cancel
              </Button>
            )}
          </>
        )

      case 'agreed_awaiting_collateral':
        return (
          <>
            <Button
              variant={getButtonVariant('deposit_collateral')}
              onClick={onDepositCollateral}
              style={{ background: getButtonColor('deposit_collateral'), color: 'var(--ink)' }}
            >
              Deposit Collateral
            </Button>
            <Button
              variant={getButtonVariant('cancel')}
              onClick={onCancel}
              style={{ color: getButtonColor('cancel') }}
            >
              Cancel
            </Button>
          </>
        )

      case 'collateral_deposited':
        return (
          <div
            style={{
              padding: '12px 24px',
              background: 'color-mix(in srgb, var(--solar) 20%, transparent)',
              border: '1px solid var(--solar)',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--ink)',
              fontWeight: 600,
            }}
            aria-live="polite"
          >
            Awaiting Other Party's Collateral
          </div>
        )

      case 'completed':
        return (
          <div
            style={{
              padding: '12px 24px',
              background: 'color-mix(in srgb, #22c55e 20%, transparent)',
              border: '1px solid #22c55e',
              borderRadius: 'var(--radius-pill)',
              color: '#22c55e',
              fontWeight: 600,
            }}
            aria-live="polite"
          >
            Swap Completed Successfully
          </div>
        )

      case 'cancelled':
        return (
          <div
            style={{
              padding: '12px 24px',
              background: 'color-mix(in srgb, #ef4444 10%, transparent)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-pill)',
              color: '#ef4444',
              fontWeight: 600,
            }}
            aria-live="polite"
          >
            Swap Cancelled
          </div>
        )

      case 'rejected':
        return (
          <div
            style={{
              padding: '12px 24px',
              background: 'color-mix(in srgb, #ef4444 10%, transparent)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-pill)',
              color: '#ef4444',
              fontWeight: 600,
            }}
            aria-live="polite"
          >
            Swap Rejected
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--surface)',
        border: '1px solid var(--ink-12)',
        borderRadius: 'var(--radius-card)',
      }}
      role="group"
      aria-label="Swap actions"
    >
      {renderActions()}
    </div>
  )
}
