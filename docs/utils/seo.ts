export const docsSite = {
  name: 'Selaras',
  url: 'https://selarasui.my.id',
  description: 'Nuxt-first components for adaptable design systems.',
}

export const legacyDocsPaths: Record<string, string> = {
  '/overview/introduction': '/overview/getting-started/introduction',
  '/overview/installation': '/overview/getting-started/installation',
  '/overview/typescript': '/overview/getting-started/typescript',
  '/overview/migrating-to-1': '/overview/getting-started/migrating-to-1',
  '/overview/theming': '/overview/theming/overview',
  '/overview/ai-documentation': '/overview/agent-support/documentation',
}

export function docsCanonicalUrl(path: string, siteUrl: string, baseURL: string) {
  const pathname = (path.split(/[?#]/)[0] || '/').replace(/\/$/, '') || '/'
  const canonicalPath = legacyDocsPaths[pathname] ?? pathname
  const base = `/${baseURL.split('/').filter(Boolean).join('/')}`.replace(/\/$/, '')
  return new URL(`${base}${canonicalPath === '/' ? '/' : `${canonicalPath}/`}`, siteUrl).href
}

export function docsPathWithoutBase(path: string, baseURL: string) {
  const base = baseURL.replace(/\/$/, '')
  return base && (path === base || path.startsWith(`${base}/`)) ? path.slice(base.length) || '/' : path
}

export function docsPageTitle(title: string) {
  return title === docsSite.name ? title : `${title} — ${docsSite.name}`
}
