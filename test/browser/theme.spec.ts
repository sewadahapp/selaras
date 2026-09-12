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
