import { expect, test } from '@nuxt/test-utils/playwright'

test('resolves registered semantic colors in a real browser', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  await expect(page.locator('#enterprise-button')).toHaveAttribute('data-selaras-color', 'enterprise')
  await expect.poll(async () => page.locator('#enterprise-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(81, 52, 168)')
})

test('resolves CSS-variable-backed semantic colors in a real browser', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  await expect(page.locator('#brand-vars-button')).toHaveAttribute('data-selaras-color', 'brand-vars')
  await expect.poll(async () => page.locator('#brand-vars-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(17, 34, 51)')
})

test('resolves scoped theme colors on portalled content in a real browser', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const portalButton = page.locator('#scoped-popover-button')
  await expect(portalButton).toHaveAttribute('data-selaras-color', 'enterprise')
  await expect.poll(async () => portalButton.evaluate(element => element.closest('[data-selaras-theme]')?.getAttribute('data-selaras-theme') ?? '')).not.toBe('')
  await expect.poll(async () => portalButton.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(9, 8, 7)')
})

test('does not let a scoped light override win in dark mode', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await page.locator('html').evaluate(element => element.classList.add('dark'))

  const portalButton = page.locator('#scoped-popover-button')
  await expect.poll(async () => portalButton.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(167, 139, 250)')
})

test('preserves keyboard focus ownership for an uncontrolled popover', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const trigger = page.locator('#keyboard-popover-trigger')
  await trigger.focus()
  await page.keyboard.press('Enter')

  const content = page.locator('#keyboard-popover-content')
  await expect(content).toBeVisible()
  await expect.poll(async () => page.evaluate(() => document.activeElement?.id)).toBe('keyboard-popover-content')

  await page.keyboard.press('Escape')
  await expect(content).toBeHidden()
  await expect.poll(async () => page.evaluate(() => document.activeElement?.id)).toBe('keyboard-popover-trigger')
})

test('isolates nested explicit theme scopes in a real browser', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  await expect.poll(async () => page.locator('#nested-outer-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(40, 41, 42)')
  await expect.poll(async () => page.locator('#nested-inner-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(50, 51, 52)')
})

test('honors reduced-motion media preferences in compiled consumer CSS', async ({ page, goto }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await goto('/', { waitUntil: 'hydration' })

  await expect.poll(async () => page.locator('#enterprise-button').evaluate(element => getComputedStyle(element).transitionDuration)).toBe('1e-05s')
})

test('propagates RTL through the Nuxt App contract', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('#rtl-probe')).toHaveCSS('direction', 'rtl')
})
