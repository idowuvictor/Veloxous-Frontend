'use client'

import { useState } from 'react'
import { TechnicianProfile } from '@/types/technician'
import { Card, Button, Badge, AmountInput } from '@/components/index'

interface TechnicianAdminViewProps {
  technician: TechnicianProfile
}

export function TechnicianAdminView({ technician }: TechnicianAdminViewProps) {
  const [bondAmount, setBondAmount] = useState(technician.stakedBondXLM.toString())
  const [isUpdatingBond, setIsUpdatingBond] = useState(false)
  const [bondUpdatedSuccess, setBondUpdatedSuccess] = useState(false)

  const handleUpdateBond = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingBond(true)
    setTimeout(() => {
      setIsUpdatingBond(false)
      setBondUpdatedSuccess(true)
      setTimeout(() => setBondUpdatedSuccess(false), 3000)
    }, 900)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Banner Notice */}
      <div
        style={{
          background: 'color-mix(in srgb, var(--solar) 15%, var(--surface))',
          border: '1px solid var(--solar)',
          borderRadius: 'var(--radius-card)',
          padding: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
            ⚙️ Technician Management Console — {technician.name}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-60)', marginTop: 2 }}>
            Manage active Soroban escrow jobs, update staked collateral bond, and monitor review reputation metrics.
          </div>
        </div>

        <Badge tone="solar">Status: Online & Accepting Repairs</Badge>
      </div>

      {/* Grid of Admin Tools */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Active Escrow Requests */}
        <Card>
          <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
            Active Escrow Repair Jobs
          </h3>
          <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 12 }}>
            3 Pending Approval / In Progress
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { id: 'JOB-942', device: 'MacBook Pro 16 M2', issue: 'Logic Board Short', escrow: '210 USDC', status: 'In Progress (Testing)' },
              { id: 'JOB-943', device: 'iPad Pro 12.9', issue: 'Touch IC Reballing', escrow: '120 USDC', status: 'Parts Arrived' },
              { id: 'JOB-944', device: 'SolarEdge Inverter', issue: 'MOSFET Replacement', escrow: '340 USDC', status: 'Awaiting Receipt' },
            ].map((job) => (
              <div
                key={job.id}
                style={{
                  background: 'var(--bg-sunken)',
                  border: '1px solid var(--ink-12)',
                  borderRadius: 'var(--radius-input)',
                  padding: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
                    {job.id}: {job.device}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>
                    {job.issue} • {job.status}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-data)', fontWeight: 700, color: 'var(--growth)', fontSize: 14 }}>
                    {job.escrow}
                  </div>
                  <Button variant="secondary" size="sm">
                    View Escrow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bonded Collateral Manager */}
        <Card>
          <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
            Soroban Collateral Bond Manager
          </h3>
          <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 16 }}>
            Higher bond increases public trust & search rank
          </div>

          <form onSubmit={handleUpdateBond} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AmountInput
              label="Staked Collateral Amount (XLM)"
              value={bondAmount}
              onChange={setBondAmount}
              currency="XLM"
            />

            {bondUpdatedSuccess && (
              <div style={{ fontSize: 13, color: 'var(--growth)', fontWeight: 600 }}>
                ✓ Soroban Collateral Bond updated on Stellar Testnet!
              </div>
            )}

            <Button variant="primary" size="md" type="submit" loading={isUpdatingBond}>
               Stake Additional XLM Bond
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
