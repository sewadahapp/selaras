export default defineNuxtConfig({
  extends: ['@sewadah/selaras-docs'],
  compatibilityDate: 'latest',
  selarasDocs: { css: false },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  // The repository consumer resolves Selaras through the local workspace.
  // Keep Reka and VueUse in the app bundle so SSR uses one Vue instance.
  build: {
    transpile: ['reka-ui', /^@vueuse\//, 'vue-demi'],
  },
})
