import { writeFile } from 'node:fs/promises'
import { expect, test } from '@nuxt/test-utils/playwright'

// Stock defaults on the default canvas only; arbitrary consumer palettes and
// surfaces need their own validation. Interaction tests verify state bindings.
test('measures stock semantic contrast in both modes', async ({ page, goto }, testInfo) => {
  await goto('/', { waitUntil: 'hydration' })
  const measurements = []
  for (const mode of ['light', 'dark']) {
    await page.locator('html').evaluate((element, dark) => element.classList.toggle('dark', dark), mode === 'dark')
    await expect(page.locator('#stock-colors')).toHaveCSS('background-color', mode === 'dark' ? 'rgb(12, 12, 13)' : 'rgb(255, 255, 255)')
    if (mode === 'light') {
      const primaryFill = await page.locator('#stock-primary').evaluate((button) => {
        const probe = document.createElement('span')
        probe.style.backgroundColor = 'var(--_selaras-color-fill)'
        button.append(probe)
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1
        const context = canvas.getContext('2d')!
        context.fillStyle = getComputedStyle(probe).backgroundColor
        context.fillRect(0, 0, 1, 1)
        const pixel = [...context.getImageData(0, 0, 1, 1).data]
        probe.remove()
        return pixel
      })
      expect(primaryFill).toEqual([78, 64, 201, 255])
    }
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
        ['solid', 'on-fill', 'fill', 4.5],
        ['solid:hover', 'on-fill', 'fill-hover', 4.5],
        ['solid:active', 'on-fill', 'fill-pressed', 4.5],
        ['soft', 'on-subtle', 'subtle', 4.5],
        ['soft:hover', 'on-subtle', 'subtle-hover', 4.5],
        ['soft:active', 'on-subtle', 'subtle-pressed', 4.5],
        ['text', 'text', null, 4.5],
        ['text:hover', 'text-hover', null, 4.5],
        ['text:active', 'text-pressed', null, 4.5],
        ['outline', 'text', null, 4.5],
        ['outline:hover', 'text', 'subtle-hover', 4.5],
        ['outline:active', 'text', 'subtle-pressed', 4.5],
        ['ghost', 'text', null, 4.5],
        ['ghost:hover', 'text', 'subtle-hover', 4.5],
        ['ghost:active', 'text', 'subtle-pressed', 4.5],
        ['indicator/surface', 'indicator', null, 3],
        ['border/surface', 'border', null, 3],
        ['focus/surface', 'focus', null, 3],
      ] as const
      return Array.from(section.querySelectorAll('button')).flatMap((button) => {
        const probe = document.createElement('span')
        button.append(probe)
        const values = pairs.map(([state, foreground, background, threshold]) => {
          probe.style.color = `var(--_selaras-color-${foreground})`
          probe.style.backgroundColor = background ? `var(--_selaras-color-${background})` : surface
          const style = getComputedStyle(probe)
          const foregroundColor = style.color
          const backgroundColor = style.backgroundColor
          const first = luminance(foregroundColor)
          const second = luminance(backgroundColor)
          const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
          return { role: button.dataset.selarasColor, state, foregroundColor, backgroundColor, ratio, threshold, passes: ratio >= threshold }
        })
        probe.remove()
        return values
      })
    })
    measurements.push(...results.map(result => ({ mode, ...result })))
  }
  expect(measurements).toHaveLength(252)
  expect(measurements.every(result => Number.isFinite(result.ratio) && result.ratio >= 1 && result.ratio <= 21)).toBe(true)
  const report = testInfo.outputPath('stock-semantic-contrast.json')
  await writeFile(report, JSON.stringify({ measurements }, null, 2))
  await testInfo.attach('stock-semantic-contrast.json', {
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
