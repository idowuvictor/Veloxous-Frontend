import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/render'
import { QuoteRequestModal } from './QuoteRequestModal'
import { TECHNICIANS_DATA } from '@/data/techniciansData'

vi.mock('@/services/s3UploadService', () => ({
  uploadFileToS3: vi.fn().mockImplementation((_file, onProgress) => {
    if (onProgress) onProgress(100)
    return Promise.resolve({
      fileUrl: 'https://veloxous-repair-vault.s3.us-west-2.amazonaws.com/uploads/test.jpg',
      s3Key: 'uploads/test.jpg',
      presignedUrl: 'https://veloxous-repair-vault.s3.us-west-2.amazonaws.com/uploads/test.jpg?signed',
    })
  }),
}))

const mockTech = TECHNICIANS_DATA[0]

describe('QuoteRequestModal (Multi-Step Wizard & Accessibility)', () => {
  it('renders Step 1 with correct ARIA dialog attributes', () => {
    render(
      <QuoteRequestModal
        technician={mockTech}
        onClose={vi.fn()}
        onSubmitSuccess={vi.fn()}
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeDefined()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(screen.getByText(/Select Device & Issue/i)).toBeDefined()
  })

  it('navigates to Step 2 and disables Next button when required photo is missing for Screen Replacement', () => {
    render(
      <QuoteRequestModal
        technician={mockTech}
        initialService="Screen Replacement"
        onClose={vi.fn()}
        onSubmitSuccess={vi.fn()}
      />
    )

    // Click Next to go to Step 2
    const nextBtnStep1 = screen.getByText(/Next: Upload Photos/i)
    fireEvent.click(nextBtnStep1)

    // Verify Step 2 is active
    expect(screen.getByText(/Upload Damage Photos/i)).toBeDefined()

    // Step 2 Next button should be disabled because Screen Replacement requires photos
    const nextBtnStep2 = screen.getByRole('button', { name: /Next: Issue Details/i }) as HTMLButtonElement
    expect(nextBtnStep2.disabled).toBe(true)
  })

  it('enables Step 2 Next button once a photo file is uploaded', async () => {
    render(
      <QuoteRequestModal
        technician={mockTech}
        initialService="Screen Replacement"
        onClose={vi.fn()}
        onSubmitSuccess={vi.fn()}
      />
    )

    // Go to Step 2
    fireEvent.click(screen.getByText(/Next: Upload Photos/i))

    // Upload a photo file
    const fileInput = screen.getByLabelText(/Upload photo attachment/i)
    const mockFile = new File(['fake-image'], 'broken_screen.jpg', { type: 'image/jpeg' })

    fireEvent.change(fileInput, { target: { files: [mockFile] } })

    // Wait for S3 upload promise resolution
    await waitFor(() => {
      expect(screen.getByText('broken_screen.jpg')).toBeDefined()
      const nextBtnStep2 = screen.getByRole('button', { name: /Next: Issue Details/i }) as HTMLButtonElement
      expect(nextBtnStep2.disabled).toBe(false)
    })
  })

  it('closes modal when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(
      <QuoteRequestModal
        technician={mockTech}
        onClose={handleClose}
        onSubmitSuccess={vi.fn()}
      />
    )

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
