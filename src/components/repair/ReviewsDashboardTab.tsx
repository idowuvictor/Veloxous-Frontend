'use client'

import { useEffect, useState } from 'react'
import { TechnicianProfile, TechnicianReview } from '@/types/technician'
import { Badge, Button } from '@/components/index'
import { ReviewsFeedSkeleton } from './ReviewsFeedSkeleton'

interface ReviewsDashboardTabProps {
  technician: TechnicianProfile
  reviews: TechnicianReview[]
  isLoading?: boolean
  onOpenWriteReview: () => void
}

const REVIEWS_PER_PAGE = 3

export function ReviewsDashboardTab({
  technician,
  reviews,
  isLoading = false,
  onOpenWriteReview,
}: ReviewsDashboardTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({})
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({})

  const handleHelpfulClick = (reviewId: string, currentCount: number) => {
    if (votedHelpful[reviewId]) return
    setVotedHelpful((prev) => ({ ...prev, [reviewId]: true }))
    setHelpfulCounts((prev) => ({ ...prev, [reviewId]: (prev[reviewId] ?? currentCount) + 1 }))
  }

  const filteredReviews = reviews.filter((rev: TechnicianReview) => {
    if (verifiedOnly && !rev.isVerifiedEscrow) return false
    if (selectedRating !== 'all' && rev.rating !== selectedRating) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        rev.title.toLowerCase().includes(q) ||
        rev.comment.toLowerCase().includes(q) ||
        rev.authorName.toLowerCase().includes(q) ||
        rev.deviceType.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Pagination calculation
  const totalFiltered = filteredReviews.length
  const totalPages = Math.ceil(totalFiltered / REVIEWS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const totalCount = technician.totalReviews
  const breakdown = technician.ratingBreakdown

  const allReviewsVerified = reviews.length > 0 && reviews.every((r) => r.isVerifiedEscrow)

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5 ? 1 : 0
    const emptyStars = 5 - fullStars - halfStar
    return (
      '★'.repeat(fullStars) +
      (halfStar ? '½' : '') + 
      '☆'.repeat(emptyStars)
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          background: 'var(--surface)',
          border: '1px solid var(--ink-12)',
          borderRadius: 'var(--radius-card)',
          padding: 24,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            background: 'var(--bg-sunken)',
            padding: 16,
            borderRadius: 'var(--radius-input)',
            borderLeft: '4px solid var(--solar)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Jobs Completed
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-data)', marginTop: 4 }}>
            {technician.completedRepairs.toLocaleString()}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--growth)', fontWeight: 600, marginTop: 2 }}>
            ✓ 100% Escrow Backed
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-sunken)',
            padding: 16,
            borderRadius: 'var(--radius-input)',
            borderLeft: '4px solid var(--growth)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Average Repair Time
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-data)', marginTop: 4 }}>
            {technician.avgTurnaroundHours} Hours
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-60)', marginTop: 2 }}>
            Same-Day Express Available
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-sunken)',
            padding: 16,
            borderRadius: 'var(--radius-input)',
            borderLeft: `4px solid ${technician.disputesLost === 0 ? 'var(--growth)' : 'var(--ember)'}`,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Dispute Ratio
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: technician.disputesLost === 0 ? 'var(--growth)' : 'var(--ember)', fontFamily: 'var(--font-data)', marginTop: 4 }}>
            {technician.disputeRatio.toFixed(1)}%
          </div>
          <div style={{ fontSize: 12.5, color: technician.disputesLost === 0 ? 'var(--growth)' : 'var(--ember)', fontWeight: 600, marginTop: 2 }}>
            {technician.disputesLost} Lost Disputes out of {technician.completedRepairs} Jobs
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--ink-12)',
          borderRadius: 'var(--radius-card)',
          padding: 28,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  lineHeight: 1,
                }}
              >
                {technician.rating.toFixed(2)}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 18, color: 'var(--solar)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {renderStars(technician.rating)}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>
                  based on {totalCount} verified reviews
                </span>
              </div>
            </div>

            <p style={{ fontSize: 13.5, color: 'var(--ink-60)', marginTop: 12, lineHeight: 1.5 }}>
              {allReviewsVerified
                ? '100% of reviews are from customers who performed repairs under Veloxous.'
                : 'Reviews include both verified and unverified customers.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
            {[5, 4, 3, 2, 1].map((stars: number) => {
              const count =
                stars === 5
                  ? breakdown.star5
                  : stars === 4
                  ? breakdown.star4
                  : stars === 3
                  ? breakdown.star3
                  : stars === 2
                  ? breakdown.star2
                  : breakdown.star1
              const pct = totalCount ? Math.round((count / totalCount) * 100) : 0

              return (
                <div
                  key={stars}
                  onClick={() => {
                    setSelectedRating(selectedRating === stars ? 'all' : stars)
                    setCurrentPage(1)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 40, fontFamily: 'var(--font-data)', fontWeight: 600, color: 'var(--ink)' }}>
                    {stars} ★
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      background: 'var(--bg-sunken)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: stars >= 4 ? 'var(--solar)' : 'var(--ink-40)',
                        borderRadius: 4,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <span style={{ width: 40, textAlign: 'right', fontFamily: 'var(--font-data)', color: 'var(--ink-60)' }}>
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              justifyContent: 'center',
              borderLeft: '1px solid var(--ink-12)',
              paddingLeft: 24,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Aspect Scores
            </div>

            <AspectBar label="Technical Skill" score={technician.aspectRatings.technicalSkill} />
            <AspectBar label="Escrow Reliability" score={technician.aspectRatings.escrowReliability} />
            <AspectBar label="Communication" score={technician.aspectRatings.communication} />
            <AspectBar label="Price Value" score={technician.aspectRatings.priceValue} />
            <AspectBar label="Repair Speed" score={technician.aspectRatings.speed} />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search reviews by device or keyword..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--ink-12)',
              background: 'var(--surface)',
              color: 'var(--ink)',
              fontSize: 14,
              minWidth: 260,
              outline: 'none',
            }}
          />

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13.5,
              color: 'var(--ink)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => {
                setVerifiedOnly(e.target.checked)
                setCurrentPage(1)
              }}
              style={{ accentColor: 'var(--growth)' }}
            />
            Verified Only
          </label>
        </div>

        <Button variant="primary" size="md" onClick={onOpenWriteReview}>
          ★ Leave a Verified Review
        </Button>
      </div>

      {/* 4. Paginated Review Cards Feed (Lazy Loaded State or Content) */}
      {isLoading ? (
        <ReviewsFeedSkeleton />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {paginatedReviews.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: 'center',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-card)',
                border: '1px dashed var(--ink-12)',
                color: 'var(--ink-60)',
              }}
            >
              No reviews match your filter criteria. Try resetting your search filter.
            </div>
          ) : (
            paginatedReviews.map((rev: TechnicianReview) => {
              const currentHelpful = helpfulCounts[rev.id] ?? rev.helpfulCount
              const isVoted = votedHelpful[rev.id]

              return (
                <div
                  key={rev.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--ink-12)',
                    borderRadius: 'var(--radius-card)',
                    padding: 24,
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: 'var(--bg-sunken)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: 'var(--ink)',
                        }}
                      >
                        {rev.authorAvatar ? (
                          <img src={rev.authorAvatar} alt={rev.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          rev.authorName[0]
                        )}
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 15 }}>
                          {rev.authorName}
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--ink-60)', marginTop: 2 }}>
                          Reviewed on {rev.date}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      {/* Prominent Verified Transaction Checkmark Badge */}
                      {rev.isVerifiedEscrow && (
                        <Badge tone="growth" style={{ padding: '6px 12px', fontSize: 12.5 }}>
                          <span style={{ fontSize: 14, marginRight: 2 }}>✓</span> Verified Transaction — Escrow Backed
                        </Badge>
                      )}

                     
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--solar-12)', padding: '4px 10px', borderRadius: 'var(--radius-pill)' }}>
                        <span style={{ fontSize: 14, color: 'var(--solar)', fontWeight: 800 }}>
                          {'★'.repeat(rev.rating)}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-data)' }}>
                          {rev.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Specific Device Repaired:
                    </span>
                    <span
                      style={{
                        background: 'var(--bg-sunken)',
                        border: '1px solid var(--ink-12)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                       {rev.deviceType} <span style={{ color: 'var(--ink-60)', fontWeight: 400 }}>({rev.repairCategory})</span>
                    </span>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
                      {rev.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-60)', lineHeight: 1.6 }}>
                      {rev.comment}
                    </p>
                  </div>

                  {rev.photos && rev.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      {rev.photos.map((p: string, idx: number) => (
                        <img
                          key={idx}
                          src={p}
                          alt="Repair proof photo"
                          style={{
                            width: 90,
                            height: 90,
                            borderRadius: 'var(--radius-input)',
                            objectFit: 'cover',
                            border: '1px solid var(--ink-12)',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {rev.technicianReply && (
                    <div
                      style={{
                        padding: 14,
                        borderRadius: 'var(--radius-input)',
                        background: 'var(--bg-sunken)',
                        borderLeft: '3px solid var(--growth)',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
                        Technician Reply ({rev.technicianReply.date}):
                      </div>
                      <div style={{ fontSize: 13.5, color: 'var(--ink-60)', lineHeight: 1.5 }}>
                        {rev.technicianReply.text}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 12,
                      borderTop: '1px solid var(--ink-12)',
                      fontSize: 12.5,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-data)', color: 'var(--ink-40)' }}>
                     Transaction ID: <code style={{ color: 'var(--ink-60)' }}></code>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                      style={{
                        background: isVoted ? 'var(--growth-12)' : 'none',
                        border: isVoted ? '1px solid var(--growth)' : '1px solid var(--ink-12)',
                        color: isVoted ? 'var(--growth)' : 'var(--ink-60)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: isVoted ? 'default' : 'pointer',
                      }}
                    >
                       Helpful ({currentHelpful})
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* 5. Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--ink-12)',
            borderRadius: 'var(--radius-card)',
            padding: '12px 20px',
            marginTop: 8,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 13, color: 'var(--ink-60)', fontFamily: 'var(--font-data)' }}>
            Showing <strong>{startIndex + 1}–{Math.min(startIndex + REVIEWS_PER_PAGE, totalFiltered)}</strong> of <strong>{totalFiltered}</strong> reviews
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ← Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum: number) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: currentPage === pageNum ? '2px solid var(--ink)' : '1px solid var(--ink-12)',
                  background: currentPage === pageNum ? 'var(--ink)' : 'transparent',
                  color: currentPage === pageNum ? 'var(--canvas)' : 'var(--ink)',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {pageNum}
              </button>
            ))}

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function AspectBar({ label, score }: { label: string; score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
      <span style={{ color: 'var(--ink-60)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, color: 'var(--ink)' }}>
        {score.toFixed(1)} / 5.0
      </span>
    </div>
  )
}
