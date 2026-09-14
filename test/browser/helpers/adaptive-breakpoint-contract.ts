import { expect, test } from '@nuxt/test-utils/playwright'

export function registerAdaptiveBreakpointContract() {
  test('agrees with host responsive CSS and holds the open presentation across resize', async ({ page, goto }) => {
    const issues: string[] = []
    page.on('pageerror', error => issues.push(error.message))
    page.on('console', (message) => {
      if (/hydration|mismatch|\[Selaras\]/i.test(message.text()))
        issues.push(message.text())
    })
    await page.setViewportSize({ width: 959, height: 800 })
    await goto('/', { waitUntil: 'hydration' })
    // Media-query rem uses initial font-size, not this authored size.
    await page.addStyleTag({ content: 'html { font-size: 32px; }' })
    const marker = page.locator('#responsive-breakpoint')
    const trigger = page.locator('#select-trigger')
    await expect(marker).toBeHidden()
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Choose a number', exact: true })
    await expect(dialog).toBeVisible()
    await page.setViewportSize({ width: 960, height: 800 })
    await expect(marker).toBeVisible()
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    await trigger.click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await expect(dialog).toBeHidden()
    expect(issues).toEqual([])
  })
}
