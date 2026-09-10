---
title: Installation
description: Add Selaras to a Nuxt project.
order: 20
---

## Install the package

Tailwind CSS is a peer dependency - install it alongside Selaras so your
own project owns its version directly:

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
```

Then point Nuxt at that file:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  css: ['~/assets/css/main.css'],
})
```

`@import "@sewadah/selaras";` brings in every design token (`--ui-*` custom
properties) and component-level base style - see [Theming](/overview/theming).
If your project also renders long-form markdown/CMS content, add
[prose.css](/components/typography/prose) the same way:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
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
early enough to generate a small companion stylesheet that makes sure
your Tailwind build actually produces the matching `tw:`-prefixed CSS
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
