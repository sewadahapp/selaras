import type { ColorModePair, ColorRecipeInput } from './runtime/utils/color-registry'
import { addComponentsDir, addImports, addImportsDir, addTemplate, addVitePlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { Scanner } from '@tailwindcss/oxide'
import tailwindcss from '@tailwindcss/vite'
import { createBuiltinColorRegistry } from './builtin-colors'
import { createColorRegistry, generateColorRoleCss } from './runtime/utils/color-registry'

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
  /** Adaptive presentation uses this Tailwind `--breakpoint-*` condition. */
  adaptive?: {
    /** Breakpoint name; its value is owned by the consumer's CSS. @default 'md' */
    breakpoint?: string
  }
  /** Build-time semantic color roles. Both light and dark recipes are required. */
  theme?: {
    colors?: Record<string, ColorModePair<ColorRecipeInput>>
  }
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

    // Consumers import the default theme and generated Tailwind inputs in
    // their own CSS entry. All utilities must use that entry's final theme.
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

    // Types app.config.ts's messages/icons/locale override surface (see
    // runtime/types/app-config.d.ts) - without this reference, a consumer's
    // own app.config.ts sees `messages`/`icons`/`locale` as untyped.
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ path: resolver.resolve('./runtime/types/app-config.d.ts') })
    })

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
    // '@sewadah/selaras/directives'` explicitly too (see its own barrel file) -
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

    const colorRegistry = {
      ...createBuiltinColorRegistry(options.classPrefix),
      ...createColorRegistry(options.theme?.colors ?? {}),
    }
    addTemplate({
      filename: 'selaras-color-roles.mjs',
      getContents: () => `export const colorRoles = ${JSON.stringify(Object.keys(colorRegistry).sort())}\n`,
    })
    const colorRoleTypesTemplate = addTemplate({
      filename: 'selaras-color-roles.d.ts',
      getContents: () => {
        const roles = Object.keys(colorRegistry).sort()
        // Roles intentionally allow kebab-case (`brand-accent`). Interface
        // members must be quoted when their name is not a TypeScript
        // identifier; JSON.stringify also safely handles every other legal
        // role name without maintaining a second naming grammar here.
        const declarations = roles.map(role => `    ${JSON.stringify(role)}: true`).join('\n')
        return `declare global {\n  interface SelarasColorRegistry {\n${declarations}\n  }\n}\n\nexport {}\n`
      },
      write: true,
    })

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ path: colorRoleTypesTemplate.dst })
    })

    if (Object.keys(colorRegistry).length > 0) {
      const colorsTemplate = addTemplate({
        filename: 'selaras-color-roles.css',
        getContents: () => generateColorRoleCss(colorRegistry),
        write: true,
      })
      nuxt.options.css.push(colorsTemplate.dst)
    }

    const breakpoint = options.adaptive?.breakpoint ?? 'md'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(breakpoint))
      throw new Error('Selaras adaptive.breakpoint must name a Tailwind breakpoint (for example "md" or "tablet").')

    let safelist = ''
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
      // to turn `@source` globs into candidates), scanning the same four
      // globs theme.css's own `@source` directives already declare so this
      // stays in sync with that list by construction rather than a second
      // hand-maintained copy.
      const runtimeBase = resolver.resolve('./runtime')
      const scanner = new Scanner({
        sources: [
          { base: runtimeBase, pattern: './components/**/*.vue', negated: false },
          { base: runtimeBase, pattern: './internal/**/*.vue', negated: false },
          // Published recipes/utilities are JS; directory globs cover both
          // source TS and built files, matching theme.css's @source entries.
          { base: runtimeBase, pattern: './theme/**/*', negated: false },
          { base: runtimeBase, pattern: './utils/**/*', negated: false },
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
      safelist = candidates.map(candidate => `${options.classPrefix}:${candidate}`).join(' ')
    }

    // Input only, never a second Tailwind compilation with its own defaults.
    // The bridge reference also keeps the selected breakpoint variable from
    // being pruned. Tailwind prefixes theme variables as well as utilities.
    const tailwindTemplate = addTemplate({
      filename: 'selaras-tailwind.css',
      getContents: () => [
        safelist ? `@source inline("${safelist}");` : '',
        `:root { --selaras-adaptive-breakpoint: var(--${options.classPrefix ? `${options.classPrefix}-` : ''}breakpoint-${breakpoint}); }`,
        '',
      ].join('\n'),
      write: true,
    })
    nuxt.options.alias['#selaras/tailwind.css'] = tailwindTemplate.dst
  },
})
