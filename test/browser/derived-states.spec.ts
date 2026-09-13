import { expect, test } from '@nuxt/test-utils/playwright'

test('derives omitted states from resolved scoped leaves and explicit state inputs', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const button = page.locator('#derived-states-button')
  const colors = () => button.evaluate((element) => {
    const probe = document.createElement('span')
    element.append(probe)
    const result = Object.fromEntries(['fill', 'fill-hover', 'fill-pressed', 'subtle', 'subtle-hover', 'subtle-pressed', 'text', 'text-hover', 'text-pressed', 'focus'].map((field) => {
      probe.style.color = `var(--_selaras-color-${field})`
      return [field, getComputedStyle(probe).color]
    }))
    probe.remove()
    return result
  })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    const fill = dark ? 'rgb(30, 31, 32)' : 'rgb(20, 21, 22)'
    const subtle = dark ? 'rgb(70, 71, 72)' : 'rgb(60, 61, 62)'
    const text = dark ? 'rgb(110, 111, 112)' : 'rgb(100, 101, 102)'
    expect(await colors()).toEqual({
      'fill': fill,
      'fill-hover': fill,
      'fill-pressed': fill,
      'subtle': subtle,
      'subtle-hover': subtle,
      'subtle-pressed': subtle,
      'text': text,
      'text-hover': text,
      'text-pressed': text,
      'focus': text,
    })
    await button.evaluate((element) => {
      element.style.setProperty('--selaras-color-enterprise-fill-hover', 'rgb(40 41 42)')
      element.style.setProperty('--selaras-color-enterprise-subtle-hover', 'rgb(80 81 82)')
      element.style.setProperty('--selaras-color-enterprise-text-hover', 'rgb(120 121 122)')
    })
    expect(await colors()).toMatchObject({
      'fill-pressed': 'rgb(40, 41, 42)',
      'subtle-pressed': 'rgb(80, 81, 82)',
      'text-pressed': 'rgb(120, 121, 122)',
      'focus': text,
    })
    await button.evaluate((element) => {
      element.style.setProperty('--selaras-color-enterprise-fill-pressed', 'rgb(50 51 52)')
    })
    expect(await colors()).toMatchObject({ 'fill-hover': 'rgb(40, 41, 42)', 'fill-pressed': 'rgb(50, 51, 52)' })
    await button.evaluate((element) => {
      element.style.removeProperty('--selaras-color-enterprise-fill-hover')
      element.style.removeProperty('--selaras-color-enterprise-fill-pressed')
      element.style.removeProperty('--selaras-color-enterprise-subtle-hover')
      element.style.removeProperty('--selaras-color-enterprise-text-hover')
    })
    expect(await colors()).toMatchObject({ 'fill-hover': fill, 'fill-pressed': fill, 'subtle-pressed': subtle, 'text-pressed': text })
  }
})

test('preserves an authored state even when its expression equals the base expression', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const values = await page.locator('#brand-vars-button').evaluate((element) => {
    element.style.setProperty('--selaras-color-brand-vars-fill', 'rgb(90 91 92)')
    const probe = document.createElement('span')
    element.append(probe)
    const colors = ['fill', 'fill-hover', 'fill-pressed'].map((field) => {
      probe.style.color = `var(--_selaras-color-${field})`
      return getComputedStyle(probe).color
    })
    probe.remove()
    return colors
  })
  expect(values).toEqual(['rgb(90, 91, 92)', 'rgb(17, 34, 51)', 'rgb(17, 34, 51)'])
})
