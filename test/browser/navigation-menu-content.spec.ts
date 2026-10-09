import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/navigation-menu-content', import.meta.url)) } })

for (const rtl of [false, true]) {
  for (const align of ['start', 'center', 'end']) {
    test(`aligns compact content at ${align} in ${rtl ? 'RTL' : 'LTR'}`, async ({ page, goto }) => {
      await goto(`/?align=${align}${rtl ? '&rtl=true' : ''}`, { waitUntil: 'hydration' })
      const trigger = page.getByRole('button', { name: 'Products', exact: true })
      await trigger.click()
      const viewport = page.getByTestId('viewport')
      await expect(viewport).toBeVisible()
      await expect.poll(async () => (await viewport.boundingBox())?.width).toBe(320)
      const button = (await trigger.boundingBox())!
      const panel = (await viewport.boundingBox())!
      const physicalAlign = rtl && align !== 'center' ? (align === 'start' ? 'end' : 'start') : align
      const expected = physicalAlign === 'start' ? button.x : physicalAlign === 'end' ? button.x + button.width - panel.width : button.x + (button.width - panel.width) / 2
      expect(Math.abs(panel.x - expected)).toBeLessThanOrEqual(1)
      expect(panel.y).toBeGreaterThanOrEqual(button.y + button.height - 1)
      const children = page.getByRole('link', { name: /Analytics|Automation|Integrations/ })
      const first = (await children.nth(0).boundingBox())!
      const second = (await children.nth(1).boundingBox())!
      expect(first.x).toBe(second.x)
      expect(second.y).toBeGreaterThan(first.y)
    })
  }
}

test('keeps the compact panel within a narrow screen at the right edge', async ({ page, goto }) => {
  await page.setViewportSize({ width: 280, height: 700 })
  await goto('/?edge=true&align=start', { waitUntil: 'hydration' })
  await page.getByRole('button', { name: 'Company', exact: true }).click()
  const viewport = page.getByTestId('viewport')
  await expect.poll(async () => (await viewport.boundingBox())?.width).toBe(260)
  const panel = (await viewport.boundingBox())!
  expect(panel.x).toBeGreaterThanOrEqual(9)
  expect(panel.x + panel.width).toBeLessThanOrEqual(271)
})

test('resizes between panels, updates alignment, and preserves the wide layout', async ({ page, goto }) => {
  await goto('/?align=start', { waitUntil: 'hydration' })
  await page.getByRole('button', { name: 'Products', exact: true }).click()
  const viewport = page.getByTestId('viewport')
  await expect(viewport).toBeVisible()
  const before = (await viewport.boundingBox())!
  await page.getByRole('button', { name: 'Company', exact: true }).hover()
  await expect(page.getByRole('link', { name: 'About', exact: true })).toBeVisible()
  await expect.poll(async () => (await viewport.boundingBox())!.height).toBeLessThan(before.height)
  await page.getByRole('button', { name: 'Toggle alignment' }).click()
  const trigger = page.getByRole('button', { name: 'Products', exact: true })
  await trigger.click()
  await expect.poll(async () => {
    const button = (await trigger.boundingBox())!
    const panel = (await viewport.boundingBox())!
    return Math.abs(panel.x + panel.width - button.x - button.width)
  }).toBeLessThanOrEqual(1)
  await page.getByRole('button', { name: 'Toggle layout' }).click()
  await trigger.click()
  await expect.poll(async () => (await viewport.boundingBox())!.width).toBe((await page.getByRole('navigation').boundingBox())!.width)
})

test('keeps keyboard entry, Escape, and focus return working with compact content', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const trigger = page.getByRole('button', { name: 'Products', exact: true })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('viewport')).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('link', { name: 'Analytics', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(page.getByTestId('viewport')).toBeHidden()
})

test('measures a custom panel width supplied through ui', async ({ page, goto }) => {
  await goto('/?custom=true', { waitUntil: 'hydration' })
  await page.getByRole('button', { name: 'Products', exact: true }).click()
  await expect.poll(async () => (await page.getByTestId('viewport').boundingBox())?.width).toBe(256)
})
