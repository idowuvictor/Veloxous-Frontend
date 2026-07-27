'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  expiresAt: string
  onExpire?: () => void
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const difference = expiry - now

      if (difference <= 0) {
        setTimeLeft('00:00:00')
        onExpire?.()
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpire])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        background: 'var(--ink-06)',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--ink-12)',
      }}
      aria-live="polite"
      aria-label={`Time remaining: ${timeLeft}`}
    >
      <span
        style={{
          fontSize: '1.25rem',
          color: 'var(--solar)',
          fontWeight: 700,
          fontFamily: 'monospace',
        }}
      >
        {timeLeft}
      </span>
      <span style={{ color: 'var(--ink-60)', fontSize: '0.875rem' }}>until expiry</span>
    </div>
  )
}
