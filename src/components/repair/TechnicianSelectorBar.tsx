'use client'

import { TechnicianProfile } from '@/types/technician'

interface TechnicianSelectorBarProps {
  technicians: TechnicianProfile[]
  selectedId: string
  onSelect: (id: string) => void
  viewMode: 'public' | 'admin'
  onToggleViewMode: () => void
}

export function TechnicianSelectorBar({
  technicians,
  selectedId,
  onSelect,
  viewMode,
  onToggleViewMode,
}: TechnicianSelectorBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--surface)',
        border: '1px solid var(--ink-12)',
        borderRadius: 'var(--radius-card)',
        padding: '14px 20px',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      {/* Technician Pills */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Featured Technicians:
        </span>
        {technicians.map((tech: TechnicianProfile) => {
          const isSelected = tech.id === selectedId
          return (
            <button
              key={tech.id}
              type="button"
              onClick={() => onSelect(tech.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px 6px 8px',
                borderRadius: 'var(--radius-pill)',
                border: isSelected ? '2px solid var(--ink)' : '1px solid var(--ink-12)',
                background: isSelected ? 'var(--bg-sunken)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <img
                src={tech.avatar}
                alt={tech.name}
                style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: 13.5, fontWeight: isSelected ? 700 : 500, color: 'var(--ink)' }}>
                {tech.name}
              </span>
              <span style={{ fontSize: 12, color: 'var(--solar)', fontWeight: 700 }}>
                ★ {tech.rating}
              </span>
            </button>
          )
        })}
      </div>

      {/* Admin / Public Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          onClick={onToggleViewMode}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--solar)',
            background: viewMode === 'admin' ? 'var(--solar)' : 'transparent',
            color: 'var(--ink)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {viewMode === 'admin' ? '👤 Switch to Public Visitor View' : '⚙️ Technician Dashboard Mode'}
        </button>
      </div>
    </div>
  )
}
