import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

/**
 * `NavigationMenu`/`Breadcrumb` demo examples link to placeholder routes
 * (`/pricing`, `/electronics/computers/laptops`, ...) purely to show
 * realistic-looking content - `nuxt generate`'s link-crawler follows them
 * like any other link and 404s on them, which fails the whole build (Nuxt's
 * own nitro wrapper forces `prerender.failOnError: true`, unlike Nitro's own
 * default - and that strictness is worth keeping, since turning it off would
 * silently let a genuinely broken real page drop out of the static output
 * with the build still exiting 0). Deriving the ignore list from the demo
 * files themselves means a newly added fake link is caught automatically -
 * no hand-maintained list to fall out of sync - while an actually-real route
 * a demo happens to reference (`realRouteExceptions` below) still gets
 * crawled and would still fail the build if it broke.
 */
function fakeDemoLinkedPaths() {
  const dir = join(__dirname, 'components/content/examples')
  const realRouteExceptions = new Set([
    '/',
    '/dashboard',
    '/components/forms/input',
    '/components/forms/select',
    '/components/overlays/modal',
    '/components/overlays/slideover',
  ])
  const paths = new Set<string>()
  for (const rel of readdirSync(dir, { recursive: true }) as string[]) {
    if (!rel.endsWith('.vue'))
      continue
    const content = readFileSync(join(dir, rel), 'utf8')
    for (const match of content.matchAll(/\bto:\s*['"]([^'"]+)['"]/g)) {
      const to = match[1]
      if (to && !realRouteExceptions.has(to))
        paths.add(to)
    }
  }
  return paths
}

const fakeDemoLinkedPathsCache = fakeDemoLinkedPaths()

// Nitro's crawler passes the full path including any configured baseURL
// (e.g. `/selaras/pricing` when NUXT_APP_BASE_URL=/selaras/, as set by the
// GitHub Pages deploy job) - the cache above is built from each demo's raw
// `to="..."` value, which never has that prefix, so it has to be stripped
// before checking membership or every fake link "reappears" as a real 404
// once a baseURL is in play.
function isFakeDemoLinkedPath(path: string) {
  const baseURL = (process.env.NUXT_APP_BASE_URL ?? '/').replace(/\/$/, '')
  const normalized = baseURL && path.startsWith(baseURL) ? path.slice(baseURL.length) || '/' : path
  return fakeDemoLinkedPathsCache.has(normalized)
}

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
  nitro: {
    prerender: {
      ignore: [isFakeDemoLinkedPath],
    },
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
