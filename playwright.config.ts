import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@playwright/test'

export default defineConfig<ConfigOptions>({
  testDir: './test/browser',
  outputDir: './.nuxt/playwright-results',
  timeout: 30_000,
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('./test/fixtures/prefix', import.meta.url)),
    },
  },
  reporter: [['list']],
})
