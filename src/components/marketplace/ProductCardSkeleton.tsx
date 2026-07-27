'use client'


export function ProductCardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--ink-12)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        height: 410, 
      }}
    >
      
      <div
        style={{
          height: 190,
          width: '100%',
          background: 'var(--bg-sunken)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 110,
            height: 24,
            borderRadius: 'var(--radius-pill)',
            background: 'var(--ink-12)',
          }}
        />
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ width: 80, height: 12, borderRadius: 4, background: 'var(--bg-sunken)' }} />
          <div style={{ width: '90%', height: 20, borderRadius: 4, background: 'var(--bg-sunken)' }} />
          <div style={{ width: '60%', height: 14, borderRadius: 4, background: 'var(--bg-sunken)' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <div style={{ width: 70, height: 20, borderRadius: 'var(--radius-pill)', background: 'var(--bg-sunken)' }} />
          <div style={{ width: 85, height: 20, borderRadius: 'var(--radius-pill)', background: 'var(--bg-sunken)' }} />
          <div style={{ width: 60, height: 20, borderRadius: 'var(--radius-pill)', background: 'var(--bg-sunken)' }} />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: 8,
            borderTop: '1px solid var(--ink-12)',
          }}
        >
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-sunken)' }} />
            <div style={{ width: 80, height: 12, borderRadius: 4, background: 'var(--bg-sunken)' }} />
          </div>
          <div style={{ width: 50, height: 14, borderRadius: 4, background: 'var(--bg-sunken)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ width: 90, height: 18, borderRadius: 4, background: 'var(--bg-sunken)' }} />
            <div style={{ width: 70, height: 12, borderRadius: 4, background: 'var(--bg-sunken)' }} />
          </div>

          <div
            style={{
              width: 95,
              height: 32,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--bg-sunken)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
