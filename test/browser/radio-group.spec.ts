import { expect, test } from '@nuxt/test-utils/playwright'

test('renders RadioGroup semantic ring, indicator and card leaves', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const group = page.locator(`#radio-${role}`)
      await expect(group).toHaveAttribute('data-selaras-color', role)
      const checked = group.locator('button[data-state="checked"]').first()
      await expect(checked).toHaveCount(1)
      await expect(checked).toHaveClass(/data-\[state=checked\]:ring-\[var\(--_selaras-color-indicator\)\]/)
      await expect(checked.locator('[data-state="checked"]').first()).toHaveClass(/bg-\[var\(--_selaras-color-indicator\)\]/)
      await expect(group.locator('label').first()).toHaveClass(/has-\[\[data-state=checked\]\]:bg-\[var\(--_selaras-color-subtle\)\]/)
      const second = group.locator('button').nth(1)
      await second.click()
      await expect(second).toHaveAttribute('data-state', 'checked')
    }
  }
})

test('uses a semantic danger role for invalid RadioGroup item styling', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const group = page.locator('#radio-primary')
  expect(await group.locator('label').first().getAttribute('data-selaras-color')).toBe(null)
  await expect(page.locator('#radio-invalid')).toHaveAttribute('data-selaras-color', 'enterprise')
  expect(await page.locator('#radio-invalid label').first().getAttribute('data-selaras-color')).toBe('danger')
})
