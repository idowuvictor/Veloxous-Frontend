import { test, expect } from '@playwright/test'

test.describe('DualPaneSwap E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/swap/swap-123')
  })

  test('should display dual-pane layout with device cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Device Swap' })).toBeVisible()
    await expect(page.getByText('Your Device')).toBeVisible()
    await expect(page.getByText('Their Device')).toBeVisible()
    await expect(page.getByText('iPhone 13 Pro')).toBeVisible()
    await expect(page.getByText('iPhone 15 Pro')).toBeVisible()
  })

  test('should display value difference warning', async ({ page }) => {
    await expect(page.getByRole('alert')).toContainText('Value Difference Detected')
    await expect(page.getByRole('alert')).toContainText('$200')
    await expect(page.getByRole('alert')).toContainText('$500')
  })

  test('should display countdown timer', async ({ page }) => {
    await expect(page.getByLabel(/Time remaining/)).toBeVisible()
  })

  test('should show deposit collateral button when state is agreed_awaiting_collateral', async ({
    page,
  }) => {
    const depositButton = page.getByRole('button', { name: 'Deposit Collateral' })
    await expect(depositButton).toBeVisible()
  })

  test('should open transaction overlay when deposit collateral is clicked', async ({ page }) => {
    const depositButton = page.getByRole('button', { name: 'Deposit Collateral' })
    await depositButton.click()

    await expect(page.getByRole('dialog', { name: 'Transaction Progress' })).toBeVisible()
    await expect(page.getByText('Waiting for signature')).toBeVisible()
  })

  test('should show transaction steps in order', async ({ page }) => {
    const depositButton = page.getByRole('button', { name: 'Deposit Collateral' })
    await depositButton.click()

    await expect(page.getByText('Waiting for signature')).toBeVisible()
    await expect(page.getByText('Signing transaction')).toBeVisible()
    await expect(page.getByText('Submitting to network')).toBeVisible()
    await expect(page.getByText('Confirmed on chain')).toBeVisible()
  })

  test('should show success state after successful transaction', async ({ page }) => {
    const depositButton = page.getByRole('button', { name: 'Deposit Collateral' })
    await depositButton.click()

    await page.waitForTimeout(2000)

    await expect(page.getByText('Confirmed on chain')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible()
  })

  test('should handle insufficient balance warning', async ({ page }) => {
    await page.evaluate(() => {
      window.__USER_USDC_BALANCE__ = 100
    })

    await page.reload()

    await expect(page.getByRole('alert')).toContainText('Insufficient USDC Balance')
    await expect(page.getByRole('button', { name: 'Buy USDC via Fiat On-Ramp' })).toBeVisible()
  })

  test('should disable deposit button when balance is insufficient', async ({ page }) => {
    await page.evaluate(() => {
      window.__USER_USDC_BALANCE__ = 100
    })

    await page.reload()

    const depositButton = page.getByRole('button', { name: 'Deposit Collateral' })
    await expect(depositButton).toBeDisabled()
  })

  test('should navigate to fiat on-ramp when buy USDC is clicked', async ({ page }) => {
    await page.evaluate(() => {
      window.__USER_USDC_BALANCE__ = 100
    })

    await page.reload()

    const buyButton = page.getByRole('button', { name: 'Buy USDC via Fiat On-Ramp' })
    await buyButton.click()

    await expect(page).toHaveURL(/\/fiat-on-ramp/)
  })

  test('should display blockchain error when transaction fails', async ({ page }) => {
    await page.evaluate(() => {
      window.__MOCK_TRANSACTION_ERROR__ = 'tx_insufficient_fee'
    })

    const depositButton = page.getByRole('button', { name: 'Deposit Collateral' })
    await depositButton.click()

    await expect(page.getByRole('alert')).toContainText('Insufficient gas fee')
    await expect(page.getByRole('button', { name: 'Retry Transaction' })).toBeVisible()
  })

  test('should allow retry after failed transaction', async ({ page }) => {
    await page.evaluate(() => {
      window.__MOCK_TRANSACTION_ERROR__ = 'tx_insufficient_fee'
    })

    const depositButton = page.getByRole('button', { name: 'Deposit Collateral' })
    await depositButton.click()

    await expect(page.getByRole('alert')).toContainText('Insufficient gas fee')

    await page.evaluate(() => {
      window.__MOCK_TRANSACTION_ERROR__ = null
    })

    const retryButton = page.getByRole('button', { name: 'Retry Transaction' })
    await retryButton.click()

    await expect(page.getByText('Confirmed on chain')).toBeVisible()
  })

  test('should update state via WebSocket when other party accepts', async ({ page }) => {
    await page.evaluate(() => {
      window.__MOCK_WEBSOCKET_MESSAGE__ = { state: 'agreed_awaiting_collateral' }
    })

    await page.waitForTimeout(1000)

    await expect(page.getByText('Awaiting Other Party\'s Collateral')).toBeVisible()
  })

  test('should be accessible with screen reader', async ({ page }) => {
    const swapInterface = page.getByRole('main', { name: 'Swap interface' })
    await expect(swapInterface).toBeVisible()

    const countdown = page.getByLabel(/Time remaining/)
    await expect(countdown).toHaveAttribute('aria-live', 'polite')

    const warning = page.getByRole('alert')
    await expect(warning).toHaveAttribute('aria-live', 'assertive')
  })
})
