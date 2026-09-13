import { Buffer } from 'node:buffer'
import { expect, test } from '@nuxt/test-utils/playwright'

test('preserves DatePicker and ColorPicker native form values through reset', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const values = () => page.evaluate(() => {
    const form = document.querySelector<HTMLFormElement>('#native-form')!
    const entries = new FormData(form)
    entries.delete('attachments')
    return Object.fromEntries(entries.entries())
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

test('submits selected FileUpload files and resets native validity', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const input = page.locator('input#native-file-upload[type="file"]')
  await input.setInputFiles({ name: 'proof.txt', mimeType: 'text/plain', buffer: Buffer.from('proof') })

  await expect.poll(async () => page.evaluate(() => {
    const form = document.querySelector<HTMLFormElement>('#native-form')!
    const file = form.elements.namedItem('attachments') as HTMLInputElement
    return {
      valid: form.checkValidity(),
      fileCount: file.files?.length ?? 0,
      formDataName: (new FormData(form).get('attachments') as File | null)?.name ?? null,
    }
  })).toEqual({ valid: true, fileCount: 1, formDataName: 'proof.txt' })

  await page.locator('#native-form-reset').click()
  await expect.poll(async () => page.evaluate(() => {
    const form = document.querySelector<HTMLFormElement>('#native-form')!
    const file = form.elements.namedItem('attachments') as HTMLInputElement
    return { valid: form.checkValidity(), fileCount: file.files?.length ?? 0 }
  })).toEqual({ valid: false, fileCount: 0 })
})
