import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Progress semantic indicator leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const progress = page.locator(`#progress-${role}`)
      await expect(progress).toHaveAttribute('data-selaras-color', role)
      await expect(progress.locator('[data-state]')).toHaveClass(/bg-\[var\(--_selaras-color-fill\)\]/)
    }
  }
})
