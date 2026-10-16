export function hueToHex(h: number) {
  const toLinear = (lightness: number, chroma: number) => {
    const a = chroma * Math.cos((h * Math.PI) / 180)
    const b = chroma * Math.sin((h * Math.PI) / 180)
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
  }
  // Keep the brand's lightness and give up chroma until the color fits sRGB.
  let chroma = 0.2
  let rgb = toLinear(0.5, chroma)
  while (rgb.some(channel => channel < 0 || channel > 1) && chroma > 0) {
    chroma -= 0.005
    rgb = toLinear(0.5, chroma)
  }
  return `#${rgb.map((channel) => {
    const clamped = Math.min(1, Math.max(0, channel))
    const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055
    return Math.round(encoded * 255).toString(16).padStart(2, '0')
  }).join('')}`
}
