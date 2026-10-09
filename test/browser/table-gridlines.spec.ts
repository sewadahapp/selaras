import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/table-gridlines', import.meta.url)) } })

for (const dark of [false, true]) {
  for (const state of ['populated', 'empty', 'loading', 'ordinary']) {
    test(`keeps a single frame for ${state} tables in ${dark ? 'dark' : 'light'} mode`, async ({ page, goto }) => {
      const query = new URLSearchParams()
      if (dark)
        query.set('dark', 'true')
      if (state === 'empty')
        query.set('empty', 'true')
      if (state === 'loading')
        query.set('loading', 'true')
      if (state === 'ordinary')
        query.set('grid', 'false')
      await goto(`/?${query}`, { waitUntil: 'hydration' })
      const frame = page.locator('[data-frame="table"]')
      await expect(frame).toHaveCSS('border-top-width', '0px')
      await expect(frame).toHaveCSS('box-shadow', /1px/)
      expect(Number.parseFloat(await frame.evaluate(el => getComputedStyle(el).borderRadius))).toBeGreaterThan(0)
      await expect(frame.locator('table')).toHaveCSS('border-top-width', '0px')
      await expect(frame.locator('table')).toHaveCSS('border-left-width', '0px')
      const header = frame.locator('thead th')
      await expect(header.first()).toHaveCSS('border-left-width', '0px')
      await expect(header.last()).toHaveCSS('border-right-width', '0px')
      await expect(header.first()).toHaveCSS('border-right-width', state === 'ordinary' ? '0px' : '1px')
      if (state !== 'ordinary') {
        await expect(header.first()).toHaveCSS('border-bottom-width', '1px')
        await expect(frame.locator('tfoot')).toHaveCSS('border-top-width', '1px')
      }
      if (state === 'empty') {
        await expect(frame.getByText('No data')).toBeVisible()
        await expect(frame.locator('tbody')).toHaveCount(0)
      }
      else {
        const firstRow = frame.locator('tbody tr').first()
        await expect(firstRow.locator('td').first()).toHaveCSS('border-right-width', state === 'ordinary' ? '0px' : '1px')
        await expect(firstRow.locator('td').last()).toHaveCSS('border-right-width', '0px')
      }
      if (state === 'loading')
        await expect(page.locator('.iconify')).toBeVisible()
      const bounds = await frame.boundingBox()
      await frame.evaluate(el => el.scrollLeft = el.scrollWidth)
      expect(await frame.evaluate(el => el.scrollLeft)).toBeGreaterThan(0)
      expect(await frame.boundingBox()).toEqual(bounds)
      await expect(frame.locator('table')).toHaveCSS('border-right-width', '0px')
    })
  }
}

test('retains the internal line when the final header spans rows', async ({ page, goto }) => {
  await goto('/?grouped=true', { waitUntil: 'hydration' })
  const rows = page.locator('thead tr')
  await expect(rows).toHaveCount(2)
  const spanning = rows.first().locator('th').last()
  await expect(spanning).toHaveAttribute('rowspan', '2')
  await expect(spanning).toHaveCSS('border-right-width', '0px')
  await expect(rows.nth(1).locator('th').last()).toHaveCSS('border-right-width', '1px')
})
