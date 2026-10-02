---
title: Nuxt configuration
description: Configure component imports, class prefixes, adaptive breakpoints, and color roles.
order: 40
---

## Options

Configure the module under the `selaras` key:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  selaras: {
    // Prefix used for auto-imported components.
    prefix: 'S', // default
  },
})
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `prefix` | `string` | `'S'` | Prefix used for auto-imported components (`SButton`, `SModal`, ...). |
| `classPrefix` | `string` | none | Namespaces every class Selaras's own components render - see below. |
| `theme.colors` | `Record<string, ColorModePair<ColorRecipeInput>>` | built-in roles | Build-time light and dark color recipes; also registers custom roles. |
| `adaptive.breakpoint` | `string` | `'md'` | Selects a Tailwind `--breakpoint-*` token for adaptive presentation. |

## Adaptive breakpoint

CSS owns breakpoint values. Override the default condition in your stylesheet:

```css
@theme {
  --breakpoint-md: 60rem;
}
```

Or define your own `--breakpoint-tablet` token and select it with
`selaras: { adaptive: { breakpoint: 'tablet' } }`. Supported values are simple
lengths in `px`, `rem` or `em`. Keep breakpoint units consistent with your other
Tailwind conditions. Selaras reads the resolved length after mount and uses the
native `(width < …)` media query, including under a class prefix. Its initial
SSR render uses desktop presentation; the existing adaptive controls hold their
chosen presentation until they close.

These are build-time `@theme` conditions. Changing a breakpoint CSS variable at
runtime does not rewrite Tailwind's compiled responsive rules. A missing or
unsupported binding produces a console diagnostic and disables mobile
presentation; there is no implicit 768px fallback.

## Class prefix

Tailwind v4 supports namespacing every one of its own utilities behind a
prefix (`@import "tailwindcss" prefix(tw);`, which turns `px-4` into
`tw:px-4`) - typically to avoid collisions with another CSS framework or a
second, differently-configured Tailwind build in the same project. Selaras
can match that prefix in the classes its own components render, via
`classPrefix` under the `selaras` key in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  selaras: {
    classPrefix: 'tw',
  },
})
```

This is a module option, not an `app.config.ts` value - Tailwind CSS
generation happens at build time, so Selaras needs to know the prefix
early enough to generate the class candidates imported through
`#selaras/tailwind.css`. Your own Tailwind entry produces the matching CSS
(Tailwind never generates CSS for a class it can't find as literal text
anywhere, whether that's your own templates or a safelist - an
`app.config.ts` value alone, read only at render time, could never
produce that).

**This value must match your own Tailwind prefix exactly.** Selaras has
no way to detect your Tailwind configuration, so if the two ever drift -
`classPrefix: 'tw'` here while your CSS still says `prefix(ui)`, or one
set and not the other - every component renders classes your Tailwind
build never generated CSS for, and the entire UI comes out unstyled. No
error is raised either way; it silently looks like a blank stylesheet.
Only set this if you've already added `prefix(...)` to your own
`@import "tailwindcss"`.

**Your own classes need the same prefix, written by hand.** Selaras's
automatic handling only covers classes baked into its own shipped
components - it has no way to see a string you write yourself, so a
`:ui` override (or your own custom component built the same way, on
`resolveSlot`/`tv()`) needs the prefix written directly into the string:

```vue-html
<!-- classPrefix: 'tw' -->
<SButton :ui="{ base: 'tw:bg-purple-700' }" />
```

This isn't a Selaras-specific gotcha - it's the same rule Tailwind's
prefix feature already applies to every other class in your project once
you've adopted it (a plain `<div class="tw:flex">` needs the same
literal prefix). See [Theming](/overview/theming/overview) for the other ways to
customize a component.



## Custom color roles

`selaras.theme.colors` registers build-time color recipes, including custom role names. Each role supplies light and dark recipes. See [Color roles](/overview/theming/color-roles) for the full contract. Runtime classes, defaults, messages, and icons belong in `app.config.ts`, not these module options.

See [Global configuration](/overview/theming/global-configuration) and [Color modes](/overview/theming/color-modes).
