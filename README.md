# Selaras

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A UI component library for Nuxt, built on Reka UI and Tailwind v4. Every
component ships a `tailwind-variants` theme and a single `:ui` prop for
overrides - no separate pass-through prop to juggle, no specificity fights
between the library's own classes and yours. Design tokens are plain CSS
variables (`@theme` foundations plus semantic `--selaras-*` inputs), so re-theming an app is a
matter of overriding variables, not rebuilding the library.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

> **Status:** pre-1.0 and still moving - component APIs, the color token
> system, and internal structure can change between minor versions until
> things settle.

## Features

- **One override prop, not two.** `:ui` accepts a string (tailwind-merge'd
  against the theme) or an object (merged via `mergeProps` for the rare
  non-class case) per slot - the same mental model everywhere in the library.
- **CSS variable design tokens.** Colors, radii, shadows, and z-index use
  semantic `--selaras-*` inputs and `--selaras-resolved-*` reads, so swapping
  a brand color is a CSS override, not a rebuild.
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
@import "#selaras/tailwind.css";
```

For a mature design system that supplies complete semantic role recipes and
`--selaras-*` functional inputs, import `@sewadah/selaras/structural.css`
instead. It keeps Selaras's source discovery, variants, motion and semantic
bindings while omitting Selaras-owned foundation colors. The default aggregate
import remains the recommended path for most applications. Structural CSS is
not an unthemed fallback: an incomplete theme has no default palette or runtime
diagnostic, so provide every role and functional value your components use.

The Nuxt-generated import supplies library class candidates and the adaptive
breakpoint binding to the same Tailwind compilation as your app. Breakpoint
values come from your CSS (`@theme { --breakpoint-md: 60rem; }`); select another
name with `selaras.adaptive.breakpoint` in `nuxt.config.ts`.

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

## Theming

Selaras is CSS-first for design values.

For normal theme changes, override the public `--selaras-*` CSS variables or
the Selaras foundation palettes in Tailwind `@theme`. You do not need
`nuxt.config.ts` to change built-in roles such as `primary`, `warning`,
`danger`, or `neutral`.

Use `selaras.theme.colors` in `nuxt.config.ts` when you must register a new
role name, such as `tertiary`, or when you intentionally want to author a
complete build-time recipe.

`defineColorFromSeed()` is an optional accessibility-oriented generator. The
supplied color remains the exact resting solid fill; Selaras derives readable
content, interaction states, text, borders, focus, and essential indicators
around it. Use `defineColor()` when you need to author every leaf yourself.

See the full [Theming guide](./docs/content/overview/theming.md).

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  npm install

  # Generate type stubs and prepare the docs site
  npm run docs:prepare

  # Develop with the docs site (documentation + component showcase)
  npm run docs:dev

  # Generate the static docs site
  npm run docs:generate

  # Type-check
  npm run test:types

  # Run ESLint
  npm run lint

  # Run Vitest
  npm run test
  npm run test:watch

  # Build and test source consumers plus an isolated installed tarball
  # Requires Bun for the temporary consumer's dependency installation
  npm run test:compat

  # Release new versions (selaras, docs layer, or both)
  npm run release
  npm run release:selaras
  npm run release:docs

  # Each package has its own version stream, so one run can bump them at
  # different levels - Selaras major alongside a docs patch, for example.
  # The release workflow exposes per-package bump/version inputs for this.
  # Locally, drive each half through its own env:
  RELEASE_BUMP=major npm run release:selaras
  RELEASE_BUMP=patch npm run release:docs
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
