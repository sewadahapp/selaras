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
    },
    repository: {
      url: 'https://github.com/example/project',
      editLinks: true,
    },
    header: {
      links: [
        { label: 'Guide', to: '/guide/getting-started' },
      ],
    },
  },
})
```

Create an application component with the same name as a layer component, such
as `components/DocsHeader.vue`, to replace that part of the shell. For a host
that owns Tailwind compilation or uses a class prefix, set
`selarasDocs: { css: false }` in `nuxt.config.ts` and import Selaras and the
docs stylesheet from the host CSS entry.
