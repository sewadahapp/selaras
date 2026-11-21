import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Input semantic focus leaves in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      const input = page.locator(`#input-${role}`)
      await expect(input.locator('..')).toHaveAttribute('data-selaras-color', role)
      await expect(input).toHaveClass(/focus:ring-\[var\(--_selaras-color-focus\)\]/)
    }
  }
})

test('uses the danger semantic role for invalid Input styling', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const input = page.locator('#input-invalid')
  await expect(input.locator('..')).toHaveAttribute('data-selaras-color', 'danger')
  await expect(input).toHaveClass(/focus:ring-\[var\(--_selaras-color-focus\)\]/)
})

test('hides Chromium native search cancel only when Selaras clear replaces it', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const clearable = page.locator('#search-clearable')
  await expect(clearable).toHaveAttribute('type', 'search')
  await expect(clearable).toHaveClass(/\[&::-webkit-search-cancel-button\]:hidden/)

  // Chromium does not expose a UA shadow pseudo-element's computed style via
  // getComputedStyle, so assert the generated CSS rule itself instead: the
  // scoped arbitrary variant must compile to display:none on the cancel glyph.
  const hidesCancel = await page.evaluate(() => {
    const walk = (rules: CSSRuleList): boolean => Array.from(rules).some((rule) => {
      const hide = 'selectorText' in rule
        && (rule as CSSStyleRule).selectorText.includes('search-cancel-button')
        && (rule as CSSStyleRule).cssText.includes('display: none')
      if (hide)
        return true
      return 'cssRules' in (rule as CSSGroupingRule) && walk((rule as CSSGroupingRule).cssRules)
    })
    return Array.from(document.styleSheets).some((sheet) => {
      try {
        return walk(sheet.cssRules)
      }
      catch {
        return false
      }
    })
  })
  expect(hidesCancel).toBe(true)

  // The replacement is a real, keyboard-operable button that clears the model.
  const clearButton = clearable.locator('..').getByRole('button', { name: 'Clear' })
  await expect(clearButton).toBeVisible()
  await clearButton.focus()
  await page.keyboard.press('Enter')
  await expect(clearable).toHaveValue('')
  await expect(clearable).toBeFocused()

  // Without clearable, native search behavior stays untouched.
  const plain = page.locator('#search-plain')
  await expect(plain).toHaveAttribute('type', 'search')
  await expect(plain).not.toHaveClass(/\[&::-webkit-search-cancel-button\]:hidden/)
})
