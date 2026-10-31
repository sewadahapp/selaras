import type { Locator, Page } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({
  locale: 'en-US',
  nuxt: {
    rootDir: fileURLToPath(new URL('../../docs', import.meta.url)),
    setupTimeout: 300_000,
    nuxtConfig: {
      // Exercise SSR and hydration without generating the entire static site.
      nitro: { prerender: { crawlLinks: false, ignore: [() => true] } },
    },
  },
})

async function expectAnchoredLanguagePicker(page: Page, trigger: Locator) {
  const panel = page.getByRole('dialog').filter({ has: page.locator('#docs-language-picker-title') })
  await expect(panel).toBeVisible()
  await expect.poll(async () => {
    const button = await trigger.boundingBox()
    const content = await panel.boundingBox()
    if (!button || !content)
      return false
    return Math.abs(content.y - (button.y + button.height + 8)) < 2
      && content.x <= button.x + button.width
      && content.x + content.width >= button.x
      && content.x >= 0
      && content.x + content.width <= page.viewportSize()!.width
  }).toBe(true)
}

test('language picker stays anchored after hydration, reopening, and resizing', async ({ page, goto }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await goto('/', { waitUntil: 'hydration' })
  const trigger = page.getByRole('button', { name: 'Switch to Bahasa Indonesia' })
  await trigger.click()
  await expectAnchoredLanguagePicker(page, trigger)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await expectAnchoredLanguagePicker(page, trigger)
  await page.setViewportSize({ width: 390, height: 844 })
  await expectAnchoredLanguagePicker(page, trigger)
})

test('root locale redirect renders the selected language on the trigger', async ({ page, goto }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await goto('/', { waitUntil: 'hydration' })
  await page.context().addCookies([{ name: 'selaras-docs-locale', value: 'id', url: page.url() }])
  await goto('/', { waitUntil: 'hydration' })
  await expect(page).toHaveURL(/\/id\/?$/)
  const trigger = page.getByRole('button', { name: 'Ganti bahasa ke English' })
  await expect(trigger).toBeVisible()
  await expect(trigger.locator('.i-circle-flags\\:id')).toBeVisible()
  await trigger.click()
  await expectAnchoredLanguagePicker(page, trigger)
  await expect(page.getByRole('button', { name: 'Bahasa Indonesia id-ID' })).toHaveAttribute('aria-pressed', 'true')
})
