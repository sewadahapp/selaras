import { createResolver } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: ['@sewadah/selaras', '@nuxt/content', '@nuxt/fonts', resolve('./modules/docs.mjs')],
  // Selaras supports Node versions with node:sqlite. Keeping Content on its
  // native connector lets an installed docs layer avoid a native addon.
  content: {
    experimental: {
      sqliteConnector: 'native',
    },
  },
  fonts: {
    provider: 'npm',
    families: [
      { name: 'Plus Jakarta Sans', provider: 'npm' },
      { name: 'JetBrains Mono', provider: 'npm' },
    ],
  },
})
