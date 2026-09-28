import { createResolver } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: ['@sewadah/selaras', '@nuxt/content', resolve('./modules/docs.mjs')],
  // Selaras supports Node versions with node:sqlite. Keeping Content on its
  // native connector lets an installed docs layer avoid a native addon.
  content: {
    // Include h3 headings in the docs sidebar TOC; Nuxt Content defaults to
    // including headings through h2 only.
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
      },
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },
})
