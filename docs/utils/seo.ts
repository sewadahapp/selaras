import { docsCanonicalUrl as baseCanonicalUrl } from '../../packages/docs/app/utils/seo.ts'

export { docsPageTitle, docsPathWithoutBase, docsSite } from '../../packages/docs/app/utils/seo.ts'

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
  return baseCanonicalUrl(canonicalPath, siteUrl, baseURL)
}
