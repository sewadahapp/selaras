import { expect, test } from '@nuxt/test-utils/playwright'

test('Callout shares Alert soft styling and reveals a striped border on hover or focus within', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const note = page.locator('#callout-note')
  await expect(note).toHaveAttribute('data-selaras-color', 'info')
  await expect(note).toHaveClass(/bg-\[var\(--_selaras-color-subtle\)\]/)

  const before = async (id: string) => page.locator(id).evaluate(element => {
    const style = getComputedStyle(element, '::before')
    return { opacity: style.opacity, image: style.backgroundImage, mask: style.maskComposite }
  })

  expect(await before('#callout-note')).toMatchObject({ opacity: '0' })
  await note.hover()
  await expect.poll(async () => (await before('#callout-note')).opacity).toBe('1')
  const visibleBorder = await before('#callout-note')
  expect(visibleBorder.image).toContain('repeating-linear-gradient')
  expect(visibleBorder.mask.split(',').map(value => value.trim())).toEqual(['exclude', 'exclude'])

  const focusCallout = page.locator('#callout-focus')
  await focusCallout.locator('a').focus()
  await expect.poll(async () => (await before('#callout-focus')).opacity).toBe('1')
})
