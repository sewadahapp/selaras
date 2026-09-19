export default defineNuxtConfig({
  extends: ['@sewadah/selaras-docs'],
  compatibilityDate: '2026-09-15',
  debug: { hydration: true },
  selarasDocs: { css: false },
  selaras: { classPrefix: 'tw', adaptive: { breakpoint: 'tablet' } },
  css: ['~/main.css'],
})
