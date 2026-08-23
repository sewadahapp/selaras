export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/content', '@nuxt/fonts'],
  css: ['~/assets/css/fonts.css'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },
})
