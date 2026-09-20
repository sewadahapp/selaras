import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

function fakeDemoLinkedPaths() {
  const dir = join(rootDir, 'components/content/examples')
  const realRouteExceptions = new Set([
    '/',
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

function isFakeDemoLinkedPath(path: string) {
  const baseURL = (process.env.NUXT_APP_BASE_URL ?? '/').replace(/\/$/, '')
  const normalized = baseURL && path.startsWith(baseURL) ? path.slice(baseURL.length) || '/' : path
  return fakeDemoLinkedPathsCache.has(normalized)
}

export default defineNuxtConfig({
  extends: ['@sewadah/selaras-docs'],
  compatibilityDate: 'latest',
  devtools: { enabled: true },
  icon: {
    clientBundle: {
      scan: {
        globInclude: [
          'components/**/*.{vue,md,mdc,mdx}',
          'content/**/*.{vue,md,mdc,mdx}',
        ],
      },
      sizeLimitKb: 512,
    },
  },
  css: ['~/assets/style.css'],
  // The repository consumer resolves Selaras through the local workspace.
  // Keep Reka and VueUse in the app bundle so SSR uses one Vue instance.
  build: {
    transpile: ['reka-ui', /^@vueuse\//, 'vue-demi'],
  },
  nitro: {
    prerender: {
      ignore: [isFakeDemoLinkedPath],
    },
  },
  hooks: {
    // Same as the playground: @nuxt/content asks Vite to pre-bundle
    // `@nuxtjs/mdc`'s own dependencies via the nested "pkg > subpkg" syntax,
    // but in this workspace `@nuxtjs/mdc` resolves nested under @nuxt/content
    // rather than a hoisted node_modules entry, so every entry is
    // unresolvable and only spams a [NUXT_B7002] warning.
    'vite:extendConfig': (config) => {
      if (config.optimizeDeps?.include) {
        config.optimizeDeps.include = config.optimizeDeps.include.filter(
          entry => !entry.startsWith('@nuxtjs/mdc >'),
        )
      }
    },
  },
})
