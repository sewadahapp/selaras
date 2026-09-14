import { Buffer } from 'node:buffer'
import { expect, test } from '@nuxt/test-utils/playwright'

test('hydrates library-owned dates and numbers and resets errors after real blur', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  page.on('pageerror', error => issues.push(error.message))
  await goto('/', { waitUntil: 'hydration' })
  const fixture = page.locator('#form-library-fixture')
  const state = () => fixture.locator('[data-test="state"]').evaluate(el => JSON.parse(el.textContent!))
  const html = await (await page.request.get('/')).text()
  expect(html).toMatch(/<input[^>]*name="date"[^>]*value="2024-01-15"/)
  await expect.poll(state).toEqual({ email: '', plan: 0, files: [], date: '2024-01-15', quantity: 1, touched: false, quantityTouched: false })
  await expect(fixture.getByRole('group', { name: 'Date', exact: true })).toBeVisible()

  const email = fixture.getByLabel('Email', { exact: true })
  await email.fill('invalid')
  await email.press('Tab')
  await expect.poll(async () => (await state()).touched).toBe(true)
  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await expect(email).toHaveAccessibleDescription('Your contact address Enter a valid email')

  const quantity = fixture.getByLabel('Quantity', { exact: true })
  await quantity.fill('')
  await quantity.press('Tab')
  await expect(quantity).toHaveAttribute('aria-invalid', 'true')
  await expect(quantity).toHaveAccessibleDescription('Enter a positive quantity')
  await fixture.locator('[data-test="date-field"]').getByRole('button', { name: 'Clear', exact: true }).click()
  await expect(fixture.locator('#integration-date-error')).toHaveText('Choose a date')
  await fixture.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(fixture.locator('[data-test="submitted"]')).toBeEmpty()

  await fixture.getByRole('button', { name: 'Reset', exact: true }).click()
  await expect.poll(state).toEqual({ email: '', plan: 0, files: [], date: '2024-01-15', quantity: 1, touched: false, quantityTouched: false })
  await expect(fixture.getByRole('alert')).toHaveCount(0)
  await expect(quantity).toHaveValue('1')
  await expect(email).not.toHaveAttribute('aria-invalid')
  await expect(email).toHaveAccessibleDescription('Your contact address')
  expect(issues).toEqual([])
})

test('submits typed user selections and synchronizes native controls on library reset', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const fixture = page.locator('#form-library-fixture')
  await fixture.getByLabel('Email', { exact: true }).fill('reader@example.com')
  const quantity = fixture.getByLabel('Quantity', { exact: true })
  await quantity.fill('2.5')
  await quantity.press('Tab')
  const plan = fixture.locator('#integration-plan')
  await fixture.locator('[data-test="plan-field"]').getByRole('button', { name: 'Clear', exact: true }).click()
  await plan.click()
  await page.getByRole('option', { name: 'Free', exact: true }).click()
  await fixture.getByRole('button', { name: 'Date picker', exact: true }).click()
  await page.locator('td button').filter({ hasText: /^20$/ }).click()
  await fixture.locator('#integration-files').setInputFiles({ name: 'proof.txt', mimeType: 'text/plain', buffer: Buffer.from('proof') })
  await fixture.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect.poll(() => fixture.locator('[data-test="submitted"]').evaluate(el => el.textContent ? JSON.parse(el.textContent) : null)).toEqual({
    email: 'reader@example.com',
    plan: 0,
    files: ['proof.txt'],
    date: '2024-01-20',
    calendarDate: true,
    quantity: 2.5,
    quantityType: 'number',
  })
  const nativeValues = () => fixture.locator('form').evaluate((form: HTMLFormElement) => {
    const values = new FormData(form)
    return { date: values.get('date'), quantity: values.get('quantity'), file: (values.get('files') as File)?.name }
  })
  await expect.poll(nativeValues).toEqual({ date: '2024-01-20', quantity: '2.5', file: 'proof.txt' })
  await fixture.getByRole('button', { name: 'Reset', exact: true }).click()
  await expect.poll(nativeValues).toEqual({ date: '2024-01-15', quantity: '1', file: '' })
  await expect(fixture.locator('#integration-files').locator('..').locator('li')).toHaveCount(0)
  await expect(quantity).toHaveValue('1')
})

