export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/content', '@nuxt/fonts'],
  css: ['~/assets/css/global.css'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  // `/` (the homepage) directly renders SSelect/STabs/SAccordion - Reka UI
  // "compound" components using provide/inject between a Root and its
  // children. Confirmed by bisection (temporarily stripping each from
  // pages/index.vue and rerunning `nuxt generate`) that any one of them,
  // used directly on a real page, reliably 500s SSR with "null is not an
  // object (evaluating 'currentRenderingInstance.ce')" on that route's
  // FIRST SSR render ONLY - a second render of the exact same route
  // succeeds (confirmed separately: build + boot .output/server/index.mjs
  // + curl / twice - first request 500s, second succeeds identically;
  // also confirmed Nitro's own prerender retry/retryDelay options do NOT
  // apply to this failure - an inflated retry: 5/retryDelay: 3000 made no
  // observable difference, so retrying isn't a viable fix here). Same
  // underlying Vue/Reka SSR bug already exhaustively investigated for
  // Nuxt Content's MDC-embedded component examples (see this project's
  // own memory) - turns out not to be MDC-specific after all, just never
  // previously hit outside MDC since compound components weren't used
  // directly on a plain page before. Root cause is upstream (Vue/Reka's
  // SSR interaction), out of scope to fix here.
  //
  // `ssr: false` on just this one route sidesteps it entirely (client-only
  // render, no SSR attempted at all) rather than merely excluding `/` from
  // static prerendering - that narrower option would leave `nuxt generate`
  // succeeding but with no index.html for `/` at all (broken on static
  // hosts without an SPA fallback rewrite). The tradeoff (no SSR/SEO HTML
  // for the homepage specifically) is deliberate: this same bug would
  // otherwise also 500 for a real deployed live server's very first-ever
  // visitor to `/` after each fresh deploy/restart (before self-resolving
  // for everyone after) - `ssr: false` removes that production risk too,
  // not just the `nuxt generate` failure.
  routeRules: {
    '/': { ssr: false },
  },
  nitro: {
    prerender: {
      // `/` above no longer renders any server HTML for the crawler to
      // parse links from (an ssr:false shell has no real content until
      // client hydration), so it can't be the crawl's implicit seed
      // anymore either - any real docs page works as an explicit seed
      // instead, since the sidebar nav on every one already links to
      // every other page.
      routes: ['/components/elements/button'],
    },
  },
  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
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
