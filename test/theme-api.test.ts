import { describe, expect, it } from 'vitest'
import { defineColor } from '../src/runtime/theme-api'

const recipe = {
  fill: '#5134a8',
  onFill: '#ffffff',
  subtle: '#eeeaff',
  onSubtle: '#201050',
  text: '#5134a8',
  border: '#765fc0',
}

describe('theme public API', () => {
  it('returns the authored mode pair unchanged', () => {
    const color = { light: recipe, dark: { ...recipe, fill: '#a895f0' } }
    expect(defineColor(color)).toBe(color)
  })

  it('rejects a missing mode or required semantic leaf', () => {
    expect(() => defineColor({ light: recipe } as any)).toThrow('both light and dark')
    expect(() => defineColor({ light: recipe, dark: { ...recipe, border: '' } })).toThrow('"border" must be a non-empty string')
  })
})
