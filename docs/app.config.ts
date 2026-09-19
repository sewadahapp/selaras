export default defineAppConfig({
  selaras: {
    locale: 'en-GB',
    messages: {
      colorModeToggle: 'Switch theme',
    },
  },
  selarasDocs: {
    site: {
      name: 'Selaras',
      description: 'Nuxt-first components for adaptable design systems.',
    },
    repository: {
      url: 'https://github.com/sewadahapp/selaras',
      branch: 'main',
      contentDirectory: 'docs/content',
      editLinks: true,
    },
    header: {
      showTitle: true,
      search: true,
      colorMode: true,
      links: [
        {
          label: 'Overview',
          to: '/overview/introduction',
        },
        {
          label: 'Components',
          to: '/components/elements/button',
        },
        {
          label: 'Blocks',
          to: '/blocks/documentation/page-header',
        },
        {
          label: 'Utilities',
          to: '/utilities/composables/use-modal',
        },
      ],
    },
    toc: {
      enabled: true,
      title: 'On this page',
    },
  },
})
