import { expect, test } from '@nuxt/test-utils/playwright'

for (const kind of ['select', 'autocomplete'] as const) {
  test(`${kind} converts uncontrolled modes and adapts captured reset defaults`, async ({ page, goto }) => {
    const issues: string[] = []
    page.on('pageerror', error => issues.push(error.message))
    page.on('console', (message) => {
      if (/hydration|mismatch/i.test(message.text()))
        issues.push(message.text())
    })
    await goto('/', { waitUntil: 'hydration' })
    const form = page.locator(`#${kind}-mode-form`)
    const values = () => form.evaluate(el => ({
      uncontrolled: new FormData(el as HTMLFormElement).getAll('uncontrolled'),
      controlled: new FormData(el as HTMLFormElement).getAll('controlled'),
    }))
    await expect.poll(values).toEqual({ uncontrolled: ['0', '1'], controlled: ['0', '1'] })
    await form.getByRole('button', { name: 'Use single selection', exact: true }).click()
    await expect.poll(values).toEqual({ uncontrolled: ['0'], controlled: ['0'] })
    await expect(form.getByLabel('Uncontrolled proposal', { exact: true })).toHaveText('0')
    await expect(form.getByLabel('Controlled proposal count', { exact: true })).toHaveText('0')
    if (kind === 'autocomplete')
      await expect(form.getByRole('combobox', { name: 'Uncontrolled autocomplete', exact: true })).toHaveValue('Numeric zero')
    await form.getByRole('button', { name: 'Reset mode selections', exact: true }).click()
    await expect.poll(values).toEqual({ uncontrolled: ['0'], controlled: ['0'] })
    if (kind === 'autocomplete')
      await expect(form.getByRole('combobox', { name: 'Uncontrolled autocomplete', exact: true })).toHaveValue('Numeric zero')
    await form.getByRole('button', { name: 'Use multiple selection', exact: true }).click()
    await expect.poll(values).toEqual({ uncontrolled: ['0'], controlled: ['0'] })
    await expect(form.getByLabel('Uncontrolled proposal', { exact: true })).toHaveText('[0]')
    await form.getByRole('button', { name: 'Reset mode selections', exact: true }).click()
    await expect.poll(values).toEqual({ uncontrolled: ['0', '1'], controlled: ['0', '1'] })
    expect(issues).toEqual([])
  })
}

for (const owner of ['Uncontrolled', 'Controlled'] as const) {
  test(`keeps the ${owner.toLowerCase()} Autocomplete query and focus when its input branch changes`, async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    const form = page.locator('#autocomplete-mode-form')
    const input = form.getByRole('combobox', { name: `${owner} autocomplete`, exact: true })
    await input.fill('Active query')
    await expect(input).toBeFocused()
    await expect(input).toHaveAttribute('aria-expanded', 'true')
    // Programmatic activation changes mode without moving focus to the button.
    await form.getByRole('button', { name: 'Use single selection', exact: true }).evaluate(el => (el as HTMLButtonElement).click())
    await expect(input).toBeFocused()
    await expect(input).toHaveValue('Active query')
    await expect(input).toHaveAttribute('aria-expanded', 'true')
    await form.getByRole('button', { name: 'Use multiple selection', exact: true }).evaluate(el => (el as HTMLButtonElement).click())
    await expect(input).toBeFocused()
    await expect(input).toHaveValue('Active query')
    await expect(input).toHaveAttribute('aria-expanded', 'true')
    await form.getByRole('button', { name: 'Use single selection', exact: true }).click()
    await expect(form.getByRole('button', { name: 'Use multiple selection', exact: true })).toBeFocused()
  })
}

test('cancels composition on a mode change and permits later suggestion selection', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const form = page.locator('#autocomplete-mode-form')
  const input = form.getByRole('combobox', { name: 'Uncontrolled autocomplete', exact: true })
  await input.focus()
  await input.dispatchEvent('compositionstart', { data: '' })
  await input.fill('Composing query')
  await form.getByRole('button', { name: 'Use single selection', exact: true }).evaluate(el => (el as HTMLButtonElement).click())
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
  await input.fill('Numeric one')
  await input.press('Enter')
  await expect.poll(() => form.evaluate(el => new FormData(el as HTMLFormElement).getAll('uncontrolled'))).toEqual(['1'])
})
