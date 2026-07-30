import { render, screen, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SwapWebSocketProvider, useSwapWebSocket } from './SwapWebSocket'

describe('SwapWebSocket', () => {
  let mockWebSocket: {
    send: ReturnType<typeof vi.fn>
    close: ReturnType<typeof vi.fn>
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    global.WebSocket = class {
      constructor() {
        return mockWebSocket
      }
    } as any
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should provide initial state as negotiation', () => {
    const TestComponent = () => {
      const { state } = useSwapWebSocket()
      return <div data-testid="state">{state}</div>
    }

    render(
      <SwapWebSocketProvider>
        <TestComponent />
      </SwapWebSocketProvider>
    )

    expect(screen.getByTestId('state')).toHaveTextContent('negotiation')
  })

  it('should update state when WebSocket receives message', async () => {
    const TestComponent = () => {
      const { state, subscribe } = useSwapWebSocket()
      useEffect(() => { subscribe('123') }, [])
      return <div data-testid="state">{state}</div>
    }

    render(
      <SwapWebSocketProvider>
        <TestComponent />
      </SwapWebSocketProvider>
    )

    const onMessageCallback = (mockWebSocket as any).onmessage

    if (onMessageCallback) {
      onMessageCallback({ data: JSON.stringify({ state: 'agreed_awaiting_collateral' }) })
    }

    await waitFor(() => {
      expect(screen.getByTestId('state')).toHaveTextContent('agreed_awaiting_collateral')
    })
  })

  it('should transition from negotiation to agreed_awaiting_collateral on accept', async () => {
    const TestComponent = () => {
      const { state, subscribe } = useSwapWebSocket()
      useEffect(() => { subscribe('123') }, [])
      return <div data-testid="state">{state}</div>
    }

    render(
      <SwapWebSocketProvider>
        <TestComponent />
      </SwapWebSocketProvider>
    )

    const onMessageCallback = (mockWebSocket as any).onmessage

    if (onMessageCallback) {
      onMessageCallback({ data: JSON.stringify({ state: 'agreed_awaiting_collateral' }) })
    }

    await waitFor(() => {
      expect(screen.getByTestId('state')).toHaveTextContent('agreed_awaiting_collateral')
    })
  })

  it('should handle invalid WebSocket messages gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const TestComponent = () => {
      const { state, subscribe } = useSwapWebSocket()
      useEffect(() => { subscribe('123') }, [])
      return <div data-testid="state">{state}</div>
    }

    render(
      <SwapWebSocketProvider>
        <TestComponent />
      </SwapWebSocketProvider>
    )

    const onMessageCallback = (mockWebSocket as any).onmessage

    if (onMessageCallback) {
      onMessageCallback({ data: 'invalid json' })
    }

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  it('should set connected to true when WebSocket opens', async () => {
    const TestComponent = () => {
      const { isConnected, subscribe } = useSwapWebSocket()
      
      useEffect(() => { subscribe('123') }, [])
      
      return <div data-testid="connected">{isConnected.toString()}</div>
    }

    render(
      <SwapWebSocketProvider>
        <TestComponent />
      </SwapWebSocketProvider>
    )

    const onOpenCallback = (mockWebSocket as any).onopen

    if (onOpenCallback) {
      onOpenCallback()
    }

    await waitFor(() => {
      expect(screen.getByTestId('connected')).toHaveTextContent('true')
    })
  })

  it('should close WebSocket on unmount', () => {
    const TestComponent = () => {
      const { subscribe } = useSwapWebSocket()
      
      useEffect(() => { subscribe('123') }, [])
      
      return <div>Test</div>
    }
    const { unmount } = render(
      <SwapWebSocketProvider>
        <TestComponent />
      </SwapWebSocketProvider>
    )

    unmount()

    expect(mockWebSocket.close).toHaveBeenCalled()
  })
})
