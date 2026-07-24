'use client'

import { useState, useEffect } from 'react'
import { TechnicianReview } from '@/types/technician'
import { getTechnicianReviewsClient } from '@/services/techniciansService'

export function useTechnicianReviews(technicianId: string, initialReviews: TechnicianReview[]) {
  const [data, setData] = useState<TechnicianReview[]>(initialReviews)
  const [isLoading, setIsLoading] = useState<boolean>(initialReviews.length === 0)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    getTechnicianReviewsClient(technicianId)
      .then((reviews) => {
        if (isMounted) {
          setData(reviews)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [technicianId])

  const addReview = (newReview: TechnicianReview) => {
    setData((prev) => [newReview, ...prev])
  }

  return { reviews: data, isLoading, error, addReview }
}
