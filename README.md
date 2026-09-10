# Selaras

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A UI component library for Nuxt, built on Reka UI and Tailwind v4. Every
component ships a `tailwind-variants` theme and a single `:ui` prop for
overrides - no separate pass-through prop to juggle, no specificity fights
between the library's own classes and yours. Design tokens are plain CSS
variables (`@theme` + a semantic `--ui-*` layer), so re-theming an app is a
matter of overriding variables, not rebuilding the library.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

> **Status:** pre-1.0 and still moving - component APIs, the color token
> system, and internal structure can change between minor versions until
> things settle.

## Features

- **One override prop, not two.** `:ui` accepts a string (tailwind-merge'd
  against the theme) or an object (merged via `mergeProps` for the rare
  non-class case) per slot - the same mental model everywhere in the library.
- **CSS variable design tokens.** Colors, radii, shadows, and z-index all
  live in `theme.css` as `--ui-*` variables built on OKLCH primitives, so
  swapping a brand color is a CSS override, not a rebuild.
- **CSS-only animation.** Open/close and hover/focus transitions run on
  `data-state` attributes and Tailwind variants - no motion library
  dependency.
- **~35 components** across elements (Button, Badge, Chip, Icon, ...), forms
  (Input, Select, Autocomplete, Checkbox, RadioGroup, Switch, FormField,
  ...), data (Table, with sorting/pagination/virtualization/pinning/export),
  navigation (Tabs, Accordion, ContentNavigation, ContentToc), overlays
  (Modal, Dropdown, Tooltip, Toast), layout, and a full set of Prose
  wrappers for `@nuxt/content`.
- Components auto-import with an `S` prefix (`SButton`, `SSelect`, ...).

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxt module add @sewadah/selaras
```

Tailwind CSS is a peer dependency - install it alongside Selaras too, so
your own project owns its version directly:

```bash
npm install tailwindcss
```

Import the CSS in your own stylesheet, after Tailwind itself:

```css
@import "tailwindcss";
@import "@sewadah/selaras";
```

Wrap your root `app.vue` in `<SApp>`, once - required for Tooltip's shared
hover-delay behavior and the `useModal`/`useDrawer`/`useSlideover` composables
to work:

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

Every component is now auto-imported and ready to use:

```vue-html
<SButton color="primary" icon="ph:sparkle">
  Get started
</SButton>
```

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  npm install

  # Generate type stubs
  npm run dev:prepare

  # Develop with the playground (component docs site)
  npm run dev

  # Build the playground
  npm run dev:build

  # Type-check
  npm run test:types

  # Run ESLint
  npm run lint

  # Run Vitest
  npm run test
  npm run test:watch

  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@sewadah/selaras/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@sewadah/selaras

[npm-downloads-src]: https://img.shields.io/npm/dm/@sewadah/selaras.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@sewadah/selaras

[license-src]: https://img.shields.io/npm/l/@sewadah/selaras.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@sewadah/selaras

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
