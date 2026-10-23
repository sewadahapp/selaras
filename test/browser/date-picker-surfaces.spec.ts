import type { Locator } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/date-picker-surfaces', import.meta.url)) } })

async function surfaceColor(surface: Locator, token: string) {
  return surface.evaluate((el, token) => {
    const probe = document.createElement('span')
    probe.style.backgroundColor = `var(${token})`
    el.appendChild(probe)
    const color = getComputedStyle(probe).backgroundColor
    probe.remove()
    return color
  }, token)
}

for (const dark of [false, true]) {
  for (const size of ['sm', 'md', 'lg']) {
    test(`shares field surfaces for ${size} triggers in ${dark ? 'dark' : 'light'} mode`, async ({ page, goto }) => {
      const issues: string[] = []
      page.on('pageerror', error => issues.push(error.message))
      for (const mode of ['single', 'range', 'time']) {
        const query = new URLSearchParams({ size, mode, ...(dark ? { dark: 'true' } : {}) })
        await goto(`/?${query}`, { waitUntil: 'hydration' })
        const field = page.locator('[data-surface="field"]')
        const button = page.locator('button[data-surface="button"]')
        const height = { sm: '32px', md: '40px', lg: '44px' }[size]!
        await expect(field).toHaveCSS('height', height)
        await expect(button).toHaveCSS('height', height)
        for (const surface of [field, button]) {
          await expect(surface).toHaveCSS('--tw-ring-color', '#7f8a82')
        }
        const background = await surfaceColor(button, '--selaras-resolved-surface-default')
        const hoverBackground = await surfaceColor(button, '--selaras-resolved-surface-elevated')
        await expect(button).toHaveCSS('background-color', background)
        await expect(field).toHaveCSS('background-color', background)
        await button.hover()
        await expect(button).toHaveCSS('background-color', hoverBackground)
        await field.hover()
        await expect(field).toHaveCSS('background-color', hoverBackground)
        await button.focus()
        await expect(button).toHaveCSS('box-shadow', /2px/)
        await button.press('Enter')
        await expect(button).toHaveAttribute('aria-expanded', 'true')
        await page.keyboard.press('Escape')
        await expect(button).toBeFocused()
        await expect(button).toHaveAttribute('aria-expanded', 'false')
        await button.locator('..').getByRole('button', { name: 'Clear', exact: true }).click()
        await expect(button).toContainText(mode === 'time' ? 'Pick a time' : 'Pick a date')
        await expect(button).toHaveAttribute('aria-expanded', 'false')
      }
      expect(issues).toEqual([])
    })
  }
}

test('keeps instance overrides and native invalid/disabled states in every button mode', async ({ page, goto }) => {
  for (const mode of ['single', 'range', 'time']) {
    await goto(`/?mode=${mode}&local=true&invalid=true&disabled=true`, { waitUntil: 'hydration' })
    const button = page.locator('button[data-surface="button"]')
    await expect(button).toHaveCSS('--tw-ring-color', '#56665a')
    await expect(button).toHaveAttribute('aria-invalid', 'true')
    await expect(button).toHaveAttribute('data-selaras-color', 'danger')
    await expect(button).toBeDisabled()
    await expect(button).toHaveCSS('opacity', '0.5')
  }
})
