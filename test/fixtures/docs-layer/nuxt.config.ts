export default defineNuxtConfig({
  extends: ['@sewadah/selaras-docs'],
  compatibilityDate: '2026-09-15',
  debug: { hydration: true },
  selaras: { classPrefix: 'tw', adaptive: { breakpoint: 'tablet' } },
  css: ['~/main.css'],
})
