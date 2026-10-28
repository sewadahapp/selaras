---
title: DashboardGroup
description: The root of a resizable, collapsible dashboard shell - sidebar, resize handle, and main content panel.
order: 10
---

## Usage

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardGroup>
  <SDashboardSidebar>
    <template #header>Acme Inc</template>
    <nav>...</nav>
  </SDashboardSidebar>
  <SDashboardResizeHandle />
  <SDashboardPanel>
    <SDashboardNavbar title="Overview" />
    <main>...</main>
  </SDashboardPanel>
</SDashboardGroup>
```

`SDashboardGroup` coordinates the whole shell - place a
[DashboardSidebar](/composites/dashboard/dashboard-sidebar), a
[DashboardResizeHandle](/composites/dashboard/dashboard-resize-handle), and a
[DashboardPanel](/composites/dashboard/dashboard-panel) inside it directly (not
wrapped in anything else - it needs to see all three as its own children).
It's a themed wrapper around [Splitter](/components/layout/splitter) -
`SDashboardSidebar`/`SDashboardPanel` wrap `SSplitterPanel` the same way, so
the resize/collapse/remember-the-width behavior all comes from that same
general-purpose primitive, not logic specific to a dashboard shell.

### Persistence

By default, the sidebar's width and collapsed state are stored in a
session cookie keyed by `autoSaveId`. Pass a `storage` object with
`getItem` and `setItem` methods to use another backend, such as
`localStorage`; omitting it keeps the cookie-backed default. Give pages
that should remember separate layouts distinct `autoSaveId` values.

The saved layout is restored after mounting, when splitter panels register
and the container can be measured. It is not read during server rendering,
so a returning visitor first sees the configured default width, then the
saved layout.

### Mobile

Below `mobileBreakpoint` (768px by default), there's no resizable panel at
all - `SDashboardSidebar` switches to rendering its content inside a
[Drawer](/components/overlays/drawer) overlay instead, and
`SDashboardResizeHandle` renders nothing (there's nothing to drag once the
sidebar isn't part of a split layout). Try resizing this page's own browser
window narrower than a phone to see it switch live.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `DashboardGroup`'s own theme file:

::theme-source{name="dashboard-group"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `autoSaveId` | `string` | `'selaras-dashboard'` |
| `mobileBreakpoint` | `number` | `768` |
| `storage` | `{ getItem(name): string \| null; setItem(name, value): void }` | Cookie-backed storage |
| `ui` | `Partial<Record<'root', string \| object>>` | - |
