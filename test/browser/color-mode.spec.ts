import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/color-mode', import.meta.url)) } })

test.describe('server rendering', () => {
  test.use({ javaScriptEnabled: false })

  test('renders stable disabled controls before hydration', async ({ page, goto }) => {
    await goto('/async', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#toggle')).toBeDisabled()
    await expect(page.locator('#toggle .iconify')).toHaveClass(/i-appearance:light/)
    await expect(page.locator('#switch')).toBeDisabled()
    await expect(page.locator('#switch')).toHaveAttribute('aria-checked', 'false')
  })
})

for (const path of ['/', '/async']) {
  for (const preference of ['light', 'dark', 'system']) {
    for (const system of ['light', 'dark'] as const) {
      test(`hydrates ${path} with ${preference} preference and ${system} system appearance`, async ({ page, goto }) => {
        const errors: string[] = []
        page.on('console', (message) => {
          if (/hydration/i.test(message.text()))
            errors.push(message.text())
        })
        page.on('pageerror', error => errors.push(error.message))
        await page.emulateMedia({ colorScheme: system })
        await page.addInitScript(value => localStorage.setItem('nuxt-color-mode', value), preference)
        await goto(path, { waitUntil: 'hydration' })
        await expect(page.locator('section')).toHaveAttribute('data-mounted', 'true')
        const dark = (preference === 'system' ? system : preference) === 'dark'
        const icon = dark ? /i-appearance:dark/ : /i-appearance:light/
        await expect(page.locator('#mode')).toHaveText(dark ? 'dark' : 'light')
        await expect(page.locator('#toggle')).toBeEnabled()
        await expect(page.locator('#toggle .iconify')).toHaveClass(icon)
        await expect(page.locator('#outside-toggle .iconify')).toHaveClass(icon)
        await expect(page.locator('#switch')).toHaveAttribute('aria-checked', String(dark))
        await expect(page.locator('#switch .iconify')).toHaveClass(icon)

        await page.locator('#toggle').click()
        await expect(page.locator('#preference')).toHaveText(dark ? 'light' : 'dark')
        await expect(page.locator('#switch')).toHaveAttribute('aria-checked', String(!dark))
        await page.locator('#switch').click()
        await expect(page.locator('#preference')).toHaveText(dark ? 'dark' : 'light')
        await expect(page.locator('#toggle .iconify')).toHaveClass(icon)
        expect(errors).toEqual([])
      })
    }
  }
}

test('disables both controls on a page with a forced appearance', async ({ page, goto }) => {
  await goto('/forced', { waitUntil: 'hydration' })
  await expect(page.locator('#mode')).toHaveText('dark')
  await expect(page.locator('#toggle')).toBeDisabled()
  await expect(page.locator('#switch')).toBeDisabled()
})
