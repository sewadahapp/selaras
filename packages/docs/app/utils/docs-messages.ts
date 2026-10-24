import type { SelarasDocsMessages } from '../../types'

/**
 * The docs layer's own UI copy. The layer must not depend on @nuxtjs/i18n, so
 * this catalog is resolved from the active locale code instead of vue-i18n
 * messages. Sites can replace any string per locale through
 * `app.config.selarasDocs.messages`.
 */
export const docsMessages: Record<string, SelarasDocsMessages> = {
  en: {
    skipToContent: 'Skip to content',
    documentationNavigation: 'Documentation navigation',
    pageActions: 'Page actions',
    reportIssue: 'Report an issue',
    editPage: 'Edit this page',
    footerNavigation: 'Footer navigation',
    sourceRepository: 'Source repository',
    openNavigation: 'Open documentation navigation',
    mainNavigation: 'Main navigation',
    previewViewport: 'Preview viewport',
    tableOfContents: 'Table of contents',
    searchDocumentation: 'Search documentation',
    languageSwitcher: 'Switch to {language}',
    documentationUnavailable: 'Documentation unavailable',
    untranslatedNotice: 'This page is not yet available in Bahasa Indonesia. Showing the English original.',
    emptyTitle: 'No content yet',
    emptyDescription: 'There’s no content on this page yet. You can explore the rest of the documentation using the navigation.',
    notFoundTitle: 'Page not found',
    notFoundDescription: 'The link may have changed, or this page may no longer exist. You can start again from the homepage.',
    fatalTitle: 'Something went wrong',
    fatalDescription: 'We couldn’t load this page. Reload it to try again, or return to the homepage.',
    pageTitle: 'This page couldn’t load',
    pageDescription: 'Please try again. You can still use the navigation to explore other pages.',
    exampleTitle: 'This example couldn’t load',
    exampleDescription: 'Try loading the example again. The rest of the documentation is still available.',
    retry: 'Try again',
    retrying: 'Trying again…',
    reload: 'Reload page',
    backToDocumentation: 'Back to documentation',
    home: 'Go to homepage',
  },
  id: {
    skipToContent: 'Lewati ke konten',
    documentationNavigation: 'Navigasi dokumentasi',
    pageActions: 'Aksi halaman',
    reportIssue: 'Laporkan masalah',
    editPage: 'Sunting halaman ini',
    footerNavigation: 'Navigasi footer',
    sourceRepository: 'Repositori sumber',
    openNavigation: 'Buka navigasi dokumentasi',
    mainNavigation: 'Navigasi utama',
    previewViewport: 'Pratinjau viewport',
    tableOfContents: 'Daftar isi',
    searchDocumentation: 'Cari dokumentasi',
    languageSwitcher: 'Ganti bahasa ke {language}',
    documentationUnavailable: 'Dokumentasi tidak tersedia',
    untranslatedNotice: 'Halaman ini belum tersedia dalam Bahasa Indonesia. Menampilkan versi bahasa Inggris.',
    emptyTitle: 'Belum ada konten',
    emptyDescription: 'Halaman ini belum memiliki konten. Anda dapat menjelajahi bagian dokumentasi lain melalui navigasi.',
    notFoundTitle: 'Halaman tidak ditemukan',
    notFoundDescription: 'Tautan mungkin sudah berubah, atau halaman ini tidak lagi tersedia. Anda dapat memulai lagi dari beranda.',
    fatalTitle: 'Terjadi kesalahan',
    fatalDescription: 'Halaman ini tidak dapat dimuat. Muat ulang untuk mencoba lagi, atau kembali ke beranda.',
    pageTitle: 'Halaman ini tidak dapat dimuat',
    pageDescription: 'Silakan coba lagi. Anda tetap dapat menjelajahi halaman lain melalui navigasi.',
    exampleTitle: 'Contoh ini tidak dapat dimuat',
    exampleDescription: 'Coba muat ulang contoh ini. Dokumentasi lainnya tetap tersedia.',
    retry: 'Coba lagi',
    retrying: 'Mencoba lagi…',
    reload: 'Muat ulang halaman',
    backToDocumentation: 'Kembali ke dokumentasi',
    home: 'Ke beranda',
  },
}

/**
 * Resolve the copy for a locale: default-locale strings first, then the
 * locale's own strings, then any consumer overrides.
 */
export function resolveDocsMessages(
  locale: string,
  defaultLocale = 'en',
  overrides?: Partial<SelarasDocsMessages>,
): Required<SelarasDocsMessages> {
  return {
    ...docsMessages[defaultLocale],
    ...docsMessages[locale],
    ...overrides,
  } as Required<SelarasDocsMessages>
}

/** Replace `{name}` placeholders in a resolved message. */
export function formatDocsMessage(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}
