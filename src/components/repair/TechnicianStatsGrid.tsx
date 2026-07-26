'use client'

import { StatBlock } from '@/components/StatBlock'
import { TechnicianProfile } from '@/types/technician'

interface TechnicianStatsGridProps {
  technician: TechnicianProfile
}

export function TechnicianStatsGrid({ technician }: TechnicianStatsGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32,
      }}
    >
      <StatBlock
        label="Completed Repairs"
        value={technician.completedRepairs.toString()}
        unit="repairs"
      />

      <StatBlock
        label="First-Time Fix Rate"
        value={`${technician.successRate}%`}
        delta="+0.4%"
        deltaDirection="up"
      />

      <StatBlock
        label="Avg Turnaround Time"
        value={`${technician.avgTurnaroundHours}`}
        unit="Hours"
      />

      <StatBlock
        label="E-Waste Diverted"
        value={`${technician.ewasteSavedKg.toLocaleString()}`}
        unit="kg"
        delta={`+${((technician.carbonSavedKg ?? 0) / 1000).toFixed(1)}t CO₂e`}
        deltaDirection="up"
      />

      <StatBlock
        label="Dispute Ratio"
        value={`${(technician.disputeRatio ?? 0).toFixed(1)}%`}
        delta={`${technician.disputesLost} lost`}
        deltaDirection={technician.disputeRatio === 0 ? 'up' : 'down'}
      />
    </div>
  )
}
