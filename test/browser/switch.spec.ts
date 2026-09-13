import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Switch semantic track and thumb leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const track = page.locator(`#switch-${role}`)
      await expect(track.locator('..')).toHaveAttribute('data-selaras-color', role)
      await expect(track).toHaveAttribute('data-state', 'checked')
      await expect(track).toHaveClass(/data-\[state=checked\]:bg-\[var\(--_selaras-color-fill\)\]/)
      const thumb = track.locator('[data-state="checked"]').first()
      await expect(thumb).toHaveClass(/data-\[state=checked\]:bg-\[var\(--_selaras-color-on-fill\)\]/)
      await expect(thumb).toHaveClass(/data-\[state=checked\]:text-\[var\(--_selaras-color-fill\)\]/)
    }
  }
})

test('uses a semantic danger role for invalid Switch styling', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const track = page.locator('#switch-invalid')
  await expect(track.locator('..')).toHaveAttribute('data-selaras-color', 'danger')
  await expect(track).toHaveClass(/ring-\[var\(--_selaras-color-fill\)\]/)
})
