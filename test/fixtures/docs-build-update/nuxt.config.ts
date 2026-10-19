export default defineNuxtConfig({
  extends: ['../../../packages/docs'],
  app: { baseURL: '/manual/' },
  selarasDocs: { css: false },
  css: ['~/main.css'],
  build: { transpile: ['reka-ui', /^@vueuse\//, 'vue-demi'] },
  compatibilityDate: '2026-10-19',
})
