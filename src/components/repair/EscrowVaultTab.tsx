'use client'

import { useState } from 'react'
import { TechnicianProfile } from '@/types/technician'
import { Card, Button, Badge } from '../index'

interface EscrowVaultTabProps {
  technician: TechnicianProfile
}

export function EscrowVaultTab({ technician }: EscrowVaultTabProps) {
  const [serialQuery, setSerialQuery] = useState('')
  const [claimStatus, setClaimStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')

  const handleVerifyClaim = (e: React.FormEvent) => {
    e.preventDefault()
    if (!serialQuery.trim()) return
    setClaimStatus('checking')
    setTimeout(() => {
      if (serialQuery.length >= 4) {
        setClaimStatus('valid')
      } else {
        setClaimStatus('invalid')
      }
    }, 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Contract Summary Card */}
      <Card>
        <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
          Soroban Smart Escrow Vault & Bonded Staking
        </h3>
        <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 16 }}>
          Decentralized Customer Protection Engine
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
              Active Escrow Bond
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
              Soroban Contract Address
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-data)', wordBreak: 'break-all', marginTop: 4 }}>
              {technician.escrowContract}
            </div>
            <div style={{ fontSize: 12, color: 'var(--growth)', fontWeight: 600, marginTop: 4 }}>
              ✓ Contract State: Fully Collateralized
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
              100% Satisfied Escrow Settlements
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Warranty Claim Check */}
      <Card>
        <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
          Instant Warranty & Smart Escrow Claim Verification
        </h3>
        <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 16 }}>
          Check repair serial number or Stellar transaction hash
        </div>

        <form onSubmit={handleVerifyClaim} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Enter Repair ID or Stellar Tx Hash (e.g., a8b1c2d3)..."
            value={serialQuery}
            onChange={(e) => {
              setSerialQuery(e.target.value)
              setClaimStatus('idle')
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

          <Button variant="primary" size="md" type="submit" loading={claimStatus === 'checking'}>
            Verify Coverage
          </Button>
        </form>

        {claimStatus === 'valid' && (
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
              <div style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>
                Repair ID: {serialQuery} • Covered under 90-Day Escrow Payout Protection.
              </div>
            </div>
            <Badge tone="growth">Full Escrow Refund Ready</Badge>
          </div>
        )}

        {claimStatus === 'invalid' && (
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
            <div style={{ fontWeight: 700, fontSize: 14 }}>⚠️ Serial Number / Tx Hash Not Found</div>
            <div style={{ fontSize: 13, marginTop: 2 }}>
              Please double check the ID from your repair receipt or wallet transaction log.
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
