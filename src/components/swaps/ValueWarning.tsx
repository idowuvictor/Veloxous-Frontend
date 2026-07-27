'use client'

interface ValueWarningProps {
  userValue: number
  targetValue: number
  targetCollateral: number
}

export function ValueWarning({ userValue, targetValue, targetCollateral }: ValueWarningProps) {
  const difference = targetValue - userValue
  const needsAdditionalCollateral = difference > 0

  if (!needsAdditionalCollateral) {
    return null
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        padding: '16px',
        background: 'color-mix(in srgb, var(--solar) 15%, transparent)',
        border: '2px solid var(--solar)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex',gap: '12px', alignItems: 'flex-start' }}>
        <span
          style={{
            fontSize: '1.5rem',
            lineHeight: 1,
            color: 'var(--solar)',
          }}
          aria-hidden="true"
        >
          ⚠️
        </span>
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: '0 0 8px',
            }}
          >
            Value Difference Detected
          </h4>
          <p
            style={{
              color: 'var(--ink)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Your device is worth ${userValue.toLocaleString()} while the target device is worth $
            {targetValue.toLocaleString()}. You will be required to deposit $
            {targetCollateral.toLocaleString()} USDC collateral to secure this swap.
          </p>
        </div>
      </div>
    </div>
  )
}
