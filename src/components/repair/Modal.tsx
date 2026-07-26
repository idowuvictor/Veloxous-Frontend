'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
  onClose: () => void
  titleId: string
  descriptionId?: string
}

export function Modal({ children, onClose, titleId, descriptionId }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle Escape key and focus trapping
  useEffect(() => {
    const modalEl = modalRef.current
    if (!modalEl) return

    // Focus the first focusable element
    const focusables = modalEl.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length > 0) {
      focusables[0].focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const currentFocusables = Array.from(
          modalEl.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
        if (!currentFocusables.length) return

        const firstEl = currentFocusables[0]
        const lastEl = currentFocusables[currentFocusables.length - 1]

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1200, // Use a high z-index
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="hb-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}