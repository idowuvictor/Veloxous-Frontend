export interface Certification {
  id: string
  name: string
  issuer: string
  year: number
  verifiedHash: string
  badgeUrl?: string
}

export interface PricingItem {
  category: string
  service: string
  startPrice: string
  avgTurnaround: string
  description?: string
}

export interface AspectRatings {
  communication: number
  technicalSkill: number
  speed: number
  escrowReliability: number
  priceValue: number
}

export interface RatingBreakdown {
  star5: number
  star4: number
  star3: number
  star2: number
  star1: number
}

export interface TechnicianProfile {
  id: string
  name: string
  handle: string
  title: string
  avatar: string
  bannerColor?: string
  verifiedStatus: 'Stellar Escrow Verified' | 'Master Guild Certified' | 'Bonded Staker'
  is_verified?: boolean
  trustScore?: number
  cityCountry?: string
  stellarAddress: string
  escrowContract: string
  stakedBondXLM: number
  stakedBondUSD: number
  rating: number
  totalReviews: number
  ratingBreakdown: RatingBreakdown
  aspectRatings: AspectRatings
  location: string
  serviceRadius: string
  responseTime: string
  availability: {
    status: 'available' | 'busy' | 'away'
    text: string
  }
  experienceYears: number
  completedRepairs: number
  successRate: number
  avgTurnaroundHours: number
  ewasteSavedKg: number
  carbonSavedKg: number
  bio: string
  certifications: Certification[]
  specialties: string[]
  equipment: string[]
  warrantyPolicy: string
  pricingGuide: PricingItem[]
}

export interface RepairPortfolioItem {
  id: string
  technicianId: string
  title: string
  device: string
  category: string
  faultSummary: string
  solutionDetails: string
  beforeImg?: string
  afterImg?: string
  turnaroundHours: number
  cost: string
  ewasteKg: number
  stellarTxHash: string
  date: string
  customerRating: number
}

export interface TechnicianReview {
  id: string
  technicianId: string
  authorName: string
  authorAvatar?: string
  rating: number
  date: string
  deviceType: string
  repairCategory: string
  title: string
  comment: string
  isVerifiedEscrow: boolean
  stellarTxHash: string
  helpfulCount: number
  photos?: string[]
  technicianReply?: {
    date: string
    text: string
  }
}
