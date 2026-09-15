import { checkDefaultColorCss } from './scripts/generate-default-colors.mjs'

export default {
  entries: [
    { input: 'src/tokens/', outDir: 'dist/tokens', builder: 'copy' },
  ],
  hooks: {
    'build:prepare': async function () {
      await checkDefaultColorCss()
    },
  },
}
