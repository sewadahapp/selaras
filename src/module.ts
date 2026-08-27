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
    // classSuffix: '' (the module's own default) produces bare `dark`/`light`
    // classes on <html>, matching theme.css's own Tailwind v4 dark variant
    // (`@custom-variant dark (&:where(.dark, .dark *))`) with no extra config.
    '@nuxtjs/color-mode': {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Without this, Nuxt Icon injects each icon's CSS (width/height: 1em,
    // ...) completely unlayered, which the CSS Cascade Layers spec always
    // ranks ABOVE any layered rule regardless of specificity - so it
    // silently beat every Tailwind size-*/h-*/w-* utility (all inside
    // Tailwind v4's own @layer utilities) the moment an icon's CSS finished
    // its async mount, collapsing every icon back to 1em (its ambient
    // font-size) a second or so after render. Tailwind v4 itself declares
    // `@layer theme, base, components, utilities;` - slotting Nuxt Icon's
    // CSS into that pre-existing `components` layer puts it below
    // `utilities` in priority, so Tailwind's size utilities win again.
    // Passing this via moduleDependencies' own options object silently did
    // NOT reach Nuxt Icon's config (verified: its injected CSS stayed
    // unlayered) - setting nuxt.options.icon directly, before its module
    // runs, is what actually works.
    nuxt.options.icon ||= {}
    nuxt.options.icon.cssLayer = 'components'

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
