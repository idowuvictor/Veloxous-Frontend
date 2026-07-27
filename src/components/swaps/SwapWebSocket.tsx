'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { SwapState } from './types'

interface SwapWebSocketContextValue {
  state: SwapState
  isConnected: boolean
  lastUpdate: string | null
  subscribe: (swapId: string) => () => void
}

const SwapWebSocketContext = createContext<SwapWebSocketContextValue | null>(null)

export function useSwapWebSocket(): SwapWebSocketContextValue {
  const ctx = useContext(SwapWebSocketContext)
  if (!ctx) throw new Error('useSwapWebSocket must be used within SwapWebSocketProvider')
  return ctx
}

interface SwapWebSocketProviderProps {
  children: ReactNode
  wsUrl?: string
}

export function SwapWebSocketProvider({ children, wsUrl = 'ws://localhost:8080' }: SwapWebSocketProviderProps) {
  const [state, setState] = useState<SwapState>('negotiation')
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [currentSwapId, setCurrentSwapId] = useState<string | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)

  const subscribe = (swapId: string): (() => void) => {
    setCurrentSwapId(swapId)

    if (ws) {
      ws.close()
    }

    const newWs = new WebSocket(`${wsUrl}/swaps/${swapId}`)
    setWs(newWs)

    newWs.onopen = () => {
      setIsConnected(true)
    }

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.state) {
          setState(data.state)
          setLastUpdate(new Date().toISOString())
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }

    newWs.onclose = () => {
      setIsConnected(false)
    }

    return () => {
      newWs.close()
    }
  }

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [ws])

  return (
    <SwapWebSocketContext.Provider value={{ state, isConnected, lastUpdate, subscribe }}>
      {children}
    </SwapWebSocketContext.Provider>
  )
}
