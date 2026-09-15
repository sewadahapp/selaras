import type { ColorModePair, ColorRecipe } from './color-registry'
import { defaultSeedSurfaces } from '../default-color-metadata'

export interface SeedColorSurfaces {
  light: string
  dark: string
}

export interface SeedColorOptions {
  /** Opaque sRGB surfaces used to derive and verify each mode. */
  surfaces?: SeedColorSurfaces
}

type Rgb = readonly [number, number, number]
type Lch = readonly [number, number, number]

const textMinimum = 4.5
const nonTextMinimum = 3
const textGuard = 4.7
const nonTextGuard = 3.2
const black: Rgb = [0, 0, 0]
const white: Rgb = [1, 1, 1]

function invalid(message: string): never {
  throw new Error(`Invalid Selaras seed color: ${message}`)
}

function rgb(red: number, green: number, blue: number): Rgb {
  return [red, green, blue]
}

function parseHex(value: string, label: string): Rgb {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value))
    invalid(`${label} must be an opaque six-digit sRGB hex color such as "#FD5E53".`)
  return rgb(
    Number.parseInt(value.slice(1, 3), 16) / 255,
    Number.parseInt(value.slice(3, 5), 16) / 255,
    Number.parseInt(value.slice(5, 7), 16) / 255,
  )
}

function gammaToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function linearToGamma(value: number): number {
  return value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055
}

