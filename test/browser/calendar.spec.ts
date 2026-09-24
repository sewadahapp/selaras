import { expect, test } from '@nuxt/test-utils/playwright'

test('hydrates the inline calendar and preserves independent meeting content', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  page.on('pageerror', error => issues.push(error.message))

  const response = await page.request.get('/')
  const html = await response.text()
  expect(html).toContain('id="calendar-fixture"')
  expect(html).toContain('Design review')

  await goto('/', { waitUntil: 'hydration' })
  const calendar = page.locator('#calendar-fixture')
  const day = calendar.locator('[data-value="2024-01-18"]')
  const details = calendar.getByRole('link', { name: 'Design review' })

  await expect(day).toBeVisible()
  await expect(details).toBeVisible()
  await expect(day).toHaveAttribute('aria-describedby', await details.locator('..').getAttribute('id') ?? '')
  await expect(day.locator('a')).toHaveCount(0)
  await day.click()
  await expect(day).toHaveAttribute('data-selected', 'true')
  expect(issues).toEqual([])
})
