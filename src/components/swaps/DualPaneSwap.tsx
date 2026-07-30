'use client'

import { useEffect, useState } from 'react'
import { DeviceCard } from './DeviceCard'
import { ValueWarning } from './ValueWarning'
import { CountdownTimer } from './CountdownTimer'
import { SwapActions } from './SwapActions'
import { TransactionOverlay } from './TransactionOverlay'
import { BalanceWarning } from './BalanceWarning'
import { parseHorizonError } from './BlockchainErrorHandler'
import { SwapWebSocketProvider, useSwapWebSocket } from './SwapWebSocket'
import { useWallet } from '../../wallet/WalletProvider'
import { Swap, type TransactionStep } from './types'

interface DualPaneSwapProps {
  swap: Swap
  isUserInitiator?: boolean
  userUsdcBalance?: number
  onCounter?: () => void
  onAccept?: () => void
  onReject?: () => void
  onCancel?: () => void
  onFiatOnRamp?: () => void
}

function DualPaneSwapContent({
  swap,
  isUserInitiator = true,
  userUsdcBalance = 0,
  onCounter,
  onAccept,
  onReject,
  onCancel,
  onFiatOnRamp,
}: DualPaneSwapProps) {
  const { state, subscribe } = useSwapWebSocket()
  const { sign, address } = useWallet()
  const [transactionStep, setTransactionStep] = useState<TransactionStep>('waiting')
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [transactionError, setTransactionError] = useState<string | undefined>()

  useEffect(() => {
    const unsubscribe = subscribe(swap.id)
    return unsubscribe
  }, [swap.id, subscribe])

  const handleDepositCollateral = async () => {
    if (!address) {
      setTransactionError('Please connect your wallet first')
      return
    }

    setIsTransactionOpen(true)
    setTransactionStep('waiting')
    setTransactionError(undefined)

    try {
      setTransactionStep('signing')

      const response = await fetch(`/api/swaps/${swap.id}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch transaction')
      }

      const { xdr } = await response.json()

      setTransactionStep('submitting')

      const signedXdr = await sign(xdr)

      const submitResponse = await fetch(`/api/swaps/${swap.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signedXdr }),
      })

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json()
        throw new Error(errorData.message || 'Transaction submission failed')
      }

      setTransactionStep('confirmed')
    } catch (error) {
      setTransactionError(parseHorizonError(error))
      setTransactionStep('failed')
    }
  }

  const handleRetryTransaction = () => {
    handleDepositCollateral()
  }

  const handleCloseTransaction = () => {
    setIsTransactionOpen(false)
    setTransactionStep('waiting')
    setTransactionError(undefined)
  }

  const requiredCollateral = swap.targetDevice.collateralUsdc
  const hasInsufficientBalance = userUsdcBalance < requiredCollateral

  return (
    <main
      style={{
        maxWidth: 1320,
        margin: '0 auto',
        padding: '64px 32px',
      }}
      aria-label="Swap interface"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          Device Swap
        </h1>
        <CountdownTimer expiresAt={swap.expiresAt} />
      </div>

      <ValueWarning
        userValue={swap.userDevice.valueUsd}
        targetValue={swap.targetDevice.valueUsd}
        targetCollateral={swap.targetDevice.collateralUsdc}
      />

      {state === 'agreed_awaiting_collateral' && hasInsufficientBalance && (
        <BalanceWarning
          requiredUsdc={requiredCollateral}
          currentUsdc={userUsdcBalance}
          onFiatOnRamp={onFiatOnRamp}
        />
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px',
          marginBottom: '32px',
        }}
      >
        <DeviceCard device={swap.userDevice} label="Your Device" isUserDevice />
        <DeviceCard device={swap.targetDevice} label="Their Device" />
      </div>

      <SwapActions
        state={state}
        onCounter={onCounter || (() => {})}
        onAccept={onAccept || (() => {})}
        onReject={onReject || (() => {})}
        onCancel={onCancel || (() => {})}
        onDepositCollateral={handleDepositCollateral}
        isUserInitiator={isUserInitiator}
      />

      <TransactionOverlay
        isOpen={isTransactionOpen}
        step={transactionStep}
        error={transactionError}
        onClose={handleCloseTransaction}
        onRetry={handleRetryTransaction}
      />
    </main>
  )
}

export function DualPaneSwap(props: DualPaneSwapProps) {
  return (
    <SwapWebSocketProvider>
      <DualPaneSwapContent {...props} />
    </SwapWebSocketProvider>
  )
}
