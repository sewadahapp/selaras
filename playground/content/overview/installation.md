---
title: Installation
description: Add Selaras to a Nuxt project.
order: 20
---

## Requirements

Selaras supports Nuxt `^4.5.2`, Tailwind CSS `^4.3.0`, and Node.js
`^22.19.0 || ^24.11.0 || >=26.0.0`. Nuxt provides the Vue runtime and SFC
compiler, so they are not installed or versioned separately. Type checking is
verified with TypeScript `>=5.9.3`; TypeScript is a build-time tool, not a
Selaras runtime dependency.

## Install the package

Nuxt and Tailwind CSS are peer dependencies - install Selaras in an existing
Nuxt project and keep Tailwind under your project's direct control:

::code-group

```bash [bun]
bun add @sewadah/selaras tailwindcss
```

```bash [npm]
npm install @sewadah/selaras tailwindcss
```

```bash [pnpm]
pnpm add @sewadah/selaras tailwindcss
```

::

## Register the module

Add `@sewadah/selaras` to `modules` in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
})
```

Components are now auto-imported, and the module pulls in its own
dependencies (`@nuxt/icon`, `@nuxtjs/color-mode`) automatically.

## Wrap your app in `SApp`

Wrap your root `app.vue` in `<SApp>`, once:

```vue-html
<!-- app.vue -->
<template>
  <SApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </SApp>
</template>
```

This isn't optional - without it, Tooltip loses its shared hover-delay
behavior, and `useModal()`/`useDrawer()`/`useSlideover()` (the "open from
anywhere" APIs) have nothing to render into. See [App](/components/layout/app)
for the full picture, including the two components (`SToast`,
`SCommandPalette`) that still need to be placed yourself even with `SApp`
already wrapping everything.

## Import the CSS

Selaras doesn't inject its own CSS for you - import it explicitly in your
own stylesheet, after Tailwind itself:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

Then point Nuxt at that file:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  css: ['~/assets/css/main.css'],
})
```

`@import "@sewadah/selaras";` brings in the default theme and component base
styles - see [Theming](/overview/theming). `#selaras/tailwind.css` is generated
by the Nuxt module. Import it in this same entry so library class candidates
and adaptive presentation use your app's final Tailwind theme.

### Complete explicit theme

Applications with a complete existing semantic theme can import Selaras's
structural entry instead of its owned default foundations:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras/structural.css";
@import "#selaras/tailwind.css";
```

This entry retains source discovery, variants, motion and semantic bindings.
Provide a light and dark recipe for every role your components can render,
including any built-in role you keep and each custom role you register. Provide
the functional `--selaras-*` inputs required by your design system as well.
It is not an unthemed zero-configuration mode: incomplete structural themes
have no Selaras fallback palette or runtime completeness diagnostic. Use the
aggregate import unless you provide that complete contract.
If your project also renders long-form markdown/CMS content, add
[prose.css](/components/typography/prose) the same way:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
@import "@sewadah/selaras/prose.css";
```

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
literal prefix). See [Theming](/overview/theming) for the other ways to
customize a component.

## Dark mode

Selaras ships both a light and a dark palette, toggled by a plain `.dark`
class on `<html>` (via `@nuxtjs/color-mode`, installed automatically). The
built-in `SColorModeToggle` component flips it for you - see
[Theming](/overview/theming) for how the underlying tokens work.
