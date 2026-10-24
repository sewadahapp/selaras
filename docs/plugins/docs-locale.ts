/**
 * Applies the active locale to the document and to Selaras' own component
 * locale (date formats, Intl-aware messages). Runs client-side after the
 * cookie-driven locale is known, because the docs site is statically built.
 */
export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig() as { selaras?: { locale?: string } }
  const { locale, localeOption } = useDocsLocale()

  useHead(() => ({ htmlAttrs: { lang: localeOption.value.language ?? locale.value } }))

  if (import.meta.client) {
    watchEffect(() => {
      if (appConfig.selaras)
        appConfig.selaras.locale = localeOption.value.language ?? locale.value
    })
  }
})
