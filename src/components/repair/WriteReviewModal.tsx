'use client'

import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { TechnicianProfile, TechnicianReview } from '@/types/technician'
import { Button, Badge } from '@/components/index'

interface WriteReviewModalProps {
  technician: TechnicianProfile
  onClose: () => void
  onSubmitReview: (newReview: TechnicianReview) => void
}

export function WriteReviewModal({
  technician,
  onClose,
  onSubmitReview,
}: WriteReviewModalProps) {
  const [authorName, setAuthorName] = useState('')
  const [deviceType, setDeviceType] = useState('MacBook Pro M1')
  const [repairCategory] = useState('Logic Board Micro-soldering')
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [txHash, setTxHash] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidStellarTxHash = (hash: string): boolean => {
    return /^[a-f0-9]{64}$/i.test(hash)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !comment.trim() || !authorName.trim()) return

    setIsSubmitting(true)
  }

  useEffect(() => {
    if (!isSubmitting) return

    const timer = setTimeout(() => {
      setIsSubmitting(false)
      const review: TechnicianReview = {
        id: `rev-${Date.now()}`,
        technicianId: technician.id,
        authorName,
        rating,
        date: new Date().toISOString().split('T')[0],
        deviceType,
        repairCategory,
        title,
        comment,
        isVerifiedEscrow: isValidStellarTxHash(txHash),
        stellarTxHash: txHash,
        helpfulCount: 0,
      }
      onSubmitReview(review)
    }, 800)

    return () => {
      clearTimeout(timer)
    }
  }, [isSubmitting, authorName, comment, deviceType, onSubmitReview, rating, repairCategory, technician.id, title, txHash])

  return (
    <Modal onClose={onClose} titleId="review-modal-title" descriptionId="review-modal-desc">
      {/* The outer div is gone, and the inner div is now the root of the modal's content */}
      <>
        <button
          type="button"
          onClick={onClose}
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

        <Badge tone="growth"> Verified Review</Badge>

        <h2 id="review-modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '8px 0 4px 0', color: 'var(--ink)' }}>
          Write a Review for {technician.name}
        </h2>
        <p id="review-modal-desc" style={{ fontSize: 13.5, color: 'var(--ink-60)', margin: '0 0 20px 0' }}>
          Your review will be attached to your repair receipt.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
              Overall Experience Rating
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: 28,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= rating ? 'var(--solar)' : 'var(--ink-12)',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  ★
                </button>
              ))}
              <span style={{ alignSelf: 'center', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginLeft: 8 }}>
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
              Your Name / Alias
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Marcus Thorne"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--ink-12)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Device Model
              </label>
              <input
                type="text"
                required
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-input)',
                  border: '1px solid var(--ink-12)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Transaction ID
              </label>
              <input
                type="text"
                required
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="e.g. a8b1..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-input)',
                  border: '1px solid var(--ink-12)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-data)',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
              Review Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional micro-soldering work & instant turn!"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--ink-12)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
              Review Details
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about turnaround speed, communication, quality of repair, and escrow settlement..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--ink-12)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="lg" type="submit" loading={isSubmitting}>
              Submit Verified Review
            </Button>
          </div>
        </form>
      </>
    </Modal>
  )
}
