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
[DashboardSidebar](/blocks/dashboard/dashboard-sidebar), a
[DashboardResizeHandle](/blocks/dashboard/dashboard-resize-handle), and a
[DashboardPanel](/blocks/dashboard/dashboard-panel) inside it directly (not
wrapped in anything else - it needs to see all three as its own children).
It's a themed wrapper around [Splitter](/components/layout/splitter) -
`SDashboardSidebar`/`SDashboardPanel` wrap `SSplitterPanel` the same way, so
the resize/collapse/remember-the-width behavior all comes from that same
general-purpose primitive, not logic specific to a dashboard shell.

### Persistence

The sidebar's width (and whether it's collapsed) is remembered across
reloads via a cookie, keyed by `autoSaveId` - give pages that shouldn't
share one remembered layout their own distinct id. A cookie rather than
Reka's own default `localStorage`-backed storage - same-origin
server-readable, portable across a full page reload rather than just
client-side navigation, and works with privacy tooling that blocks
`localStorage` but allows first-party cookies.

That said, the remembered width still applies after mounting, not
before - confirmed by reading Reka UI's own source: its layout-restore
call runs inside a `watch()` callback triggered by a panel registering
itself, which Vue's SSR render pass never flushes, so it doesn't run
server-side regardless of what the storage backend returns. A returning
visitor's very first server-rendered response shows the default width,
correcting to the remembered one shortly after - the same class of
pre-existing, upstream-only limitation as [Prose](/components/typography/prose)'s
own documented SSR caveat, not something fixable from here.

### Mobile

Below `mobileBreakpoint` (768px by default), there's no resizable panel at
all - `SDashboardSidebar` switches to rendering its content inside a
[Drawer](/components/overlays/drawer) overlay instead, and
`SDashboardResizeHandle` renders nothing (there's nothing to drag once the
sidebar isn't part of a split layout). Try resizing this page's own browser
window narrower than a phone to see it switch live.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `autoSaveId` | `string` | `'selaras-dashboard'` |
| `mobileBreakpoint` | `number` | `768` |
| `ui` | `Partial<Record<'root', string \| object>>` | - |
