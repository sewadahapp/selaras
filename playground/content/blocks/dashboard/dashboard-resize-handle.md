---
title: DashboardResizeHandle
description: The draggable divider between DashboardSidebar and DashboardPanel.
order: 40
---

## Usage

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardGroup>
  <SDashboardSidebar>...</SDashboardSidebar>
  <SDashboardResizeHandle />
  <SDashboardPanel>...</SDashboardPanel>
</SDashboardGroup>
```

Placed between [DashboardSidebar](/blocks/dashboard/dashboard-sidebar) and
[DashboardPanel](/blocks/dashboard/dashboard-panel), both direct children of
[DashboardGroup](/blocks/dashboard/dashboard-group) - a thin wrapper around
[SplitterResizeHandle](/components/layout/splitter) (`direction="horizontal"`
fixed, since a dashboard shell only ever splits left/right) that just adds
the mobile check: renders nothing below `mobileBreakpoint` - there's
nothing to drag once the sidebar isn't part of a split layout at all, see
[DashboardGroup](/blocks/dashboard/dashboard-group)'s own "Mobile" section.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<SplitterResizeHandleSlot, string \| object>>` | - |
