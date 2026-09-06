---
title: ContentSurround
description: Previous/next page navigation at the bottom of a content page.
order: 50
---

## Usage

```vue-html
<SContentSurround
  :prev="{ title: 'Installation', path: '/overview/installation' }"
  :next="{ title: 'Theming', path: '/overview/theming' }"
/>
```

::component-example{name="content-surround-basic"}
::

Pass only `prev`, only `next`, or neither - `SContentSurround` renders
nothing at all when both are omitted (the first and last page in a
collection have no counterpart on one side). This docs site sources both
from a content collection's own surrounding-page query (e.g.
`queryCollectionItemSurroundings` from `@nuxt/content`), not typed in by
hand - see this page's own "Previous"/"Next" links at the bottom for a live
example.

## Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `ContentSurround`'s own theme file:

::theme-source{name="content-surround"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `prev` | `{ title: string, path: string }` | - |
| `next` | `{ title: string, path: string }` | - |
| `ui` | `Partial<Record<'root' \| 'link' \| 'label' \| 'icon' \| 'title', string \| object>>` | - |
