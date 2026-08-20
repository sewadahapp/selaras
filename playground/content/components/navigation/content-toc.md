---
title: ContentToc
description: A table of contents with scroll-spy active-heading highlighting.
order: 43
---

## Usage

::component-example{name="content-toc-basic"}
::

```vue-html
<SContentToc :links="page.body.toc.links" />
```

`links` matches `@nuxt/content`'s `page.body.toc.links` shape directly
(`{ id, text, depth, children? }[]`) - pass it straight through, no adapter
needed. As with [ContentNavigation](/components/navigation/content-navigation), there's
no hard dependency on `@nuxt/content` - build the array yourself if you don't
use it.

The currently-visible heading is tracked via `IntersectionObserver` (set up
once, even through nested levels) and highlighted with a themed left border -
try scrolling this very page and watching the right-hand rail.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `links` | `{ id: string, text: string, depth: number, children?: [...] }[]` | - (required) |
| `title` | `string` | `'On this page'` |
| `ui` | `Partial<Record<ContentTocSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `title` | Custom title content, overrides `title` prop |
