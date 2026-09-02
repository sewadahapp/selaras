---
title: Installation
description: Add Selaras to a Nuxt project.
order: 20
---

## Install the package

::code-group

```bash [bun]
bun add selaras
```

```bash [npm]
npm install selaras
```

```bash [pnpm]
pnpm add selaras
```

::

## Register the module

Add `selaras` to `modules` in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['selaras'],
})
```

That's it - components are auto-imported, and the module pulls in its own
dependencies (`@nuxt/icon`, `@nuxtjs/color-mode`) automatically.

## Options

Configure the module under the `selaras` key:

```ts
export default defineNuxtConfig({
  modules: ['selaras'],
  selaras: {
    // Prefix used for auto-imported components.
    prefix: 'S', // default
  },
})
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `prefix` | `string` | `'S'` | Prefix used for auto-imported components (`SButton`, `SModal`, ...). |

## Dark mode

Selaras ships both a light and a dark palette, toggled by a plain `.dark`
class on `<html>` (via `@nuxtjs/color-mode`, installed automatically). The
built-in `SColorModeToggle` component flips it for you - see
[Theming](/overview/theming) for how the underlying tokens work.
