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
    },
    toc: {
      enabled: true,
      title: 'On this page',
    },
    footer: {},
  },
})
