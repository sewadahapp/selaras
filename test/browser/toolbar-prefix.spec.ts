import { fileURLToPath } from 'node:url'
import { test } from '@nuxt/test-utils/playwright'
import { toolbarContract } from './helpers/toolbar-contract'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/toolbar-prefix', import.meta.url)) } })
toolbarContract()
