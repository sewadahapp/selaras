import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import process from 'node:process'

export function packedNuxtDependencies(dependencies, env = process.env) {
  return {
    ...dependencies,
    ...(env.SELARAS_NUXT_VERSION && { nuxt: env.SELARAS_NUXT_VERSION }),
    ...(env.SELARAS_NUXT_VUE_VERSION && { vue: env.SELARAS_NUXT_VUE_VERSION }),
  }
}

export function packedNuxtOverrides(overrides, env = process.env) {
  const result = { ...overrides }
  // Nuxt must resolve its own matching Kit internals. The ordinary support
  // floor tests keep their original pins; alternate frameworks use semver.
  if (env.SELARAS_NUXT_VERSION)
    delete result['@nuxt/kit']
  return result
}

export function packedNuxtConfig(source, env = process.env) {
  const version = env.SELARAS_NUXT_COMPATIBILITY_VERSION
  if (!version)
    return source
  assert.equal(version, '5', 'Only Nuxt future.compatibilityVersion 5 is supported by this test lane')
  const marker = 'export default defineNuxtConfig({'
  assert.ok(source.includes(marker), 'The packed fixture must expose its Nuxt config')
  return source.replace(marker, `${marker}\n  future: { compatibilityVersion: 5 },`)
}

export function installedPackedNuxt(require, env = process.env) {
  const manifest = JSON.parse(readFileSync(require.resolve('nuxt/package.json'), 'utf8'))
  if (env.SELARAS_NUXT_EXPECTED_VERSION)
    assert.equal(manifest.version, env.SELARAS_NUXT_EXPECTED_VERSION, 'The packed consumer must install the selected Nuxt version')
  return manifest.version
}

export const nuxtCompatibilityChannels = {
  future: { package: 'nuxt', tag: 'latest', major: 4, compatibilityVersion: '5' },
  nightly: { package: 'nuxt-nightly', tag: '5x', major: 5 },
}

export function nuxtCompatibilityEnvironment(channel, metadata) {
  const target = nuxtCompatibilityChannels[channel]
  assert.ok(target, `Unknown Nuxt compatibility channel: ${channel}`)
  assert.ok(typeof metadata.version === 'string' && metadata.version.startsWith(`${target.major}.`), `Expected Nuxt ${target.major}, received ${metadata.version}`)
  assert.ok(typeof metadata['dependencies.vue'] === 'string', 'Nuxt must declare its Vue version requirement')
  return {
    SELARAS_NUXT_VERSION: target.package === 'nuxt' ? metadata.version : `npm:${target.package}@${metadata.version}`,
    SELARAS_NUXT_EXPECTED_VERSION: metadata.version,
    SELARAS_NUXT_VUE_VERSION: metadata['dependencies.vue'],
    SELARAS_NUXT_COMPATIBILITY_VERSION: target.compatibilityVersion ?? '',
  }
}
