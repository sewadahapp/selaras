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
  <template #header="{ isCollapsed }">
    {{ isCollapsed ? 'A' : 'Acme Inc' }}
  </template>
  <template #default="{ isCollapsed }">
    <nav>
      <a href="/">
        <Icon name="..." />
        <span v-if="!isCollapsed">Dashboard</span>
      </a>
    </nav>
  </template>
  <template #footer>...</template>
</SDashboardSidebar>
```

Must be a direct child of [DashboardGroup](/composites/dashboard/dashboard-group) -
see its own page for the resize/collapse/persistence/mobile-drawer behavior,
all shared across the whole shell rather than owned by the sidebar alone.
`header`/default/`footer` mirror [PageAside](/composites/documentation/page-aside)'s
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

## Control collapse from outside

Bind `v-model:collapsed` to set the desktop rail state and receive updates from
resizing or `DashboardSidebarToggle`. An explicit value takes precedence over
saved collapse state. Omit it to keep the existing uncontrolled sizing and persistence.

::component-example{name="dashboard-controlled"}
::

```vue-html
<SDashboardSidebar v-model:collapsed="collapsed" />
```

A component ref also exposes `collapse()`, `expand()`, `toggle()`, and
`isCollapsed`. `collapse()` and `expand()` operate on the desktop panel and restore
its previous expanded width. They do nothing on mobile or when `collapsible` is
`false`. `toggle()` retains the normal mobile drawer behavior. The `collapsed`
model does not control the mobile drawer; its value is applied when returning to desktop.
Use the model to capture the user's current choice before temporarily collapsing
for a page, then restore that choice when leaving.

## Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `DashboardSidebar`'s own theme file:

::theme-source{name="dashboard-sidebar"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `collapsed` | `boolean` | - |
| `defaultSize` | `number` | `260` |
| `minSize` | `number` | `200` |
| `maxSize` | `number` | `400` |
| `collapsedSize` | `number` | `64` |
| `collapsible` | `boolean` | `true` |
| `sizeUnit` | `'px' \| '%'` | `'px'` |
| `ui` | `Partial<Record<DashboardSidebarSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `header` | `{ isCollapsed }` | Fixed content above the scrollable body (a logo, a brand name) |
| default | `{ isCollapsed }` | Scrollable body content (typically a nav tree) |
| `footer` | `{ isCollapsed }` | Fixed content below the scrollable body (a user menu) |

`isCollapsed` is always `false` on mobile, where there's no in-between state -
just the drawer open or closed. Use it to swap a header's logo to a narrower
mark, or hide a nav item's label text, once the sidebar collapses to its icon
rail - the live example above does both, along with hiding the footer's name
next to the avatar.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:collapsed` | `boolean` | Desktop collapse state changed through resizing, the toggle, or a component method. |
