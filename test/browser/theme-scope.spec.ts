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
  }
  finally {
    await serverRenderedPage.close()
  }
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
})
