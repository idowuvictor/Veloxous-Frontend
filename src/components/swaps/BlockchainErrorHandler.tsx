'use client'

interface HorizonError {
  code: number
  title: string
  detail?: string
  extras?: {
    result_codes?: {
      transaction?: string
      operations?: string[]
    }
  }
}

export function parseHorizonError(error: any): string {
  try {
    if (error?.response?.data) {
      const horizonError = error.response.data as HorizonError

      if (horizonError.code === 400) {
        return 'Transaction failed: Invalid request format. Please check your inputs.'
      }

      if (horizonError.code === 404) {
        return 'Transaction failed: Resource not found on the network.'
      }

      if (horizonError.extras?.result_codes?.transaction === 'tx_bad_seq') {
        return 'Transaction failed: Sequence number mismatch. Please try again.'
      }

      if (horizonError.extras?.result_codes?.transaction === 'tx_insufficient_fee') {
        return 'Transaction failed: Insufficient gas fee. Please try again with a higher fee.'
      }

      if (horizonError.extras?.result_codes?.transaction === 'tx_no_source_account') {
        return 'Transaction failed: Source account not found or not funded.'
      }

      if (horizonError.extras?.result_codes?.transaction === 'tx_failed') {
        return 'Transaction failed: One or more operations failed. Please check your account balance.'
      }

      if (horizonError.extras?.result_codes?.operations?.includes('op_no_trust')) {
        return 'Transaction failed: You do not have a trustline for USDC.'
      }

      if (horizonError.extras?.result_codes?.operations?.includes('op_underfunded')) {
        return 'Transaction failed: Insufficient balance to complete this operation.'
      }

      if (horizonError.extras?.result_codes?.operations?.includes('op_low_reserve')) {
        return 'Transaction failed: Account reserve requirements not met.'
      }

      return horizonError.detail || horizonError.title || 'Transaction failed on the Stellar network.'
    }

    if (error?.message) {
      if (error.message.includes('network')) {
        return 'Network error: Unable to connect to the Stellar network. Please check your connection.'
      }

      if (error.message.includes('timeout')) {
        return 'Transaction timed out. The network may be congested. Please try again.'
      }

      return error.message
    }

    return 'An unexpected error occurred during the transaction.'
  } catch {
    return 'Failed to process error. Please try again.'
  }
}
