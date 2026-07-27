'use client'

import { memo } from 'react'
import Image from 'next/image'
import { DeviceProduct } from '@/types/marketplace'
import { Button } from '@/components/index'
import { DEFAULT_BLUR_DATA_URL } from '@/utils/imageUtils'

interface DeviceCardProps {
  product: DeviceProduct
  onSelectQuote?: (product: DeviceProduct) => void
}


export const DeviceCard = memo(function DeviceCard({ product, onSelectQuote }: DeviceCardProps) {
  const isBrandNew = product.condition === 'Brand New'
  const isExcellent = product.condition.includes('Excellent')

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--ink-12)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--dur-press) var(--ease-out), boxShadow var(--dur-press) var(--ease-out)',
        opacity: product.inStock ? 1 : 0.6,
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 190,
          width: '100%',
          background: 'var(--bg-sunken)',
          overflow: 'hidden',
        }}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={DEFAULT_BLUR_DATA_URL}
          style={{
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
        />

        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          <span
            style={{
              background: 'rgba(11, 22, 18, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontSize: 11.5,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {isBrandNew ? ' Brand New' : isExcellent ? ' Refurbished - Excellent' : ` ${product.condition}`}
          </span>
        </div>

        {product.discountPercent && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
            <span
              style={{
                background: 'rgba(185, 28, 28, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontSize: 11.5,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
              }}
            >
              -{product.discountPercent}% OFF
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {product.category}
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15.5,
              fontWeight: 700,
              color: 'var(--ink)',
              margin: '4px 0 2px 0',
              lineHeight: 1.3,
            }}
          >
            {product.title}
          </h3>
          <div style={{ fontSize: 12, color: 'var(--ink-60)', fontFamily: 'var(--font-data)' }}>
            {product.model}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          {product.specs.slice(0, 3).map((spec: string, idx: number) => (
            <span
              key={idx}
              style={{
                fontSize: 11,
                background: 'var(--bg-sunken)',
                border: '1px solid var(--ink-12)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--ink-60)',
                fontWeight: 500,
              }}
            >
              {spec}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--ink-12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Image
              src={product.sellerAvatar}
              alt={product.sellerName}
              width={22}
              height={22}
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontWeight: 600, color: 'var(--ink)', maxWidth: 95, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.sellerName}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-data)' }}>
            <span style={{ color: 'var(--solar)' }}>★</span>
            <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{product.rating.toFixed(2)}</span>
            <span style={{ color: 'var(--ink-60)' }}>({product.reviewsCount})</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-data)', lineHeight: 1.15 }}>
              ${product.priceUSD.toLocaleString()} USD
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--growth)', fontWeight: 600 }}>
              {product.priceUSDC.toLocaleString()} USDC
            </div>
          </div>

          <Button
            variant={product.inStock ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onSelectQuote?.(product)}
            disabled={!product.inStock}
            style={{ minWidth: 90 }}
          >
            {product.inStock ? 'Buy Now' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  )
})
