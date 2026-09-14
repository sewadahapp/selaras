import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/theme-scope', import.meta.url)) } })

test('applies global managed tokens to an unscoped programmatic toast', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await page.locator('#global-toast').evaluate(element => (element as HTMLButtonElement).click())
  const toast = page.locator('[data-selaras-color="primary"]').filter({ has: page.getByText('Global theme toast', { exact: true }) })
  await expect(toast).toHaveCSS('border-inline-start-color', 'rgb(1, 2, 3)')
})

test('renders explicit semantic modes before JavaScript or hydration', async ({ browser, page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const serverRenderedPage = await browser.newPage({ javaScriptEnabled: false })
  try {
    await serverRenderedPage.goto(page.url())
    await expect(serverRenderedPage.locator('#outer-fill')).toHaveCSS('background-color', 'rgb(120, 130, 140)')
    await expect(serverRenderedPage.locator('#inner-fill')).toHaveCSS('background-color', 'rgb(40, 50, 60)')
    await expect(serverRenderedPage.locator('#inner-text')).toHaveCSS('color', 'rgb(35, 69, 103)')
    await expect(serverRenderedPage.locator('#default-dark-surface')).toHaveCSS('background-color', 'oklch(0.145 0.008 280)')
    await expect(serverRenderedPage.locator('#default-light-surface')).toHaveCSS('background-color', 'oklch(0.995 0.0015 280)')
    await expect(serverRenderedPage.locator('#outer-surface')).toHaveCSS('background-color', 'rgb(14, 15, 16)')
    await expect(serverRenderedPage.locator('#inner-surface')).toHaveCSS('background-color', 'rgb(24, 25, 26)')
    await expect(serverRenderedPage.locator('#inner-surface')).toHaveCSS('color', 'rgb(30, 31, 32)')
    await expect(serverRenderedPage.locator('#inner-surface')).toHaveCSS('border-top-color', 'rgb(80, 81, 82)')
    await expect(serverRenderedPage.locator('#global-surface')).toHaveCSS('background-color', 'rgb(240, 241, 242)')
  }
  finally {
    await serverRenderedPage.close()
  }
})

test('keeps functional colors coherent through nested modes, real portals and reactive updates', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('pageerror', error => issues.push(error.message))
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  await goto('/', { waitUntil: 'hydration' })
  const modal = page.getByTestId('functional-modal')
  await expect(page.locator('#global-surface')).toHaveCSS('background-color', 'rgb(240, 241, 242)')
  const popover = page.locator('#portal-surface').locator('..')
  for (const surface of [page.locator('#inner-surface'), page.locator('#portal-surface'), modal, popover, page.locator('#functional-input')]) {
    await expect(surface).toHaveCSS('background-color', 'rgb(24, 25, 26)')
  }
  await expect(page.locator('#portal-surface')).toHaveCSS('color', 'rgb(30, 31, 32)')
  await expect(page.locator('#portal-surface')).toHaveCSS('border-top-color', 'rgb(80, 81, 82)')
  // Parent muted text and scrim are dark-only: explicit light restores defaults.
  await expect(page.locator('#modal-muted')).toHaveCSS('color', 'oklch(0.445 0.019 280)')
  await expect(page.getByTestId('functional-scrim')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.5)')
  await page.locator('html').evaluate(element => element.classList.add('dark'))
  await expect(page.locator('#global-surface')).toHaveCSS('background-color', 'rgb(50, 51, 52)')
  await expect(page.locator('#default-dark-surface')).toHaveCSS('background-color', 'oklch(0.145 0.008 280)')
  await expect(page.locator('#default-light-surface')).toHaveCSS('background-color', 'oklch(0.995 0.0015 280)')
  await expect(modal).toHaveCSS('background-color', 'rgb(24, 25, 26)')
  await expect(page.locator('#portal-surface')).toHaveCSS('color', 'rgb(30, 31, 32)')
  await page.locator('#update-surface').evaluate(element => (element as HTMLButtonElement).click())
  await expect(modal).toHaveCSS('background-color', 'rgb(25, 26, 27)')
  await expect(popover).toHaveCSS('background-color', 'rgb(25, 26, 27)')
  await expect(page.getByTestId('functional-scrim')).toHaveCSS('background-color', 'rgba(20, 30, 40, 0.6)')
  await page.locator('#toggle-mode').evaluate(element => (element as HTMLButtonElement).click())
  await expect(page.locator('#outer-surface')).toHaveCSS('background-color', 'rgb(230, 231, 232)')
  await expect(modal).toHaveCSS('background-color', 'rgb(25, 26, 27)')
  expect(issues).toEqual([])
})

