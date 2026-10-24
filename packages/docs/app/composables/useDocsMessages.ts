import type { SelarasDocsMessages } from '../../types'
import { resolveDocsMessages } from '../utils/docs-messages'

interface DocsMessagesAppConfig {
  selarasDocs?: {
    messages?: Partial<Record<string, SelarasDocsMessages>>
  }
}

/** UI copy for the active locale, with consumer overrides applied. */
export function useDocsMessages() {
  const appConfig = useAppConfig() as DocsMessagesAppConfig
  const { locale, defaultLocale } = useDocsLocale()

  return computed(() => resolveDocsMessages(
    locale.value,
    defaultLocale.value,
    appConfig.selarasDocs?.messages?.[locale.value],
  ))
}
