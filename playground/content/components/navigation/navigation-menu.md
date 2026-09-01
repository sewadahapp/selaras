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
(or hovering) it opens a dropdown. Every open dropdown teleports into one
shared floating panel that smoothly resizes and cross-fades as you move
between different top-level items - Reka UI's own real navigation-menu
mechanism, not an independent popover per item:

::component-example{name="navigation-menu-children"}
::

```vue-html
<SNavigationMenu :items="[
  { label: 'Products', children: [
    { label: 'Analytics', to: '/products/analytics' },
    { label: 'Automation', to: '/products/automation' },
  ] },
]" />
```

This is a single level of children only - Reka's own shared-viewport
dropdown isn't built for deeper nesting. For an arbitrary-depth tree, use
[Vertical](#vertical) instead.

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

```vue-html
<SNavigationMenu :items="items" highlight />
```

### Disabled item

`disabled` on an item keeps it visible but non-interactive - no
navigation, no `onSelect`, marked `aria-disabled`:

```vue-html
<SNavigationMenu :items="[{ label: 'Coming soon', disabled: true }]" />
```

### Color

`color` follows the same palette as every other component here
(`primary`, `neutral`, `secondary`, `success`, `danger`, `info`,
`warning`) and only affects the active item:

```vue-html
<SNavigationMenu :items="items" color="secondary" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `NavigationMenuItem[]` | - (required) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'primary'` |
| `variant` | `'pill' \| 'link'` | `'pill'` |
| `highlight` | `boolean` | `false` |
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
| `onSelect` | `(event: Event) => void` | Fired when a leaf item is activated. |

## Slots

This component is fully data-driven via `items` - there are no content
slots. Use `:ui` to override any slot's classes.
