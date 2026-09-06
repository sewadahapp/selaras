---
title: Prose
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

It's a separate, opt-in stylesheet - not bundled into `theme.css`,
which this module already injects into every consumer automatically -
so a project with no long-form content never pays for it:

```css
@import "tailwindcss";
@import "selaras/prose.css";
```

Every element selector inside it is wrapped in `:where(...)`, which
carries zero specificity - your own classes, or even another plain
element selector combined with one more thing, always win. No
`!important`, and nothing to override one rule at a time on a page
where the defaults don't fit.

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
plus a filename/language header bar, via
[Badge](/components/elements/badge)) and `SProseH1`-`SProseH6` (wraps
heading content in a self-anchor `<a href="#id">` when given an `id` -
this page's own headings work exactly this way).

Both are usable directly, the same as any other component:

```vue-html
<SProseH3 id="a-heading">A heading</SProseH3>
<SProsePre code="const x = 1" language="ts" />
```

## Props

### `SProsePre`

| Prop | Type | Default |
| --- | --- | --- |
| `code` | `string` | - |
| `language` | `string` | - |
| `filename` | `string` | - |
| `highlights` | `number[]` | - |
| `meta` | `string` | - |

`code` drives the copy button (nothing renders if it's unset) and is also
copied verbatim, regardless of what's in the default slot. The header bar
shows `filename` if set, else a `Badge` for `language` if that's set, else
nothing. `highlights` and `meta` are accepted but currently have no
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

This module registers `ProsePre`/`ProseH1`-`ProseH6` a *second* time
under their own bare, unprefixed names (`ProseH1`, not `SProseH1`).
That's necessary but **not sufficient on its own** - `@nuxtjs/mdc`
ships its own built-in default `ProseH1`/`ProsePre` (styling-only,
no copy button, no anchor link) under those exact same names, and its
own registration wins that naming collision regardless of this
module's own `priority` setting (confirmed by reading
`@nuxtjs/mdc`'s own source - `MDCRenderer` never does a global-name
component *lookup* for these tags at all, so registration order/
priority never even enters into it).

The reliable path is `<ContentRenderer>`'s own `components` prop -
`@nuxtjs/mdc` merges it *over* its built-in defaults (see
`MDCRenderer.vue`'s own `tags` computed), so this always wins:

```vue-html
<ContentRenderer
  :value="page"
  :components="{ h1: 'SProseH1', h2: 'SProseH2', h3: 'SProseH3', h4: 'SProseH4', h5: 'SProseH5', h6: 'SProseH6', pre: 'SProsePre' }"
  class="selaras-prose"
/>
```

This docs site's own pages are wired exactly this way
(`playground/pages/components/[...slug].vue`) - no adapter file
anywhere in `playground/components/content/`, and every heading/code
block on this very page renders through it.

Everything else, `selaras-prose` styles directly - no `components`
entry needed for it, since it's plain HTML either way.

### A known SSR caveat

Confirmed via a real production build (`nuxt build` + serving the
built output, not just dev mode): on the *very first* server-rendered
HTML for a page, any component `@nuxtjs/mdc` resolves dynamically -
headings and code blocks included, regardless of whether it's
resolving to this library's components, its own built-in defaults, or
anything else passed through `:components` - can render as a literal,
unresolved tag (`<SProsePre ...>` as text, not real markup) instead of
the actual element. This traces to `MDCRenderer`'s own `async setup()`
combined with Vue's `resolveComponent`, a known Vue SSR interaction
(dynamic component resolution needs Vue's current-instance context,
which an `await` inside an async `setup()` doesn't reliably preserve
server-side) - not something introduced by this wiring, and not
something this module can fix from the outside. It self-corrects
immediately on client hydration (confirmed: every example on this
page works correctly once loaded in a real browser) - the practical
impact is limited to a no-JS/crawler-only view of the very first
response, not anything a real visitor sees.

## Custom `:ui`

`SProsePre` and `SProseH1`-`SProseH6` all resolve their slots from the
same theme file - overriding `ui` on any one of them reads from, and
merges over, this one shared source. To see exactly what you'd be
overriding - the current default classes for every slot and variant -
here's `Prose`'s own theme file:

::theme-source{name="prose"}
::
