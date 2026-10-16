import { expect, test } from '@nuxt/test-utils/playwright'

export function toolbarContract() {
  for (const mode of ['horizontal', 'vertical', 'rtl']) {
    test(`shares one focus sequence across action and toggle groups in ${mode}`, async ({ page, goto }) => {
      await goto(mode === 'horizontal' ? '/' : `/?${mode}=true`, { waitUntil: 'hydration' })
      const toolbar = page.getByRole('toolbar', { name: 'Fixture actions' })
      const forward = mode === 'vertical' ? 'ArrowDown' : mode === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      const backward = mode === 'vertical' ? 'ArrowUp' : mode === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      await page.locator('#before').focus()
      await page.keyboard.press('Tab')
      await expect(toolbar.getByRole('button', { name: 'First', exact: true })).toBeFocused()
      await page.keyboard.press(forward)
      await expect(toolbar.getByRole('button', { name: 'Bold', exact: true })).toBeFocused()
      await page.keyboard.press('Space')
      await expect(toolbar.getByRole('button', { name: 'Bold', exact: true })).toHaveAttribute('aria-pressed', 'true')
      await page.keyboard.press(forward)
      await expect(toolbar.getByRole('button', { name: 'Italic', exact: true })).toBeFocused()
      await page.keyboard.press(forward)
      await expect(toolbar.getByRole('button', { name: 'Last', exact: true })).toBeFocused()
      await page.keyboard.press(forward)
      await expect(toolbar.getByRole('button', { name: 'First', exact: true })).toBeFocused()
      await page.keyboard.press(backward)
      await expect(toolbar.getByRole('button', { name: 'Last', exact: true })).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(page.locator('#actions')).toHaveText('1')
      await expect(page.locator('#submits')).toHaveText('0')
      await page.keyboard.press('Tab')
      await expect(page.locator('#after')).toBeFocused()
      await expect(toolbar.getByRole('separator')).toHaveAttribute('data-orientation', mode === 'vertical' ? 'horizontal' : 'vertical')
      await expect(toolbar.getByRole('button', { name: 'First', exact: true })).toHaveCSS('height', '32px')
      await page.locator('#disable').click()
      for (const button of await toolbar.getByRole('button').all())
        await expect(button).toBeDisabled()
    })
  }
}
