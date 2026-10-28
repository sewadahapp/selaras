import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ locale: 'en-US', nuxt: { rootDir: fileURLToPath(new URL('../../docs', import.meta.url)), setupTimeout: 300_000 } })

test('root locale redirect renders the selected language on the trigger', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await page.context().addCookies([{ name: 'selaras-docs-locale', value: 'id', url: page.url() }])
  await goto('/', { waitUntil: 'hydration' })
  await expect(page).toHaveURL(/\/id\/?$/)
  const trigger = page.getByRole('button', { name: 'Ganti bahasa ke English' })
  await expect(trigger).toBeVisible()
  await expect(trigger.locator('.i-circle-flags\\:id')).toBeVisible()
  await trigger.click()
  await expect(page.getByRole('button', { name: 'Bahasa Indonesia id-ID' })).toHaveAttribute('aria-pressed', 'true')
})
