---
title: DashboardNavbar
description: A top bar for a DashboardPanel's own main content area.
order: 50
---

## Usage

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardNavbar title="Overview">
  <template #leading>
    <SDashboardSidebarToggle />
  </template>
  <SButton size="sm" icon="hugeicons:plus-sign">New</SButton>
</SDashboardNavbar>
```

Distinct from the site-wide [Header](/components/layout/header) - this one
lives *inside* a [DashboardPanel](/blocks/dashboard/dashboard-panel), scoped
to the main content area only.

Nothing renders in the leading slot by default - matching every other piece
of this family (a [DashboardResizeHandle](/blocks/dashboard/dashboard-resize-handle)
isn't auto-inserted between the sidebar and panel either), a sidebar-toggle
button is something you compose in explicitly rather than something
`SDashboardNavbar` assumes you want. See
[DashboardSidebarToggle](/blocks/dashboard/dashboard-sidebar-toggle) for
what it does and how to customize it - it collapses/expands
[DashboardSidebar](/blocks/dashboard/dashboard-sidebar) (or opens/closes it
on mobile, see [DashboardGroup](/blocks/dashboard/dashboard-group)'s own
"Mobile" section), and renders nothing itself until there's an actual
sidebar in the same [DashboardGroup](/blocks/dashboard/dashboard-group) to
control.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `ui` | `Partial<Record<DashboardNavbarSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `leading` | Empty by default - a sidebar-toggle button, typically |
| `title` | Custom title content, overrides `title` prop |
| default | Trailing content - actions, a search trigger, whatever the page needs |
