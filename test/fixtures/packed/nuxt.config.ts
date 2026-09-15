import { defineColor, defineColorFromSeed } from '@sewadah/selaras/theme'

const color = defineColor({
  light: { fill: '#123456', onFill: '#ffffff', subtle: '#ddeeff', onSubtle: '#112233', text: '#234567', border: '#345678' },
  dark: { fill: '#abcdef', onFill: '#112233', subtle: '#223344', onSubtle: '#ddeeff', text: '#cdefab', border: '#bcdefa' },
})

export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  compatibilityDate: '2026-09-13',
  debug: { hydration: true },
  selaras: { classPrefix: 'tw', adaptive: { breakpoint: 'tablet' }, theme: { colors: { 'published': color, 'published-accent': color, 'seeded': defineColorFromSeed('#FD5E53'), 'secondary': color } } },
  css: ['~/main.css'],
})
