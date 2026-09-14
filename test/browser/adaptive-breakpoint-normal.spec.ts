import { fileURLToPath } from 'node:url'
import { test } from '@nuxt/test-utils/playwright'
import { registerAdaptiveBreakpointContract } from './helpers/adaptive-breakpoint-contract'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../fixtures/adaptive-select-normal', import.meta.url)) } })
registerAdaptiveBreakpointContract()
