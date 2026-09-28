export default defineAppConfig({
  selarasDocs: {
    site: {
      name: 'Documentation',
    },
    repository: {
      branch: 'main',
      contentDirectory: 'content',
      editLinks: true,
    },
    header: {
      showTitle: true,
      search: true,
      colorMode: true,
      fluid: false,
    },
    main: {
      fluid: false,
      padded: true,
    },
    sidebar: {
      enabled: true,
      collapsed: false,
    },
    toc: {
      enabled: true,
      title: 'On this page',
    },
    footer: {
      fluid: false,
      links: [
        {
          label: 'Powered by Selaras',
          to: 'https://sewadahapp.github.io/selaras',
          target: '_blank',
          rel: 'noreferrer',
        },
      ],
    },
  },
})
