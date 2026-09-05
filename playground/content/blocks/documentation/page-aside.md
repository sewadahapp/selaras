---
title: PageAside
description: A sticky, scrollable side rail used for both a page's nav and table-of-contents columns.
order: 20
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
layout does for both the left nav and right [ContentToc](/blocks/documentation/content-toc)
rail. The example above overrides `root` via the `ui` prop to a fixed height
so it fits inline in these docs.

It's also hidden below the `lg` breakpoint by default - a fixed-width rail
alongside the main content column has nowhere to go on a narrow viewport.
This docs site's own right-hand ToC rail simply disappears there; its left
nav instead surfaces through a Drawer triggered from the header, since
unlike the ToC it still needs to be reachable on mobile.

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
