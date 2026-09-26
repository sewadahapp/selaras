import { expect, test } from '@nuxt/test-utils/playwright'

test('scrollable tabs expose controls only on overflow and keep the active tab visible', async ({ page, goto }) => {
  await goto('/?tabs=1', { waitUntil: 'hydration' })
  const fixture = page.locator('#scrollable-tabs-fixture')
  const list = fixture.getByRole('tablist')
  const viewport = list.locator('..')
  const left = fixture.getByRole('button', { name: 'Scroll tabs left' })
  const right = fixture.getByRole('button', { name: 'Scroll tabs right' })

  await expect(left).toBeDisabled()
  await expect(right).toBeEnabled()
  await expect(left).toHaveAttribute('data-custom-scroll', 'yes')
  await expect(left.locator('[data-custom-icon]')).toHaveAttribute('data-custom-icon', 'yes')
  await right.click()
  await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)

  await fixture.getByRole('button', { name: 'Select last tab' }).click()
  const lastTab = list.getByRole('tab', { name: 'Tab 12' })
  await expect(lastTab).toHaveAttribute('aria-selected', 'true')
  await expect.poll(() => lastTab.evaluate((tab) => {
    const tabRect = tab.getBoundingClientRect()
    const viewportRect = tab.parentElement!.parentElement!.getBoundingClientRect()
    return tabRect.left >= viewportRect.left - 1 && tabRect.right <= viewportRect.right + 1
  })).toBe(true)
  await expect(right).toBeDisabled()

  await fixture.getByRole('button', { name: 'Toggle tab width' }).click()
  await expect(left).toHaveCount(0)
  await expect(right).toHaveCount(0)
})

test('scrollable tabs allow icon and full button replacement without losing control behavior', async ({ page, goto }) => {
  await goto('/?tabs=1', { waitUntil: 'hydration' })
  const fixture = page.locator('#custom-scrollable-tabs-fixture')
  const left = fixture.getByRole('button', { name: 'Scroll tabs left' })
  const right = fixture.getByTestId('custom-right-button')
  const viewport = fixture.getByRole('tablist').locator('..')

  await expect(fixture.getByTestId('custom-left-icon')).toBeVisible()
  await expect(left).toBeDisabled()
  await expect(right).toHaveAttribute('type', 'button')
  await expect(right).toHaveAttribute('aria-label', 'Scroll tabs right')
  await expect(right).toHaveAttribute('data-slot-label', 'Scroll tabs right')
  await right.click()
  await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
  await expect(left).toBeEnabled()
})

test('controlled scrollable tabs reveal a clicked tab with a single scroll', async ({ page, goto }) => {
  await goto('/?tabs=1', { waitUntil: 'hydration' })
  const fixture = page.locator('#scrollable-tabs-fixture')
  const list = fixture.getByRole('tablist')

  const result = await list.evaluate(async (tablist) => {
    const viewport = tablist.parentElement!
    const calls: unknown[] = []
    const scrollBy = viewport.scrollBy.bind(viewport)
    viewport.scrollBy = ((...args: Parameters<typeof scrollBy>) => {
      calls.push(args[0])
      scrollBy(...args)
    }) as typeof viewport.scrollBy

    // A tab cut off by the right edge. Dispatch the press directly, since a
    // real click would scroll it into view before Selaras gets a chance to.
    const viewportRect = viewport.getBoundingClientRect()
    const tab = [...tablist.querySelectorAll<HTMLElement>('[role="tab"]')]
      .find(element => element.getBoundingClientRect().right > viewportRect.right + 1)!
    tab.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }))
    await new Promise(resolve => setTimeout(resolve, 600))

    return { selected: tab.getAttribute('aria-selected'), calls: calls.length }
  })

  expect(result).toEqual({ selected: 'true', calls: 1 })
})
