import type { Locator, Page } from '@playwright/test'
import { expect, test } from '@nuxt/test-utils/playwright'

function caretTo(input: Locator, position: number) {
  return input.evaluate((element: HTMLInputElement, at) => element.setSelectionRange(at, at), position)
}

async function setup(page: Page, goto: (url: string, options: { waitUntil: 'hydration' }) => Promise<unknown>) {
  await goto('/?mask=1', { waitUntil: 'hydration' })
  const input = page.locator('#masked-phone')
  const value = page.locator('#masked-phone-value')
  const caret = () => input.evaluate((element: HTMLInputElement) => element.selectionStart)
  await input.click()
  return { input, value, caret }
}

test('mask shows formatted text while the model keeps the raw value', async ({ page, goto }) => {
  const { input, value } = await setup(page, goto)
  await page.keyboard.type('5551234567')

  await expect(input).toHaveValue('(555) 123-4567')
  await expect(value).toHaveText('5551234567')
})

test('mask keeps the caret beside a character typed or deleted mid-value', async ({ page, goto }) => {
  const { input, value, caret } = await setup(page, goto)
  await page.keyboard.type('5551234567')

  await caretTo(input, 3)
  await page.keyboard.type('9')
  await expect(input).toHaveValue('(559) 512-3456')
  await expect(value).toHaveText('5595123456')
  expect(await caret()).toBe(4)

  await caretTo(input, 7)
  await page.keyboard.press('Backspace')
  await expect(input).toHaveValue('(559) 123-456')
  expect(await caret()).toBe(6)
})

test('mask steps back over a literal on backspace instead of re-inserting it', async ({ page, goto }) => {
  const { input, caret } = await setup(page, goto)
  await page.keyboard.type('5591')
  await expect(input).toHaveValue('(559) 1')

  await caretTo(input, 6)
  await page.keyboard.press('Backspace')
  await expect(input).toHaveValue('(559) 1')
  expect(await caret()).toBe(5)
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await expect(input).toHaveValue('(551')
})

test('mask formats a model value set from code', async ({ page, goto }) => {
  const { input } = await setup(page, goto)
  await page.getByRole('button', { name: 'Set phone' }).click()
  await expect(input).toHaveValue('(555) 123-4567')
})
