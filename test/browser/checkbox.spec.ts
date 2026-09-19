import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Checkbox semantic checked and card leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const box = page.locator(`#checkbox-${role}`)
      const root = box.locator('..')
      await expect(root).toHaveAttribute('data-selaras-color', role)
      await expect(box).toHaveAttribute('data-state', 'checked')
      await expect(box).toHaveClass(/data-\[state=checked\]:bg-\[var\(--_selaras-color-fill\)\]/)
      await expect(box).toHaveClass(/data-\[state=checked\]:ring-\[var\(--_selaras-color-fill\)\]/)
      await expect(root).toHaveClass(/has-\[\[data-state=checked\]\]:bg-\[var\(--_selaras-color-subtle\)\]/)
      await expect(root.locator('svg')).toHaveCount(1)
    }
  }
})

test('uses a semantic danger role for invalid Checkbox styling', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const box = page.locator('#checkbox-invalid')
  const root = box.locator('..')
  await expect(root).toHaveAttribute('data-selaras-color', 'danger')
  await expect(box).toHaveClass(/data-\[state=checked\]:ring-\[var\(--_selaras-color-border\)\]/)
})
