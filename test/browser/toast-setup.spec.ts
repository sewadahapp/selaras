import { expect, test } from '@nuxt/test-utils/playwright'

test('a toast added during setup renders the page and shows after hydration', async ({ page, goto }) => {
  const messages: string[] = []
  page.on('console', message => messages.push(message.text()))
  await goto('/?setupToast=1', { waitUntil: 'hydration' })

  await expect(page.getByText('Toast from setup', { exact: true })).toBeVisible()
  // Exactly one toast - the server skipped it, the browser added it once.
  await expect(page.getByRole('region', { name: /Notifications/ }).getByRole('listitem')).toHaveCount(1)
  expect(messages.filter(text => /hydration/i.test(text))).toEqual([])
})
