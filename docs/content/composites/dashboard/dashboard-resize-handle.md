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

Placed between [DashboardSidebar](/composites/dashboard/dashboard-sidebar) and
[DashboardPanel](/composites/dashboard/dashboard-panel), both direct children of
[DashboardGroup](/composites/dashboard/dashboard-group) - a thin wrapper around
[SplitterResizeHandle](/components/layout/splitter) (`direction="horizontal"`
fixed, since a dashboard shell only ever splits left/right). Its transparent
8px hit area overlaps the boundary without taking up layout space or assuming
either panel’s background. A thin border is visible by default, with an accent
color on hover, while dragging, or on keyboard focus. It also adds the mobile check: renders nothing below `mobileBreakpoint` - there's
nothing to drag once the sidebar isn't part of a split layout at all, see
[DashboardGroup](/composites/dashboard/dashboard-group)'s own "Mobile" section.

## Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `DashboardResizeHandle`'s own theme file:

::theme-source{name="dashboard-resize-handle"}
::

The `root` slot controls the hit area; `line` controls the visible divider. For
example, hide the divider at rest and reveal it during interaction:

```vue-html
<SDashboardResizeHandle :ui="{ line: 'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[state=drag]:opacity-100' }" />
```

DashboardPanel remains transparent, so your page or panel background continues
to show through. The standalone SplitterResizeHandle retains its own defaults.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<SplitterResizeHandleSlot, string \| object>>` | - |
