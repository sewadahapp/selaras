import { fileURLToPath } from 'node:url'
import { test } from '@nuxt/test-utils/playwright'
import { controlSizingContract } from './helpers/control-sizing-contract'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/control-sizing', import.meta.url)) } })

controlSizingContract()
