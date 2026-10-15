import { docsPathWithoutBase } from '../../utils/seo'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:input', (context) => {
    const { baseURL } = useRuntimeConfig().app
    // Prerender discovery includes the deployment prefix; the sitemap
    // resolver adds it itself when it creates absolute URLs.
    context.urls = context.urls.map(entry => typeof entry === 'string'
      ? docsPathWithoutBase(entry, baseURL)
      : { ...entry, loc: docsPathWithoutBase(entry.loc, baseURL) })
  })
})
