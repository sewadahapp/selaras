import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const proseCss = readFileSync(new URL('../../src/runtime/prose.css', import.meta.url), 'utf8')

test.beforeEach(async ({ page }) => {
  await page.setContent(`
    <style>
      body { margin: 16px; }
      main { max-width: 800px; }
      ${proseCss}
    </style>
    <main class="selaras-prose">
      <table id="slots">
        <thead><tr><th>Slot</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>default</td><td>Custom content</td></tr>
          <tr><td>icon</td><td>Replaces the leading icon</td></tr>
        </tbody>
      </table>
      <table id="plain"><tbody><tr><td>One</td><td>Two</td></tr></tbody></table>
      <table id="wide">
        <thead><tr><th>Prop</th><th>Type</th></tr></thead>
        <tbody><tr><td>items</td><td><code>${'LongUnbrokenType'.repeat(80)}</code></td></tr></tbody>
      </table>
      <div class="not-prose"><table id="excluded"><tr><td>Unthemed</td></tr></table></div>
    </main>
  `)
})

for (const width of [1200, 375]) {
  test(`fills the content width and contains overflowing columns at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    const container = (await page.locator('main').boundingBox())!
    for (const id of ['slots', 'plain']) {
      const row = (await page.locator(`#${id} tr`).first().boundingBox())!
      expect(row.width).toBeCloseTo(container.width, 0)
    }

    const headers = await page.locator('#slots th').all()
    const cells = await page.locator('#slots tbody tr').first().locator('td').all()
    for (let index = 0; index < headers.length; index++) {
      const header = (await headers[index]!.boundingBox())!
      const cell = (await cells[index]!.boundingBox())!
      expect(header.x).toBeCloseTo(cell.x, 0)
      expect(header.width).toBeCloseTo(cell.width, 0)
    }

    const wide = page.locator('#wide')
    expect((await wide.boundingBox())!.width).toBeCloseTo(container.width, 0)
    expect(await wide.evaluate(element => element.scrollWidth)).toBeGreaterThan(container.width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await wide.evaluate(element => element.scrollLeft = 100)
    expect(await wide.evaluate(element => element.scrollLeft)).toBe(100)
  })
}

test('leaves tables inside not-prose at their natural width', async ({ page }) => {
  const table = page.locator('#excluded')
  await expect(table).toHaveCSS('display', 'table')
  expect((await table.boundingBox())!.width).toBeLessThan((await page.locator('main').boundingBox())!.width)
})
