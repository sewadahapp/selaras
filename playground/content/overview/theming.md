---
title: Theming
description: Design tokens, the :ui prop, and global overrides.
order: 30
---

Every component reads its colors from a small set of semantic CSS custom
properties, and its layout/variant classes from a `tailwind-variants`
theme. There are four ways to customize a component, in increasing order
of precedence.

## 1. Design tokens

`--ui-*` custom properties carry every component's colors, radius,
shadow, and overlay stacking order - components never reference a raw
Tailwind color/radius/shadow class directly:

| Token | Purpose |
| --- | --- |
| `--ui-bg`, `--ui-bg-elevated`, `--ui-bg-inverted` | Page/surface backgrounds |
| `--ui-border`, `--ui-border-hover`, `--ui-border-muted` | Borders |
| `--ui-text`, `--ui-text-muted`, `--ui-text-inverted` | Text |
| `--ui-primary`, `--ui-secondary`, `--ui-success`, `--ui-danger`, `--ui-info`, `--ui-warning` | Role colors, each with a `-hover`, `-active`, `-foreground` and `-soft` variant |
| `--ui-radius` | Base corner radius - see below |
| `--ui-shadow-sm`, `--ui-shadow-md`, `--ui-shadow-lg` | Overlay elevation (Modal, Dropdown, Popover, ...) |
| `--ui-z-modal-overlay`, `--ui-z-modal`, `--ui-z-dropdown`, `--ui-z-tooltip`, `--ui-z-toast` | Overlay stacking order, reflecting real nesting (a Dropdown can open from inside a Modal, a Toast always stays on top) |

Redefine any of these in your own CSS to retheme the whole library without
touching a single component. Dark mode is just a second set of the same
tokens, applied under a `.dark` class on `<html>` (flipped by
`SColorModeToggle`, or your own `useColorMode()` logic).

