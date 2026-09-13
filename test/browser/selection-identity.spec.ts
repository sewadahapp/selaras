import { expect, test } from '@nuxt/test-utils/playwright'

test('preserves primitive identity through hydration, chip removal, and form reset', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('pageerror', error => issues.push(error.message))
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  await goto('/', { waitUntil: 'hydration' })
  const form = page.locator('#identity-form')
  const trigger = form.getByRole('button', { name: 'Choose identities', exact: true })
  await expect(trigger).toHaveAccessibleDescription('Choose numeric or string identities.')
  const values = () => form.evaluate(el => new FormData(el as HTMLFormElement).getAll('identity'))
  await expect.poll(values).toEqual(['1', '1'])
  await form.getByLabel('Remove Numeric identity', { exact: true }).click()
  await expect.poll(values).toEqual(['1'])
  await expect(form.getByLabel('Remove String identity', { exact: true })).toBeVisible()
  await form.getByRole('button', { name: 'Reset identities' }).click()
  await expect.poll(values).toEqual(['1', '1'])
  await expect(form.getByLabel('Remove Numeric identity', { exact: true })).toBeVisible()
  expect(issues).toEqual([])
})