test('hydrates and edits accessible range, time-only and date-time fields with a different client clock', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  page.on('pageerror', error => issues.push(error.message))
  await page.clock.setFixedTime(new Date(2035, 5, 7, 13, 42))
  await goto('/?accessibility=1', { waitUntil: 'hydration' })
  const fixture = page.locator('#datepicker-accessibility-fixture')
  await expect(fixture.getByRole('group', { name: 'Booking window', exact: true })).toBeVisible()
  await expect(fixture.getByRole('group', { name: 'Reminder time', exact: true })).toBeVisible()
  await expect(fixture.getByRole('group', { name: 'Booking window', exact: true })).toHaveAccessibleDescription('Select the arrival and departure dates.')
  await expect(fixture.getByRole('group', { name: 'Reminder time', exact: true })).toHaveAccessibleDescription('Use local time.')
  const reminder = fixture.getByRole('group', { name: 'Selected reminder', exact: true })
  const appointment = fixture.getByRole('group', { name: 'Appointment', exact: true })
  await expect(reminder.getByRole('spinbutton', { name: 'minute', exact: false })).toHaveText('30')
  await expect(appointment.getByRole('spinbutton', { name: 'minute', exact: false })).toHaveText('30')
  await reminder.getByRole('spinbutton', { name: 'minute', exact: false }).press('ArrowUp')
  await expect(fixture.locator('input[name="selected-time"]')).toHaveValue('14:31:00')
  await expect(fixture.locator('input[name="appointment"]')).toHaveValue('2024-01-15T14:30:00')
  expect(issues).toEqual([])
})

test('uses the opt-in DatePicker modal presentation on a narrow viewport', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  page.on('pageerror', error => issues.push(error.message))
  await page.setViewportSize({ width: 600, height: 800 })
  await goto('/?mobile=1', { waitUntil: 'hydration' })
  const fixture = page.locator('#datepicker-mobile-fixture')
  const trigger = fixture.getByRole('button', { name: 'Date picker', exact: true })
  await expect(trigger).toBeVisible()
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Date picker', exact: true })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAccessibleName('Date picker')
  await expect(dialog.getByRole('button', { name: 'Choose month', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  const rangeTrigger = fixture.getByRole('button', { name: 'Date range picker', exact: true })
  await rangeTrigger.click()
  const rangeDialog = page.getByRole('dialog', { name: 'Date range picker', exact: true })
  await expect(rangeDialog).toBeVisible()
  await expect(rangeDialog.getByRole('heading', { level: 2 })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(rangeDialog).toBeHidden()

  const timeTrigger = fixture.getByRole('button', { name: 'Time picker', exact: true })
  await timeTrigger.click()
  const timeDialog = page.getByRole('dialog', { name: 'Time picker', exact: true })
  await expect(timeDialog).toBeVisible()
  await expect(timeDialog.getByRole('button', { name: 'Increment', exact: true }).first()).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(timeDialog).toBeHidden()
  expect(issues).toEqual([])
})

test('uses the mobile modal for an initially open DatePicker after hydration', async ({ page, goto }) => {
  const issues: string[] = []
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      issues.push(message.text())
  })
  page.on('pageerror', error => issues.push(error.message))
  await page.setViewportSize({ width: 600, height: 800 })
  await goto('/?mobile=1&initialOpen=1', { waitUntil: 'hydration' })

  const dialog = page.getByRole('dialog', { name: 'Date picker', exact: true })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Choose month', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  expect(issues).toEqual([])
})

test('uses mobile modals for initially open Select, Autocomplete and ColorPicker controls', async ({ page, goto }) => {
  const cases = [
    ['initialSelect', 'initial-select-modal-content', true],
    ['initialAutocomplete', 'initial-autocomplete-modal-content', false],
    ['initialColorPicker', 'initial-color-picker-modal-content', true],
  ] as const

  await page.setViewportSize({ width: 600, height: 800 })
  for (const [query, contentTest, closesOnEscape] of cases) {
    const issues: string[] = []
    page.on('console', (message) => {
      if (/hydration|mismatch/i.test(message.text()))
        issues.push(message.text())
    })
    page.on('pageerror', error => issues.push(error.message))
    await goto(`/?mobile=1&${query}=1`, { waitUntil: 'hydration' })
    const dialog = page.locator(`[data-test="${contentTest}"]`).locator('xpath=ancestor::*[@role="dialog"]')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    if (closesOnEscape)
      await expect(dialog).toBeHidden()
    else
      await expect(dialog).toBeVisible()
    expect(issues).toEqual([])
  }
})
