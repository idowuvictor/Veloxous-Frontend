'use client'

import { useState } from 'react'
import { TECHNICIANS_DATA, REPAIR_PORTFOLIO_ITEMS, TECHNICIAN_REVIEWS } from '@/data/techniciansData'
import { TechnicianProfile, TechnicianReview, RepairPortfolioItem } from '@/types/technician'
import { useTechnicianReviews } from '@/hooks/useTechnicianReviews'
import { TechnicianSelectorBar } from '@/components/repair/TechnicianSelectorBar'
import { TechnicianHeader } from '@/components/repair/TechnicianHeader'
import { TrustGuaranteeBar } from '@/components/repair/TrustGuaranteeBar'
import { TechnicianStatsGrid } from '@/components/repair/TechnicianStatsGrid'
import { OverviewTab } from '@/components/repair/OverviewTab'
import { PortfolioTab } from '@/components/repair/PortfolioTab'
import { ReviewsDashboardTab } from '@/components/repair/ReviewsDashboardTab'
import { EscrowVaultTab } from '@/components/repair/EscrowVaultTab'
import { QuoteRequestModal } from '@/components/repair/QuoteRequestModal'
import { WriteReviewModal } from '@/components/repair/WriteReviewModal'
import { TechnicianAdminView } from '@/components/repair/TechnicianAdminView'
import { Toast, ToastTone } from '@/components/Toast'

interface FixItDirectoryProps {
  initialTechId?: string
  serverTechnician?: TechnicianProfile | null
}

