'use client'

import { useState, useEffect } from 'react'
import { TechnicianProfile } from '@/types/technician'
import { Card, Button, Badge } from '../index'
import { useDebounce } from '@/hooks/useDebounce'

interface EscrowVaultTabProps {
  technician: TechnicianProfile
}

type VerificationStatus = 'idle' | 'loading' | 'valid' | 'invalid' | 'error'

interface WarrantyVerificationResult {
  valid: boolean
  deviceName?: string
  escrowAmountUSDC?: number
}

/**
 * Mocks a service call to verify a smart contract warranty ID.
 * In a real application, this would be a fetch call to a backend API.
 */
async function verifyWarrantyId(
  id: string,
  signal: AbortSignal
): Promise<WarrantyVerificationResult> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 1200))

  if (signal.aborted) {
    throw new DOMException('Aborted', 'AbortError')
  }

  // Mock logic: valid if it's a specific string, otherwise invalid.
  if (id.toUpperCase() === 'VX-8A4D-G7B2-L3C9') {
    return {
      valid: true,
      deviceName: 'MacBook Pro 16" M2 Max',
      escrowAmountUSDC: 2750,
    }
  }

  return { valid: false }
}

export function EscrowVaultTab({ technician }: EscrowVaultTabProps) {
  const [serialQuery, setSerialQuery] = useState('')
  const [status, setStatus] = useState<VerificationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [verifiedData, setVerifiedData] = useState<WarrantyVerificationResult | null>(null)

  const debouncedQuery = useDebounce(serialQuery, 500)

  useEffect(() => {
    if (debouncedQuery.length < 4) {
      return
    }

    const controller = new AbortController()

    const checkWarranty = async () => {
      setStatus('loading')
      setError(null)
      setVerifiedData(null)

      try {
        const result = await verifyWarrantyId(debouncedQuery, controller.signal)
        if (result.valid) {
          setStatus('valid')
          setVerifiedData(result)
        } else {
          setStatus('invalid')
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setStatus('error')
          setError('Network error. Please try again.')
          console.error('Failed to verify warranty ID:', err)
        }
      }
    }

    checkWarranty()

    // This cleanup function aborts the request if the debouncedQuery changes,
    // preventing race conditions and memory leaks.
    return () => {
      controller.abort()
    }
  }, [debouncedQuery])

  const handleInitiateRefund = () => {
    if (status !== 'valid' || !verifiedData) return
    alert(`Initiating refund for ${verifiedData.deviceName}.`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      <Card>
        <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
          Veloxous Vault & Bonded Staking
        </h3>
        <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 16 }}>
         Customer Protection Engine
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          <div style={{ background: 'var(--bg-sunken)', padding: 16, borderRadius: 'var(--radius-input)' }}>
            <div style={{ fontSize: 12, color: 'var(--ink-40)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Bond
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--growth)', fontFamily: 'var(--font-data)' }}>
              {technician.stakedBondXLM.toLocaleString()} XLM
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>
              ≈ ${technician.stakedBondUSD.toLocaleString()} USD Collateral
            </div>
          </div>


          <div style={{ background: 'var(--bg-sunken)', padding: 16, borderRadius: 'var(--radius-input)' }}>
            <div style={{ fontSize: 12, color: 'var(--ink-40)', textTransform: 'uppercase', fontWeight: 600 }}>
              Dispute Resolution Record
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-data)' }}>
              0 Disputes Lost
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>
              100% Satisfied Settlements
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
          Instant Warranty & Claim Verification
        </h3>
        <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 16 }}>
          Check warranty status
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Enter Warranty ID..."
            value={serialQuery}
            onChange={(e) => {
              setSerialQuery(e.target.value)
              setStatus('idle')
              setError(null)
              setVerifiedData(null)
            }}
            style={{
              flex: 1,
              minWidth: 280,
              padding: '12px 16px',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--ink-12)',
              background: 'var(--surface)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-data)',
              fontSize: 14,
              outline: 'none',
            }}
          />

          <Button variant="primary" size="md" onClick={handleInitiateRefund} disabled={status !== 'valid'} loading={status === 'loading'}>
            {status === 'loading' ? 'Verifying...' : 'Initiate Refund'}
          </Button>
        </div>

        {status === 'valid' && verifiedData && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 'var(--radius-input)',
              background: 'var(--growth-12)',
              border: '1px solid var(--growth)',
              color: 'var(--growth)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>✓ Valid Active Smart Contract Warranty</div>
              <div style={{ fontSize: 13, color: 'var(--ink-80)', marginTop: 4 }}>
                Device: <strong>{verifiedData.deviceName}</strong> · Escrow Amount:{' '}
                <strong>{verifiedData.escrowAmountUSDC?.toLocaleString()} USDC</strong>
              </div>
            </div>
            <Badge tone="growth">Full Refund Ready</Badge>
          </div>
        )}

        {(status === 'invalid' || status === 'error') && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 'var(--radius-input)',
              background: 'var(--ember-12)',
              border: '1px solid var(--ember)',
              color: 'var(--ember)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {status === 'invalid' ? '✗ Invalid or Expired Warranty ID' : `⚠️ ${error}`}
            </div>
            <div style={{ fontSize: 13, marginTop: 2 }}>
              Please double-check the ID from your repair receipt.
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
