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
  build: {
    // Without this, Vite's SSR build leaves these as external imports in the
    // server bundle, so they resolve through Nitro's separately-traced
    // node_modules copy of Vue instead of the one bundled into the app's own
    // entry chunk - two disconnected Vue module instances means Reka's
    // provide-inject-based primitives (Accordion, ScrollArea, NavigationMenu,
    // ConfigProvider, ...) crash on `getCurrentInstance()` in a real
    // production build. Forcing these into the same bundle keeps every
    // component on one Vue instance.
    transpile: ['reka-ui', /^@vueuse\//, 'vue-demi'],
  },
  hooks: {
    // @nuxt/content asks Vite to pre-bundle `@nuxtjs/mdc`'s own dependencies
    // via the "pkg > subpkg" nested-resolution syntax, which needs
    // `@nuxtjs/mdc` itself resolvable as a real node_modules entry starting
    // from this project's root. Bun's installer doesn't hoist it there (it's
    // several levels transitive - content -> mdc - and Bun's own runtime
    // resolves it through a separate global-cache fallback instead), so
    // every one of these entries is unresolvable and just spams a
    // [NUXT_B7002] warning on every dev boot with no functional effect
    // (`@nuxtjs/mdc` and its deps still load fine at runtime). Stripping
    // the unresolvable entries here is the fix Nuxt's own warning suggests.
    'vite:extendConfig': (config) => {
      if (config.optimizeDeps?.include) {
        config.optimizeDeps.include = config.optimizeDeps.include.filter(
          entry => !entry.startsWith('@nuxtjs/mdc >'),
        )
      }
    },
  },
})