function rgbToLab(rgb: Rgb): Rgb {
  const [red, green, blue] = rgb
  const r = gammaToLinear(red)
  const g = gammaToLinear(green)
  const b = gammaToLinear(blue)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function labToRgb([L, a, b]: Rgb): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    linearToGamma(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

function labToLch([l, a, b]: Rgb): Lch {
  const chroma = Math.hypot(a, b)
  return [l, chroma, chroma < 1e-7 ? 0 : (Math.atan2(b, a) * 180 / Math.PI + 360) % 360]
}

function lchToLab([l, chroma, hue]: Lch): Rgb {
  const radians = hue * Math.PI / 180
  return [l, chroma * Math.cos(radians), chroma * Math.sin(radians)]
}

function inGamut(rgb: Rgb): boolean {
  return rgb.every(value => value >= -1e-7 && value <= 1 + 1e-7)
}

function fitLch([lightness, chroma, hue]: Lch): Rgb {
  let low = 0
  let high = chroma
  let result = labToRgb(lchToLab([lightness, 0, hue]))
  for (let iteration = 0; iteration < 24; iteration++) {
    const candidateChroma = (low + high) / 2
    const candidate = labToRgb(lchToLab([lightness, candidateChroma, hue]))
    if (inGamut(candidate)) {
      low = candidateChroma
      result = candidate
    }
    else {
      high = candidateChroma
    }
  }
  return rgb(
    Math.min(1, Math.max(0, result[0])),
    Math.min(1, Math.max(0, result[1])),
    Math.min(1, Math.max(0, result[2])),
  )
}

function quantize(rgb: Rgb): Rgb {
  return parseHex(toHex(rgb), 'derived color')
}

function toHex(rgb: Rgb): string {
  return `#${rgb.map(value => Math.round(value * 255).toString(16).padStart(2, '0')).join('')}`
}

function luminance(rgb: Rgb): number {
  const [red, green, blue] = rgb
  const r = gammaToLinear(red)
  const g = gammaToLinear(green)
  const b = gammaToLinear(blue)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(left: Rgb, right: Rgb): number {
  const leftLuminance = luminance(left)
  const rightLuminance = luminance(right)
  const lighter = Math.max(leftLuminance, rightLuminance)
  const darker = Math.min(leftLuminance, rightLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

function mixLab(left: Rgb, right: Rgb, amount: number): Rgb {
  const source = rgbToLab(left)
  const target = rgbToLab(right)
  const mixed = labToRgb(rgb(
    source[0] * (1 - amount) + target[0] * amount,
    source[1] * (1 - amount) + target[1] * amount,
    source[2] * (1 - amount) + target[2] * amount,
  ))
  return rgb(
    Math.min(1, Math.max(0, mixed[0])),
    Math.min(1, Math.max(0, mixed[1])),
    Math.min(1, Math.max(0, mixed[2])),
  )
}

interface ColorSeries {
  colors: Rgb[]
  cost: number
}

function findSeries(seed: Rgb, direction: number, step: number, count: number, accepts: (color: Rgb) => boolean, distinct = true): ColorSeries {
  const [seedLightness, seedChroma, seedHue] = labToLch(rgbToLab(seed))
  let best: ColorSeries | undefined
  for (let index = 0; index <= 1000; index++) {
    const baseLightness = index / 1000
    const lightnesses = Array.from({ length: count }, (_, state) => baseLightness + direction * step * state)
    if (lightnesses.some(value => value < 0 || value > 1))
      continue
    const colors = lightnesses.map(lightness => quantize(fitLch([lightness, seedChroma, seedHue])))
    if (!colors.every(accepts) || (distinct && new Set(colors.map(toHex)).size !== colors.length))
      continue
    const cost = Math.abs(baseLightness - seedLightness)
    if (!best || cost < best.cost)
      best = { colors, cost }
  }
  if (!best)
    throw new Error('no series satisfies the required contrast.')
  return best
}

interface StateSeries extends ColorSeries {
  collapsed: boolean
}

function findStateSeries(seed: Rgb, direction: number, step: number, count: number, accepts: (color: Rgb) => boolean): StateSeries {
  for (const scale of [1, 0.75, 0.5, 0.25, 0.1]) {
    try {
      return { ...findSeries(seed, direction, step * scale, count, accepts), collapsed: false }
    }
    catch {}
  }
  return { ...findSeries(seed, direction, 0, count, accepts, false), collapsed: true }
}

function requireSeries(mode: keyof SeedColorSurfaces, family: string, create: () => StateSeries): StateSeries {
  try {
    return create()
  }
  catch {
    invalid(`cannot derive the ${mode} ${family} family while preserving its contrast targets; provide an explicit defineColor() recipe.`)
  }
}

function deriveMode(seed: Rgb, surface: Rgb, mode: keyof SeedColorSurfaces): ColorRecipe {
  const direction = contrast(white, surface) > contrast(black, surface) ? 1 : -1
  const fillCandidates = [black, white].flatMap((foreground) => {
    try {
      const series = findStateSeries(seed, direction, 0.045, 3, color => contrast(color, surface) >= nonTextGuard && contrast(color, foreground) >= textGuard)
      return [{ ...series, foreground }]
    }
    catch {
      return []
    }
  }).sort((left, right) => (left.cost + Number(left.collapsed) * 0.02) - (right.cost + Number(right.collapsed) * 0.02))
  const fill = fillCandidates[0]
  if (!fill)
    invalid(`cannot derive the ${mode} fill family while preserving its contrast targets; provide an explicit defineColor() recipe.`)

  const fillColor = fill.colors[0]!
  const subtle = quantize(mixLab(surface, fillColor, 0.10))
  const subtleHover = quantize(mixLab(surface, fillColor, 0.14))
  const subtlePressed = quantize(mixLab(surface, fillColor, 0.18))
  const text = requireSeries(mode, 'text/subtle', () => findStateSeries(seed, direction, 0.03, 3, color => [surface, subtle, subtleHover, subtlePressed].every(background => contrast(color, background) >= textGuard))).colors
  const border = requireSeries(mode, 'border', () => findStateSeries(seed, direction, 0.02, 1, color => contrast(color, surface) >= nonTextGuard)).colors[0]!

  return {
    fill: toHex(fill.colors[0]!),
    fillHover: toHex(fill.colors[1]!),
    fillPressed: toHex(fill.colors[2]!),
    onFill: toHex(fill.foreground),
    subtle: toHex(subtle),
    subtleHover: toHex(subtleHover),
    subtlePressed: toHex(subtlePressed),
    onSubtle: toHex(text[0]!),
    text: toHex(text[0]!),
    textHover: toHex(text[1]!),
    textPressed: toHex(text[2]!),
    border: toHex(border),
    focus: toHex(text[0]!),
  }
}

/**
 * Derives a complete, opaque two-mode web ColorRecipe from one opaque sRGB seed.
 * Custom or unresolved surfaces require explicit recipes instead.
 */
export function defineColorFromSeed(seed: string, options: SeedColorOptions = {}): ColorModePair<ColorRecipe> {
  const surfaces = options.surfaces ?? defaultSeedSurfaces
  const color = parseHex(seed, 'seed')
  return {
    light: deriveMode(color, parseHex(surfaces.light, 'surfaces.light'), 'light'),
    dark: deriveMode(color, parseHex(surfaces.dark, 'surfaces.dark'), 'dark'),
  }
}

export const seedColorContrastTargets = {
  text: textMinimum,
  nonText: nonTextMinimum,
} as const
