import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { expect, it } from 'vitest'

it('evaluates the docs layer defaults in server tooling without Nuxt app globals', () => {
  const config = new URL('../packages/docs/app/app.config.ts', import.meta.url).href
  const output = execFileSync(process.execPath, ['--input-type=module', '--eval', `
    import config from ${JSON.stringify(config)}
    if (typeof globalThis.defineAppConfig !== 'undefined') throw new Error('Expected a plain server context')
    console.log(JSON.stringify(config))
  `], { encoding: 'utf8' })
  const defaults = JSON.parse(output).selarasDocs
  expect(defaults.site.name).toBe('Documentation')
  expect(defaults.sidebar.enabled).toBe(true)
  expect(defaults.header.search).toBe(true)
})
