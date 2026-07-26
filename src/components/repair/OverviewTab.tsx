'use client'

import { TechnicianProfile, Certification, PricingItem } from '@/types/technician'
import { Button, Tag, Card } from '@/components/index'

interface OverviewTabProps {
  technician: TechnicianProfile
  onSelectServiceQuote: (serviceName: string, category: string, price: string) => void
}

export function OverviewTab({ technician, onSelectServiceQuote }: OverviewTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
       
        <Card>
          <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
            Technician Profile & Background
          </h3>
          <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 12 }}>
            {technician.experienceYears} Years Certified Experience
          </div>

          <p style={{ color: 'var(--ink-60)', lineHeight: 1.6, marginTop: 8, fontSize: 15 }}>
            {technician.bio}
          </p>

          <h4 style={{ margin: '20px 0 10px 0', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-60)' }}>
            Core Specialties
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {technician.specialties.map((spec: string) => (
              <Tag key={spec}>
                {spec}
              </Tag>
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
            Verifiable Certifications & Lab Spec
          </h3>
          <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 12 }}>
             Verified Credentials
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {technician.certifications.map((cert: Certification) => (
              <div
                key={cert.id}
                style={{
                  background: 'var(--bg-sunken)',
                  border: '1px solid var(--ink-12)',
                  borderRadius: 'var(--radius-input)',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>
                    {cert.issuer}  Issued {cert.year}
                  </div>
                </div>
                <span
                  title={`Verification Hash: ${cert.verifiedHash}`}
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 11,
                    color: 'var(--growth)',
                    background: 'var(--growth-12)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 600,
                  }}
                >
                   VERIFIED
                </span>
              </div>
            ))}
          </div>

          <h4 style={{ margin: '20px 0 10px 0', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-60)' }}>
            Lab & Inspection Hardware
          </h4>
          <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--ink-60)', fontSize: 13.5, lineHeight: 1.6 }}>
            {technician.equipment.map((eq: string) => (
              <li key={eq}>{eq}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)' }}>
          Standard Repair Rates & Turnaround Matrix
        </h3>
        <div style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 16 }}>
          All repairs covered by Veloxous Guarantee
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ink-12)', color: 'var(--ink-60)', fontFamily: 'var(--font-data)' }}>
                <th style={{ padding: '10px 12px' }}>Device Category</th>
                <th style={{ padding: '10px 12px' }}>Repair Service</th>
                <th style={{ padding: '10px 12px' }}>Starting Price</th>
                <th style={{ padding: '10px 12px' }}>Est. Turnaround</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {technician.pricingGuide.map((item: PricingItem, idx: number) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--ink-12)',
                    transition: 'background var(--dur-press) var(--ease-out)',
                  }}
                >
                  <td style={{ padding: '14px 12px', fontWeight: 600, color: 'var(--ink)' }}>{item.category}</td>
                  <td style={{ padding: '14px 12px', color: 'var(--ink)' }}>
                    <div>{item.service}</div>
                    {item.description && (
                      <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{item.description}</div>
                    )}
                  </td>
                  <td style={{ padding: '14px 12px', fontFamily: 'var(--font-data)', fontWeight: 700, color: 'var(--growth)' }}>
                    {item.startPrice}
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--ink-60)' }}>{item.avgTurnaround}</td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSelectServiceQuote(item.service, item.category, item.startPrice)}
                    >
                      Book Quote
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
