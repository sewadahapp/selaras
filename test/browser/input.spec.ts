import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Input semantic focus leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const input = page.locator(`#input-${role}`)
      await expect(input.locator('..')).toHaveAttribute('data-selaras-color', role)
      await expect(input).toHaveClass(/focus:ring-\[var\(--_selaras-color-focus\)\]/)
    }
  }
})

test('uses the danger semantic role for invalid Input styling', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const input = page.locator('#input-invalid')
  await expect(input.locator('..')).toHaveAttribute('data-selaras-color', 'danger')
  await expect(input).toHaveClass(/focus:ring-\[var\(--_selaras-color-fill\)\]/)
})
