import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/listbox', import.meta.url)) } })

test.describe('server rendering', () => {
  test.use({ javaScriptEnabled: false })
  test('renders inline selection and both transfer panels before hydration', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#single [role=option]')).toHaveCount(3)
    await expect(page.locator('#single [aria-selected=true]')).toHaveText('0')
    await expect(page.getByRole('listbox', { name: 'Available fruit' }).getByRole('option')).toHaveCount(2)
    await expect(page.getByRole('listbox', { name: 'Assigned fruit' }).getByRole('option')).toHaveText('Berry')
    await expect(page.locator('#transfer input[type=hidden][name=assigned]')).toHaveCount(1)
  })
})

test('navigates and selects using the keyboard with generated prefix styling', async ({ page, goto }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (/hydration/i.test(message.text()))
      errors.push(message.text())
  })
  page.on('pageerror', error => errors.push(error.message))
  await goto('/', { waitUntil: 'hydration' })
  const list = page.getByRole('listbox', { name: 'Numbers' })
  await list.focus()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Space')
  await expect(page.locator('#single-value')).toHaveText('1')
  await expect(list.getByRole('option', { name: '1', exact: true })).toHaveAttribute('aria-selected', 'true')
  const color = await list.getByRole('option', { name: '1', exact: true }).evaluate(element => getComputedStyle(element).backgroundColor)
  expect(color).not.toBe('rgba(0, 0, 0, 0)')
  await expect(page.locator('#single').locator('..')).toHaveClass(/tw:outline-dashed/)
  expect(errors).toEqual([])
})

test('filters and bulk selects enabled matches without nested focusable row controls', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const panel = page.locator('#multiple-panel')
  await panel.getByRole('combobox').fill('Ap')
  await expect(panel.getByRole('option')).toHaveCount(2)
  await panel.getByRole('checkbox', { name: 'Check visible' }).click()
  await expect(page.locator('#multiple-value')).toHaveText('[2,0]')
  await panel.getByRole('checkbox', { name: 'Check visible' }).click()
  await expect(page.locator('#multiple-value')).toHaveText('[2]')
  await panel.getByRole('listbox').focus()
  await page.keyboard.press('Control+a')
  await expect(page.locator('#multiple-value')).toHaveText('[2,0]')
  await expect(panel.getByRole('option').locator('button')).toHaveCount(0)
  await panel.getByRole('combobox').fill('missing')
  await expect(panel).toContainText('No results found')
})

test('transfers checked rows, moves focus, submits destination values and resets', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await page.getByRole('listbox', { name: 'Available fruit' }).getByRole('option', { name: 'Apple' }).click()
  await expect(page.locator('#assigned-value')).toHaveText('[2]')
  await expect(page.locator('#checked-value')).toHaveText('[0]')
  await page.getByRole('button', { name: 'Assign', exact: true }).click()
  await expect(page.locator('#assigned-value')).toHaveText('[2,0]')
  await expect(page.locator('#checked-value')).toHaveText('[]')
  await expect(page.getByRole('listbox', { name: 'Assigned fruit' })).toBeFocused()
  expect(await page.locator('#assignment-form').evaluate(element => new FormData(element as HTMLFormElement).getAll('assigned'))).toEqual(['2', '0'])
  await page.getByRole('button', { name: 'Reset assignment' }).click()
  await expect(page.locator('#assigned-value')).toHaveText('[2]')
})

test('stacks transfer panels on narrow viewports and keeps the controls usable', async ({ page, goto }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await goto('/', { waitUntil: 'hydration' })
  const source = (await page.getByRole('listbox', { name: 'Available fruit' }).boundingBox())!
  const target = (await page.getByRole('listbox', { name: 'Assigned fruit' }).boundingBox())!
  expect(target.y).toBeGreaterThan(source.y + source.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('listbox', { name: 'Available fruit' }).getByRole('option', { name: 'Apple' }).click()
  await page.getByRole('button', { name: 'Assign', exact: true }).click()
  await expect(page.locator('#assigned-value')).toHaveText('[2,0]')
})

test('windows large collections, finds late filtered items and validates required choices', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const virtual = page.locator('#virtual-panel')
  expect(await virtual.getByRole('option').count()).toBeLessThan(100)
  await virtual.getByRole('combobox').fill('Row 999')
  await expect(virtual.getByRole('option')).toHaveText('Row 999')
  await virtual.getByRole('combobox').press('ArrowDown')
  await virtual.getByRole('combobox').press('Enter')
  await expect(virtual.getByRole('option')).toHaveAttribute('aria-selected', 'true')
  expect(await page.locator('#required-form').evaluate(element => (element as HTMLFormElement).checkValidity())).toBe(false)
  await page.locator('#required').getByRole('option', { name: '0', exact: true }).click()
  expect(await page.locator('#required-form').evaluate(element => (element as HTMLFormElement).checkValidity())).toBe(true)
})
