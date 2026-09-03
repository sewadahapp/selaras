---
title: DashboardNavbar
description: A top bar for a DashboardPanel's own main content area, with a built-in sidebar-toggle button.
order: 50
---

## Usage

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardNavbar title="Overview">
  <SButton size="sm" icon="hugeicons:plus-sign">New</SButton>
</SDashboardNavbar>
```

Distinct from the site-wide [Header](/components/layout/header) - this one
lives *inside* a [DashboardPanel](/blocks/dashboard/dashboard-panel), scoped
to the main content area only, and its leading button toggles
[DashboardSidebar](/blocks/dashboard/dashboard-sidebar) (collapse on
desktop, open/close on mobile - the same button either way, see
[DashboardGroup](/blocks/dashboard/dashboard-group)'s own "Mobile"
section). The toggle button only renders when there's an actual sidebar in
the same [DashboardGroup](/blocks/dashboard/dashboard-group) to control -
`SDashboardNavbar` still works fine on its own otherwise.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `ui` | `Partial<Record<DashboardNavbarSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `title` | Custom title content, overrides `title` prop |
| default | Trailing content - actions, a search trigger, whatever the page needs |
