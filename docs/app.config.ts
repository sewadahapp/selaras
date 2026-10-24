export default defineAppConfig({
  selaras: {
    locale: 'en-GB',
    messages: {
      colorModeToggle: 'Switch theme',
    },
  },
  selarasDocs: {
    // Mirrors the @nuxtjs/i18n locales so the layer's switcher can label them
    // without importing the module. English owns the unprefixed URL and root
    // content; Indonesian uses /id and docs/content/id.
    i18n: {
      defaultLocale: 'en',
      locales: [
        { code: 'en', name: 'English', language: 'en-GB' },
        { code: 'id', name: 'Bahasa Indonesia', language: 'id-ID' },
      ],
    },
    site: {
      name: 'Selaras',
      description: 'Nuxt-first components for adaptable design systems.',
      logo: {
        light: '/logo.svg',
        dark: '/logo-dark.svg',
        alt: 'Selaras',
        tint: true,
      },
      favicon: '/favicon.svg',
    },
    repository: {
      url: 'https://github.com/sewadahapp/selaras',
      branch: 'master',
      contentDirectory: 'docs/content',
      editLinks: true,
    },
    header: {
      showTitle: true,
      search: true,
      colorMode: true,
      themePicker: true,
      links: [
        {
          label: 'Overview',
          labels: { id: 'Ikhtisar' },
          to: '/overview/getting-started/introduction',
        },
        {
          label: 'Components',
          labels: { id: 'Komponen' },
          to: '/components/elements/button',
        },
        {
          label: 'Composites',
          labels: { id: 'Komposit' },
          to: '/composites/documentation/page-header',
        },
        {
          label: 'Blocks',
          labels: { id: 'Blok' },
          to: '/blocks/overview',
        },
        {
          label: 'Templates',
          labels: { id: 'Templat' },
          to: '/templates',
        },
        {
          label: 'Utilities',
          labels: { id: 'Utilitas' },
          to: '/utilities/composables/use-modal',
        },
      ],
    },
    toc: {
      enabled: true,
      title: 'On this page',
    },
    footer: {
      text: '© 2026 Sewadah · Open source under the MIT License',
      textByLocale: { id: '© 2026 Sewadah · Sumber terbuka dengan Lisensi MIT' },
      links: [
        { label: 'Changelog', labels: { id: 'Catatan perubahan' }, to: '/changelog' },
        { label: 'Design kit', labels: { id: 'Kit desain' }, to: '/design-kit' },
      ],
    },
  },
})
