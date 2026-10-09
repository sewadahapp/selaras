---
title: NavigationMenu
description: A horizontal or vertical navigation bar built on Reka UI's NavigationMenu primitive.
order: 45
---

## Usage

`items` is a flat array - `label` is required, everything else is optional:

::component-example{name="navigation-menu-basic"}
::

```vue-html
<SNavigationMenu :items="[
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs' },
  { label: 'Pricing', to: '/pricing' },
]" />
```

### Icons

Give an item an `icon` and it renders before its label:

::component-example{name="navigation-menu-icons"}
::

```vue-html
<SNavigationMenu :items="[{ label: 'Home', icon: 'hugeicons:home-01', to: '/' }]" />
```

### With children

An item with `children` renders as a trigger instead of a link - clicking
(or hovering) it opens a dropdown. Open dropdowns render in one shared
viewport within the NavigationMenu. By default, the panel is a compact,
single-column list beneath its active trigger. The viewport resizes as
you move between top-level items:

::component-example{name="navigation-menu-children"}
::

```vue-html
<SNavigationMenu :items="[
  { label: 'Products', children: [
    { label: 'Analytics', to: '/components/data/table' },
    { label: 'Automation', to: '/components/forms/validation' },
  ] },
]" />
```

This is a single level of children only - Reka's own shared-viewport
dropdown isn't built for deeper nesting. For an arbitrary-depth tree, use
[Vertical](#vertical) instead.

For a wide, multi-column panel, set `contentOrientation="horizontal"`.
This example shows that layout with more items, children, and icons:

::component-example{name="navigation-menu-full"}
::

```vue-html
<SNavigationMenu :items="items" content-orientation="horizontal" />
```

### Content orientation and alignment

For a horizontal navigation bar, `contentOrientation="vertical"` is the
default: a compact, single-column dropdown beneath its active trigger.
`contentOrientation="horizontal"` switches to a full-width, multi-column
dropdown. The navigation bar itself stays horizontal in both layouts.

::component-example{name="navigation-menu-content-orientation"}
::

```vue-html
<SNavigationMenu
  :items="items"
  :positioning="{ align: 'start' }"
/>
```

`positioning.align` accepts `start`, `center` (the default), or `end`.
Start and end follow the reading direction, and the compact panel shifts
at screen edges to stay visible. Use `ui.content` to customize its width;
the viewport measures each open panel and resizes with it.

These settings apply only to horizontal navigation; alignment affects
only its compact dropdown. They do not change vertical accordions or
collapsed sidebar flyouts. Configure those flyouts through `popover`.
NavigationMenu's `positioning` currently supports only `align`, rather than
the full set of positioning options available on Popover and Dropdown.

### Active item

An item whose `to` matches the current route is highlighted
automatically, via Reka's own real `active` link state (`aria-current="page"`
included, not just a class). `active` on the item itself overrides the
auto-detected value in either direction - useful for a route that doesn't
map cleanly to one item's `to`, or for a non-navigating item that should
still show as current:

::component-example{name="navigation-menu-active"}
::

```vue-html
<SNavigationMenu :items="[{ label: 'Docs', active: true }]" />
```

### Vertical

`orientation="vertical"` switches to a top-to-bottom layout. Unlike
horizontal's single-level dropdown, vertical supports arbitrary-depth
nesting - each level with children renders as its own collapsible
accordion group, closed by default:

::component-example{name="navigation-menu-vertical"}
::

```vue-html
<SNavigationMenu :items="items" orientation="vertical" />
```

At a more realistic scale - a settings/docs-style sidebar, three levels
deep, icons throughout, mixing leaf links with nested groups, plus an
active and a disabled item:

::component-example{name="navigation-menu-vertical-full"}
::

### Collapsed

`collapsed` (vertical only) shrinks every item down to just its own icon -
an icon rail, the shape a sidebar nav commonly takes once collapsed. Labels
stay in the DOM for assistive tech (`sr-only`, not removed), so this is
CSS-only and doesn't change what a screen reader announces. A parent with
children renders as a themed flyout trigger instead of an expandable
accordion row - there's no room for a nested list in an icon rail, so its
children surface in a small popover next to the icon instead, the same
pattern a collapsed sidebar commonly uses elsewhere:

::component-example{name="navigation-menu-collapsed"}
::

```vue-html
<SNavigationMenu :items="items" orientation="vertical" collapsed tooltip />
```

### Collapsed labels and flyouts

Add `tooltip` to show a collapsed leaf's label on hover or keyboard focus.
Its text defaults to `ariaLabel`, then `label`. Disabled items, group labels,
and separators do not show tooltips. Expanded and horizontal menus are unaffected.
Wrap your application in `SApp` to provide the shared tooltip context.

