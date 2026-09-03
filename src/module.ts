import { addComponentsDir, addImports, addImportsDir, addVitePlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
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
      // ModalRenderer is App.vue's own internal render loop for useModal(),
      // mirroring a comparable reference's own un-exported OverlayProvider - not meant to be
      // placed by a consumer (App.vue already mounts one; a second copy
      // would render every open programmatic modal twice, since useModal()'s
      // state is a shared singleton). NavigationMenuAccordionItem is
      // NavigationMenu's own internal recursive helper for vertical mode's
      // arbitrary-depth tree - not meant to be placed directly either.
      // SlideoverRenderer/DrawerRenderer are useSlideover()'s/useDrawer()'s
      // own render loops, same reasoning as ModalRenderer.
      ignore: ['**/ModalRenderer.vue', '**/NavigationMenuAccordionItem.vue', '**/SlideoverRenderer.vue', '**/DrawerRenderer.vue'],
    })

    // ProsePre/ProseH1-H6 are the only two Prose*.vue components with real
    // behavior beyond styling (a copy-to-clipboard button, an auto-anchor-
    // linked heading) - see prose.md for the rest, which moved to a plain
    // CSS class instead. This registers them a second time under their own
    // bare, unprefixed names (`ProseH1`, not `SProseH1`) - additive, not a
    // rename: `SProsePre`/`SProseH1`-`H6` (the main registration above)
    // keep working unchanged for direct use.
    //
    // NOT sufficient on its own for @nuxt/content/@nuxtjs/mdc specifically,
    // even with a high `priority` here: confirmed by reading its source
    // that it ships its own built-in default ProseH1/ProsePre under these
    // same bare names, and its `MDCRenderer` never does a global-name
    // component *lookup* for these tags at all (registration
    // order/priority genuinely never enters into it) - it resolves
    // through a `components` prop passed to `<ContentRenderer>` instead.
    // Still worth registering here regardless: this is the correct
    // mechanism for any *other* renderer that resolves markdown elements
    // to real component instances without shipping its own conflicting
    // defaults. See prose.md's own "Wiring into @nuxt/content" section for
    // the actual working `<ContentRenderer :components="...">` pattern.
    const hasContentModule = nuxt.options.modules.some((m) => {
      const name = typeof m === 'string' ? m : Array.isArray(m) && typeof m[0] === 'string' ? m[0] : undefined
      return name === '@nuxt/content' || name === '@nuxtjs/mdc'
    })
    if (hasContentModule) {
      addComponentsDir({
        path: resolver.resolve('./runtime/components'),
        pattern: ['ProsePre.vue', 'ProseH[1-6].vue'],
        prefix: '',
        pathPrefix: false,
        global: true,
        priority: 10,
      })
    }

    addImportsDir(resolver.resolve('./runtime/composables'))

    // Registers vRipple as an auto-importable directive - plain
    // addImportsDir doesn't mark an import as a directive (confirmed: a
    // v-ripple used only in a template, with no matching identifier
    // anywhere in the script block, gave Nuxt's import-scanner nothing to
    // detect, so nothing got injected and the directive stayed fully
    // unresolved). addImports' own meta.vueDirective flag is what wires
    // into Nuxt 4's built-in vueDirectivesAddon (unimport, enabled by
    // default whenever imports.autoImport isn't explicitly false) -
    // verified end to end (real spawn, correct auto-containment, no
    // console warnings) with a bare v-ripple and zero explicit import
    // anywhere. Consumers can still `import { vRipple } from
    // 'selaras/directives'` explicitly too (see its own barrel file) -
    // the two aren't mutually exclusive, and the explicit path stays
    // useful for a non-Nuxt Vue app, or one with autoImport disabled.
    addImports({
      name: 'vRipple',
      from: resolver.resolve('./runtime/directives/ripple'),
      meta: { vueDirective: true },
    })
  },
})
