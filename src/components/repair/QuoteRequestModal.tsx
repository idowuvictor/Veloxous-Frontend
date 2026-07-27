'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { TechnicianProfile, PricingItem } from '@/types/technician'
import { Button, Badge, AmountInput } from '@/components/index'
import { uploadFileToS3 } from '@/services/s3UploadService'

interface QuoteRequestModalProps {
  technician: TechnicianProfile
  initialService?: string
  initialCategory?: string
  initialPrice?: string
  onClose: () => void
  onSubmitSuccess: (details: { device: string; service: string; cost: string; s3PhotosCount: number }) => void
}

interface UploadedPhoto {
  id: string
  name: string
  previewUrl: string
  s3PresignedUrl: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

export function QuoteRequestModal({
  technician,
  initialService,
  initialCategory,
  initialPrice,
  onClose,
  onSubmitSuccess,
}: QuoteRequestModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  const [deviceCategory, setDeviceCategory] = useState(initialCategory || 'MacBook Pro / Air')
  const [deviceModel, setDeviceModel] = useState('MacBook Pro 16" (2023, M2 Max)')
  const [issueType, setIssueType] = useState(initialService || 'Screen Replacement')

  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const [description, setDescription] = useState('')
  const [serviceMethod, setServiceMethod] = useState<'dropoff' | 'mail' | 'express'>('dropoff')
  const [customPrice, setCustomPrice] = useState(initialPrice ? initialPrice.replace(/[^0-9.]/g, '') : '180')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const successfulUploads = uploadedPhotos.filter((p) => p.status === 'completed')

  const isPhotoRequired =
    issueType.toLowerCase().includes('screen') ||
    issueType.toLowerCase().includes('water') ||
    issueType.toLowerCase().includes('damage')

  const isStep2NextDisabled =
    (isPhotoRequired && successfulUploads.length === 0) || isUploading

  const handleRealS3Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const newId = `photo-${Date.now()}`
    let preview = ''
    try {
      preview = URL.createObjectURL(file)
    } catch {
      preview = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80'
    }

    const newPhoto: UploadedPhoto = {
      id: newId,
      name: file.name,
      previewUrl: preview,
      s3PresignedUrl: '',
      progress: 5,
      status: 'uploading',
    }

    setUploadedPhotos((prev) => [...prev, newPhoto])
    setIsUploading(true)

    try {
      const s3Res = await uploadFileToS3(file, (progressPct) => {
        setUploadedPhotos((prev) =>
          prev.map((p) => (p.id === newId ? { ...p, progress: progressPct } : p))
        )
      })

      setUploadedPhotos((prev) =>
        prev.map((p) =>
          p.id === newId
            ? { ...p, progress: 100, status: 'completed', s3PresignedUrl: s3Res.fileUrl }
            : p
        )
      )
    } catch (err) {
      setUploadedPhotos((prev) =>
        prev.map((p) => (p.id === newId ? { ...p, status: 'error' } : p))
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmitSuccess({
        device: deviceModel,
        service: issueType,
        cost: `${customPrice} USDC`,
        s3PhotosCount: successfulUploads.length,
      })
    }, 400)
  }