```vue-html
<SNavigationMenu
  :items="items"
  orientation="vertical"
  collapsed
  :tooltip="{ delayDuration: 150, arrow: false }"
  :popover="{ side: 'right', positioning: { sideOffset: 10 } }"
/>
```

Use an item's `tooltip: false` to opt out, or an object such as
`tooltip: { text: 'Account settings', side: 'left' }` to override that item.
Global and item tooltip settings are merged, with item settings taking priority.
Tooltips default to an immediate opening on the right in LTR and left in RTL.
The link remains the trigger, preserving navigation, shortcuts, and custom item slots.

Items with children keep their child flyout rather than adding a competing tooltip.
`popover` configures its side, alignment, positioning, portal, arrow, and `ui`;
an item's `popover` overrides the menu settings. Flyouts remain enabled and retain
hover, click, and keyboard behavior. Their default side also follows text direction.

### Labels and separators

An item can be a real link (the default), or `type: 'label'`/`type: 'separator'`
instead - a non-interactive section heading and a thin divider line,
respectively. Both are just items in the same flat array, not a wrapping
structure - a "group" is nothing more than a `label` item followed by the
items it introduces:

::component-example{name="navigation-menu-labels"}
::

```vue-html
<SNavigationMenu :items="[
  { label: 'Guide', type: 'label' },
  { label: 'Introduction', to: '/introduction' },
  { label: 'Installation', to: '/installation' },
  { label: 'sep-1', type: 'separator' },
  { label: 'Components', type: 'label' },
  { label: 'Button', to: '/components/button' },
]" orientation="vertical" />
```

In a collapsed vertical rail, headings stay in the DOM but are visually hidden.
By default, `collapsedGroups="separator"` adds a thin line between populated
sections. Use `"spacing"` for a gap or `"none"` for no automatic boundary.
The same `items` array works when expanding and collapsing. Explicit separator
items still draw lines in all three modes; collapsed rails remove leading,
trailing, and repeated separators. Empty sections do not add visible boundaries.
Horizontal menus are unchanged.

```vue-html
<SNavigationMenu :items="items" orientation="vertical" collapsed collapsed-groups="spacing" tooltip />
```

Use `ui.separator`, `ui.groupSpacer`, and `ui.collapsedGroupLabel` to customize
the line, gap, and visually hidden heading respectively. None become focusable
menu actions; link labels and tooltips retain their existing behavior.

A `separator` item still needs a unique `label` even though it's never
displayed - every item's `label` doubles as its list key. Top-level only:
a `children` array doesn't check `type`, so a nested tree can't group its
own children under a sub-heading.

### Variant

`variant="pill"` (default) gives the active item a filled background;
`variant="link"` only changes its text color, no background:

::component-example{name="navigation-menu-variant"}
::

```vue-html
<SNavigationMenu :items="items" variant="link" />
```

### Highlight

`highlight` draws a small bar next to the active item, in addition to its
own color styling - a line under it in horizontal, or beside it in
vertical:

::component-example{name="navigation-menu-highlight"}
::

```vue-html
<SNavigationMenu :items="items" highlight />
```

### Disabled item

`disabled` on an item keeps it visible but non-interactive - no
navigation, no `onSelect`, marked `aria-disabled`:

::component-example{name="navigation-menu-disabled"}
::

```vue-html
<SNavigationMenu :items="[{ label: 'Coming soon', disabled: true }]" />
```

### Shortcuts

`shortcut` displays a Kbd hint next to a leaf item. Set `hotkey: true` to
bind it, so the key activates that item from anywhere on the page. It stays
inactive while someone is typing in a field. `mod` maps to ⌘ on macOS and Ctrl
on other platforms. A leaf can navigate with `to` or run `onSelect` like a
button.

::component-example{name="navigation-menu-shortcuts"}
::

```vue
<script setup lang="ts">
const lastAction = ref('')
const items = [
  { label: 'Overview', shortcut: 'mod+1', hotkey: true, onSelect: () => lastAction.value = 'Overview selected' },
  { label: 'Settings', shortcut: 'mod+2', hotkey: true, onSelect: () => lastAction.value = 'Settings selected' },
  { label: 'Help', shortcut: 'mod+/', onSelect: () => lastAction.value = 'Help selected' },
]
</script>

<template>
  <SNavigationMenu :items="items" />
</template>
```

Press ⌘1 or ⌘2 (Ctrl on other platforms) to select an item. `Help` shows a
hint but does not bind the key because it omits `hotkey: true`.

### Color

`color` follows the same palette as every other component here
(`primary`, `neutral`, `secondary`, `success`, `danger`, `info`,
`warning`) and only affects the active item:

::component-example{name="navigation-menu-color"}
::

