---
title: Prose
components: [SProseH1, SProseH2, SProseH3, SProseH4, SProseH5, SProseH6, SProsePre]
description: A pipeline-agnostic typography class for long-form content, plus two enhanced components for renderers that support them.
order: 70
---

## Usage

Wrap any rendered HTML - markdown output, a CMS's rich-text body,
hand-written content, whatever produced it - in the `selaras-prose`
class for consistent long-form typography, no components or
`@nuxt/content` required:

::component-example{name="prose-standalone"}
::

```vue-html
<div class="selaras-prose">
  <h3>A heading</h3>
  <p>Some <strong>bold</strong> text.</p>
</div>
```

It's a separate, opt-in stylesheet - not bundled into `theme.css` (which
you already import yourself, see [Installation](/overview/getting-started/installation))
- so a project with no long-form content never pays for it:

```css
@import "tailwindcss";
@import "@sewadah/selaras/prose.css";
```

Every element selector inside it is wrapped in `:where(...)`, which
carries zero specificity - your own classes, or even another plain
element selector combined with one more thing, always win. No
`!important`, and nothing to override one rule at a time on a page
where the defaults don't fit.

Tables fill the content width by default. When columns need more space,
the table scrolls horizontally without widening the page. Headers and
body cells keep their columns aligned.

### Fonts

`selaras-prose` doesn't hardcode a font stack - it follows whatever
your project already uses, through three CSS variables you can
override independently of your site-wide fonts if prose specifically
should look different:

```css
:root {
  --selaras-prose-font-body: inherit;
  --selaras-prose-font-heading: inherit;
  --selaras-prose-font-mono: var(--font-mono, ui-monospace, monospace);
}
```

## The two enhanced components

Two elements have real interactive behavior a CSS class can't
replicate, so they're still real components: `SProsePre` (a
copy-to-clipboard button, via [Button](/components/elements/button),
plus a plain filename/language header with a file-type
[Icon](/components/elements/icon)) and `SProseH1`-`SProseH6` (wraps
heading content in a self-anchor `<a href="#id">` when given an `id` -
this page's own headings work exactly this way).

Both are usable directly, the same as any other component:

```vue-html
<SProseH3 id="a-heading">A heading</SProseH3>
<SProsePre code="const x = 1" language="ts"><code>const x = 1</code></SProsePre>
```

## Props

### `SProsePre`

| Prop | Type | Default |
| --- | --- | --- |
| `code` | `string` | - |
| `language` | `string` | - |
| `filename` | `string` | - |
| `icon` | `string` | resolved from `filename`/`language` |
| `showHeader` | `boolean` | `true` |
| `highlights` | `number[]` | - |
| `meta` | `string` | - |

`code` supplies the clipboard text; the default slot supplies the visible code.
The copy button is hidden when `code` is empty. A Markdown renderer supplies
both the highlighted slot content and the original source automatically. The header bar
shows `filename` if set, else a plain label for `language` if that's set, else
nothing; set `showHeader` to `false` to hide the whole metadata/copy row.
CodeGroup does this automatically and moves the filename and file-type icon
into its tab. Beside either, a file-type icon is resolved from the filename's
extension first, then the fence language - for example `vue` renders the
`vscode-icons:file-type-vue` glyph - with no icon for an unrecognized
type. Pass `icon` to override that resolution. Long filenames truncate in
the header, with the full path available on hover. Copying changes the button
to a success-colored check; its labels come from `copyCode` and `codeCopied`
in the [message registry](/utilities/composables/use-messages).

Customize the header through the `prose` theme's `preHeader`, `preLabel`,
`preIcon`, `preFilename`, `preLanguage`, and `preCopyButton` slots in
`app.config.selaras.ui` or `STheme`. `highlights` and `meta` are accepted but currently have no
effect - there's no line-highlighting logic wired up yet anywhere in the
component, so passing either does nothing visible today. They're reserved
for that feature landing later; don't wire them up expecting output.

### `SProseH1`-`SProseH6`

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |

### Why only these two aren't CSS

Everything else a markdown renderer produces - links, images,
paragraphs, lists, tables, emphasis - is pure styling with no behavior
of its own, so `selaras-prose` covers it entirely. A copy button needs
real JavaScript; an anchor-link heading needs a real `<a>` element in
the actual DOM a renderer produces, which only a *component-based*
renderer (one that resolves each markdown element to a real component
instance with props, `id` included - `@nuxt/content`/`@nuxtjs/mdc` is
the common case) can do at all. A raw-HTML-string pipeline (most non-
Nuxt-Content cases: a CMS, hand-rolled markdown-it, a headless CMS's
rendered body) has no hook to swap in a component per element -
`selaras-prose` still styles whatever plain `<pre>`/`<h1 id="...">`
that pipeline emits, just without the copy button or the clickable
anchor.

## Wiring into `@nuxt/content`

Pass imported component objects to `ContentRenderer`. This keeps heading anchors
and code-copy controls available during server rendering and hydration. Bare
component names can collide with the renderer's built-in prose components.

For example, create a wrapper that accepts a document returned by your
`queryCollection` call:

```vue
<script setup lang="ts">
import ProseH1 from '@sewadah/selaras/components/ProseH1.vue'
import ProseH2 from '@sewadah/selaras/components/ProseH2.vue'
import ProseH3 from '@sewadah/selaras/components/ProseH3.vue'
import ProseH4 from '@sewadah/selaras/components/ProseH4.vue'
import ProseH5 from '@sewadah/selaras/components/ProseH5.vue'
import ProseH6 from '@sewadah/selaras/components/ProseH6.vue'
import ProsePre from '@sewadah/selaras/components/ProsePre.vue'

defineProps<{ document: Record<string, unknown> }>()
const proseComponents = {
  h1: ProseH1,
  h2: ProseH2,
  h3: ProseH3,
  h4: ProseH4,
  h5: ProseH5,
  h6: ProseH6,
  pre: ProsePre,
}
</script>

<template>
  <ContentRenderer :value="document" :components="proseComponents" class="selaras-prose" />
</template>
```

Import the prose stylesheet in your CSS entry as shown above. The docs layer
already supplies this mapping and stylesheet; a project extending
`@sewadah/selaras-docs` only needs custom wiring when replacing its renderer.
The documentation website and packed docs-layer consumers use imported
components in the same way. Plain elements continue to use the
`selaras-prose` styles without a component mapping.

## Custom `:ui`

`SProsePre` and `SProseH1`-`SProseH6` share the `prose` theme. Configure
`app.config.selaras.ui.prose`, or scope `STheme` with `:ui="{ prose: { slots: { pre: 'font-mono' } } }"`.
These components do not expose an instance `ui` prop. To see exactly what you'd be
overriding - the current default classes for every slot and variant -
here's `Prose`'s own theme file:

::theme-source{name="prose"}
::
