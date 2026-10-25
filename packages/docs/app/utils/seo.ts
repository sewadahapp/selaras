export const docsSite = {
  name: 'Selaras',
  url: 'https://selarasui.my.id',
  description: 'Nuxt-first components for adaptable design systems.',
}

export function docsCanonicalUrl(path: string, siteUrl: string, baseURL: string) {
  const pathname = (path.split(/[?#]/)[0] || '/').replace(/\/$/, '') || '/'
  const base = `/${baseURL.split('/').filter(Boolean).join('/')}`.replace(/\/$/, '')
  return new URL(`${base}${pathname === '/' ? '/' : `${pathname}/`}`, siteUrl).href
}

export function docsPathWithoutBase(path: string, baseURL: string) {
  const base = baseURL.replace(/\/$/, '')
  return base && (path === base || path.startsWith(`${base}/`)) ? path.slice(base.length) || '/' : path
}

export function docsPageTitle(title: string) {
  return title === docsSite.name ? title : `${title} — ${docsSite.name}`
}
