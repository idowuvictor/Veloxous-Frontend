'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { RepairPortfolioItem } from '@/types/technician'
import { Badge, Tag, Button } from '@/components/index'

interface PortfolioTabProps {
  portfolio: RepairPortfolioItem[]
}

export function PortfolioTab({ portfolio }: PortfolioTabProps) {
  const [selectedCase, setSelectedCase] = useState<RepairPortfolioItem | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(portfolio.map((p: RepairPortfolioItem) => p.category)))]

  const filteredPortfolio =
    activeCategory === 'All' ? portfolio : portfolio.filter((p: RepairPortfolioItem) => p.category === activeCategory)

  return (
    <div>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map((cat: string) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: activeCategory === cat ? '1px solid var(--ink)' : '1px solid var(--ink-12)',
              background: activeCategory === cat ? 'var(--ink)' : 'var(--surface)',
              color: activeCategory === cat ? 'var(--canvas)' : 'var(--ink)',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--dur-press) var(--ease-out)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

     
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20,
        }}
      >
        {filteredPortfolio.map((item: RepairPortfolioItem) => (
          <div
            key={item.id}
            onClick={() => setSelectedCase(item)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--ink-12)',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
            }}
          >
            
            <div style={{ position: 'relative', height: 180, background: 'var(--bg-sunken)', display: 'flex' }}>
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <img
                  src={item.beforeImg || item.afterImg}
                  alt="Before repair"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Diagnostic View
                </span>
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'var(--growth)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                ★ {item.customerRating}.0 Rating
              </div>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Tag>{item.category}</Tag>
                <span style={{ fontSize: 12, color: 'var(--ink-40)', alignSelf: 'center' }}>
                  {item.date}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--ink)',
                  margin: '0 0 8px 0',
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </h3>

              <p style={{ fontSize: 13, color: 'var(--ink-60)', margin: '0 0 14px 0', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.faultSummary}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop: '1px solid var(--ink-12)',
                  fontSize: 12.5,
                  fontFamily: 'var(--font-data)',
                }}
              >
                <span style={{ color: 'var(--ink-60)' }}>
                  {item.turnaroundHours}h turn •  {item.ewasteKg}kg e-waste
                </span>
                <span style={{ fontWeight: 700, color: 'var(--growth)' }}>{item.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCase && (
        <Modal onClose={() => setSelectedCase(null)} titleId="portfolio-modal-title">
          <>
            <button
              type="button"
              onClick={() => setSelectedCase(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                border: 'none',
                background: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: 'var(--ink-60)',
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Badge tone="growth">✓ Verified Repair Record</Badge>
              <Badge tone="solar">Stellar Tx: {selectedCase.stellarTxHash}</Badge>
            </div>

            <h2 id="portfolio-modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '8px 0', color: 'var(--ink)' }}>
              {selectedCase.title}
            </h2>

            <div style={{ fontSize: 13.5, color: 'var(--ink-60)', marginBottom: 20 }} id="portfolio-modal-desc">
              Device: <strong style={{ color: 'var(--ink)' }}>{selectedCase.device}</strong> • Repair Date: {selectedCase.date}
            </div>

            {selectedCase.beforeImg && (
              <div style={{ borderRadius: 'var(--radius-input)', overflow: 'hidden', marginBottom: 20 }}>
                <img
                  src={selectedCase.beforeImg}
                  alt={selectedCase.title}
                  style={{ width: '100%', height: 260, objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 14, color: 'var(--ink)' }}>Fault Diagnostic</h4>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.5 }}>{selectedCase.faultSummary}</p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 14, color: 'var(--ink)' }}>Technical Resolution</h4>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.5 }}>{selectedCase.solutionDetails}</p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                  background: 'var(--bg-sunken)',
                  padding: 16,
                  borderRadius: 'var(--radius-input)',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-40)' }}>Turnaround</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{selectedCase.turnaroundHours} Hours</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-40)' }}>Total Cost</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--growth)' }}>{selectedCase.cost}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-40)' }}>E-Waste Saved</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--solar)' }}>{selectedCase.ewasteKg} kg</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Button variant="primary" size="md" onClick={() => setSelectedCase(null)}>
                Close Record
              </Button>
            </div>
          </>
        </Modal>
      )}
    </div>
  )
}
