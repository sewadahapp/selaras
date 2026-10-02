import { buildAgentCatalog } from './scripts/build-agent-catalog.mjs'
import { checkDefaultColorCss } from './scripts/generate-default-colors.mjs'

export default {
  entries: [
    { input: 'src/tokens/', outDir: 'dist/tokens', builder: 'copy' },
  ],
  hooks: {
    'build:done': async function () {
      await buildAgentCatalog()
    },
    'build:prepare': async function () {
      await checkDefaultColorCss()
    },
  },
}
