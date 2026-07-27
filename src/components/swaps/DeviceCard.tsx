'use client'

import { Card } from '../Card'
import { Device } from './types'

interface DeviceCardProps {
  device: Device
  label: string
  isUserDevice?: boolean
}

export function DeviceCard({ device, label, isUserDevice = false }: DeviceCardProps) {
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        border: isUserDevice ? '2px solid var(--solar)' : '1px solid var(--ink-12)',
      }}
      aria-label={`${label}: ${device.name}`}
    >
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            color: 'var(--ink)',
            margin: '0 0 4px',
          }}
        >
          {label}
        </h3>
        <p style={{ color: 'var(--ink-60)', fontSize: '0.875rem', margin: 0 }}>
          {device.ownerName}
        </p>
      </div>

      {device.imageUrl && (
        <div
          style={{
            width: '100%',
            height: '200px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            background: 'var(--ink-06)',
          }}
        >
          <img
            src={device.imageUrl}
            alt={`${device.name} - ${device.condition}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: 'var(--ink-60)', fontSize: '0.875rem' }}>Device</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '1rem' }}>
            {device.name}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: 'var(--ink-60)', fontSize: '0.875rem' }}>Model</span>
          <span style={{ color: 'var(--ink)', fontWeight: 500, fontSize: '0.875rem' }}>
            {device.model}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: 'var(--ink-60)', fontSize: '0.875rem' }}>Condition</span>
          <span
            style={{
              color: 'var(--ink)',
              fontWeight: 500,
              fontSize: '0.875rem',
              textTransform: 'capitalize',
            }}
          >
            {device.condition.replace('_', ' ')}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: 'var(--ink-60)', fontSize: '0.875rem' }}>Value</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '1rem' }}>
            ${device.valueUsd.toLocaleString()}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 'auto',
          padding: '16px',
          background: 'var(--ink-06)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--ink-12)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              color: 'var(--ink)',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Required Collateral
          </span>
          <span
            style={{
              color: 'var(--solar)',
              fontWeight: 700,
              fontSize: '1.125rem',
            }}
          >
            {device.collateralUsdc.toLocaleString()} USDC
          </span>
        </div>
        <p
          style={{
            color: 'var(--ink-60)',
            fontSize: '0.75rem',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Collateral required to secure this device in escrow
        </p>
      </div>
    </Card>
  )
}
