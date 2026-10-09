import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/stepper-messages', import.meta.url)) } })

test('renders one translated announcement on the server and hydrates without duplicates', async ({ page, goto }) => {
  const warnings: string[] = []
  page.on('console', (message) => {
    if (/hydration/i.test(message.text()))
      warnings.push(message.text())
  })
  await goto('/', { waitUntil: 'hydration' })
  const response = await page.request.get('/')
  const html = await response.text()
  expect(html).toContain('Langkah 1 dari 2')
  expect(html).not.toContain('Step 1 of 0')
  const status = page.locator('#translated [role="status"]')
  await expect(status).toHaveCount(1)
  await expect(status).toHaveText('Langkah 1 dari 2')
  await expect(status).toHaveAttribute('aria-live', 'polite')
  await expect(status).toHaveAttribute('aria-atomic', 'true')
  expect((await status.boundingBox())!.width).toBe(1)
  await expect(page.locator('#empty [role="status"]')).toBeEmpty()
  await expect(page.locator('#instance [role="status"]')).toHaveText('Stage 1/2')
  expect(warnings).toEqual([])
})

test('updates announcements with keyboard activation, language, and item counts', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const triggers = page.locator('#translated button')
  await triggers.first().focus()
  await page.keyboard.press('ArrowRight')
  await expect(triggers.nth(1)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#translated [role="status"]')).toHaveText('Langkah 2 dari 2')
  await page.locator('#language').click()
  await expect(page.locator('#translated [role="status"]')).toHaveText('Étape 2 sur 2')
  await expect(page.locator('#translated')).toHaveAttribute('aria-label', 'Progres pembuatan kunci')
  await page.locator('#add-step').click()
  await expect(page.locator('#translated [role="status"]')).toHaveText('Étape 2 sur 3')
  await expect(page.locator('#instance [role="status"]')).toHaveText('Stage 1/3')
  await expect(page.locator('#translated')).not.toContainText('Step ')
})

test('preserves linear and disabled constraints for uncontrolled steps', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const root = page.locator('#uncontrolled')
  const buttons = root.locator('button')
  await expect(buttons.nth(2)).toBeDisabled()
  await expect(buttons.nth(3)).toBeDisabled()
  await buttons.nth(1).click()
  await expect(root.locator('[role="status"]')).toHaveText('Langkah 2 dari 4')
  await buttons.first().focus()
  await page.keyboard.press('Space')
  await expect(root.locator('[role="status"]')).toHaveText('Langkah 1 dari 4')
})
