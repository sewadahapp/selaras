import type { Page } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/adaptive-autocomplete', import.meta.url)) } })

function collectIssues(page: Page) {
  const issues: string[] = []
  page.on('pageerror', (error: Error) => issues.push(error.message))
  page.on('console', (message: { text: () => string }) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  return issues
}

test('keeps the mobile Autocomplete editor accessible through typing, composition, selection and form submission', async ({ page, goto }) => {
  const issues = collectIssues(page)
  await page.setViewportSize({ width: 600, height: 800 })
  await goto('/', { waitUntil: 'hydration' })
  const input = page.locator('#autocomplete-input')
  await input.fill('Tw')
  const panel = page.locator('[data-test="autocomplete-mobile-panel"]')
  await expect(panel).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(input).toBeFocused()
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await expect(panel.getByRole('option', { name: 'Two', exact: true })).toBeVisible()
  await input.dispatchEvent('compositionstart', { data: '' })
  await input.dispatchEvent('keydown', { key: 'Enter', code: 'Enter', isComposing: true, bubbles: true })
  await expect(page.locator('#value-proposals')).toHaveText('[]')
  await input.dispatchEvent('compositionend', { data: 'Tw' })
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(page.locator('#value-proposals')).toHaveText('[2]')
  await expect(input).toBeFocused()
  await expect.poll(() => page.locator('#autocomplete-form').evaluate(el => new FormData(el as HTMLFormElement).getAll('number'))).toEqual(['2'])
  await input.press('Escape')
  await expect(panel).toBeHidden()
  await expect(input).toBeFocused()
  expect(issues).toEqual([])
})

test('keeps a controlled mobile Autocomplete panel open when the parent vetoes Escape', async ({ page, goto }) => {
  const issues = collectIssues(page)
  await page.setViewportSize({ width: 600, height: 800 })
  await goto('/?initial=true&controlled=true', { waitUntil: 'hydration' })
  const input = page.locator('#autocomplete-input')
  const panel = page.locator('[data-test="autocomplete-mobile-panel"]')
  await expect(panel).toBeVisible()
  await expect(input).toBeFocused()
  await input.press('Escape')
  await expect(page.locator('#open-requests')).toHaveText('[false]')
  await expect(panel).toBeVisible()
  await expect(input).toBeFocused()
  expect(issues).toEqual([])
})
