import { expect, test } from '@nuxt/test-utils/playwright'

test('preserves DatePicker and ColorPicker native form values through reset', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const values = () => page.evaluate(() => {
    const form = document.querySelector<HTMLFormElement>('#native-form')!
    return Object.fromEntries(new FormData(form).entries())
  })

  await expect.poll(values).toEqual({ bookingDate: '2024-02-20', accent: '#00ff00' })

  await page.locator('#native-form [aria-label="Clear"]').click()
  await expect.poll(values).toEqual({ bookingDate: '', accent: '#00ff00' })

  await page.locator('#native-form-reset').click()
  await expect.poll(values).toEqual({ bookingDate: '2024-02-20', accent: '#00ff00' })
})

test('keeps FileUpload native attributes on the real file input after hydration', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const input = page.locator('input#native-file-upload[type="file"]')
  await expect(input).toHaveAttribute('capture', 'environment')
  await expect(input).toHaveAttribute('form', 'native-form')
  await expect(input.locator('..')).not.toHaveAttribute('capture')
})
