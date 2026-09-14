/**
 * The structured, already-resolved DTCG color subset Selaras can serialize
 * today. Resolution, alias traversal and context selection belong to the
 * caller's DTCG processor, not the component runtime.
 */
export type DtcgColorSpace = 'srgb' | 'srgb-linear' | 'oklch'
export type DtcgColorComponent = number | 'none'

export interface DtcgResolvedColor {
  colorSpace: DtcgColorSpace
  components: readonly [DtcgColorComponent, DtcgColorComponent, DtcgColorComponent]
  /** Omitted alpha means fully opaque; DTCG does not permit `none` here. */
  alpha?: number
  /** Optional six-digit fallback required by DTCG when provided. */
  hex?: string
}

export interface DtcgColorConversionOptions {
  /** Source path included in validation errors. @default '$value' */
  path?: string
}

function invalid(path: string, message: string): never {
  throw new Error(`Invalid resolved DTCG color at ${path}: ${message}`)
}

function assertComponent(value: unknown, path: string): asserts value is DtcgColorComponent {
  if (value !== 'none' && (typeof value !== 'number' || !Number.isFinite(value)))
    invalid(path, 'components must be finite numbers or "none".')
}

function assertRange(value: DtcgColorComponent, path: string, minimum: number, maximum: number, inclusiveMaximum = true): void {
  if (value === 'none')
    return
  if (value < minimum || value > maximum || (!inclusiveMaximum && value === maximum))
    invalid(path, `must be within ${inclusiveMaximum ? `[${minimum}, ${maximum}]` : `[${minimum}, ${maximum})`}.`)
}

/**
 * Converts a resolved structured DTCG color to a browser CSS value.
 * It deliberately accepts no CSS strings, aliases, token groups or Resolver
 * documents: pass a resolved `$value` at the semantic mapping boundary.
 */
export function dtcgColorToCss(value: unknown, options: DtcgColorConversionOptions = {}): string {
  const path = options.path ?? '$value'
  if (!value || typeof value !== 'object' || Array.isArray(value))
    invalid(path, 'expected a structured color value after reference resolution.')

  const color = value as Partial<DtcgResolvedColor>
  if (color.colorSpace !== 'srgb' && color.colorSpace !== 'srgb-linear' && color.colorSpace !== 'oklch')
    invalid(path, 'unsupported colorSpace; supported values are "srgb", "srgb-linear" and "oklch".')
  if (!Array.isArray(color.components) || color.components.length !== 3)
    invalid(path, 'components must contain exactly three values.')
  for (const [index, component] of color.components.entries())
    assertComponent(component, `${path}.components[${index}]`)

  if (color.colorSpace === 'srgb' || color.colorSpace === 'srgb-linear') {
    for (const [index, component] of color.components.entries())
      assertRange(component, `${path}.components[${index}]`, 0, 1)
  }
  else {
    assertRange(color.components[0], `${path}.components[0]`, 0, 1)
    assertRange(color.components[1], `${path}.components[1]`, 0, Number.POSITIVE_INFINITY)
    assertRange(color.components[2], `${path}.components[2]`, 0, 360, false)
  }

  if (color.alpha !== undefined && (typeof color.alpha !== 'number' || !Number.isFinite(color.alpha) || color.alpha < 0 || color.alpha > 1))
    invalid(`${path}.alpha`, 'must be a number within [0, 1].')
  if (color.hex !== undefined && (typeof color.hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(color.hex)))
    invalid(`${path}.hex`, 'must be a six-digit CSS hex fallback.')

  const alpha = color.alpha === undefined ? '' : ` / ${color.alpha}`
  const components = color.components.join(' ')
  return color.colorSpace === 'oklch'
    ? `oklch(${components}${alpha})`
    : `color(${color.colorSpace} ${components}${alpha})`
}
