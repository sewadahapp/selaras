# Selaras

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A customizable Vue component library for Nuxt, built on Reka UI and Tailwind CSS v4.
Build forms, navigation, data tables, overlays, and application layouts with typed APIs,
keyboard interactions, and light and dark modes.

Selaras v1 is available on npm.

[Documentation](https://selarasui.my.id) · [Components](https://selarasui.my.id/components/elements/button) · [Blocks](https://selarasui.my.id/blocks/overview) · [Templates](https://selarasui.my.id/templates) · [Release notes](https://github.com/sewadahapp/selaras/releases)

## Features

- **Ready-to-use components.** Form controls, Select, Autocomplete, Listbox, TransferList,
  Table, NavigationMenu, Modal, Drawer, Toast, and more, auto-imported with an `S` prefix.
- **CSS-first theming.** Customize semantic colors, surfaces, radius, and shadows through
  CSS variables, with support for light, dark, and system appearance.
- **Consistent customization.** Use props, slots, and `:ui` overrides locally,
  `app.config.ts` for shared defaults, or `STheme` for a subtree.
- **Adaptive interfaces.** Present supported controls as popovers, modals, or drawers
  according to the available screen space.
- **Application building blocks.** Dashboard and documentation layouts, copyable blocks,
  and starter templates.
- **Agent support.** Public Markdown documentation, an installable skill, and an optional
  local MCP server with component contracts and examples.

## Requirements

Use an existing Nuxt application with:

- Nuxt `^4.5.2`.
- Tailwind CSS `^4.3.0`.
- Node.js `^22.19.0 || ^24.11.0 || >=26.0.0`.

Nuxt supplies Vue. Selaras configures the Tailwind Vite plugin and installs
Nuxt Icon and Nuxt Color Mode automatically.

## Quick setup

### 1. Install

```bash
npm install @sewadah/selaras tailwindcss
```

Or use your preferred package manager:

```bash
pnpm add @sewadah/selaras tailwindcss
bun add @sewadah/selaras tailwindcss
```

Install the default icon collection locally so icons do not depend on runtime
requests to Iconify:

```bash
npm install -D @iconify-json/hugeicons
```

See [Icons](https://selarasui.my.id/overview/getting-started/icons) to use other collections.

### 2. Configure Nuxt

Register the module and your stylesheet in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  css: ['~/assets/css/main.css'],
})
```

### 3. Add the styles

Create `app/assets/css/main.css` with these imports in order:

```css
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

The generated `#selaras/tailwind.css` entry connects component classes and adaptive
breakpoints to your application's Tailwind theme.

### 4. Add the app provider

Wrap your application once in `SApp` in `app/app.vue`:

```vue
<template>
  <SApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </SApp>
</template>
```

`SApp` provides shared tooltip behavior and the renderers used by the programmatic
overlay composables. Toasts need an `SToast` component where you want them rendered;
see the [App guide](https://selarasui.my.id/components/layout/app) for details.

### 5. Use components

Create `app/pages/index.vue`, or add components to an existing page:

```vue
<script setup lang="ts">
const name = ref('')
</script>

<template>
  <main class="mx-auto max-w-md space-y-6 px-6 py-12">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold">
        Welcome to Selaras
      </h1>
      <SColorModeToggle />
    </div>

    <SFormField label="Your name">
      <SInput v-model="name" placeholder="Enter your name" />
    </SFormField>
    <p v-if="name">
      Hello, {{ name }}!
    </p>

    <SButton as="a" href="https://selarasui.my.id/components/elements/button">
      Explore components
    </SButton>
  </main>
</template>
```

Start your application:

```bash
npm run dev
```

No component imports are needed. See [Installation](https://selarasui.my.id/overview/getting-started/installation)
for additional setup options and [Nuxt configuration](https://selarasui.my.id/overview/getting-started/nuxt-configuration)
for module settings.

## Customization

Change design tokens in your stylesheet, after the imports:

```css
:root {
  --selaras-radius-base: 0.5rem;
}
```

Override a component's slots with `:ui`:

```vue
<SButton :ui="{ base: 'font-semibold' }">
  Save changes
</SButton>
```

Use [global configuration](https://selarasui.my.id/overview/theming/global-configuration)
to share styles and defaults, or [scoped themes](https://selarasui.my.id/overview/theming/scoped-themes)
to style part of an application. The [theming guides](https://selarasui.my.id/overview/theming/overview)
cover color roles, complete themes, and all customization layers.

## Documentation

- [Component usage](https://selarasui.my.id/overview/getting-started/component-usage)
- [Icons](https://selarasui.my.id/overview/getting-started/icons)
- [Messages and text](https://selarasui.my.id/overview/getting-started/messages)
- [Color modes](https://selarasui.my.id/overview/theming/color-modes)
- [Adaptive interfaces](https://selarasui.my.id/overview/getting-started/adaptive-interfaces)
- [Copyable blocks](https://selarasui.my.id/blocks/overview)
- [Starter templates](https://selarasui.my.id/templates)
- [Changelog](https://selarasui.my.id/changelog)

## Agent support

Install the Selaras skill from your application directory:

```bash
npx skills add sewadahapp/selaras --skill selaras
```

The optional `@sewadah/selaras-mcp` package provides a local stdio MCP server for
documentation search, component discovery, and Vue examples matching your installed
Selaras version. It needs no hosted service or API key.

See the [agent support guides](https://selarasui.my.id/overview/agent-support/overview)
for skill installation options, MCP configuration, and `llms.txt` exports.

## Contributing

See the [contribution guide](https://github.com/sewadahapp/selaras/blob/master/CONTRIBUTING.md)
for local development, validation, compatibility checks, and release commands.
Report bugs and suggest improvements through [GitHub issues](https://github.com/sewadahapp/selaras/issues).

## License

[MIT](https://github.com/sewadahapp/selaras/blob/master/LICENSE), copyright Sewadah.

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@sewadah/selaras/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://www.npmjs.com/package/@sewadah/selaras

[npm-downloads-src]: https://img.shields.io/npm/dm/@sewadah/selaras.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@sewadah/selaras

[license-src]: https://img.shields.io/npm/l/@sewadah/selaras.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/sewadahapp/selaras/blob/master/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
