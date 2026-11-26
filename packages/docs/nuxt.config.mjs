import { createResolver } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: ['@sewadah/selaras', '@nuxt/content', resolve('./modules/docs.mjs')],
  vite: {
    ssr: {
      // Vue Router needs Nuxt's compile-time Vue flags in the SSR bundle.
      noExternal: ['vue-router'],
    },
    environments: {
      ssr: {
        build: {
          rolldownOptions: {
            // Nuxt 4 also imports unctx by absolute path after transforming
            // async setup. Match the external status of the bare import.
            external: [/[\\/]node_modules[\\/]unctx[\\/]dist[\\/]index\.mjs$/],
          },
        },
      },
    },
  },
  experimental: {
    emitRouteChunkError: 'automatic-immediate',
    // Keep page boundaries client-side so fatal SSR errors reach error.vue
    // and Nuxt sends the original HTTP error status.
    ssrErrorBoundary: false,
    // Content 3 still imports server utilities from Nitro's generated imports.
    nitroAutoImports: true,
  },
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
