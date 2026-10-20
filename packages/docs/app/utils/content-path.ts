/** Nuxt Content stores page paths without a trailing slash. */
export function docsContentPath(path: string) {
  return path.replace(/\/+$/, '') || '/'
}
