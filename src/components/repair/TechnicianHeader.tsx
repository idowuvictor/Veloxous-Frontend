'use client'

import { useState } from 'react'
import { TechnicianProfile } from '@/types/technician'
import { Button, Badge, Tag } from '@/components/index'

interface TechnicianHeaderProps {
  technician: TechnicianProfile
  onOpenQuoteModal: () => void
  onOpenWriteReview: () => void
  isSaved?: boolean
  onToggleSave?: () => void
}

function TrustScoreGauge({ score = 98 }: { score: number }) {
  const radius = 30
  const strokeWidth = 5
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--surface)',
        padding: '6px 14px 6px 10px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--ink-12)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            stroke="var(--ink-12)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Progress Arc */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            stroke="var(--growth)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <span
          style={{
            position: 'absolute',
            fontFamily: 'var(--font-data)',
            fontWeight: 800,
            fontSize: 13,
            color: 'var(--ink)',
          }}
        >
          {score}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
          Trust Score
        </span>
        <span style={{ fontSize: 11, color: 'var(--growth)', fontWeight: 600, marginTop: 1 }}>
          {score >= 95 ? 'Top 1% Tier' : 'Verified Tech'}
        </span>
      </div>
    </div>
  )
}

export function TechnicianHeader({
  technician,
  onOpenQuoteModal,
  onOpenWriteReview,
  isSaved = false,
  onToggleSave,
}: TechnicianHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    try {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const isVerified = technician.is_verified ?? true
  const trustScore = technician.trustScore ?? 98
  const locationText = technician.cityCountry || technician.location

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--surface)',
        border: '1px solid var(--ink-12)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        marginBottom: 24,
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          height: 140,
          background: technician.bannerColor || 'linear-gradient(135deg, #0b2b23 0%, #0e6f44 100%)',
          position: 'relative',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Badge tone="solar">
            Bonded Escrow: ${technician.stakedBondUSD.toLocaleString()} USD
          </Badge>
          <Badge tone="growth">
            0 Dispute Payouts
          </Badge>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onToggleSave}
            aria-label={isSaved ? 'Remove from saved' : 'Save technician'}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isSaved ? '❤️ Saved' : '🤍 Bookmark'}
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share profile"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {copied ? '✓ Copied Link' : '🔗 Share'}
          </button>
        </div>
      </div>

      {/* Main Info Header Row */}
      <div
        className="hb-tech-header-body"
        style={{
          padding: '0 32px 24px 32px',
          display: 'flex',
          flexDirection: 'row',
          gap: 24,
          alignItems: 'flex-end',
          marginTop: -50,
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <img
            src={technician.avatar}
            alt={technician.name}
            style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid var(--surface)',
              boxShadow: 'var(--shadow-sm)',
              background: 'var(--canvas)',
            }}
          />
          <span
            title={technician.availability.text}
            style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'var(--growth)',
              border: '3px solid var(--surface)',
            }}
          />
        </div>

        {/* Info Body */}
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.85rem',
                fontWeight: 700,
                color: 'var(--ink)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {technician.name}
            </h1>

            {/* Prominent Verified Professional Badge */}
            {isVerified && (
              <Badge tone="growth" style={{ fontSize: 13, padding: '4px 12px' }}>
                Verified Professional
              </Badge>
            )}

            <span style={{ fontFamily: 'var(--font-data)', fontSize: 13, color: 'var(--ink-60)' }}>
              {technician.handle}
            </span>
          </div>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--ink-60)',
              margin: '6px 0 10px 0',
              fontWeight: 500,
            }}
          >
            {technician.title}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 13.5,
              color: 'var(--ink-60)',
              flexWrap: 'wrap',
              marginBottom: 12,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--ink)' }}>
              ⭐ {technician.rating.toFixed(2)} ({technician.totalReviews} verified reviews)
            </span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
              📍 {locationText}
            </span>
            <span>⏱️ Avg response {technician.responseTime}</span>
            <span>🎓 {technician.experienceYears} Years exp.</span>
          </div>

          {/* Skills & Specialties Tags Section */}
          <div className="hb-tech-skills-group" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Specialties:
            </span>
            {technician.specialties.map((skill: string) => (
              <Tag key={skill} style={{ height: 28, fontSize: 12.5, padding: '0 10px' }}>
                {skill}
              </Tag>
            ))}
          </div>
        </div>

        {/* Circular Gauge & Action Buttons Group */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          {/* Primary Action Buttons */}
          <div className="hb-tech-cta-group" style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" size="md" onClick={onOpenWriteReview}>
              Write Review
            </Button>
            <Button variant="primary" size="lg" onClick={onOpenQuoteModal}>
              Request Repair Quote
            </Button>
          </div>

          {/* Circular Gauge Chart for Trust Score */}
          <div className="hb-tech-gauge-group" style={{ display: 'flex' }}>
            <TrustScoreGauge score={trustScore} />
          </div>
        </div>
      </div>
    </div>
  )
}
