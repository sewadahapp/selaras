import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Chip semantic solid, soft, and outline leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const solid = page.locator(`#chip-${role}-solid`)
      await expect(solid).toHaveAttribute('data-selaras-color', role)
      await expect(solid).toHaveClass(/bg-\[var\(--_selaras-color-fill\)\]/)
      await expect(solid).toHaveClass(/text-\[var\(--_selaras-color-on-fill\)\]/)
      await expect(page.locator(`#chip-${role}-soft`)).toHaveClass(/bg-\[var\(--_selaras-color-subtle\)\]/)
      await expect(page.locator(`#chip-${role}-outline`)).toHaveClass(/ring-\[var\(--_selaras-color-border\)\]/)
    }
  }
})
