import type { SelarasDocsAppConfig } from '@sewadah/selaras-docs'

const docsConfig: SelarasDocsAppConfig = {
  site: {
    name: 'Packed documentation',
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
    links: [{ label: 'Guide', to: '/guide/getting-started' }],
  },
}

export default defineAppConfig({
  selarasDocs: docsConfig,
})
