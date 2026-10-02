---
title: Icons
description: Configure internal icons globally and provide icons locally.
order: 50
---

Selaras uses [Nuxt Icon](https://nuxt.com/modules/icon) under the hood and installs its module automatically. `SIcon` wraps its `Icon` component, so Nuxt Icon configuration, providers, aliases, and custom collections also apply to Selaras icons. Icon names use `collection:name`; internal component icons default to Hugeicons.

## Local icons

```vue-html
<SButton icon="hugeicons:search-01">Search</SButton>
<SButton icon="hugeicons:cancel-01" square aria-label="Close" />
<SIcon name="hugeicons:calendar-01" class="size-6" aria-hidden="true" />
```

Components expose their supported `icon`, `trailingIcon`, or icon slots in their reference pages. Explicit icon names do not change when you override the internal registry. Give icon-only actions an accessible label; decorative icons can be hidden from assistive technology.

## Global internal icons

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    icons: {
      close: 'hugeicons:cancel-01',
      loading: 'hugeicons:loading-02',
    },
  },
})
```

Each key describes a purpose rather than a component. Overriding `close` changes components that read that registry key. Unspecified keys retain their defaults. See [useIcons](/utilities/composables/use-icons) for the complete registry and how custom components can reuse it.

## Configuration and loading

Configure Nuxt Icon through the top-level `icon` key in `nuxt.config.ts`, alongside `selaras`. You do not need to register `@nuxt/icon` again.

Nuxt Icon can fetch icons from the [Iconify](https://iconify.design/) API when they are unavailable locally. This is convenient for trying collections, but runtime requests can delay an icon's appearance. Install the collections you use locally:

```bash
bun add -d @iconify-json/hugeicons @iconify-json/lucide
```

`devDependencies` is appropriate for the normal bundled build: icon data is consumed during building. Build environments must install dev dependencies. If you explicitly externalize icon JSON for runtime resolution, keep the packages available as production dependencies instead.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  icon: {
    serverBundle: {
      collections: ['hugeicons', 'lucide'],
    },
    clientBundle: {
      scan: true,
      icons: ['lucide:search', 'lucide:x'],
    },
  },
})
```

Installing a collection avoids relying on the public API; it does not alone guarantee immediate rendering. The client bundle makes known icons available without an icon request. Scanning finds literal names; add dynamically selected names explicitly to `clientBundle.icons`. This is especially useful for static sites without a Nuxt server endpoint.

## Runtime customization

Nuxt Icon's runtime settings belong under `icon` in `app.config.ts`. Selaras's internal-purpose registry remains under `selaras.icons`:

```ts [app.config.ts]
export default defineAppConfig({
  icon: {
    mode: 'svg',
    aliases: {
      'app-search': 'lucide:search',
    },
  },
  selaras: {
    icons: {
      search: 'app-search',
    },
  },
})
```

Nuxt Icon also supports global SVG customization through `icon.customize`. Selaras components set their own icon sizing classes, so prefer their `ui` slots for sizing individual component parts. See the [Nuxt Icon configuration reference](https://github.com/nuxt/icon#icon-customization) for the full upstream API.

## Custom SVG collections

Place SVG files in `app/assets/icons`, then register a collection:

```ts [nuxt.config.ts]
import { createResolver } from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  icon: {
    customCollections: [
      { prefix: 'app', dir: resolve('./app/assets/icons') },
    ],
    clientBundle: {
      includeCustomCollections: true,
    },
  },
})
```

A file named `brand.svg` becomes `app:brand`. Including custom collections in the client bundle also makes them available on static hosting.

```vue-html
<SIcon name="app:brand" class="size-6" />
<SButton icon="app:brand">Workspace</SButton>
```

## Vue components as icons

Nuxt Icon can resolve a globally registered Vue component by name. For example, create `app/components/global/BrandIcon.vue`:

```vue
<template>
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12L12 4L20 12L12 20Z" fill="currentColor" />
  </svg>
</template>
```

Then use that component name through Selaras:

```vue-html
<SIcon name="BrandIcon" class="size-6" />
<SButton icon="BrandIcon">Workspace</SButton>
```

The component must be globally registered; an ordinary local import is insufficient for name-based resolution. Nuxt Icon renders the component directly and ignores its CSS/SVG mode setting for that icon. See [Nuxt Icon's component support](https://github.com/nuxt/icon#vue-component).
