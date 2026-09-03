---
title: DashboardPanel
description: The main-content counterpart to DashboardSidebar - fills whatever width the sidebar doesn't take.
order: 30
---

## Usage

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardPanel>
  <SDashboardNavbar title="Overview" />
  <main>...</main>
</SDashboardPanel>
```

Must be a direct child of [DashboardGroup](/blocks/dashboard/dashboard-group),
alongside [DashboardSidebar](/blocks/dashboard/dashboard-sidebar) - a plain
(non-collapsible) [SplitterPanel](/components/layout/splitter) on desktop,
since Reka's own panel-group layout math needs every direct child to be a
real panel, so this exists even though it isn't independently resizable or
collapsible itself, just fills whatever space the sidebar doesn't take.
Typically
contains a [DashboardNavbar](/blocks/dashboard/dashboard-navbar) plus a
scrollable `<main>` for the actual page content - neither is required
though, `SDashboardPanel` has no opinion on what's inside it.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `minSize` | `number` | `30` |
| `ui` | `Partial<Record<'root', string \| object>>` | - |
