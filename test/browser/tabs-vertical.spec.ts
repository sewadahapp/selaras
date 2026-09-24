import { expect, test } from '@nuxt/test-utils/playwright'

test('vertical tabs stack triggers beside their panel and use vertical arrow navigation', async ({ page, goto }) => {
  await goto('/?tabs=1', { waitUntil: 'hydration' })
  const fixture = page.locator('#vertical-tabs-fixture')
  const list = fixture.getByRole('tablist')
  const first = list.getByRole('tab', { name: 'Tab 1' })
  const second = list.getByRole('tab', { name: 'Tab 2' })
  const panel = fixture.getByRole('tabpanel')

  await expect(list).toHaveAttribute('aria-orientation', 'vertical')
  const firstBox = (await first.boundingBox())!
  const secondBox = (await second.boundingBox())!
  const listBox = (await list.boundingBox())!
  const panelBox = (await panel.boundingBox())!
  expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 1)
  expect(panelBox.x).toBeGreaterThan(listBox.x + listBox.width - 1)

  await first.focus()
  await page.keyboard.press('ArrowDown')
  await expect(second).toHaveAttribute('aria-selected', 'true')
  await expect(panel).toContainText('Second vertical panel')
})

test('vertical underline follows the active tab along the list edge', async ({ page, goto }) => {
  await goto('/?tabs=1', { waitUntil: 'hydration' })
  const fixture = page.locator('#vertical-underline-tabs-fixture')
  const list = fixture.getByRole('tablist')
  const indicator = list.locator('[aria-hidden="true"]')
  const second = list.getByRole('tab', { name: 'Tab 2' })

  await expect(indicator).toBeVisible()
  await second.click()
  await expect(second).toHaveAttribute('aria-selected', 'true')
  await expect.poll(async () => {
    const tab = (await second.boundingBox())!
    const mark = (await indicator.boundingBox())!
    const edge = (await list.boundingBox())!
    return Math.abs(mark.y - tab.y) < 2
      && Math.abs(mark.height - tab.height) < 2
      && Math.abs(mark.x + mark.width - edge.x - edge.width) < 2
  }).toBe(true)
})
