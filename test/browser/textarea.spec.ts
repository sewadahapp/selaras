import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Textarea semantic focus leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const textarea = page.locator(`#textarea-${role}`)
      await expect(textarea.locator('..')).toHaveAttribute('data-selaras-color', role)
      await expect(textarea).toHaveClass(/focus:ring-\[var\(--_selaras-color-focus\)\]/)
    }
  }
})

test('uses the danger semantic role for invalid Textarea styling', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const textarea = page.locator('#textarea-invalid')
  await expect(textarea.locator('..')).toHaveAttribute('data-selaras-color', 'danger')
  await expect(textarea).toHaveClass(/focus:ring-\[var\(--_selaras-color-focus\)\]/)
})