**Recoloring a role (`primary`, `secondary`, `success`, `danger`, `info`,
`warning`) takes more than just overriding `--ui-primary` itself.** Each
`--ui-*` role token above is only the semantic *entry point* - `--ui-primary`,
`--ui-primary-hover`, `--ui-primary-active`, and `--ui-primary-soft` each
resolve to a different step of Selaras's owned 11-shade
`--color-selaras-indigo-50` through `--color-selaras-indigo-950` default
scale (defined in Selaras's own `@theme` block), not
to each other. Overriding `--ui-primary` alone changes the base color but
leaves hover/active/soft still pointing at the *old* scale's other shades -
a visibly inconsistent result. Override the whole scale instead, in your
own `@theme` block (same mechanism the breakpoints/spacing example below
uses):

```css
@theme {
  /* Every shade shares one hue (the third oklch number) - only the
     lightness/chroma (first two numbers) step from light to dark. Swap
     the hue to recolor while keeping the same accessible contrast steps
     Selaras's own scale was tuned with; only touch lightness/chroma too
     if you want a fundamentally different saturation curve. */
  --color-selaras-indigo-50:  oklch(0.9700 0.0120 25);
  --color-selaras-indigo-100: oklch(0.9300 0.0280 25);
  --color-selaras-indigo-200: oklch(0.8600 0.0550 25);
  --color-selaras-indigo-300: oklch(0.7800 0.1000 25);
  --color-selaras-indigo-400: oklch(0.6400 0.1650 25);
  --color-selaras-indigo-500: oklch(0.4755 0.2026 25);
  --color-selaras-indigo-600: oklch(0.4150 0.1850 25);
  --color-selaras-indigo-700: oklch(0.3550 0.1580 25);
  --color-selaras-indigo-800: oklch(0.2950 0.1280 25);
  --color-selaras-indigo-900: oklch(0.2350 0.0950 25);
  --color-selaras-indigo-950: oklch(0.1700 0.0600 25);
}
```

The built-in Button and Badge recipes select separate filled, subtle and text
colors from these scales in each mode. Button hover and pressed states preserve
contrast against the stock `--ui-bg` surface. Warning uses a dark foreground
and brighter filled interaction shades; dark-mode text uses lighter shades.
Changing a palette or surface requires checking the resulting contrast again.
Use a complete semantic recipe when your brand needs different foregrounds
or interaction choices. Other components still use the legacy `--ui-*`
bridges while their semantic recipe migration is in progress.

### Custom semantic roles

Register an additional role in `nuxt.config.ts` when a named product color
needs to work through component `color` props. Role names are build-time
topology so Nuxt can generate their CSS and augment `ColorRole`; their values
remain CSS expressions and can use company variables. `defineColor` validates
the six required leaves in both modes without deriving or changing them:

```ts
import { defineColor } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  selaras: {
    theme: {
      colors: {
        premium: defineColor({
          light: {
            fill: 'var(--company-premium)',
            onFill: '#fff',
            subtle: 'var(--company-premium-soft)',
            onSubtle: '#241344',
            text: '#5134a8',
            border: '#765fc0',
          },
          dark: {
            fill: '#a895f0',
            onFill: '#170b38',
            subtle: '#2b2050',
            onSubtle: '#eeeaff',
            text: '#c9bcff',
            border: '#8c78d4',
          },
        }),
      },
    },
  },
})
```

Hover, pressed, and focus leaves are optional. Omitted hover leaves follow
the resolved base; omitted pressed leaves follow the resolved hover; omitted
focus follows resolved text. CSS inputs and runtime token overrides participate
in these chains. Explicitly authored leaves remain independent, even if their
expression initially matches the base. New roles require both modes. A runtime `app.config` override can
change leaves of a registered role, but cannot introduce a new role name.

For an existing DTCG token system, resolve aliases and select its context in
your token pipeline, then map each resolved color value into the recipe. The
`dtcgColorToCss` helper accepts structured `srgb`, `srgb-linear`, and `oklch`
values. It deliberately does not parse token documents or resolve references:

```ts
import { defineColor, dtcgColorToCss } from '@sewadah/selaras/theme'

const fill = dtcgColorToCss(tokens.brand.fill.$value, {
  path: 'semantic.brand.fill.$value',
})

const brand = defineColor({
  light: { fill, onFill: '#fff', subtle: fill, onSubtle: '#111', text: fill, border: fill },
  dark: { fill, onFill: '#111', subtle: fill, onSubtle: '#fff', text: fill, border: fill },
})
```

Custom roles accept role-specific CSS overrides such as
`--selaras-color-premium-fill`. Set them on `:root` for the document or on
a local ancestor for a subtree:

```css
.premium-panel {
  --selaras-color-premium-fill: #5134a8;
  --selaras-color-premium-on-fill: #fff;
}
```

These variables are override inputs. Selaras resolves registered defaults
at each role element; it does not declare a complete default palette under
these names on `:root`. This keeps default expressions referencing local
company variables usable. Explicit managed token overrides take precedence
over inherited CSS inputs. Changing `fill` updates an omitted `fillHover` and
its omitted pressed state. Override authored interaction leaves explicitly
when you want to change them. Built-in recipes author all their state leaves,
so changing only their fill does not retheme their interactions.
Button and Badge use these inputs for built-in roles too, for example
`--selaras-color-primary-fill`. Built-in defaults read the palette foundations,
so a local `--ui-primary` override no longer recolors Button or Badge. Module
`theme.colors.primary` can replace the complete built-in recipe; runtime
`selaras.tokens` and explicit `STheme` scopes can override its leaves.
Other components still use the legacy bridge during their semantic migration.

Tailwind v4 only keeps a theme variable in the compiled CSS if it detects
the variable actually being used somewhere - normally that means a
utility class like `bg-selaras-indigo-500` appearing literally in a scanned
file. Overriding a color Selaras already ships (as above) works with a
plain `@theme` block, since Selaras's own CSS already references the full
scale internally. If a color you add still doesn't show up in your build
- most likely a token that isn't one of Selaras's own roles - add
`static` to your own block instead (`@theme static { ... }`), which tells
Tailwind to always keep it regardless of detected usage:

```css
@theme static {
  --color-brand-500: oklch(0.55 0.20 300);
}
```

**Radius is one knob, not four.** `--ui-radius-sm`/`-md`/`-lg` are derived
from `--ui-radius` itself (0.75x/1x/2x), so changing the single base value
rescales every component's corners proportionally:

```css
:root {
  --ui-radius: 0.25rem; /* sharper corners across the whole library */
}
```

`--ui-radius-full` (pills, avatars) stays independent - "pill-shaped" is
a distinct visual choice, not a point on the same size gradient.

**Breakpoints and spacing** aren't Selaras tokens at all - components use
Tailwind's own default scale directly, so you customize them the same way
you would in any Tailwind v4 project, through Tailwind's own `@theme`:

```css
@theme {
  --breakpoint-3xl: 1920px;
  --spacing: 0.2rem;
}
```

## 2. The `:ui` prop

Every component takes a single `:ui` prop for per-instance overrides -
there's no separate "pass-through props" prop alongside it. Each key is a
slot name; each value is either:

- a **string** - extra classes, merged with the slot's own classes via
  `tailwind-merge` (so a conflicting utility like `bg-*` correctly
  replaces the default rather than stacking both);
- an **object** - `{ class, ...attrs }`, where `class` is merged the same
  way and everything else is applied as raw attributes/event handlers via
  Vue's `mergeProps` (never tailwind-merged) - the escape hatch for the
  rare case you need more than classes.

```vue-html
<SButton :ui="{ base: 'font-mono' }">
  Custom
</SButton>
```

To know what you're actually overriding - the current default classes for
every slot and variant - every component's own doc page ends with a "Theme
source" block showing its real `src/runtime/theme/*.ts` file, read live
rather than transcribed by hand (so it can never drift from what's
actually shipped, the way a hand-written table would).

## 3. `STheme`

To retheme every component inside one part of the page - a card, a
sidebar - without making that a global default, wrap it in
[`STheme`](/components/layout/theme):

```vue-html
<STheme :ui="{ button: { slots: { base: 'font-mono' } } }">
  <!-- every SButton in here, however deeply nested -->
</STheme>
```

Same override shape as `app.config.ui` (below), and merged onto the
component's theme the same way - just scoped to `STheme`'s own subtree
instead of the whole app. It can also default a prop's value (`:defaults`)
for a component that opts into reading it - see its own doc page for
which components currently do.

### Functional colors and explicit modes

Role colors are separate from general surfaces, text, borders and the modal
scrim. Configure these functional values per mode through `selaras.tokens` in
`app.config.ts`, or through the same `tokens` shape on an explicit `STheme`:

```vue-html
<STheme
  as="section"
  mode="light"
  :tokens="{
    light: {
      surface: { default: 'var(--company-surface)', elevated: '#f5f5f5' },
      text: { default: '#202020', muted: '#555555' },
      border: { default: '#808080' },
      scrim: 'rgb(0 0 0 / .6)',
    },
  }"
>
  <!-- Descendants and declarative portals inherit this managed contract. -->
</STheme>
```

`surface` supports `default`, `elevated` and `inverted`; `text` supports
`default`, `muted` and `inverted`; `border` supports `default`, `muted` and
`hover`. `scrim` is a separate CSS color. Values are partial and inherit by
mode and leaf. A parent's dark-only value does not become a light override.
Explicit `light`/`dark` governs functional and role colors independently of
the document mode; omitted mode inherits, and unscoped components follow the
document root. Runtime tokens and explicit modes require a DOM boundary
through `as`.

CSS authors can use inherited inputs such as `--selaras-surface-default`,
`--selaras-text-muted`, `--selaras-border-hover` and `--selaras-scrim`. For
example, a root declaration changes the default surface without supplying a
palette:

```css
:root {
  --selaras-surface-default: #fafafa;
}
```

An unqualified CSS input applies in both modes; use per-mode runtime tokens
when mode-dependent ownership is needed. Consumer CSS on a theme owner and
inline inputs can override managed values. External variables referenced by a
managed token must exist at its destination, including the portal target.
Selaras does not copy DOM-local variables into body portals or certify contrast
for arbitrary CSS expressions.

Use the `--selaras-*` inputs for functional customization. The current
`--ui-bg`/`--ui-text`/`--ui-border` aliases are resolved recipe bindings and are
rebound at theme owners; overriding those aliases only on an ancestor is no
longer a scoped customization contract.

## 4. Global overrides

To retheme a component everywhere instead of one instance at a time,
extend its theme from `app.config.ts` under `ui.<componentKey>` (the
lowercase component name, e.g. `button`, `modal`):

```ts
export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'font-mono',
      },
    },
  },
})
```

This is merged over the component's base theme with `tailwind-variants`'
own `extend`, so you only need to specify what you're changing.

## Precedence

Lowest to highest: the component's base `tv()` theme → your
`app.config.ts` override → an ancestor `STheme`'s override → the
instance's `:ui` prop/explicit prop → a native `class`/fallthrough
attribute on the component's root element.

## Class prefix

If your own Tailwind build namespaces its utilities behind a prefix, see
[Installation](/overview/installation#class-prefix) for the matching
`classPrefix` option - it applies after every one of the mechanisms above,
regardless of which one produced the final class string.

## Localization

Retheming covers color/layout - three separate mechanisms cover text and
direction the same way `app.config.ui` covers a component's classes:
[`useMessages`](/utilities/composables/use-messages) overrides the text a
component renders on its own, [`useLocale`](/utilities/composables/use-locale)
sets the app-wide default for date/time formatting, and `SApp`'s `dir`
prop switches the whole layout to RTL. All three are independent axes,
matching how a page's language, its date formatting, and its reading
direction can each vary on their own.
