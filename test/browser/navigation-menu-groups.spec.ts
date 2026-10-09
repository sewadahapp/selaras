import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/navigation-menu-groups', import.meta.url)) } })

test('hides collapsed headings, keeps one boundary, and preserves link labels', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const heading = page.locator('li').filter({ hasText: /^Workspace$/ })
  expect((await heading.boundingBox())!.width).toBeGreaterThan(1)
  await page.getByRole('button', { name: 'Toggle rail' }).click()
  await expect(page.getByRole('separator')).toHaveCount(1)
  expect((await heading.boundingBox())!.width).toBe(1)
  await page.getByRole('link', { name: 'Security', exact: true }).hover()
  await expect(page.locator('[data-side]:has([role="tooltip"])')).toBeVisible()
  await expect(page.getByRole('tooltip', { includeHidden: true })).toHaveText('Security')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Toggle rail' }).click()
  expect((await heading.boundingBox())!.width).toBeGreaterThan(1)
  await expect(page.getByRole('separator')).toHaveCount(3)
})
