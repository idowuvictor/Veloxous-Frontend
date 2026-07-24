import type { Metadata } from 'next'
import { FixItDirectory } from '@/screens/FixItDirectory'
import { getTechnicianProfileServer } from '@/services/techniciansService'

interface PageProps {
  params: Promise<{ wallet_id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { wallet_id } = await params
  const tech = await getTechnicianProfileServer(wallet_id)

  if (!tech) {
    return {
      title: 'Verified Repair Technician | Veloxous',
      description: 'Find verified electronics repair technicians with on-chain Soroban escrow guarantee.',
    }
  }

  return {
    title: `${tech.name} (${tech.handle}) — Verified Repair Technician | Veloxous`,
    description: `${tech.title} in ${tech.cityCountry || tech.location}. ${tech.rating}★ rating from ${tech.totalReviews} verified reviews. Backed by $${tech.stakedBondUSD} Soroban smart escrow deposit.`,
    openGraph: {
      title: `${tech.name} — ${tech.title}`,
      description: tech.bio,
      images: [{ url: tech.avatar }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tech.name} — Verified Repair Technician`,
      description: tech.bio,
    },
  }
}

export default async function TechnicianWalletPage({ params }: PageProps) {
  const { wallet_id } = await params
  const tech = await getTechnicianProfileServer(wallet_id)

  return <FixItDirectory initialTechId={tech?.id} serverTechnician={tech} />
}