  return (
    <Modal onClose={onClose} titleId="wizard-title" descriptionId="wizard-desc">
      <>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            border: 'none',
            background: 'none',
            fontSize: 22,
            cursor: 'pointer',
            color: 'var(--ink-60)',
          }}
        >
          ✕
        </button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Badge tone="solar">Step {step} of 4</Badge>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-60)', fontFamily: 'var(--font-data)' }}>
              Protected
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, height: 6, borderRadius: 3, background: 'var(--bg-sunken)', overflow: 'hidden' }}>
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  background: s <= step ? 'var(--solar)' : 'transparent',
                  borderRadius: 3,
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        <h2 id="wizard-title" style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 4px 0', color: 'var(--ink)' }}>
          {step === 1 && `Select Device & Issue (${technician.name})`}
          {step === 2 && 'Upload Damage Photos (AWS S3 Direct Vault)'}
          {step === 3 && 'Describe Issue & Delivery Method'}
          {step === 4 && 'Review & Submit Escrow Request'}
        </h2>
        <p id="wizard-desc" style={{ fontSize: 13.5, color: 'var(--ink-60)', margin: '0 0 24px 0' }}>
          {step === 1 && 'Choose your device category, model name, and specific repair service needed.'}
          {step === 2 && 'Attach diagnostic photos uploaded directly to AWS S3 via presigned URLs.'}
          {step === 3 && 'Add detailed symptoms and select your preferred service delivery method.'}
          {step === 4 && 'Review summary details and confirm smart contract escrow deposit.'}
        </p>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label htmlFor="device-category" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Device Category
              </label>
              <select
                id="device-category"
                value={deviceCategory}
                onChange={(e) => setDeviceCategory(e.target.value)}
                style={inputStyle}
              >
                <option value="MacBook Pro / Air">Laptop / MacBook</option>
                <option value="iPhone / iPad">Smartphone / Tablet</option>
                <option value="Solar Inverters">Solar & Power Electronics</option>
                <option value="Data Recovery">NAND & Data Recovery</option>
                <option value="Console / Audio">Gaming Console / Audio</option>
              </select>
            </div>

            <div>
              <label htmlFor="device-model" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Specific Device Model Name
              </label>
              <input
                id="device-model"
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="e.g. Apple MacBook Pro 16 (2023, M2 Max)"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="issue-type" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Primary Issue Type
              </label>
              <select
                id="issue-type"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                style={inputStyle}
              >
                <option value="Screen Replacement">Screen Replacement (Photo Required)</option>
                <option value="Water Damage Restoration">Water Damage Restoration (Photo Required)</option>
                {technician.pricingGuide.map((p: PricingItem, idx: number) => (
                  <option key={idx} value={p.service}>
                    {p.category}: {p.service} ({p.startPrice})
                  </option>
                ))}
                <option value="Custom Diagnostic / General Micro-soldering">
                  Custom Diagnostic / Micro-soldering
                </option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                Next: Upload Photos →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                border: '2px dashed var(--solar)',
                borderRadius: 'var(--radius-card)',
                padding: '24px 20px',
                textAlign: 'center',
                background: 'var(--solar-12)',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <input
                id="photo-upload-input"
                aria-label="Upload photo attachment"
                type="file"
                accept="image/*"
                onChange={handleRealS3Upload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
                Click or Drop Diagnostic Photos Here
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 4 }}>
                Direct Upload to AWS S3 via Presigned URL 
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-60)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Uploaded Damage Attachments ({successfulUploads.length}):
              </div>

              {uploadedPhotos.length === 0 ? (
                <div style={{ fontSize: 13, color: isPhotoRequired ? 'var(--ember)' : 'var(--ink-40)', fontWeight: isPhotoRequired ? 600 : 400 }}>
                  {isPhotoRequired
                    ? 'Photo upload is required for Screen / Water Damage repairs before proceeding.'
                    : 'No photos uploaded yet. (Optional)'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {uploadedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: 'var(--bg-sunken)',
                        padding: 10,
                        borderRadius: 'var(--radius-input)',
                        border: '1px solid var(--ink-12)',
                      }}
                    >
                      <img
                        src={photo.previewUrl}
                        alt={photo.name}
                        style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {photo.name}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-data)', color: 'var(--ink-60)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          S3: {photo.s3PresignedUrl || 'Uploading to AWS S3...'}
                        </div>
                        {photo.status === 'uploading' && (
                          <div style={{ height: 4, background: 'var(--ink-12)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${photo.progress}%`, height: '100%', background: 'var(--solar)', transition: 'width 0.2s' }} />
                          </div>
                        )}
                      </div>
                      {photo.status === 'completed' && (
                        <Badge tone="growth">AWS S3 Uploaded</Badge>
                      )}
                      {photo.status === 'error' && (
                        <Badge tone="ember">S3 Error</Badge>
                      )}
                      <button
                        type="button"
                        aria-label={`Remove photo ${photo.name}`}
                        onClick={() => handleRemovePhoto(photo.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ember)' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setStep(3)}
                disabled={isStep2NextDisabled}
                reason={isStep2NextDisabled ? 'Please upload at least 1 photo of the damage' : undefined}
              >
                Next: Issue Details →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label htmlFor="issue-description" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                Detailed Fault Description / Symptoms
              </label>
              <textarea
                id="issue-description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe symptoms, liquid exposure, dropped state, or prior repair attempts..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
                Service & Delivery Method
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { id: 'dropoff', label: 'In-Store Dropoff', sub: 'Bay Area / Austin' },
                  { id: 'mail', label: 'Express Mail-In', sub: 'Prepaid Insured Tag' },
                  { id: 'express', label: 'On-Site Courier', sub: 'Same-day Pickup' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setServiceMethod(method.id as any)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-input)',
                      border: serviceMethod === method.id ? '2px solid var(--solar)' : '1px solid var(--ink-12)',
                      background: serviceMethod === method.id ? 'var(--solar-12)' : 'var(--surface)',
                      color: 'var(--ink)',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{method.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-60)', marginTop: 2 }}>{method.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <AmountInput
              label="Veloxous Deposit (USDC)"
              value={customPrice}
              onChange={setCustomPrice}
              currency="USDC"
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <Button variant="secondary" size="md" onClick={() => setStep(2)}>
                ← Back
              </Button>
              <Button variant="primary" size="lg" onClick={() => setStep(4)}>
                Next: Review Request →
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                background: 'var(--bg-sunken)',
                border: '1px solid var(--ink-12)',
                borderRadius: 'var(--radius-input)',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-12)', paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>Technician</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{technician.name}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-12)', paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>Device Model</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{deviceModel}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-12)', paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>Issue Type</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{issueType}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-12)', paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>S3 Photos Attached</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--growth)' }}>
                  {uploadedPhotos.length} S3 Presigned Files
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-12)', paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>Service Method</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', textTransform: 'capitalize' }}>
                  {serviceMethod} Delivery
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Smart Escrow Deposit</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--growth)', fontFamily: 'var(--font-data)' }}>
                  {customPrice} USDC
                </span>
              </div>
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--ink-60)', lineHeight: 1.5 }}>
              By submitting, your {customPrice} USDC is securely locked in Veloxous Wallet (<code style={{ fontFamily: 'var(--font-data)' }}>{technician.escrowContract}</code>). Payout is released only after your repair is tested & approved.
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <Button variant="secondary" size="md" type="button" onClick={() => setStep(3)}>
                ← Back
              </Button>
              <Button variant="primary" size="lg" type="submit" loading={isSubmitting}>
                Lock Escrow & Submit Request
              </Button>
            </div>
          </form>
        )}
      </>
    </Modal>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 'var(--radius-input)',
  border: '1px solid var(--ink-12)',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontSize: 14,
  outline: 'none',
}
