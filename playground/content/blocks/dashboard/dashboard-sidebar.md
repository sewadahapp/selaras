---
title: DashboardSidebar
description: A resizable, collapsible sidebar that becomes a drawer on small screens.
order: 20
---

## Usage

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardSidebar :default-size="260" :min-size="200" :max-size="400">
  <template #header>Acme Inc</template>
  <nav>...</nav>
  <template #footer>...</template>
</SDashboardSidebar>
```

Must be a direct child of [DashboardGroup](/blocks/dashboard/dashboard-group) -
see its own page for the resize/collapse/persistence/mobile-drawer behavior,
all shared across the whole shell rather than owned by the sidebar alone.
`header`/default/`footer` mirror [PageAside](/blocks/documentation/page-aside)'s
own slot shape - default content scrolls (via
[ScrollArea](/components/layout/scroll-area)) independently of the fixed
header/footer.

On desktop, a themed [SplitterPanel](/components/layout/splitter)
(collapsible, `minSize`/`maxSize`/`defaultSize` passed straight through);
below `mobileBreakpoint`, the same content renders inside a
[Drawer](/components/overlays/drawer) instead. Sizes are pixels by default
(`sizeUnit="px"`) rather than `SplitterPanel`'s own percentage default - a
sidebar's width reads more naturally in pixels than as a fraction of
however wide the page happens to be.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `defaultSize` | `number` | `260` |
| `minSize` | `number` | `200` |
| `maxSize` | `number` | `400` |
| `collapsedSize` | `number` | `0` |
| `collapsible` | `boolean` | `true` |
| `sizeUnit` | `'px' \| '%'` | `'px'` |
| `ui` | `Partial<Record<DashboardSidebarSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `header` | Fixed content above the scrollable body (a logo, a brand name) |
| default | Scrollable body content (typically a nav tree) |
| `footer` | Fixed content below the scrollable body (a user menu) |
