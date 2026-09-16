import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('..', import.meta.url))
const manifest = JSON.parse(readFileSync(`${root}/package.json`, 'utf8'))
const moduleSource = readFileSync(`${root}/src/module.ts`, 'utf8')
const publicTypesSource = readFileSync(`${root}/src/runtime/types/index.ts`, 'utf8')

const ignoredComponents = moduleSource.split('ignore: [')[1]?.split(']')[0]
  ?.matchAll(/'\*\*\/([^']+)\.vue'/g)
const ignoredNames = new Set([...(ignoredComponents ?? [])].map(match => match[1]!))

describe('public component export boundary', () => {
  it('blocks every component excluded from Nuxt auto-registration', () => {
    const ignored = [...ignoredNames].sort()

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

  it('re-exports every named public component contract from the types entry', () => {
    const componentDir = `${root}/src/runtime/components`
    const typedPublicComponents = readdirSync(componentDir)
      .filter(file => file.endsWith('.vue'))
      .filter(file => !ignoredNames.has(file.slice(0, -4)))
      .filter(file => /export\s+(?:interface|type)\b/.test(readFileSync(`${componentDir}/${file}`, 'utf8')))
      .sort()

    for (const file of typedPublicComponents)
      expect(publicTypesSource, `${file} must be reachable from @sewadah/selaras/types`).toContain(`'../components/${file}'`)
  })

  it('auto-imports only the intentional consumer composables', () => {
    expect(moduleSource).not.toContain('addImportsDir')
    for (const name of ['useCommandPalette', 'useDrawer', 'useIcons', 'useLocale', 'useMessages', 'useModal', 'useRippleEnabled', 'useSlideover', 'createTableColumnHelper', 'useToast'])
      expect(moduleSource).toContain(`name: '${name}'`)
    for (const name of ['provideFormField', 'useFormField', 'useIsMobile', 'useTable'])
      expect(moduleSource).not.toContain(`name: '${name}'`)
  })
})
