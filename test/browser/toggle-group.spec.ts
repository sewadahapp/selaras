import { expect, test } from '@nuxt/test-utils/playwright'

test('renders ToggleGroup semantic pressed leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const group = page.locator(`#toggle-group-${role}`)
      await expect(group).toHaveAttribute('data-selaras-color', role)
      const pressed = group.locator('button[data-state="on"]')
      await expect(pressed).toHaveCount(1)
      await expect(pressed).toHaveClass(/data-\[state=on\]:bg-\[var\(--_selaras-color-subtle\)\]/)
      await expect(pressed).toHaveClass(/data-\[state=on\]:text-\[var\(--_selaras-color-text\)\]/)
      await expect(pressed).toHaveClass(/focus-visible:outline-\[var\(--_selaras-color-focus\)\]/)
    }
  }
})
