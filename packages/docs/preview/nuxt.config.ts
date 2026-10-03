export default defineNuxtConfig({
  extends: ['..'],
  compatibilityDate: '2026-09-19',
  nitro: { prerender: { routes: ['/examples/team-picker'] } },
})
