# Selaras Docs

A zero-config Nuxt documentation layer for Selaras.

Install Nuxt and the layer as development dependencies:

```sh
bun add -d nuxt @sewadah/selaras-docs
```

Add the layer to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@sewadah/selaras-docs'],
})
```

Then create `content/index.md`:

```md
---
title: My documentation
description: Documentation for my project.
---

# My documentation

Start writing.
```

The layer supplies Nuxt Content, Tailwind CSS v4, Selaras, an accessible
responsive documentation shell, local navigation search, and dark mode. It
uses neutral system font stacks by default. You do not
need an app root, Content config, or stylesheet for the default setup.

`nuxt` remains a peer because the documentation site is a Nuxt application;
the layer is normally a development dependency, just like Nuxt itself.

## Customization

Use `app.config.ts` for site identity and the default shell:

```ts
export default defineAppConfig({
  selarasDocs: {
    site: {
      name: 'My project',
      description: 'Documentation for my project.',
      titleTemplate: '%s · My project',
      url: 'https://example.com',
      // Files in public/. Use one path, or separate light and dark images.
      // `tint: true` colors a monochrome SVG with the active primary theme color.
      logo: { light: '/logo.svg', dark: '/logo-dark.svg', tint: true },
      favicon: '/favicon.svg',
    },
    repository: {
      url: 'https://github.com/example/project',
      editLinks: true,
    },
    header: {
      search: true,
      colorMode: true,
      fluid: false,
      links: [
        { label: 'Guide', to: '/guide/getting-started' },
        {
          label: 'Resources',
          children: [
            { label: 'API reference', to: '/api' },
            { label: 'GitHub', to: 'https://github.com/example/project', target: '_blank', rel: 'noreferrer' },
          ],
        },
      ],
    },
    main: { fluid: false, padded: true },
    sidebar: {
      enabled: true,
      collapsed: false,
      exclude: ['/internal/draft'],
    },
    toc: { enabled: true, title: 'On this page' },
    footer: { text: '© 2026 My project', fluid: false },
  },
})
```

Folder navigation can be configured with a `.navigation.yml` file alongside
the Markdown pages in that folder:

```yaml
title: Getting started
icon: hugeicons:rocket
order: 1
collapse: false
navBadges:
  - New
```

Use `navigation: false` in a page's frontmatter to omit it from navigation, or
set `navigation` to an object to override its navigation `title`, `icon`,
`order`, and `navBadges`. Page frontmatter can also set `toc: false`,
`aside: false`, `editLink: false`, or `prevNext: false` to hide those parts of
the page shell. The sidebar also accepts an app-wide `collapsed` default; a
folder's `collapse` value takes precedence. `main.fluid` expands the
content width, `main.padded: false` removes its outer inset, and `header.fluid`
and `footer.fluid` allow those regions to span the viewport.

Create an application component with the same name as a layer component, such
as `components/DocsHeader.vue`, to replace that part of the shell. Smaller
pieces can be replaced on their own:

| Component | Controls | Default |
| --- | --- | --- |
| `DocsHeaderBrand` | The header's home link content | `site.logo` and the site name |
| `DocsFooterBrand` | The start of the footer | `footer.text` |
| `DocsLogo` | The logo image, used by `DocsHeaderBrand` | `site.logo`, switching light/dark; size it with `--selaras-docs-logo-height` |

For example, a `components/DocsFooterBrand.vue` containing `<DocsLogo />` adds
the logo to the footer while leaving the header as configured.

For a host that owns Tailwind compilation or uses a class prefix, set
`selarasDocs: { css: false }` in `nuxt.config.ts` and import Selaras and the
docs stylesheet from the host CSS entry.

## Viewport previews

`DocsViewportPreview` embeds an example page in a real iframe viewport. Device
buttons change its width, so media queries and Selaras' `adaptive` controls
respond without resizing the documentation browser. It is available in Vue
components and Markdown:

```md
::docs-viewport-preview{src="/examples/team-picker" title="Team picker" :height="540"}
::
```

Create the example route in your application's `pages/` directory (or
`app/pages/` with Nuxt's default directory structure). Use `layout: false` to
render only the example:

```vue
<script setup lang="ts">
definePageMeta({ layout: false })
const team = ref<string>()
</script>

<template>
  <main class="p-6">
    <SSelect v-model="team" :items="['Design', 'Engineering']" adaptive />
  </main>
</template>
```

Root-relative `src` paths automatically include the application's `baseURL`.
When generating a static site, add example routes to `nitro.prerender.routes`;
iframe URLs are not ordinary navigation links for the prerender crawler.

| Prop / model | Default | Purpose |
| --- | --- | --- |
| `src` | Required | URL of the example page. |
| `title` | `Responsive example` | Accessible preview label and iframe title. |
| `devices` | Desktop 1024px, tablet 768px, mobile 390px | Entries with `value`, `label`, `width`, and optional `icon`. Widths are CSS pixels. |
| `defaultDevice` | `mobile` | Initial selection; an unknown value falls back to the first device. |
| `v-model:device` | Uncontrolled | Read or control the selected device value. |
| `height` | `540` | Iframe height in CSS pixels. |
| `reloadKey` | Unset | Change this to reload the embedded page, for example after a theme change. |

The frame scrolls horizontally when the chosen viewport is wider than its
container. Changing devices preserves the embedded page's state; changing
`reloadKey` remounts it. The example page controls its own theme and providers.
An empty `devices` array uses the default devices.

`toolbar-start` and `toolbar-end` accept additional toolbar content and receive
`{ device }`. The `toolbar` slot replaces the entire toolbar and receives
`{ device, devices, selectDevice }`. Custom device entries can use the exported
`SelarasDocsViewportDevice` type from `@sewadah/selaras-docs`.
