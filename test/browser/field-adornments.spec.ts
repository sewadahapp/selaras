import type { Locator } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/field-adornments', import.meta.url)) } })

async function expectRoomForContent(field: Locator, rtl: boolean) {
  await expect(async () => {
    const geometry = await field.evaluate((root, rtl) => {
      const native = root.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type=hidden]),textarea,button[aria-haspopup]')!
      const start = root.querySelector<HTMLElement>('[data-test=leading]')!.getBoundingClientRect()
      const end = root.querySelector<HTMLElement>('[data-test=trailing]')!.getBoundingClientRect()
      const input = native.getBoundingClientRect()
      const css = getComputedStyle(native)
      const contentStart = rtl ? input.right - Number.parseFloat(css.paddingInlineStart) : input.left + Number.parseFloat(css.paddingInlineStart)
      const contentEnd = rtl ? input.left + Number.parseFloat(css.paddingInlineEnd) : input.right - Number.parseFloat(css.paddingInlineEnd)
      const clear = root.querySelector<HTMLElement>('[aria-label=Clear]')?.getBoundingClientRect()
      return { startGap: rtl ? start.left - contentStart : contentStart - start.right, endGap: rtl ? contentEnd - end.right : end.left - contentEnd, width: input.width, clearGap: clear ? (rtl ? clear.left - end.right : end.left - clear.right) : undefined }
    }, rtl)
    expect(geometry.startGap).toBeGreaterThanOrEqual(7)
    expect(geometry.endGap).toBeGreaterThanOrEqual(7)
    expect(geometry.width).toBeGreaterThan(100)
    if (geometry.clearGap !== undefined)
      expect(geometry.clearGap).toBeGreaterThanOrEqual(0)
  }).toPass({ timeout: 3000 })
}

for (const rtl of [false, true]) {
  test(`reserves dynamic adornment widths at every size in ${rtl ? 'RTL' : 'LTR'}`, async ({ page, goto }, testInfo) => {
    const issues: string[] = []
    page.on('pageerror', error => issues.push(error.message))
    page.on('console', (message) => {
      if (/hydration|mismatch/i.test(message.text()))
        issues.push(message.text())
    })
    await page.setViewportSize({ width: 1280, height: 1000 })
    await goto(rtl ? '/?rtl=true' : '/', { waitUntil: 'hydration' })
    for (const size of ['sm', 'md', 'lg']) {
      for (const component of ['input', 'textarea', 'select', 'autocomplete'])
        await expectRoomForContent(page.locator(`[data-case=${component}-${size}]`), rtl)
    }
    await page.locator('#expand').click()
    await expect.poll(() => page.locator('[data-case=input-md] [data-test=trailing]').evaluate(el => el.getBoundingClientRect().width)).toBeGreaterThan(90)
    for (const component of ['input', 'textarea', 'select', 'autocomplete'])
      await expectRoomForContent(page.locator(`[data-case=${component}-md]`), rtl)
    expect(issues).toEqual([])
    if (!rtl)
      await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true })
  })
}

test('keeps actions focusable beside clear controls without opening Select or submitting the form', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const select = page.locator('[data-case=select-md]')
  const action = select.getByRole('button', { name: 'Info', exact: true })
  await page.locator('#select-md').focus()
  await page.keyboard.press('Tab')
  await expect(action).toBeFocused()
  await action.press('Enter')
  await expect(page.locator('#actions')).toHaveText('1')
  await expect(page.locator('#submits')).toHaveText('0')
  await expect(page.getByRole('option')).toHaveCount(0)
  await expect(select.locator('button button')).toHaveCount(0)
  await select.getByLabel('Clear', { exact: true }).click()
  await expect(action).toBeVisible()
  await expect(page.locator('#select-md')).not.toContainText('One')
  await expect(page.getByRole('option')).toHaveCount(0)
  await page.locator('#disable').click()
  await expect(action).toBeDisabled()
  await action.evaluate(el => (el as HTMLButtonElement).focus())
  await expect(action).not.toBeFocused()
})

test('keeps custom field actions separate from adaptive modal triggers', async ({ page, goto }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await goto('/', { waitUntil: 'hydration' })
  for (const component of ['select', 'autocomplete']) {
    const field = page.locator(`[data-case=${component}-md]`)
    await expectRoomForContent(field, false)
    await field.getByRole('button', { name: 'Info', exact: true }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.locator(`#${component}-md`).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(field.getByRole('button', { name: 'Info', exact: true })).toBeVisible()
  }
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true })
})

test('keeps password visibility and clearing independent without submitting the form', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const field = page.locator('[data-case=input-md]')
  const input = page.locator('#input-md')
  await expect(input).toHaveAttribute('type', 'password')
  await input.focus()
  await page.keyboard.press('Tab')
  await expect(field.getByLabel('Clear', { exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  const action = field.getByRole('button', { name: 'Info', exact: true })
  await expect(action).toBeFocused()
  await action.press('Enter')
  await expect(input).toHaveAttribute('type', 'text')
  await expect(input).toHaveValue('secret')
  expect(await page.locator('#fields-form').evaluate(el => new FormData(el as HTMLFormElement).get('input-md'))).toBe('secret')
  await expect(page.locator('#submits')).toHaveText('0')
  await field.getByLabel('Clear', { exact: true }).click()
  await expect(input).toHaveValue('')
  await expect(action).toBeVisible()
  await expectRoomForContent(field, false)
})
