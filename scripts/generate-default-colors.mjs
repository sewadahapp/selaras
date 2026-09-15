import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { dtcgColorToCss } from '../src/runtime/utils/dtcg-colors.ts'

const sourceUrl = new URL('../src/tokens/default-colors.tokens.json', import.meta.url)
const outputUrl = new URL('../src/runtime/default-colors.css', import.meta.url)
const paletteNamePattern = /^[a-z][a-z0-9-]*$/
const stepPattern = /^\d+$/

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
  return `/* Generated from ../tokens/default-colors.tokens.json. Do not edit directly. */\n@theme static {\n${declarations.join('\n')}\n}\n`
}

export async function expectedDefaultColorCss() {
  return generateDefaultColorCss(JSON.parse(await readFile(sourceUrl, 'utf8')))
}

export async function checkDefaultColorCss() {
  const [expected, actual] = await Promise.all([
    expectedDefaultColorCss(),
    readFile(outputUrl, 'utf8'),
  ])
  if (actual !== expected)
    throw new Error('Generated default colors are stale. Run `bun run tokens:generate`.')
}

async function main() {
  if (process.argv.includes('--check')) {
    await checkDefaultColorCss()
    return
  }
  await writeFile(outputUrl, await expectedDefaultColorCss())
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  await main()
