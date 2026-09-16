import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { dtcgColorToCss } from '../src/runtime/utils/dtcg-colors.ts'

const sourceUrl = new URL('../src/tokens/default-colors.tokens.json', import.meta.url)
const outputUrl = new URL('../src/runtime/default-colors.css', import.meta.url)
const metadataUrl = new URL('../src/runtime/default-color-metadata.ts', import.meta.url)
const paletteNamePattern = /^[a-z][a-z0-9-]*$/
const stepPattern = /^\d+$/

function linearToGamma(value) {
  return value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055
}

/** The generator emits portable sRGB metadata from the owned OKLCH source. */
function oklchToSrgbHex([L, chroma, hue]) {
  const radians = hue * Math.PI / 180
  const encode = (candidateChroma) => {
    const candidateA = candidateChroma * Math.cos(radians)
    const candidateB = candidateChroma * Math.sin(radians)
    const l = (L + 0.3963377774 * candidateA + 0.2158037573 * candidateB) ** 3
    const m = (L - 0.1055613458 * candidateA - 0.0638541728 * candidateB) ** 3
    const s = (L - 0.0894841775 * candidateA - 1.291485548 * candidateB) ** 3
    return [
      linearToGamma(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
      linearToGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
      linearToGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    ]
  }
  let low = 0
  let high = chroma
  let rgb = encode(0)
  for (let iteration = 0; iteration < 24; iteration++) {
    const candidateChroma = (low + high) / 2
    const candidate = encode(candidateChroma)
    if (candidate.every(component => component >= -1e-7 && component <= 1 + 1e-7)) {
      low = candidateChroma
      rgb = candidate
    }
    else {
      high = candidateChroma
    }
  }
  return `#${rgb.map(component => Math.round(Math.min(1, Math.max(0, component)) * 255).toString(16).padStart(2, '0')).join('')}`
}

function invalid(path, message) {
  throw new Error(`Invalid Selaras default color token at ${path}: ${message}`)
}

function record(value, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    invalid(path, 'expected an object.')
  return value
}

/** Serializes Selaras's known portable foundation document into Tailwind CSS. */
export function generateDefaultColorCss(document) {
  const root = record(document, '$')
  const color = record(root.color, 'color')
  if (color.$type !== 'color')
    invalid('color.$type', 'expected the inherited "color" type.')
  const palettes = record(color.palette, 'color.palette')
  const declarations = []

  for (const [palette, shades] of Object.entries(palettes).sort(([left], [right]) => left.localeCompare(right))) {
    if (!paletteNamePattern.test(palette))
      invalid(`color.palette.${palette}`, 'palette names must be lowercase kebab-case.')
    for (const [step, token] of Object.entries(record(shades, `color.palette.${palette}`)).sort(([left], [right]) => Number(left) - Number(right))) {
      if (!stepPattern.test(step))
        invalid(`color.palette.${palette}.${step}`, 'steps must be decimal numbers.')
      const leaf = record(token, `color.palette.${palette}.${step}`)
      if (leaf.$type !== undefined && leaf.$type !== 'color')
        invalid(`color.palette.${palette}.${step}.$type`, 'expected "color" when supplied.')
      declarations.push(`  --color-selaras-${palette}-${step}: ${dtcgColorToCss(leaf.$value, { path: `color.palette.${palette}.${step}.$value` })};`)
    }
  }

  if (declarations.length === 0)
    invalid('color.palette', 'expected at least one color token.')
  const light = {
    'surface-default': '--theme(--color-selaras-gray-25)',
    'surface-elevated': '--theme(--color-selaras-gray-50)',
    'surface-inverted': '--theme(--color-selaras-gray-950)',
    'text-default': '--theme(--color-selaras-gray-950)',
    'text-muted': '--theme(--color-selaras-gray-600)',
    'text-inverted': '--theme(--color-selaras-gray-50)',
    'border-default': '--theme(--color-selaras-gray-200)',
    'border-muted': '--theme(--color-selaras-gray-100)',
    'border-hover': '--theme(--color-selaras-gray-300)',
  }
  const dark = {
    'surface-default': '--theme(--color-selaras-gray-950)',
    'surface-elevated': '--theme(--color-selaras-gray-900)',
    'surface-inverted': '--theme(--color-selaras-gray-50)',
    'text-default': '--theme(--color-selaras-gray-50)',
    'text-muted': '--theme(--color-selaras-gray-400)',
    'text-inverted': '--theme(--color-selaras-gray-950)',
    'border-default': '--theme(--color-selaras-gray-800)',
    'border-muted': '--theme(--color-selaras-gray-900)',
    'border-hover': '--theme(--color-selaras-gray-700)',
  }
  const defaultDeclarations = values => Object.entries(values).map(([name, value]) => `  --_selaras-default-${name}: ${value};`).join('\n')
  return `/* Generated from ../tokens/default-colors.tokens.json. Do not edit directly. */\n@theme static {\n${declarations.join('\n')}\n}\n\n@layer theme {\n  :root,\n  [data-selaras-theme] {\n${defaultDeclarations(light)}\n  }\n\n  :root.dark,\n  :root.dark [data-selaras-theme]:where(:not([data-selaras-mode]), [data-selaras-mode="root"]),\n  [data-selaras-theme]:where([data-selaras-mode="dark"]) {\n${defaultDeclarations(dark)}\n  }\n}\n`
}

/** Emits the default surfaces consumed by the build-time seed helper. */
export function generateDefaultColorMetadata(document) {
  const gray = record(record(record(document, '$').color, 'color').palette, 'color.palette').gray
  const palette = record(gray, 'color.palette.gray')
  const surface = (step) => {
    const token = record(palette[step], `color.palette.gray.${step}`)
    const value = record(token.$value, `color.palette.gray.${step}.$value`)
    if (value.colorSpace !== 'oklch' || !Array.isArray(value.components) || value.components.length !== 3 || !value.components.every(component => typeof component === 'number'))
      invalid(`color.palette.gray.${step}.$value`, 'expected an OKLCH color with three numeric components.')
    return oklchToSrgbHex(value.components)
  }
  return `/* Generated from ../tokens/default-colors.tokens.json. Do not edit directly. */\nexport const defaultSeedSurfaces = {\n  light: '${surface('25')}',\n  dark: '${surface('950')}',\n} as const\n`
}

export async function expectedDefaultColorCss() {
  return generateDefaultColorCss(JSON.parse(await readFile(sourceUrl, 'utf8')))
}

export async function expectedDefaultColorMetadata() {
  return generateDefaultColorMetadata(JSON.parse(await readFile(sourceUrl, 'utf8')))
}

export async function checkDefaultColorCss() {
  const [expectedCss, actualCss, expectedMetadata, actualMetadata] = await Promise.all([
    expectedDefaultColorCss(),
    readFile(outputUrl, 'utf8'),
    expectedDefaultColorMetadata(),
    readFile(metadataUrl, 'utf8'),
  ])
  if (actualCss !== expectedCss || actualMetadata !== expectedMetadata)
    throw new Error('Generated default color artifacts are stale. Run `bun run tokens:generate`.')
}

async function main() {
  if (process.argv.includes('--check')) {
    await checkDefaultColorCss()
    return
  }
  const [css, metadata] = await Promise.all([expectedDefaultColorCss(), expectedDefaultColorMetadata()])
  await Promise.all([writeFile(outputUrl, css), writeFile(metadataUrl, metadata)])
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  await main()
