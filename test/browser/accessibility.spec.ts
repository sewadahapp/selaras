import type { Page } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/accessibility', import.meta.url)) } })

const issues = new WeakMap<Page, string[]>()
test.beforeEach(({ page }) => {
  const messages: string[] = []
  issues.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      messages.push(message.text())
  })
})
test.afterEach(({ page }) => {
  expect(issues.get(page)).toEqual([])
})

async function checkAccessibility(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([])
}

for (const colorScheme of ['light', 'dark'] as const) {
  test(`checks forms, validation, navigation, and empty states in ${colorScheme} mode`, async ({ page, goto }) => {
    await page.emulateMedia({ colorScheme })
    await goto('/', { waitUntil: 'hydration' })
    await checkAccessibility(page)
    await page.getByRole('button', { name: 'Save preferences' }).click()
    const email = page.getByLabel('Email address', { exact: true })
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription('Used for project updates. Enter a valid email address.')
    await checkAccessibility(page)
    const listSearch = page.getByRole('combobox', { name: 'Search...', exact: true })
    await listSearch.fill('')
    await listSearch.press('ArrowDown')
    await expect(listSearch).toHaveAttribute('aria-activedescendant', /.+/)
    await listSearch.fill('missing')
    await expect(page.getByText('No matching departments', { exact: true })).toBeVisible()
    await expect(listSearch).not.toHaveAttribute('aria-activedescendant')
    await checkAccessibility(page)
    await page.getByRole('button', { name: 'Reports', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('link', { name: 'Activity', exact: true })).toBeVisible()
    await checkAccessibility(page)
  })
}

test('keeps nested dialog focus and Escape behavior accessible', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const trigger = page.locator('#open-settings')
  await trigger.focus()
  await page.keyboard.press('Enter')
  const settings = page.getByRole('dialog', { name: 'Project settings', exact: true })
  await expect(settings).toBeVisible()
  await checkAccessibility(page)
  await page.locator('#open-archive').focus()
  await page.keyboard.press('Enter')
  const archive = page.getByRole('dialog', { name: 'Confirm archive', exact: true })
  await expect(archive).toBeVisible()
  await checkAccessibility(page)
  await page.keyboard.press('Escape')
  await expect(archive).toBeHidden()
  await expect(page.locator('#open-archive')).toBeFocused()
  await expect(settings).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(settings).toBeHidden()
  await expect(trigger).toBeFocused()
})

for (const width of [1440, 600]) {
  test(`checks adaptive selection and focus restoration at ${width}px`, async ({ page, goto }) => {
    await page.setViewportSize({ width, height: 1000 })
    await goto('/', { waitUntil: 'hydration' })
    const trigger = page.locator('#audit-department')
    await expect(trigger).toHaveAccessibleName('Department')
    await expect(trigger).toHaveAttribute('role', 'combobox')
    await trigger.focus()
    await page.keyboard.press('Enter')
    const option = page.getByRole('option', { name: 'Engineering', exact: true })
    await expect(option).toBeVisible()
    await checkAccessibility(page)
    const input = page.locator('[data-audit-search]')
    const controls = await input.getAttribute('aria-controls')
    await expect(page.locator(`[id="${controls}"]`)).toHaveAttribute('role', 'listbox')
    await input.fill('Missing')
    await expect(page.getByText('No results found', { exact: true })).toBeVisible()
    await checkAccessibility(page)
    await input.fill('Engineering')
    await input.press('ArrowDown')
    const active = await input.getAttribute('aria-activedescendant')
    await expect(page.locator(`[id="${active}"]`)).toHaveText('Engineering')
    await input.press('Enter')
    await expect(trigger).toBeFocused()
    await expect(trigger).toContainText('Engineering')
    await expect(trigger).toHaveAccessibleName('Department')
    await checkAccessibility(page)
    await page.keyboard.press('Enter')
    await expect(option).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(option).toBeHidden()
    await expect(trigger).toBeFocused()
  })
}
