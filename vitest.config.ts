import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environmentOptions: {
      nuxt: {
        // Reuses the existing e2e fixture (already installs ../../../src/module)
        // as the boot target for mountSuspended's `nuxt` environment - this
        // resolves our module's auto-imported S*-prefixed components exactly
        // as a real app would.
        rootDir: fileURLToPath(new URL('./test/fixtures/basic', import.meta.url)),
        domEnvironment: 'happy-dom',
      },
    },
  },
})
