---
title: PageAside
description: A sticky, scrollable side rail used for both a page's nav and table-of-contents columns.
order: 61
---

## Usage

::component-example{name="page-aside-basic"}
::

```vue-html
<SPageAside>
  <template #header>
    <strong>Header</strong>
  </template>
  <SContentNavigation :navigation="navigation" />
</SPageAside>
```

By default `SPageAside` is `sticky` and fills the viewport height (`h-screen`) -
meant to sit directly inside a page-level flex row, like this docs site's own
layout does for both the left nav and right [ContentToc](/components/navigation/content-toc)
rail. The example above overrides `root` via the `ui` prop to a fixed height
so it fits inline in these docs.

Scrolling is handled by a themed [ScrollArea](/components/layout/scroll-area)
internally, not a plain `overflow-y-auto` div - so scrollbar styling stays
consistent with the rest of the library.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<PageAsideSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `header` | Fixed content above the scrollable body |
| default | Scrollable body content |
