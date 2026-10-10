import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/avatar-group', import.meta.url)) } })

test.describe('server rendering', () => {
  test.use({ javaScriptEnabled: false })

  test('caps compiled lists before hydration and gives each avatar its own wrapper', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'domcontentloaded' })
    for (const id of ['static', 'direct', 'nested']) {
      const group = page.locator(`#${id}`)
      await expect(group.locator('[data-overflow]')).toHaveText('+1')
      await expect(group.locator('[data-avatar-item]')).toHaveCount(2)
      for (const item of await group.locator('[data-avatar-item]').all())
        expect(await item.locator(':scope > *').count()).toBe(1)
    }
  })
})

test('overlaps compiled lists, preserves sizes, and updates the cap as the list changes', async ({ page, goto }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (/hydration/i.test(message.text()))
      errors.push(message.text())
  })
  page.on('pageerror', error => errors.push(error.message))
  await goto('/', { waitUntil: 'hydration' })
  for (const id of ['static', 'direct', 'nested']) {
    const group = page.locator(`#${id}`)
    await expect(group.locator('[data-overflow]')).toHaveText('+1')
    const items = await group.locator('[data-avatar-item]').all()
    expect(items).toHaveLength(2)
    const first = (await items[0]!.boundingBox())!
    const second = (await items[1]!.boundingBox())!
    expect(first.width).toBe(40)
    expect(second.width).toBe(40)
    expect(Math.abs(first.x - second.x)).toBeGreaterThan(0)
    expect(Math.abs(first.x - second.x)).toBeLessThan(40)
  }
  await page.locator('#reorder').click()
  for (const id of ['direct', 'nested']) {
    await expect(page.locator(`#${id} [data-overflow]`)).toHaveText('+2')
    await expect(page.locator(`#${id} [data-avatar-item]`)).toHaveText(['C', 'A'])
  }
  await page.locator('#increase-max').click()
  for (const id of ['direct', 'nested']) {
    await expect(page.locator(`#${id} [data-overflow]`)).toHaveText('+1')
    await expect(page.locator(`#${id} [data-avatar-item]`)).toHaveText(['C', 'A', 'D'])
  }
  await page.locator('#clear').click()
  for (const id of ['direct', 'nested']) {
    await expect(page.locator(`#${id} [data-avatar-item]`)).toHaveCount(0)
    await expect(page.locator(`#${id} [data-overflow]`)).toHaveCount(0)
  }
  expect(errors).toEqual([])
})
