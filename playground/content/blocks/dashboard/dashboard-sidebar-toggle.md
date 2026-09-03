---
title: DashboardSidebarToggle
description: A themed button that collapses/expands (or opens/closes, on mobile) a sibling DashboardSidebar.
order: 60
---

## Usage

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardNavbar title="Overview">
  <template #leading>
    <SDashboardSidebarToggle />
  </template>
</SDashboardNavbar>
```

Nothing renders it for you - drop it into
[DashboardNavbar](/blocks/dashboard/dashboard-navbar)'s `leading` slot
(the common case, shown above), or anywhere else inside the same
[DashboardGroup](/blocks/dashboard/dashboard-group) that makes sense for a
given layout - inside [DashboardSidebar](/blocks/dashboard/dashboard-sidebar)'s
own header instead of the navbar, say, or a custom toolbar.

Renders nothing until there's an actual sibling
[DashboardSidebar](/blocks/dashboard/dashboard-sidebar) in the same
[DashboardGroup](/blocks/dashboard/dashboard-group) to control.

### Replacing the button entirely

The default slot hands a fully custom trigger the same `toggle` function
and `isCollapsed` state the built-in Button uses internally, rather than
just swapping props on it:

```vue-html
<SDashboardSidebarToggle v-slot="{ toggle, isCollapsed }">
  <button type="button" @click="toggle">
    {{ isCollapsed ? 'Show' : 'Hide' }} sidebar
  </button>
</SDashboardSidebarToggle>
```

### Customizing the icon or button

A thin wrapper around [Button](/components/elements/button) - `icon` swaps
the glyph, and anything else Button accepts (`color`, `variant`, `size`,
`ui`, ...) passes straight through:

```vue-html
<SDashboardSidebarToggle icon="lucide:menu" color="primary" variant="soft" />
```

The default icon (`hugeicons:sidebar-left-01`) mirrors horizontally once
the sidebar collapses, rather than swapping to a second icon - a custom
`icon` gets the same treatment, so pick one that still reads correctly
flipped.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `icon` | `string` | `sidebarCollapse` icon |

## Slots

| Slot | Description |
| --- | --- |
| default | Replaces the themed Button entirely - scoped to `{ toggle, isCollapsed }` |
