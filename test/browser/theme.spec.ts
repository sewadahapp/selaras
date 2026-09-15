import { expect, test } from '@nuxt/test-utils/playwright'

test('preserves semantic role markup through SSR hydration', async ({ page, goto }) => {
  const response = await page.request.get('/')
  expect(response.ok()).toBe(true)
  const html = await response.text()
  expect(html).toMatch(/<button[^>]*data-selaras-color="enterprise"[^>]*id="enterprise-button"/)
  expect(html).toMatch(/<button[^>]*data-selaras-color="brand-vars"[^>]*id="brand-vars-button"/)

  const hydrationIssues: string[] = []
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text()))
      hydrationIssues.push(message.text())
  })
  page.on('pageerror', (error) => {
    if (/hydration|mismatch/i.test(error.message))
      hydrationIssues.push(error.message)
  })

  await goto('/', { waitUntil: 'hydration' })
  await expect(page.locator('#enterprise-button')).toHaveAttribute('data-selaras-color', 'enterprise')
  await expect(page.locator('#brand-vars-button')).toHaveAttribute('data-selaras-color', 'brand-vars')
  expect(hydrationIssues).toEqual([])
})

test('resolves registered semantic colors in a real browser', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  await expect(page.locator('#enterprise-button')).toHaveAttribute('data-selaras-color', 'enterprise')
  await expect.poll(async () => page.locator('#enterprise-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(81, 52, 168)')
})

test('resolves CSS-variable-backed semantic colors in a real browser', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  await expect(page.locator('#brand-vars-button')).toHaveAttribute('data-selaras-color', 'brand-vars')
  await expect.poll(async () => page.locator('#brand-vars-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(17, 34, 51)')
})

test('inherits role-specific CSS overrides from document and local ancestors', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const background = (id: string) => page.locator(`#${id}`).evaluate(element => getComputedStyle(element).backgroundColor)
  await expect.poll(() => background('local-role-input-button')).toBe('rgb(30, 31, 32)')
  await expect.poll(() => background('nested-role-input-button')).toBe('rgb(33, 34, 35)')

  await page.locator('html').evaluate(element => element.style.setProperty('--selaras-color-enterprise-fill', 'rgb(36 37 38)'))
  await expect.poll(() => background('enterprise-button')).toBe('rgb(36, 37, 38)')
  await expect.poll(() => background('local-role-input-button')).toBe('rgb(30, 31, 32)')
  await expect.poll(() => background('nested-role-input-button')).toBe('rgb(33, 34, 35)')
  await expect.poll(() => background('brand-vars-button')).toBe('rgb(17, 34, 51)')
  await expect.poll(() => background('scoped-popover-button')).toBe('rgb(9, 8, 7)')

  await page.locator('html').evaluate(element => element.classList.add('dark'))
  await expect.poll(() => background('enterprise-button')).toBe('rgb(36, 37, 38)')
  await expect.poll(() => background('local-role-input-button')).toBe('rgb(30, 31, 32)')
})

test('resolves scoped theme colors on portalled content in a real browser', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const portalButton = page.locator('#scoped-popover-button')
  await expect(portalButton).toHaveAttribute('data-selaras-color', 'enterprise')
  await expect.poll(async () => portalButton.evaluate(element => element.closest('[data-selaras-theme]')?.getAttribute('data-selaras-theme') ?? '')).not.toBe('')
  await expect.poll(async () => portalButton.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(9, 8, 7)')
})

test('transports scoped theme colors into the DatePicker portal', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await page.locator('#scoped-date-picker-fixture button[aria-label="Date picker"]').click()

  const selectedDay = page.locator('button[data-selected][data-selaras-color="enterprise"]')
  await expect(selectedDay).toBeVisible()
  await expect.poll(async () => selectedDay.evaluate(element => element.closest('[data-selaras-theme]')?.getAttribute('data-selaras-theme') ?? '')).not.toBe('')
  await expect.poll(async () => selectedDay.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(80, 81, 82)')
})

test('retains the caller theme scope on a queued Toast', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await page.locator('#scoped-toast-trigger').evaluate((element: HTMLButtonElement) => element.click())

  const toast = page.locator('[data-selaras-color="enterprise"]', { hasText: 'Scoped toast' })
  await expect(toast).toBeVisible()
  await expect.poll(async () => toast.getAttribute('data-selaras-theme')).not.toBe('')
  await expect.poll(async () => toast.evaluate(element => getComputedStyle(element).borderInlineStartColor)).toBe('rgb(90, 91, 92)')
})

test('does not let a scoped light override win in dark mode', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await page.locator('html').evaluate(element => element.classList.add('dark'))

  const portalButton = page.locator('#scoped-popover-button')
  await expect.poll(async () => portalButton.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(167, 139, 250)')
})

test('preserves keyboard focus ownership for an uncontrolled popover', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const trigger = page.locator('#keyboard-popover-trigger')
  await trigger.focus()
  await page.keyboard.press('Enter')

  const content = page.locator('#keyboard-popover-content')
  await expect(content).toBeVisible()
  await expect.poll(async () => page.evaluate(() => document.activeElement?.id)).toBe('keyboard-popover-content')

  await page.keyboard.press('Escape')
  await expect(content).toBeHidden()
  await expect.poll(async () => page.evaluate(() => document.activeElement?.id)).toBe('keyboard-popover-trigger')
})

