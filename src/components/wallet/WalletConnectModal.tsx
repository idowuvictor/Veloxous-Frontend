'use client'

import { useEffect, useState } from 'react'
import { Button } from '../Button'
import { ModuleInterface } from '@creit.tech/stellar-wallets-kit'

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  modules: ModuleInterface[]
  onConnect: (moduleId: string) => Promise<void>
  isConnecting: boolean
  connectingTo: string | null
}

export function WalletConnectModal({
  isOpen,
  onClose,
  modules,
  onConnect,
  isConnecting,
  connectingTo,
}: WalletConnectModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  // Ensure Freighter, Albedo, xBull are prominent
  const priorityWallets = ['freighter', 'albedo', 'xbull']
  
  const sortedModules = [...modules].sort((a, b) => {
    const aIndex = priorityWallets.indexOf(a.productId.toLowerCase())
    const bIndex = priorityWallets.indexOf(b.productId.toLowerCase())
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return 0
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--paper, #fff)',
          borderRadius: 24,
          padding: 32,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 24,
              lineHeight: 1,
              color: 'var(--ink-60)',
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sortedModules.map((m) => {
            const isLoading = isConnecting && connectingTo === m.productId
            
            // Check if installed/supported based on kit logic, 
            // some modules expose `isAvailable` but the kit typically just errors if not installed.
            // We can provide a generic link if they fail, or just render the connect button.
            const installLinks: Record<string, string> = {
              freighter: 'https://www.freighter.app/',
              xbull: 'https://xbull.app/',
              albedo: 'https://albedo.link/',
            }
            
            const link = installLinks[m.productId.toLowerCase()]

            return (
              <div
                key={m.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  borderRadius: 16,
                  border: '1px solid var(--ink-10, #e2e8f0)',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {m.iconUrl && (
                    <img
                      src={m.iconUrl}
                      alt={m.name}
                      style={{ width: 32, height: 32, borderRadius: 8 }}
                    />
                  )}
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
                    {m.name}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={isLoading}
                    disabled={isConnecting}
                    onClick={() => onConnect(m.productId)}
                  >
                    Connect
                  </Button>
                  
                  {link && (
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ 
                        fontSize: 14, 
                        color: 'var(--ink-60)', 
                        textDecoration: 'underline',
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 8
                      }}
                    >
                      Install
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {isConnecting && (
          <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--ink-60)', fontSize: 14 }}>
            Please approve the signature request in your wallet extension.
          </div>
        )}
      </div>
    </div>
  )
}