```vue-html
<SNavigationMenu :items="items" color="secondary" />
```

### Customizing content

Every rendering spot has a matching slot, scoped with the item's own
data - `item-leading`/`item-label`/`item-trailing` replace one piece at a
time, `item` replaces a whole item's content, and `item-content` replaces
an entire dropdown's body, letting you build a genuine multi-column mega
menu instead of the default single-column list:

Open **Products** to see the generic `item-content` layout, or **Help** to
see the per-item `help-content` override.

::component-example{name="navigation-menu-custom"}
::

```vue-html
<SNavigationMenu :items="items" content-orientation="horizontal">
  <template #item-content="{ item }">
    <ul class="grid w-96 grid-cols-2 gap-2 p-2">
      <li v-for="child in item.children" :key="child.label">
        <NuxtLink :to="child.to">{{ child.label }}</NuxtLink>
      </li>
    </ul>
  </template>
</SNavigationMenu>
```

Every one of these slots also has a **per-item** form: set `slot` on one
item and it targets `#{slot}-content` (or `-leading`/`-label`/`-trailing`)
ahead of the generic slot above - useful when only one or two items need
bespoke content and the rest are happy with the default:

```vue-html
<SNavigationMenu :items="[{ label: 'Help', slot: 'help', children: [...] }]">
  <template #help-content="{ item }">
    <!-- only this item's dropdown uses this -->
  </template>
</SNavigationMenu>
```

`list-leading`/`list-trailing` sit outside the item list entirely -
useful for a logo or a call-to-action button alongside the menu:

```vue-html
<SNavigationMenu :items="items">
  <template #list-leading>
    <img src="/logo.svg" class="h-6">
  </template>
  <template #list-trailing>
    <SButton size="sm">Sign up</SButton>
  </template>
</SNavigationMenu>
```

These same slots work identically in vertical mode.

### Custom `:ui`

Global and scoped recipe overrides use `ui.navigationMenu`. The recursive
accordion and collapsed flyout renderers intentionally consume that same key;
they are implementation details rather than separate theme surfaces.

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `NavigationMenu`'s own theme file:

::theme-source{name="navigation-menu"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `NavigationMenuItem[]` | - (required) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `contentOrientation` | `'horizontal' \| 'vertical'` | `'vertical'` |
| `positioning` | `NavigationMenuPositioning` (`{ align?: 'start' \| 'center' \| 'end' }`) | `{ align: 'center' }` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'primary'` |
| `variant` | `'pill' \| 'link'` | `'pill'` |
| `highlight` | `boolean` | `false` |
| `collapsed` | `boolean` | `false` |
| `collapsedGroups` | `'separator' \| 'spacing' \| 'none'` | `'separator'` |
| `tooltip` | `boolean \| TooltipProps` | `false` |
| `popover` | `NavigationMenuPopover` | - |
| `ui` | `Partial<Record<NavigationMenuSlot, string \| object>>` | - |

`NavigationMenuItem`:

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Required. |
| `icon` | `string` | Rendered before the label. |
| `to` | `string` | Route path for a leaf item. |
| `disabled` | `boolean` | Visible but non-interactive. |
| `active` | `boolean` | Overrides the auto-detected route match. |
| `children` | `NavigationMenuItem[]` | One level for horizontal; arbitrary depth for vertical. |
| `description` | `string` | Not read by NavigationMenu's own default rendering - carried purely so a custom `#item-content`/`#{slot}-content` slot override can display one (a "mega menu" style description under each link, say) - see [Customizing content](#customizing-content), whose own live example already renders this field. |
| `onSelect` | `(event: Event) => void` | Fired when a leaf item is activated. |
| `shortcut` | `string` | Displays a Kbd hint beside the item. |
| `hotkey` | `boolean` | Binds `shortcut` page-wide, except while typing in a field. |
| `slot` | `string` | Targets this item's own named slots ahead of the generic ones - see [Customizing content](#customizing-content). |
| `type` | `'link' \| 'label' \| 'separator'` | `'link'` unless set - see [Labels and separators](#labels-and-separators). |

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `item` | `{ item, active }` | Replaces an item's entire content (icon+label, or icon+label+chevron for a trigger) |
| `item-leading` | `{ item, active }` | Replaces the leading icon |
| `item-label` | `{ item, active }` | Replaces the label text - also the only slot a `type: 'label'` item uses |
| `item-trailing` | `{ item, active }` | Replaces the trailing content (the chevron, for a trigger) |
| `item-content` | `{ item }` | Replaces an entire dropdown/accordion body |
| `list-leading` | - | Rendered before the item list |
| `list-trailing` | - | Rendered after the item list |

Every slot above also has a per-item form via `item.slot` - see
[Customizing content](#customizing-content).
