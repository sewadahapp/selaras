import { $fetch } from '#imports'

export default defineNuxtPlugin({
  name: 'selaras-docs-content-fetch',
  enforce: 'pre',
  setup() {
    // Content 3 uses a global fetch client; newer Nuxt releases scope it to imports.
    const globals = globalThis as typeof globalThis & { $fetch?: typeof $fetch }
    globals.$fetch ??= $fetch
  },
})
