import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { installedPackedNuxt, nuxtCompatibilityEnvironment, packedNuxtConfig, packedNuxtDependencies, packedNuxtOverrides } from '../scripts/packed-nuxt.mjs'

const config = 'export default defineNuxtConfig({ modules: ["@sewadah/selaras"] })'

describe('isolated Nuxt compatibility consumers', () => {
  it('preserves the installed dependency versions and config in ordinary compatibility runs', () => {
    const dependencies = { nuxt: '4.5.2', vue: '3.5.42', tailwindcss: '4.3.0' }
    expect(packedNuxtDependencies(dependencies, {})).toEqual(dependencies)
    expect(packedNuxtConfig(config, {})).toBe(config)
  })

  it('keeps the nightly alias and satisfies the target framework Vue requirement', () => {
    const environment = nuxtCompatibilityEnvironment('nightly', { 'version': '5.0.0-test.1', 'dependencies.vue': '^3.5.44' })
    expect(environment.SELARAS_NUXT_VERSION).toBe('npm:nuxt-nightly@5.0.0-test.1')
    expect(environment.SELARAS_NUXT_COMPATIBILITY_VERSION).toBe('')
    const dependencies = { nuxt: '4.5.2', vue: '3.5.42', tailwindcss: '4.3.0' }
    expect(packedNuxtDependencies(dependencies, environment)).toEqual({ nuxt: 'npm:nuxt-nightly@5.0.0-test.1', vue: '^3.5.44', tailwindcss: '4.3.0' })
    expect(dependencies.nuxt).toBe('4.5.2')
  })

  it('tests stable Nuxt with future defaults and leaves the rest of the fixture intact', () => {
    const environment = nuxtCompatibilityEnvironment('future', { 'version': '4.6.2', 'dependencies.vue': '^3.5.43' })
    expect(environment.SELARAS_NUXT_VERSION).toBe('4.6.2')
    expect(packedNuxtConfig(config, environment)).toBe('export default defineNuxtConfig({\n  future: { compatibilityVersion: 5 }, modules: ["@sewadah/selaras"] })')
  })

  it('rejects a nightly tag that unexpectedly resolves to Nuxt 4', () => {
    expect(() => nuxtCompatibilityEnvironment('nightly', { 'version': '4.6.2', 'dependencies.vue': '^3.5.43' })).toThrow('Expected Nuxt 5')
  })

  it('keeps the support-floor pins but lets alternate Nuxt releases resolve matching Kit internals', () => {
    const overrides = { '@nuxt/kit': '4.5.2', 'reka-ui': '2.11.0' }
    expect(packedNuxtOverrides(overrides, {})).toEqual(overrides)
    expect(packedNuxtOverrides(overrides, { SELARAS_NUXT_VERSION: '4.6.2' })).toEqual({ 'reka-ui': '2.11.0' })
    expect(overrides['@nuxt/kit']).toBe('4.5.2')
  })

  it('rejects a future lane that unexpectedly resolves to Nuxt 5', () => {
    expect(() => nuxtCompatibilityEnvironment('future', { 'version': '5.0.0', 'dependencies.vue': '^3.5.44' })).toThrow('Expected Nuxt 4')
  })

  it('rejects unsupported compatibility flags and unrecognized fixture configs', () => {
    expect(() => packedNuxtConfig(config, { SELARAS_NUXT_COMPATIBILITY_VERSION: '6' })).toThrow('Only Nuxt')
    expect(() => packedNuxtConfig('export default {}', { SELARAS_NUXT_COMPATIBILITY_VERSION: '5' })).toThrow('fixture must expose')
  })

  it('checks the framework actually installed in the isolated consumer', async () => {
    const temporary = await mkdtemp(join(tmpdir(), 'selaras-nuxt-version-'))
    try {
      await mkdir(join(temporary, 'node_modules/nuxt'), { recursive: true })
      await writeFile(join(temporary, 'node_modules/nuxt/package.json'), JSON.stringify({ name: 'nuxt-nightly', version: '5.0.0-test.1' }))
      const require = createRequire(join(temporary, 'package.json'))
      expect(installedPackedNuxt(require, { SELARAS_NUXT_EXPECTED_VERSION: '5.0.0-test.1' })).toBe('5.0.0-test.1')
      expect(() => installedPackedNuxt(require, { SELARAS_NUXT_EXPECTED_VERSION: '4.6.2' })).toThrow('selected Nuxt version')
    }
    finally {
      await rm(temporary, { recursive: true, force: true })
    }
  })
})
