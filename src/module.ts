import { addComponentsDir, addImportsDir, addVitePlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'

export interface ModuleOptions {
  /**
   * Prefix used for auto-imported components.
   * @default 'S'
   */
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'selaras',
    configKey: 'selaras',
  },
  defaults: {
    prefix: 'S',
  },
  moduleDependencies: {
    '@nuxt/icon': {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.css.push(resolver.resolve('./runtime/theme.css'))
    addVitePlugin(tailwindcss())

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false,
      // SColumn/SColumnGroup are plain .ts files (never render real DOM), not
      // .vue SFCs - addComponentsDir only scans .vue by default.
      extensions: ['vue', 'ts'],
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
  },
})
