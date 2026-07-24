import { TECHNICIANS_DATA, TECHNICIAN_REVIEWS, REPAIR_PORTFOLIO_ITEMS } from '@/data/techniciansData'
import { TechnicianProfile, TechnicianReview, RepairPortfolioItem } from '@/types/technician'

/**
 * Server Component Data Fetcher:
 * Fetches technician profile on the server for rapid FCP and SEO indexing.
 */
export async function getTechnicianProfileServer(
  walletIdOrHandle: string
): Promise<TechnicianProfile | null> {
  // Simulate lightweight server database/RPC fetch delay
  await new Promise((res) => setTimeout(res, 20))

  const q = walletIdOrHandle.toLowerCase()
  const found = TECHNICIANS_DATA.find((t) => {
    return (
      t.id.toLowerCase() === q ||
      t.stellarAddress.toLowerCase().includes(q) ||
      t.handle.toLowerCase().replace('@', '') === q
    )
  })

  return found || TECHNICIANS_DATA[0]
}

/**
 * Client-Side Lazy Data Fetcher (SWR / React Query style):
 * Lazy loads reviews on the client to keep initial HTML payload lightweight.
 */
export async function getTechnicianReviewsClient(
  technicianId: string
): Promise<TechnicianReview[]> {
  // Simulate async API latency for client-side reviews hydration
  await new Promise((res) => setTimeout(res, 400))

  return TECHNICIAN_REVIEWS.filter((r) => r.technicianId === technicianId)
}

export async function getTechnicianPortfolioClient(
  technicianId: string
): Promise<RepairPortfolioItem[]> {
  await new Promise((res) => setTimeout(res, 150))
  return REPAIR_PORTFOLIO_ITEMS.filter((p) => p.technicianId === technicianId)
}
