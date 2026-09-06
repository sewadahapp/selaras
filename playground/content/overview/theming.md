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
resolve to a different step of an 11-shade `--color-primary-50` through
`--color-primary-950` scale (defined in Selaras's own `@theme` block), not
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
  --color-primary-50:  oklch(0.9700 0.0120 25);
  --color-primary-100: oklch(0.9300 0.0280 25);
  --color-primary-200: oklch(0.8600 0.0550 25);
  --color-primary-300: oklch(0.7800 0.1000 25);
  --color-primary-400: oklch(0.6400 0.1650 25);
  --color-primary-500: oklch(0.4755 0.2026 25);
  --color-primary-600: oklch(0.4150 0.1850 25);
  --color-primary-700: oklch(0.3550 0.1580 25);
  --color-primary-800: oklch(0.2950 0.1280 25);
  --color-primary-900: oklch(0.2350 0.0950 25);
  --color-primary-950: oklch(0.1700 0.0600 25);
}
```

`--ui-primary`/`-hover`/`-active` read from `--color-primary-500`/`-600`/
`-700` (`-soft` reads from the scale too - `-100` in light mode, a
computed blend against the current background in dark mode, so it stays
legible on either) - overriding the full scale, not the semantic tokens
directly, is what keeps all of these in sync (`-foreground` is the one
exception - it's a fixed near-white constant in both light and dark mode,
since a solid-variant button/badge stays readable with white text against
any of these role colors regardless of theme). The same shape applies to
`secondary`/`success`/`danger`/`info`/`warning` - just swap the color
name.

Tailwind v4 only keeps a theme variable in the compiled CSS if it detects
the variable actually being used somewhere - normally that means a
utility class like `bg-primary-500` appearing literally in a scanned
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
instead of the whole app. It can also default a prop's value (`:props`)
for a component that opts into reading it - see its own doc page for
which components currently do.

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
