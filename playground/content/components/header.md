---
title: Header
description: A sticky top bar with left/right slots - logo on one side, actions like ColorModeToggle on the other.
order: 26
---

## Usage

::component-example{name="header-basic"}
::

```vue-html
<SHeader>
  <span class="font-semibold">My App</span>
  <template #right>
    <SColorModeToggle />
  </template>
</SHeader>
```

`SHeader` is `sticky top-0` by default, meant to sit above everything else on
the page - this docs site's own top bar is exactly this component. If you
also use [PageAside](/components/page-aside) below it (for nav or TOC), give
it a matching offset via its `ui` prop so it doesn't sit under the header:

```vue-html
<SPageAside :ui="{ root: 'top-16 h-[calc(100vh-4rem)]' }">
```

(`top-16`/`h-4rem` match `SHeader`'s default `h-16` - adjust both together if
you override the header's height.)

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<HeaderSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | Left-aligned content (e.g. a logo) |
| `right` | Right-aligned content (e.g. actions) |