test('isolates nested explicit theme scopes in a real browser', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  await expect.poll(async () => page.locator('#nested-outer-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(40, 41, 42)')
  await expect.poll(async () => page.locator('#nested-inner-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(50, 51, 52)')
})

test('isolates nested scoped overlays across two portal layers', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  const innerPortal = page.locator('#nested-inner-overlay-button')
  await expect(innerPortal).toHaveAttribute('data-selaras-color', 'enterprise')
  await expect.poll(async () => innerPortal.evaluate(element => element.closest('[data-selaras-theme]')?.getAttribute('data-selaras-theme') ?? '')).not.toBe('')
  await expect.poll(async () => innerPortal.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(70, 71, 72)')
  await expect.poll(async () => page.locator('#nested-inner-overlay-subtle').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(63, 64, 65)')
  await expect.poll(async () => page.locator('#nested-inner-inline-subtle').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(63, 64, 65)')

  const marker = await innerPortal.evaluate(element => element.closest('[data-selaras-theme]')?.getAttribute('data-selaras-theme'))
  await page.locator('#nested-tokens-update').evaluate((element: HTMLButtonElement) => element.click())
  await expect.poll(async () => page.locator('#nested-inner-overlay-subtle').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(83, 84, 85)')
  await expect.poll(async () => page.locator('#nested-inner-inline-subtle').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(83, 84, 85)')
  expect(await innerPortal.evaluate(element => element.closest('[data-selaras-theme]')?.getAttribute('data-selaras-theme'))).toBe(marker)

  await page.locator('html').evaluate(element => element.classList.add('dark'))
  await expect.poll(async () => innerPortal.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(110, 111, 112)')
  await expect.poll(async () => page.locator('#nested-inner-overlay-subtle').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(103, 104, 105)')
})

test('uses owned foundation defaults independently of inherited legacy color bridges', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const foundation = await page.locator('#builtin-foundation-probe').evaluate(element => getComputedStyle(element).color)
  await expect(page.locator('#builtin-foundation-button')).toHaveAttribute('data-selaras-color', 'primary')
  await expect.poll(async () => page.locator('#builtin-foundation-button').evaluate(element => getComputedStyle(element).backgroundColor)).toBe(foundation)
})

test('uses distinct semantic leaves for built-in and custom Button variants and states', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  for (const role of ['primary', 'enterprise']) {
    const solid = page.locator(`#semantic-${role}-solid`)
    const soft = page.locator(`#semantic-${role}-soft`)
    const outline = page.locator(`#semantic-${role}-outline`)
    const text = page.locator(`#semantic-${role}-text`)
    const ghost = page.locator(`#semantic-${role}-ghost`)
    await expect(solid).toHaveCSS('background-color', 'rgb(10, 20, 30)')
    await expect(solid).toHaveCSS('color', 'rgb(255, 255, 255)')
    await expect(soft).toHaveCSS('background-color', 'rgb(40, 50, 60)')
    await expect(soft).toHaveCSS('color', 'rgb(230, 240, 250)')
    await expect(outline).toHaveCSS('color', 'rgb(70, 80, 90)')
    await expect.poll(async () => outline.evaluate(element => getComputedStyle(element).boxShadow)).toContain('rgb(100, 110, 120)')
    await expect(ghost).toHaveCSS('color', 'rgb(70, 80, 90)')
    await expect(text).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await expect(text).toHaveCSS('color', 'rgb(70, 80, 90)')

    await solid.hover()
    await expect(solid).toHaveCSS('background-color', 'rgb(20, 30, 40)')
    await page.mouse.down()
    await expect(solid).toHaveCSS('background-color', 'rgb(30, 40, 50)')
    await page.mouse.up()
    await soft.hover()
    await expect(soft).toHaveCSS('background-color', 'rgb(50, 60, 70)')
    await page.mouse.down()
    await expect(soft).toHaveCSS('background-color', 'rgb(60, 70, 80)')
    await page.mouse.up()
    await text.hover()
    await expect(text).toHaveCSS('color', 'rgb(80, 90, 100)')
    await page.mouse.down()
    await expect(text).toHaveCSS('color', 'rgb(90, 100, 110)')
    await expect(text).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await page.mouse.up()
    await page.keyboard.press('Tab')
    await outline.focus()
    await expect(outline).toHaveCSS('outline-color', 'rgb(130, 140, 150)')
  }
  await page.locator('html').evaluate(element => element.classList.add('dark'))
  await expect(page.locator('#semantic-primary-solid')).toHaveCSS('background-color', 'rgb(10, 20, 30)')
})

test('honors reduced-motion media preferences in compiled consumer CSS', async ({ page, goto }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await goto('/', { waitUntil: 'hydration' })

  await expect.poll(async () => page.locator('#enterprise-button').evaluate(element => getComputedStyle(element).transitionDuration)).toBe('1e-05s')
})

test('propagates RTL through the Nuxt App contract', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('#rtl-probe')).toHaveCSS('direction', 'rtl')
})

test('preserves a visible focus outline in forced-colors mode', async ({ page, goto }) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await goto('/', { waitUntil: 'hydration' })

  await expect.poll(async () => page.evaluate(() => window.matchMedia('(forced-colors: active)').matches)).toBe(true)
  await page.locator('#enterprise-button').focus()
  await expect.poll(async () => page.locator('#enterprise-button').evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none')
})
