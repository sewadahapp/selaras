import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@sewadah/selaras', '@nuxt/content'],
  // Selaras supports Node versions with node:sqlite. Keeping Content on its
  // native connector lets an installed docs layer avoid a native addon.
  content: {
    experimental: {
      sqliteConnector: 'native',
    },
  },
})