export function FixItDirectory({ initialTechId, serverTechnician }: FixItDirectoryProps = {}) {
  const defaultTech = serverTechnician || TECHNICIANS_DATA.find((t) => t.id === initialTechId) || TECHNICIANS_DATA[0]

  const [selectedTechId, setSelectedTechId] = useState<string>(defaultTech.id)
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews' | 'escrow'>('overview')
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public')

  // Saved technicians
  const [savedTechs, setSavedTechs] = useState<Record<string, boolean>>({})

  // Modals state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [writeReviewOpen, setWriteReviewOpen] = useState(false)

  // Selected Service for Quote prefill
  const [selectedQuotePrefill, setSelectedQuotePrefill] = useState<{
    service?: string
    category?: string
    price?: string
  }>({})

  // Initial reviews for selected technician
  const initialTechReviews = TECHNICIAN_REVIEWS.filter((r) => r.technicianId === selectedTechId)

  // SWR-Style Client Hook for Lazy-Loading Reviews Feed
  const { reviews: currentReviews, isLoading: isReviewsLoading, addReview } = useTechnicianReviews(
    selectedTechId,
    initialTechReviews
  )

  // Toast state
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null)

  const currentTechnician: TechnicianProfile =
    TECHNICIANS_DATA.find((t: TechnicianProfile) => t.id === selectedTechId) || defaultTech

  const currentPortfolio: RepairPortfolioItem[] = REPAIR_PORTFOLIO_ITEMS.filter(
    (p: RepairPortfolioItem) => p.technicianId === currentTechnician.id
  )

  const handleToggleSave = (techId: string) => {
    setSavedTechs((prev) => {
      const nextState = !prev[techId]
      setToast({
        message: nextState
          ? `${currentTechnician.name} saved to your bookmarks!`
          : `Removed ${currentTechnician.name} from bookmarks.`,
        tone: 'solar',
      })
      return { ...prev, [techId]: nextState }
    })
  }

  const handleOpenServiceQuote = (service: string, category: string, price: string) => {
    setSelectedQuotePrefill({ service, category, price })
    setQuoteModalOpen(true)
  }

  const handleQuoteSubmitSuccess = (details: { device: string; service: string; cost: string; s3PhotosCount: number }) => {
    setQuoteModalOpen(false)
    setToast({
      message: `Quote request (${details.s3PhotosCount} S3 photos attached) & ${details.cost} escrow deposit submitted for ${details.device}!`,
      tone: 'success',
    })
  }

  const handleAddReview = (newReview: TechnicianReview) => {
    addReview(newReview)
    setWriteReviewOpen(false)
    setToast({
      message: 'Your verified review has been submitted and linked to your repair receipt!',
      tone: 'success',
    })
  }

  return (
    <main
      style={{
        maxWidth: 1320,
        margin: '0 auto',
        padding: '40px 24px 80px 24px',
        minHeight: '85vh',
        position: 'relative',
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 1100 }}>
          <Toast
            message={toast.message}
            tone={toast.tone}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}

      {/* Prominent Sticky CTA Floating Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 900,
        }}
      >
        <button
          type="button"
          onClick={() => {
            setSelectedQuotePrefill({})
            setQuoteModalOpen(true)
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 24px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--solar)',
            color: 'var(--ink)',
            border: '0px',
            fontSize: 15,
            // fontWeight: 800,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lg)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Request Repair Quote
        </button>
      </div>

      {/* Top Technician Selector Bar */}
      <TechnicianSelectorBar
        technicians={TECHNICIANS_DATA}
        selectedId={selectedTechId}
        onSelect={(id: string) => {
          setSelectedTechId(id)
          setActiveTab('overview')
        }}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((m) => (m === 'public' ? 'admin' : 'public'))}
      />

      {viewMode === 'admin' ? (
        /* Technician Self-Service Admin Dashboard */
        <TechnicianAdminView technician={currentTechnician} />
      ) : (
        /* Public High-Trust Landing Profile Architecture */
        <>
          {/* Main Hero Header */}
          <TechnicianHeader
            technician={currentTechnician}
            onOpenQuoteModal={() => {
              setSelectedQuotePrefill({})
              setQuoteModalOpen(true)
            }}
            onOpenWriteReview={() => setWriteReviewOpen(true)}
            isSaved={!!savedTechs[currentTechnician.id]}
            onToggleSave={() => handleToggleSave(currentTechnician.id)}
          />

          {/* On-Chain Escrow Security Shield Guarantee */}
          <TrustGuaranteeBar
            stakedXlm={currentTechnician.stakedBondXLM}
            escrowContract={currentTechnician.escrowContract}
          />

          {/* Key Performance & Trust Metrics */}
          <TechnicianStatsGrid technician={currentTechnician} />

          {/* Main Profile Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              borderBottom: '1px solid var(--ink-12)',
              marginBottom: 28,
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'overview', label: '📋 Overview & Rates', badge: undefined },
              { id: 'portfolio', label: '🛠️ Proof Portfolio', badge: currentPortfolio.length },
              { id: 'reviews', label: '⭐ Verified Reviews', badge: currentReviews.length },
              { id: 'escrow', label: '🛡️ Soroban Escrow Vault', badge: 'Active' },
            ].map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '12px 20px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--ink)' : 'var(--ink-60)',
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? '3px solid var(--solar)' : '3px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'color var(--dur-press) var(--ease-out)',
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      style={{
                        fontFamily: 'var(--font-data)',
                        fontSize: 12,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        background: active ? 'var(--solar-12)' : 'var(--bg-sunken)',
                        color: active ? 'var(--ink)' : 'var(--ink-60)',
                        fontWeight: 600,
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Active Tab View */}
          {activeTab === 'overview' && (
            <OverviewTab
              technician={currentTechnician}
              onSelectServiceQuote={handleOpenServiceQuote}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioTab portfolio={currentPortfolio} />
          )}

          {activeTab === 'reviews' && (
            <ReviewsDashboardTab
              technician={currentTechnician}
              reviews={currentReviews}
              isLoading={isReviewsLoading}
              onOpenWriteReview={() => setWriteReviewOpen(true)}
            />
          )}

          {activeTab === 'escrow' && (
            <EscrowVaultTab technician={currentTechnician} />
          )}
        </>
      )}

      {/* Quote Request Modal Wizard */}
      {quoteModalOpen && (
        <QuoteRequestModal
          technician={currentTechnician}
          initialService={selectedQuotePrefill.service}
          initialCategory={selectedQuotePrefill.category}
          initialPrice={selectedQuotePrefill.price}
          onClose={() => setQuoteModalOpen(false)}
          onSubmitSuccess={handleQuoteSubmitSuccess}
        />
      )}

      {/* Write Review Modal */}
      {writeReviewOpen && (
        <WriteReviewModal
          technician={currentTechnician}
          onClose={() => setWriteReviewOpen(false)}
          onSubmitReview={handleAddReview}
        />
      )}
    </main>
  )
}
