import { defineColor, defineColorFromSeed, dtcgColorToCss } from '@sewadah/selaras/theme'

const recipe = {
  fill: '#5134a8',
  onFill: '#ffffff',
  subtle: '#eeeaff',
  onSubtle: '#201050',
  text: '#5134a8',
  border: '#765fc0',
}
const color = { light: recipe, dark: { ...recipe, fill: '#a895f0' } }

if (defineColor(color) !== color)
  throw new Error('The published defineColor helper must preserve its input object.')

if (dtcgColorToCss({ colorSpace: 'oklch', components: [0.7, 0.2, 320] }) !== 'oklch(0.7 0.2 320)')
  throw new Error('The published DTCG helper must serialize resolved OKLCH values.')

if (defineColorFromSeed('#FD5E53').light.fill !== '#fd5e53')
  throw new Error('The published seed helper must normalize the documented one-color path.')
