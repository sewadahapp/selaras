import { expect, test } from '@nuxt/test-utils/playwright'

test('renders Badge semantic leaves and visible dots in both modes', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'enterprise']) {
      for (const variant of ['solid', 'soft', 'outline']) {
        const badge = page.locator(`#semantic-badge-${role}-${variant}`)
        await expect(badge).toHaveAttribute('data-selaras-color', role)
        const expectedText = variant === 'solid' ? 'rgb(255, 255, 255)' : variant === 'soft' ? 'rgb(230, 240, 250)' : 'rgb(70, 80, 90)'
        const colors = await badge.evaluate((element) => {
          const style = getComputedStyle(element)
          const dot = element.querySelector('[aria-hidden="true"]')!
          return { text: style.color, background: style.backgroundColor, border: style.boxShadow, dot: getComputedStyle(dot).backgroundColor }
        })
        expect(colors.text).toBe(expectedText)
        expect(colors.dot).toBe(expectedText)
        expect(colors.background).toBe(variant === 'solid' ? 'rgb(10, 20, 30)' : variant === 'soft' ? 'rgb(40, 50, 60)' : 'rgba(0, 0, 0, 0)')
        if (variant === 'outline')
          expect(colors.border).toContain('rgb(100, 110, 120)')
      }
      const dot = page.locator(`#semantic-dot-${role}`)
      await expect(dot).toHaveRole('img')
      await expect(dot).toHaveAccessibleName(`${role} status`)
      expect(await dot.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(70, 80, 90)')
    }
  }
})

test('transports scoped Badge colors into a portal', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const badge = page.locator('#scoped-popover-badge')
  await expect(badge).toHaveAttribute('data-selaras-color', 'enterprise')
  expect(await badge.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(9, 8, 7)')
})
