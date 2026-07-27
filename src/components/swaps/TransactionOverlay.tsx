'use client'

import { Button } from '../Button'

type TransactionStep = 'waiting' | 'signing' | 'submitting' | 'confirmed' | 'failed'

interface TransactionOverlayProps {
  isOpen: boolean
  step: TransactionStep
  error?: string
  onClose: () => void
  onRetry?: () => void
}

export function TransactionOverlay({ isOpen, step, error, onClose, onRetry }: TransactionOverlayProps) {
  if (!isOpen) return null

  const steps = [
    { key: 'waiting', label: 'Waiting for signature', icon: '⏳' },
    { key: 'signing', label: 'Signing transaction', icon: '✍️' },
    { key: 'submitting', label: 'Submitting to network', icon: '📡' },
    { key: 'confirmed', label: 'Confirmed on chain', icon: '✅' },
  ] as const

  const currentStepIndex = steps.findIndex((s) => s.key === step) || 0

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-title"
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          maxWidth: '480px',
          width: '90%',
          border: '1px solid var(--ink-12)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h2
          id="transaction-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            color: 'var(--ink)',
            margin: '0 0 24px',
            textAlign: 'center',
          }}
        >
          Transaction Progress
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {steps.map((s, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const isPending = index > currentStepIndex

            return (
              <div
                key={s.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: isCompleted
                    ? 'color-mix(in srgb, #22c55e 10%, transparent)'
                    : isCurrent
                      ? 'color-mix(in srgb, var(--solar) 15%, transparent)'
                      : 'var(--ink-06)',
                  border: isCompleted
                    ? '1px solid #22c55e'
                    : isCurrent
                      ? '1px solid var(--solar)'
                      : '1px solid var(--ink-12)',
                  opacity: isPending ? 0.5 : 1,
                }}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span
                  style={{
                    fontSize: '1.5rem',
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  {isCompleted ? '✅' : s.icon}
                </span>
                <span
                  style={{
                    color: 'var(--ink)',
                    fontWeight: isCurrent ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                >
                  {s.label}
                </span>
                {isCurrent && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '2px solid var(--solar)',
                      borderTopColor: 'transparent',
                      animation: 'spin 1s linear infinite',
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          })}
        </div>

        {step === 'failed' && error && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              padding: '16px',
              background: 'color-mix(in srgb, #ef4444 10%, transparent)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                color: '#ef4444',
                fontSize: '0.875rem',
                margin: 0,
                fontWeight: 600,
              }}
            >
              {error}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {step === 'failed' && onRetry && (
            <Button variant="primary" onClick={onRetry}>
              Retry Transaction
            </Button>
          )}
          {(step === 'confirmed' || step === 'failed') && (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
