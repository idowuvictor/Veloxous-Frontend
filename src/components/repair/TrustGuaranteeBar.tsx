'use client'

interface TrustGuaranteeBarProps {
  stakedXlm: number
  escrowContract: string
}

export function TrustGuaranteeBar({ stakedXlm, escrowContract }: TrustGuaranteeBarProps) {
  return (
    <div
      style={{
        background: 'color-mix(in srgb, var(--solar) 10%, var(--surface))',
        border: '1px solid var(--solar-24)',
        borderRadius: 'var(--radius-card)',
        padding: '16px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--solar)',
            color: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          🛡️
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h4
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Veloxous On-Chain Escrow Security Shield
            </h4>
            <span
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--growth-12)',
                color: 'var(--growth)',
                fontWeight: 600,
              }}
            >
              ACTIVE
            </span>
          </div>

          <p style={{ margin: '2px 0 0 0', fontSize: 13.5, color: 'var(--ink-60)' }}>
            Funds remain locked in Soroban Smart Escrow contract (<code style={{ fontFamily: 'var(--font-data)' }}>{escrowContract}</code>) until repair tests pass. Backed by {stakedXlm.toLocaleString()} XLM collateral bond.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-40)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Warranty
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
            90-Day Money-Back
          </div>
        </div>
      </div>
    </div>
  )
}
