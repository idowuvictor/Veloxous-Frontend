'use client'

export function ReviewsFeedSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'pulse 1.5s infinite ease-in-out' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--ink-12)',
            borderRadius: 'var(--radius-card)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-sunken)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ width: 120, height: 14, background: 'var(--bg-sunken)', borderRadius: 4 }} />
                <div style={{ width: 180, height: 12, background: 'var(--bg-sunken)', borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ width: 100, height: 24, background: 'var(--bg-sunken)', borderRadius: 12 }} />
          </div>

          <div style={{ width: 220, height: 26, background: 'var(--bg-sunken)', borderRadius: 13 }} />
          <div style={{ width: '80%', height: 16, background: 'var(--bg-sunken)', borderRadius: 4 }} />
          <div style={{ width: '60%', height: 16, background: 'var(--bg-sunken)', borderRadius: 4 }} />
        </div>
      ))}
    </div>
  )
}
