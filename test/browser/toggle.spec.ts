import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Toggle semantic pressed leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const toggle = page.locator(`#toggle-${role}`)
      await expect(toggle).toHaveAttribute('data-selaras-color', role)
      await expect(toggle).toHaveAttribute('data-state', 'on')
      await expect(toggle).toHaveClass(/data-\[state=on\]:bg-\[var\(--_selaras-color-subtle\)\]/)
      await expect(toggle).toHaveClass(/data-\[state=on\]:text-\[var\(--_selaras-color-text\)\]/)
      await expect(toggle).toHaveClass(/focus-visible:outline-\[var\(--_selaras-color-focus\)\]/)
    }
  }
})
