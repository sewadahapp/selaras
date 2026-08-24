export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/content', '@nuxt/fonts'],
  css: ['~/assets/css/global.css'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },
})