test('isolates explicit modes, inherited partial tokens and body portals through hydration and updates', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('pageerror', error => issues.push(error.message))
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  await goto('/', { waitUntil: 'hydration' })
  const inner = page.locator('#inner-fill')
  const portal = page.locator('#portal-fill')
  const text = page.locator('#inner-text')
  await expect(page.locator('#global-theme')).toHaveCSS('background-color', 'rgb(1, 2, 3)')
  await expect(page.locator('#unmanaged-dark-ancestor')).toHaveCSS('background-color', 'rgb(1, 2, 3)')
  await expect(page.locator('#outer-fill')).toHaveCSS('background-color', 'rgb(120, 130, 140)')
  await expect(page.locator('#outer-text')).toHaveCSS('color', 'rgb(220, 221, 222)')
  await expect(inner).toHaveCSS('background-color', 'rgb(40, 50, 60)')
  // Parent owns this leaf in dark mode only: explicit light must use its recipe.
  await expect(text).toHaveCSS('color', 'rgb(35, 69, 103)')
  await expect(page.locator('#inner-soft')).toHaveCSS('background-color', 'rgb(50, 60, 70)')
  await expect(portal).toHaveCSS('background-color', 'rgb(40, 50, 60)')
  await expect(page.locator('#portal-text')).toHaveCSS('color', 'rgb(35, 69, 103)')
  await expect(page.locator('#portal-native')).toHaveCSS('color-scheme', 'light')
  await expect(page.locator('#modal-native')).toHaveCSS('color-scheme', 'light')
  await expect(page.locator('#invalid-radio label').first()).toHaveAttribute('data-selaras-mode', 'light')
  await expect(page.locator('[role="listbox"][data-selaras-color="primary"]')).toHaveAttribute('data-selaras-mode', 'light')
  await expect(page.locator('[data-selaras-color="primary"]').filter({ has: page.locator('input[value="#112233"]') })).toHaveAttribute('data-selaras-mode', 'light')
  await page.locator('html').evaluate(element => element.classList.add('dark'))
  await expect(page.locator('#global-theme')).toHaveCSS('background-color', 'rgb(160, 176, 192)')
  await expect(inner).toHaveCSS('background-color', 'rgb(40, 50, 60)')
  await expect(text).toHaveCSS('color', 'rgb(35, 69, 103)')
  // Click without autofocus interference from the deliberately open popup.
  await page.locator('#toggle-mode').evaluate(element => (element as HTMLButtonElement).click())
  await expect(page.locator('#outer-fill')).toHaveCSS('background-color', 'rgb(20, 30, 40)')
  await expect(page.locator('#outer-text')).toHaveCSS('color', 'rgb(35, 69, 103)')
  await expect(portal).toHaveCSS('background-color', 'rgb(40, 50, 60)')
  await page.locator('#update-inner').evaluate(element => (element as HTMLButtonElement).click())
  await expect(inner).toHaveCSS('background-color', 'rgb(41, 51, 61)')
  await expect(portal).toHaveCSS('background-color', 'rgb(41, 51, 61)')
  await page.locator('#toggle-scope').evaluate(element => (element as HTMLButtonElement).click())
  await expect(portal).toHaveCount(0)
  await page.locator('#toggle-scope').click()
  await expect(page.locator('#portal-fill')).toHaveCSS('background-color', 'rgb(41, 51, 61)')
  expect(issues).toEqual([])
})

test('keeps nearest-owner precedence after stylesheet reversal and lets consumer CSS override it', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await page.evaluate(() => {
    for (const node of [...document.head.querySelectorAll('style, link[rel="stylesheet"]')].reverse())
      document.head.append(node)
  })
  await expect(page.locator('#outer-fill')).toHaveCSS('background-color', 'rgb(120, 130, 140)')
  await expect(page.locator('#inner-fill')).toHaveCSS('background-color', 'rgb(40, 50, 60)')
  await expect(page.locator('#portal-fill')).toHaveCSS('background-color', 'rgb(40, 50, 60)')
  await expect(page.locator('#consumer-fill')).toHaveCSS('background-color', 'rgb(70, 80, 90)')
  await expect(page.locator('#inline-fill')).toHaveCSS('background-color', 'rgb(80, 90, 100)')
  await expect(page.locator('#functional-consumer')).toHaveCSS('background-color', 'rgb(71, 72, 73)')
  await expect(page.getByTestId('functional-modal')).toHaveCSS('background-color', 'rgb(24, 25, 26)')
  await page.addStyleTag({ content: '[data-testid="functional-modal"] { --company-surface: rgb(91 92 93); --selaras-surface-default: var(--company-surface); }' })
  await expect(page.getByTestId('functional-modal')).toHaveCSS('background-color', 'rgb(91, 92, 93)')
})
