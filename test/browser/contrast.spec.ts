import { writeFile } from 'node:fs/promises'
import { expect, test } from '@nuxt/test-utils/playwright'

// Stock defaults on ui-bg only; arbitrary consumer palettes/surfaces need their
// own validation. Existing interaction tests verify actual state bindings.
test('measures stock semantic text contrast in both modes', async ({ page, goto }, testInfo) => {
  await goto('/', { waitUntil: 'hydration' })
  const measurements = []
  for (const mode of ['light', 'dark']) {
    await page.locator('html').evaluate((element, dark) => element.classList.toggle('dark', dark), mode === 'dark')
    const results = await page.locator('#stock-colors').evaluate((section) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      const context = canvas.getContext('2d')!
      const luminance = (color: string) => {
        context.clearRect(0, 0, 1, 1)
        context.fillStyle = color
        context.fillRect(0, 0, 1, 1)
        const pixel = context.getImageData(0, 0, 1, 1).data
        if (pixel[3] !== 255)
          throw new Error(`Expected an opaque resolved color: ${color}`)
        const linear = Array.from(pixel).slice(0, 3).map((value) => {
          const channel = value / 255
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
        })
        return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722
      }
      const surface = getComputedStyle(section).backgroundColor
      const pairs = [
        ['solid', 'on-fill', 'fill'],
        ['solid:hover', 'on-fill', 'fill-hover'],
        ['solid:active', 'on-fill', 'fill-pressed'],
        ['soft', 'on-subtle', 'subtle'],
        ['soft:hover', 'on-subtle', 'subtle-hover'],
        ['soft:active', 'on-subtle', 'subtle-pressed'],
        ['text', 'text', null],
        ['text:hover', 'text-hover', null],
        ['text:active', 'text-pressed', null],
        ['outline', 'text', null],
        ['outline:hover', 'text', 'subtle-hover'],
        ['outline:active', 'text', 'subtle-pressed'],
        ['ghost', 'text', null],
        ['ghost:hover', 'text', 'subtle-hover'],
        ['ghost:active', 'text', 'subtle-pressed'],
        ['focus', 'focus', null],
      ] as const
      return Array.from(section.querySelectorAll('button')).flatMap((button) => {
        const probe = document.createElement('span')
        button.append(probe)
        const values = pairs.map(([state, foreground, background]) => {
          probe.style.color = `var(--_selaras-color-${foreground})`
          probe.style.backgroundColor = background ? `var(--_selaras-color-${background})` : surface
          const style = getComputedStyle(probe)
          const foregroundColor = style.color
          const backgroundColor = style.backgroundColor
          const first = luminance(foregroundColor)
          const second = luminance(backgroundColor)
          const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
          const threshold = state === 'focus' ? 3 : 4.5
          return { role: button.dataset.selarasColor, state, foregroundColor, backgroundColor, ratio, threshold, passes: ratio >= threshold }
        })
        probe.remove()
        return values
      })
    })
    measurements.push(...results.map(result => ({ mode, ...result })))
  }
  expect(measurements).toHaveLength(224)
  expect(measurements.every(result => Number.isFinite(result.ratio) && result.ratio >= 1 && result.ratio <= 21)).toBe(true)
  const report = testInfo.outputPath('stock-text-contrast.json')
  await writeFile(report, JSON.stringify({ measurements }, null, 2))
  await testInfo.attach('stock-text-contrast.json', {
    path: report,
    contentType: 'application/json',
  })
  expect(measurements.filter(result => !result.passes)).toEqual([])
})

test('gives every stock soft Button distinct opaque hover and pressed surfaces', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  // Disable animation so the check compares settled semantic state colors.
  await page.addStyleTag({ content: '#stock-colors button { transition: none; }' })
  for (const dark of [false, true]) {
    await page.locator('html').evaluate((element, value) => element.classList.toggle('dark', value), dark)
    for (const role of ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral']) {
      await page.mouse.move(0, 0)
      const button = page.locator(`#stock-${role}`)
      const background = () => button.evaluate(element => getComputedStyle(element).backgroundColor)
      const initial = await background()
      await button.hover()
      const hover = await background()
      await page.mouse.down()
      const pressed = await background()
      await page.mouse.up()
      expect(new Set([initial, hover, pressed]).size, `${role}, dark=${dark}`).toBe(3)
    }
  }
})
