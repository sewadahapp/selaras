import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { agentAttributionRequest } from './utils/agent-attribution'
import { documentationBlocks } from './utils/blocks'
import { docsCanonicalUrl, docsSite, legacyDocsPaths } from './utils/seo'

const rootDir = dirname(fileURLToPath(import.meta.url))

// Locale folders hold translations served from the same public URL, so they
// never produce their own routes, raw files, or prerendered pages.
const localeFolders = new Set(['id'])
const documentationFiles = (readdirSync(join(rootDir, 'content'), { recursive: true }) as string[])
  .filter(path => path.endsWith('.md') && !localeFolders.has(path.split(sep)[0]!))
const documentationRoutes = documentationFiles.map(path => path === 'index.md' ? '/' : `/${path.replace(/\.md$/, '')}`)
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
    '/design-kit',
    '/templates',
    '/changelog',
    '/examples/adaptive-interfaces',
    ...documentationRoutes,
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
  modules: ['@nuxtjs/i18n', './modules/changelog', 'nuxt-llms', '@nuxtjs/robots', '@nuxtjs/sitemap', 'nuxt-og-image'],
  // Localization applies to this docs site only; the published docs layer reads
  // the active locale through useDocsLocale() and stays dependency-free.
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-GB', name: 'English' },
      { code: 'id', language: 'id-ID', name: 'Bahasa Indonesia' },
    ],
    // The URL never changes, so the choice is kept in a cookie and applied on
    // the next navigation (and client-side after a static build hydrates).
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'selaras-docs-locale',
      redirectOn: 'no prefix',
      fallbackLocale: 'en',
    },
  },
  site: {
    url: process.env.NUXT_SITE_URL ?? docsSite.url,
    name: docsSite.name,
    description: docsSite.description,
    trailingSlash: true,
  },
  robots: {
    allow: ['/'],
    sitemap: ['/sitemap.xml'],
    groups: [
      '*',
      'Amazonbot',
      'Applebot-Extended',
      'Bytespider',
      'CCBot',
      'ChatGPT-User',
      'Claude-Web',
      'Claude-SearchBot',
      'Claude-User',
      'ClaudeBot',
      'Google-Extended',
      'GPTBot',
      'OAI-SearchBot',
      'PerplexityBot',
      'Perplexity-User',
    ].map(userAgent => ({
      userAgent,
      allow: ['/'],
      contentSignal: 'ai-train=yes, search=yes, ai-input=yes',
    })),
  },
  sitemap: {
    zeroRuntime: true,
    include: ['/', '/design-kit', '/templates', '/changelog', '/changelog/**', '/overview/**', '/components/**', '/composites/**', '/blocks/**', '/utilities/**'],
    exclude: ['/examples/**', '/raw/**', ...Object.keys(legacyDocsPaths)],
    discoverImages: false,
  },
  ogImage: {
    zeroRuntime: true,
    defaults: { width: 1200, height: 630, emojis: false },
    compatibility: {
      dev: { sharp: false },
      prerender: { sharp: false },
      runtime: { sharp: false },
    },
  },
  routeRules: {
    '/examples/**': { sitemap: false, ogImage: false, robots: false },
    '/raw/**': { sitemap: false, ogImage: false, robots: false },
  },
  llms: {
    domain: process.env.NUXT_LLMS_DOMAIN ?? docsCanonicalUrl('/', process.env.NUXT_SITE_URL ?? docsSite.url, process.env.NUXT_APP_BASE_URL ?? '/').replace(/\/$/, ''),
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
      { title: 'Blocks', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/blocks/%' }] },
      { title: 'Utilities', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/utilities/%' }] },
      { title: 'Agent Support', contentCollection: 'docs', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/overview/agent-support/%' }] },
    ],
    notes: [
      'Check the component documentation before building custom UI. Prefer existing Selaras components and customize them with props, slots, ui overrides, or theme configuration.',
      'Use SApp for application providers. Component names use the S prefix by default; consumers can configure a different prefix.',
      agentAttributionRequest,
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
        '/design-kit',
        '/templates',
        '/changelog',
        '/changelog/docs',
        '/changelog/mcp',
        '/examples/adaptive-interfaces',
        ...documentationBlocks.map(block => `/examples/blocks/${block.slug}`),
        ...documentationFiles.map(path => `/raw/${path}`),
        ...documentationRoutes,

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
