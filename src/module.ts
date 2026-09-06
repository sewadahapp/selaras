import { addComponentsDir, addImports, addImportsDir, addTemplate, addVitePlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { Scanner } from '@tailwindcss/oxide'
import tailwindcss from '@tailwindcss/vite'

export interface ModuleOptions {
  /**
   * Prefix used for auto-imported components.
   * @default 'S'
   */
  prefix?: string
  /**
   * Namespaces every class Selaras's own components render behind this
   * Tailwind v4 class-prefix (`tw:flex` instead of `flex`) - matches a
   * consumer's own `@import "tailwindcss" prefix(tw);` declaration, which
   * must use the exact same string or the whole UI renders unstyled with
   * no error. Unset by default (no prefixing). See "Class prefix" in the
   * installation docs before setting this.
   */
  classPrefix?: string
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

    // theme.css is no longer auto-injected via nuxt.options.css - a
    // consumer imports it explicitly instead (`@import "tailwindcss";
    // @import "selaras";` in their own CSS entry point - package.json's
    // own root export declares a `style` condition pointing at theme.css,
    // the same mechanism a bare `@import "<package>";` commonly resolves
    // through for other Nuxt component libraries' own CSS packages),
    // matching that same current installation story and prose.css's
    // existing opt-in pattern here. This still wires up the actual
    // Tailwind build pipeline regardless of where the CSS import lives -
    // only the CSS *file itself* moved to being explicit, not this.
    addVitePlugin(tailwindcss())

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false,
      // SColumn/SColumnGroup are plain .ts files (never render real DOM), not
      // .vue SFCs - addComponentsDir only scans .vue by default.
      extensions: ['vue', 'ts'],
      // ModalRenderer is App.vue's own internal render loop for useModal(),
      // mirroring the same un-exported overlay-provider pattern other Nuxt
      // component libraries commonly use internally - not meant to be
      // placed by a consumer (App.vue already mounts one; a second copy
      // would render every open programmatic modal twice, since useModal()'s
      // state is a shared singleton). NavigationMenuAccordionItem,
      // NavigationMenuFlyoutList and NavigationMenuFlyoutTrigger are
      // NavigationMenu's own internal recursive helpers for vertical mode's
      // arbitrary-depth tree (expanded, collapsed-flyout content, and the
      // collapsed-flyout's own hover/click trigger, respectively) - not
      // meant to be placed directly either. SlideoverRenderer/DrawerRenderer
      // are useSlideover()'s/useDrawer()'s own render loops, same reasoning
      // as ModalRenderer.
      ignore: ['**/ModalRenderer.vue', '**/NavigationMenuAccordionItem.vue', '**/NavigationMenuFlyoutList.vue', '**/NavigationMenuFlyoutTrigger.vue', '**/SlideoverRenderer.vue', '**/DrawerRenderer.vue'],
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

    // Threads `classPrefix` from this build-time module option into runtime
    // code (`applyClassPrefix` in runtime/utils/ui.ts) via a virtual
    // constants module - the same pattern @nuxtjs/color-mode (already a
    // dependency here) uses for its own options, confirmed by reading its
    // shipped source (`addTemplate({ filename: 'color-mode-options.mjs', ...
    // export const ${key} = ... })`, imported via `#build/color-mode-
    // options.mjs`). Always registered, even when unset (`classPrefix:
    // null`), so ui.ts's own import of this virtual module never fails to
    // resolve regardless of whether this feature is in use.
    addTemplate({
      filename: 'selaras-class-prefix.mjs',
      getContents: () => `export const classPrefix = ${JSON.stringify(options.classPrefix ?? null)}\n`,
    })

    if (options.classPrefix) {
      // Tailwind v4 only generates CSS for a class it can find as literal
      // text (via file scanning or an explicit `@source inline(...)`
      // safelist) - never by pattern-matching whatever `applyClassPrefix`
      // produces at render time (confirmed directly: an unprefixed
      // candidate is rejected outright the moment any `prefix(...)` is
      // active in a compilation, regardless of discovery mechanism). So
      // Tailwind has to be told, at this build time, that every one of
      // Selaras's own classes now also exists in `${classPrefix}:`-prefixed
      // form - `@tailwindcss/oxide`'s `Scanner` is Tailwind's own native
      // candidate scanner (the exact code path a real Tailwind build uses
      // to turn `@source` globs into candidates), scanning the same three
      // globs theme.css's own `@source` directives already declare so this
      // stays in sync with that list by construction rather than a second
      // hand-maintained copy.
      const runtimeBase = resolver.resolve('./runtime')
      const scanner = new Scanner({
        sources: [
          { base: runtimeBase, pattern: './components/**/*.vue', negated: false },
          { base: runtimeBase, pattern: './theme/**/*.ts', negated: false },
          { base: runtimeBase, pattern: './utils/**/*.ts', negated: false },
        ],
      })
      const candidates = scanner.scan().filter((candidate) => {
        // selaras-nav-elbow (& variants) are hand-authored literal CSS
        // selectors (theme.css), never real Tailwind utilities -
        // applyClassPrefix skips them at render time too, so they must
        // never end up in this prefixed safelist either.
        if (candidate.startsWith('selaras-'))
          return false
        // The scanner reads plain file text, not syntax, so it also
        // picks up destructured variable names and TS identifiers
        // (`!canDecrement`, `accessorKey`) from the same files - harmless
        // if left in (Tailwind silently ignores anything that isn't a
        // real utility), but every real Tailwind class in this codebase
        // is lowercase and never starts with `!` (confirmed by grep), so
        // this keeps the generated safelist's size down.
        if (candidate.startsWith('!') || /[A-Z]/.test(candidate))
          return false
        return true
      })
      const safelist = candidates.map(candidate => `${options.classPrefix}:${candidate}`).join(' ')

      const safelistTemplate = addTemplate({
        filename: 'selaras-prefix-safelist.css',
        // Tailwind's split entry points (`tailwindcss/theme.css` +
        // `tailwindcss/utilities.css`, each with their own `prefix(...)`)
        // emit only the utilities layer for this file's own safelist
        // candidates, instead of a second full copy of Preflight/theme
        // output the plain `@import "tailwindcss" prefix(...)` form would
        // otherwise duplicate (confirmed: ~3.4KB vs ~190KB for an
        // equivalent safelist). `theme(reference)` on the theme import:
        // this file only needs to *resolve* Tailwind's own theme values
        // for candidate generation, not emit them again.
        //
        // `tw-animate-css` and `@custom-variant dark` are also imported/
        // declared here, matching theme.css's own - both live only in
        // theme.css's (separate) compilation otherwise, so without them
        // every `${prefix}:animate-in`/`${prefix}:fade-in-0`/etc class
        // (every Modal/Dropdown/Select/Toast/Tooltip/Drawer open-close
        // transition) would silently generate no CSS at all under a
        // configured prefix - confirmed empirically. `dark:` isn't used
        // by any real component class yet, but costs nothing to close now.
        getContents: () => [
          `@import "tailwindcss/theme.css" theme(reference) prefix(${options.classPrefix});`,
          `@import "tailwindcss/utilities.css" layer(utilities) prefix(${options.classPrefix});`,
          `@import "tw-animate-css";`,
          `@custom-variant dark (&:where(.dark, .dark *));`,
          `@source inline("${safelist}");`,
          '',
        ].join('\n'),
        write: true,
      })
      nuxt.options.css.push(safelistTemplate.dst)
    }
  },
})
