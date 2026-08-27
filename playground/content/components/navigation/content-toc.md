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

The active heading(s) are tracked by comparing scroll position against
each heading's own content range (from its position down to the next
heading's, or to the end of the document for the last one) - not a single
fixed trigger point, which is why more than one can be active at once
(short adjacent sections both overlapping the trigger band) and why the
very last section always eventually lights up regardless of how little
content it has, even once you've scrolled as far as the page allows.

Active heading(s) are shown on a zigzag rail to the left of the list - a
continuous "wire" connecting every heading, bending inward at each depth
change, with the active stretch(es) lit up in the primary color. Try
scrolling this very page and watching the right-hand rail. The rail is
drawn as an SVG path applied as a CSS mask (not painted directly), so the
same curve shape works for both the always-visible faint track and the
primary-colored active overlay - no JS animation library involved, just a
CSS `transition` on the overlay's position/size, the same "CSS-only
animation" constraint every other component in this library follows.

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
