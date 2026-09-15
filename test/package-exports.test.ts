import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('..', import.meta.url))
const manifest = JSON.parse(readFileSync(`${root}/package.json`, 'utf8'))
const moduleSource = readFileSync(`${root}/src/module.ts`, 'utf8')

describe('public component export boundary', () => {
  it('blocks every component excluded from Nuxt auto-registration', () => {
    const ignoreDeclaration = moduleSource.split('ignore: [')[1]?.split(']')[0] ?? ''
    const ignored = [...ignoreDeclaration.matchAll(/'\*\*\/([^']+)\.vue'/g)]
      .map(match => match[1]!)
      .sort()

    expect(ignored).toEqual([
      'DrawerRenderer',
      'ModalRenderer',
      'NavigationMenuAccordionItem',
      'NavigationMenuFlyoutList',
      'NavigationMenuFlyoutTrigger',
      'SlideoverRenderer',
    ])
    for (const name of ignored) {
      expect(manifest.exports[`./components/${name}*`]).toEqual({})
      expect(manifest.typesVersions['*'][`components/${name}*`]).toEqual([])
    }
  })
})
