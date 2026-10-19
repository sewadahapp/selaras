import type { SelarasDocsAppConfig } from '../types'

// Server-side content tooling also evaluates this config without app auto-imports.
export default {
  selarasDocs: {
    site: {
      name: 'Documentation',
    },
    repository: {
      branch: 'main',
      contentDirectory: 'content',
      editLinks: true,
      issueLinks: true,
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
          to: 'https://selarasui.my.id',
          target: '_blank',
          rel: 'noreferrer',
        },
      ],
    },
  },
} satisfies { selarasDocs: SelarasDocsAppConfig }
