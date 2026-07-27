'use client'

interface BalanceWarningProps {
  requiredUsdc: number
  currentUsdc: number
  onFiatOnRamp?: () => void
}

export function BalanceWarning({ requiredUsdc, currentUsdc, onFiatOnRamp }: BalanceWarningProps) {
  const hasInsufficientBalance = currentUsdc < requiredUsdc

  if (!hasInsufficientBalance) {
    return null
  }

  const shortfall = requiredUsdc - currentUsdc

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        padding: '16px',
        background: 'color-mix(in srgb, #ef4444 10%, transparent)',
        border: '2px solid #ef4444',
        borderRadius: 'var(--radius-md)',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span
          style={{
            fontSize: '1.5rem',
            lineHeight: 1,
            color: '#ef4444',
          }}
          aria-hidden="true"
        >
          💰
        </span>
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#ef4444',
              margin: '0 0 8px',
            }}
          >
            Insufficient USDC Balance
          </h4>
          <p
            style={{
              color: 'var(--ink)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              margin: '0 0 12px',
            }}
          >
            You need {requiredUsdc.toLocaleString()} USDC to deposit collateral, but you only have{' '}
            {currentUsdc.toLocaleString()} USDC. You are short by {shortfall.toLocaleString()} USDC.
          </p>
          {onFiatOnRamp && (
            <button
              onClick={onFiatOnRamp}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Buy USDC via Fiat On-Ramp
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
