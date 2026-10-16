import type { Page } from '@playwright/test'
import { expect, test } from '@nuxt/test-utils/playwright'

async function expectControlHeights(page: Page, scale = 1) {
  for (const [size, height] of [['sm', 32], ['md', 40], ['lg', 44]] as const) {
    const section = page.locator(`[data-size=${size}]`)
    const controls = await section.locator('[data-control], [data-picker] [data-selaras-field-segmented], [data-picker$="-button"] button[aria-expanded]').evaluateAll(elements => elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return { name: element.getAttribute('data-control') ?? element.closest('[data-picker]')?.getAttribute('data-picker'), height: rect.height, width: rect.width }
    }))
    expect(controls.length).toBe(26)
    for (const control of controls) {
      expect(control.height, `${control.name} at ${size}`).toBeCloseTo(height * scale, 1)
      if (control.name === 'pin')
        expect(control.width, `square PIN box at ${size}`).toBeCloseTo(height * scale, 1)
    }
  }
}

export function controlSizingContract() {
  test('matches button and single-line field heights in both color modes and viewport sizes', async ({ page, goto }) => {
    const issues: string[] = []
    page.on('pageerror', error => issues.push(error.message))
    page.on('console', (message) => {
      if (/hydration|mismatch/i.test(message.text()))
        issues.push(message.text())
    })
    await goto('/', { waitUntil: 'hydration' })
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const dark of [false, true]) {
        await page.locator('html').evaluate((element, dark) => element.classList.toggle('dark', dark), dark)
        await expectControlHeights(page)
      }
    }
    await page.addStyleTag({ content: 'html { font-size: 20px; }' })
    await expectControlHeights(page, 1.25)
    expect(issues).toEqual([])
  })

  test('keeps clear actions inside the trigger and does not resize the control after clearing', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    for (const size of ['sm', 'md', 'lg']) {
      for (const kind of ['select-clear', 'autocomplete-clear']) {
        const trigger = page.locator(`[data-size=${size}] [data-control=${kind}]`)
        const before = (await trigger.boundingBox())!
        const clear = trigger.getByRole('button', { name: 'Clear', exact: true })
        const action = (await clear.boundingBox())!
        const targetSize = { sm: 24, md: 28, lg: 32 }[size]!
        const iconSize = { sm: 16, md: 18, lg: 20 }[size]!
        expect(action.width).toBe(targetSize)
        expect(action.height).toBe(targetSize)
        await expect(clear.locator('.iconify')).toHaveCSS('width', `${iconSize}px`)
        await expect(clear.locator('.iconify')).toHaveCSS('height', `${iconSize}px`)
        expect(action.y).toBeGreaterThan(before.y)
        expect(action.y + action.height).toBeLessThan(before.y + before.height)
        const background = await clear.evaluate(element => getComputedStyle(element).backgroundColor)
        await clear.hover()
        await expect.poll(() => clear.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(background)
        await clear.click()
        await expect(clear).toHaveCount(0)
        expect((await trigger.boundingBox())!.height).toBe(before.height)
      }
      for (const mode of ['field', 'button']) {
        for (const kind of ['date', 'range', 'time']) {
          const picker = page.locator(`[data-size=${size}] [data-picker=${kind}-${mode}]`)
          const clear = picker.getByRole('button', { name: 'Clear', exact: true })
          await expect(clear).toHaveCSS('width', `${{ sm: 24, md: 28, lg: 32 }[size]}px`)
          await expect(clear.locator('.iconify')).toHaveCSS('width', `${{ sm: 16, md: 18, lg: 20 }[size]}px`)
          if (mode === 'button') {
            const calendar = picker.locator('button[aria-expanded] .iconify')
            await expect(calendar).toBeVisible()
            const glyph = (await calendar.boundingBox())!
            const action = (await clear.boundingBox())!
            expect(glyph.x - action.x - action.width).toBeGreaterThanOrEqual(4)
          }
          await clear.click()
          await expect(clear).toHaveCount(0)
          if (mode === 'button')
            await expect(picker.locator('button[aria-expanded]')).toBeFocused()
          else
            await expect(picker.getByRole('spinbutton').first()).toBeFocused()
        }
      }
    }
    await expectControlHeights(page)
  })

  test('retains a full-height popup search input and allows multiline selections to grow', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await page.locator('[data-size=md] [data-control=select-search]').click()
    const search = page.getByRole('combobox')
    const popupSearch = search.filter({ visible: true }).last()
    await expect(popupSearch).toHaveCSS('height', '36px')
    await popupSearch.fill('Two')
    await page.getByRole('option', { name: 'Two', exact: true }).click()
    await expect(page.locator('[data-size=md] [data-control=select-search]')).toHaveText('Two')
    for (const kind of ['select', 'autocomplete']) {
      const trigger = page.locator(`[data-wrapping=${kind}] [data-ui-group-item]`)
      expect((await trigger.boundingBox())!.height).toBeGreaterThan(40)
      await expect(trigger).toContainText('Customer support')
    }
  })
}
