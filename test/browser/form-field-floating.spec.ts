import { expect, test } from '@nuxt/test-utils/playwright'

test('floating labels follow native input and composite control state after hydration', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  page.on('pageerror', error => issues.push(error.message))

  const response = await page.request.get('/')
  const html = await response.text()
  expect(html).toContain('id="floating-field-fixture"')
  expect(html).toContain('data-selaras-label-mode="floating"')

  await goto('/', { waitUntil: 'hydration' })
  const field = (id: string) => page.locator(`#floating-field-fixture [data-selaras-label-mode="floating"]`).filter({ has: page.locator(`label[for="${id}"]`) })
  const labelTop = async (id: string) => field(id).locator('label').evaluate(el => Number.parseFloat(getComputedStyle(el).top))

  const email = field('floating-email')
  const emailInput = email.locator('input')
  expect(await labelTop('floating-email')).toBeGreaterThan(5)
  await emailInput.focus()
  await expect.poll(() => labelTop('floating-email')).toBe(0)
  await emailInput.fill('maya@example.com')
  await emailInput.evaluate(el => (el as HTMLInputElement).blur())
  await expect.poll(() => labelTop('floating-email')).toBe(0)
  await emailInput.fill('')
  await emailInput.evaluate(el => (el as HTMLInputElement).blur())
  await expect.poll(() => labelTop('floating-email')).toBeGreaterThan(5)

  const plan = field('floating-plan')
  expect(await labelTop('floating-plan')).toBeGreaterThan(5)
  await plan.locator('[data-ui-group-item]').first().click()
  await page.getByRole('option', { name: 'Team' }).click()
  await expect(plan.locator('[data-selaras-field-filled]')).toHaveCount(1)
  await expect.poll(() => labelTop('floating-plan')).toBe(0)

  const date = field('floating-date')
  expect(await labelTop('floating-date')).toBeGreaterThan(5)
  const dateButton = date.getByRole('button', { name: 'Appointment' })
  await expect(dateButton).toHaveAttribute('id', 'floating-date')
  await dateButton.click()
  await expect.poll(() => labelTop('floating-date')).toBe(0)
  await dateButton.click()

  const segmentedDate = field('floating-segmented-date')
  await expect.poll(() => labelTop('floating-segmented-date')).toBe(0)
  const monthSegment = segmentedDate.getByRole('spinbutton', { name: 'month', exact: false })
  await expect(monthSegment).toBeVisible()
  await monthSegment.click()
  await monthSegment.press('1')
  await expect(monthSegment).toHaveText('1')

  const grouped = field('floating-search')
  expect(await labelTop('floating-search')).toBeGreaterThan(5)
  const groupedInput = grouped.locator('input')
  const labelAboveInput = () => grouped.evaluate((root) => {
    const label = root.querySelector('[data-selaras-floating-label]')!
    const inputWrapper = root.querySelector('input')!.parentElement!
    return Number.parseInt(getComputedStyle(label).zIndex) > Number.parseInt(getComputedStyle(inputWrapper).zIndex)
  })
  await groupedInput.hover()
  await expect.poll(labelAboveInput).toBe(true)
  await groupedInput.focus()
  await page.mouse.move(0, 0)
  await expect.poll(labelAboveInput).toBe(true)
  await expect.poll(() => labelTop('floating-search')).toBe(0)
  await groupedInput.fill('query')
  await groupedInput.evaluate(el => (el as HTMLInputElement).blur())
  await expect.poll(() => labelTop('floating-search')).toBe(0)
  expect(issues).toEqual([])
})
