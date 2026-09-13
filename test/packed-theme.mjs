import { defineColor } from '@sewadah/selaras/theme'

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
