import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Stepper semantic active and completed leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const root = page.locator(`#stepper-${role}`)
      await expect(root).toHaveAttribute('data-selaras-color', role)
      await expect(root.locator('[data-state="active"][class*="relative"]').first()).toHaveClass(/data-\[state=active\]:ring-\[var\(--_selaras-color-focus\)\]/)
      await expect(root.locator('[data-state="completed"][class*="relative"]').first()).toHaveClass(/data-\[state=completed\]:bg-\[var\(--_selaras-color-fill\)\]/)
      await expect(root.locator('[data-state="completed"][class*="relative"]').first()).toHaveClass(/data-\[state=completed\]:text-\[var\(--_selaras-color-on-fill\)\]/)
    }
  }
})
