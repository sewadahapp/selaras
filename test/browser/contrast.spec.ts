import { writeFile } from 'node:fs/promises'
import { expect, test } from '@nuxt/test-utils/playwright'

// An audit artifact, not a compliance gate: palette changes will use this report
// to establish passing defaults before the experimental theme API is frozen.
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
          return { role: button.dataset.selarasColor, state, foregroundColor, backgroundColor, ratio, passes: ratio >= 4.5 }
        })
        probe.remove()
        return values
      })
    })
    measurements.push(...results.map(result => ({ mode, ...result })))
  }
  expect(measurements).toHaveLength(126)
  expect(measurements.every(result => Number.isFinite(result.ratio) && result.ratio >= 1 && result.ratio <= 21)).toBe(true)
  const report = testInfo.outputPath('stock-text-contrast.json')
  await writeFile(report, JSON.stringify({ threshold: 4.5, measurements }, null, 2))
  await testInfo.attach('stock-text-contrast.json', {
    path: report,
    contentType: 'application/json',
  })
})
