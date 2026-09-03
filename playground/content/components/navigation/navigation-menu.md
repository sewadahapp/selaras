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
mechanism, not an independent popover per item. The panel always spans
the **full width** of the nav bar, flowing children into as many columns
as comfortably fit - matching both a comparable reference's own default and another's
MegaMenu (its actual wide-panel component - Menubar's own submenus are
narrow/cascading instead), rather than a narrow popover sized to its own
content:

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

At a larger scale - more items, more children each, with icons - the same
default rendering (no custom slot needed) holds up on its own:

::component-example{name="navigation-menu-full"}
::

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
<SNavigationMenu :items="items" orientation="vertical" collapsed />
```

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

### Customizing content

Every rendering spot has a matching slot, scoped with the item's own
data - `item-leading`/`item-label`/`item-trailing` replace one piece at a
time, `item` replaces a whole item's content, and `item-content` replaces
an entire dropdown's body, letting you build a genuine multi-column mega
menu instead of the default single-column list:

::component-example{name="navigation-menu-custom"}
::

```vue-html
<SNavigationMenu :items="items">
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

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `NavigationMenuItem[]` | - (required) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'primary'` |
| `variant` | `'pill' \| 'link'` | `'pill'` |
| `highlight` | `boolean` | `false` |
| `collapsed` | `boolean` | `false` |
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
