import type { SelarasDocsAppConfig } from '@sewadah/selaras-docs'

const docsConfig: SelarasDocsAppConfig = {
  errors: {
    homeTo: '/guide/getting-started',
  },
  site: {
    name: 'Packed documentation',
    url: 'https://docs.example.test',
    description: 'Advanced installed docs consumer.',
    logo: {
      light: '/brand.svg',
      alt: 'Packed mark',
    },
  },
  repository: {
    url: 'https://github.com/sewadahapp/selaras',
  },
  header: {
    themePicker: true,
    links: [{ label: 'Guide', to: '/guide/getting-started' }],
  },
}

export default defineAppConfig({
  selarasDocs: docsConfig,
})
