import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

const documentationFiles = (readdirSync(join(rootDir, 'content'), { recursive: true }) as string[])
  .filter(path => path.endsWith('.md'))
const exampleSources = Object.fromEntries(
  (readdirSync(join(rootDir, 'components/content/examples'), { recursive: true }) as string[])
    .filter(path => path.endsWith('.vue'))
    .map((path) => {
      const name = path.split('/').at(-1)!.replace(/\.vue$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
      return [name, readFileSync(join(rootDir, 'components/content/examples', path), 'utf8')]
    }),
)

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
  // This is the package's own docs app inside the monorepo. Resolve the
  // workspace layer from its source directory so Nuxt/Vite can watch the
  // layer files directly during development; packed consumer coverage tests
  // the public package-name extension path separately.
  extends: ['../packages/docs'],
  modules: ['nuxt-llms'],
  llms: {
    domain: process.env.NUXT_LLMS_DOMAIN ?? `https://sewadahapp.github.io${process.env.NUXT_APP_BASE_URL ?? '/selaras/'}`.replace(/\/$/, ''),
    title: 'Selaras',
    description: 'Nuxt-first Vue components for adaptable design systems. Component APIs, composables, theming, and complete usage examples.',
    full: {
      title: 'Complete Selaras documentation',
      description: 'All documentation with Vue example source.',
    },
    sections: [
      { title: 'Getting Started', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/overview/getting-started/%' }] },
      { title: 'Theming', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/overview/theming/%' }] },
      { title: 'Components', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/components/%' }] },
      { title: 'Composites', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/composites/%' }] },
      { title: 'Utilities', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/utilities/%' }] },
      { title: 'Agent Support', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/overview/agent-support/%' }] },
    ],
    notes: [
      'Check the component documentation before building custom UI. Prefer existing Selaras components and customize them with props, slots, ui overrides, or theme configuration.',
      'Use SApp for application providers. Component names use the S prefix by default; consumers can configure a different prefix.',
    ],
  },
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
    virtual: {
      '#selaras-llms-examples': `export default ${JSON.stringify(exampleSources)}`,
    },
    prerender: {
      routes: [
        ...documentationFiles.map(path => `/raw/${path}`),
        ...documentationFiles.filter(path => /^overview\/[^/]+\.md$/.test(path)).map(path => `/${path.replace(/\.md$/, '')}`),
      ],
      ignore: [isFakeDemoLinkedPath],
    },
  },
  hooks: {
    // @nuxt/content asks Vite to pre-bundle `@nuxtjs/mdc`'s own
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
