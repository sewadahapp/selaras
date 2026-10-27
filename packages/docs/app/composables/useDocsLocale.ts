import type { SelarasDocsLocaleOption } from '../../types'
import { resolveDocsLocale } from '../utils/docs-locale'

interface DocsI18nRuntime {
  locale?: string | { value?: string }
  setLocale?: (code: string) => Promise<void> | void
}

interface DocsLocaleAppConfig {
  selarasDocs?: {
    i18n?: {
      defaultLocale?: string
      locales?: SelarasDocsLocaleOption[]
    }
  }
}

const fallbackLocales: SelarasDocsLocaleOption[] = [
  { code: 'en', name: 'English', language: 'en-GB' },
]

/**
 * Read the active docs locale without importing @nuxtjs/i18n. The published
 * docs layer must keep working in sites that do not install the module, so the
 * runtime injection is read defensively and falls back to the configured
 * default locale.
 */
export function useDocsLocale() {
  const nuxtApp = useNuxtApp()
  const appConfig = useAppConfig() as DocsLocaleAppConfig
  const configured = computed(() => appConfig.selarasDocs?.i18n?.locales ?? [])
  const locales = computed<SelarasDocsLocaleOption[]>(() => configured.value.length ? configured.value : fallbackLocales)
  const defaultLocale = computed(() => appConfig.selarasDocs?.i18n?.defaultLocale ?? locales.value[0]?.code ?? 'en')
  const route = useRoute()
  const i18n = (nuxtApp as unknown as { $i18n?: DocsI18nRuntime }).$i18n
  const locale = computed(() => {
    const active = i18n?.locale
    return resolveDocsLocale(
      route.path,
      (typeof active === 'string' ? active : active?.value),
      locales.value,
      defaultLocale.value,
    )
  })
  const localeOption = computed(() => locales.value.find(option => option.code === locale.value) ?? locales.value[0]!)
  const hasLocaleSwitching = computed(() => locales.value.length > 1 && typeof i18n?.setLocale === 'function')

  async function setLocale(code: string) {
    if (code === locale.value || !i18n?.setLocale)
      return
    await i18n.setLocale(code)
  }

  return { locale, locales, defaultLocale, localeOption, hasLocaleSwitching, setLocale }
}
