---
title: Chip
description: A removable tag for representing a value the user can dismiss - a filter, a selected item, a free-text entry.
order: 11.5
---

## Usage

Chip shares its color/variant/size system - and its default shape - with
[Badge](/components/elements/badge). The difference is `removable`, which
adds a dismiss button and a `remove` event. Chip doesn't track its own
value; the parent decides what "remove" means (splice it out of an array,
unset a filter, whatever fits).

::component-example{name="chip-basic"}
::

```vue-html
<SChip label="Primary" color="primary" />
<SChip label="Solid" color="primary" variant="solid" />
<SChip label="Outline" color="danger" variant="outline" />
```

### Removable

`removable` adds a dismiss button; listen for `@remove` to react to it.

::component-example{name="chip-removable"}
::

```vue-html
<SChip
  v-for="fruit in fruits"
  :key="fruit"
  :label="fruit"
  removable
  @remove="fruits = fruits.filter((f) => f !== fruit)"
/>
```

### Icon

`icon` adds a leading icon, and combines with `removable` freely - the
matching `icon` slot replaces the glyph entirely when a plain icon name
isn't enough.

::component-example{name="chip-icon"}
::

```vue-html
<SChip label="Verified" icon="hugeicons:tick-02" color="success" />
<SChip label="Starred" icon="hugeicons:star" color="warning" removable />
```

### Rounded

`rounded` swaps the default small radius for a fully rounded pill shape.

::component-example{name="chip-rounded"}
::

```vue-html
<SChip label="Primary" color="primary" rounded />
<SChip label="Removable" removable rounded @remove="() => {}" />
```

### Accessibility

The remove button is icon-only, so it needs an accessible name from
somewhere: by default it's derived as `Remove {label}` (or plain `Remove`
without a `label`) - override it directly with `removeLabel` when the
default slot's content isn't plain text `label` can describe.

Chip's own root is a `<span>`, so the remove button renders as a real
`<button>` inside it - nothing unusual to work around there, unlike a
control that has to live inside another interactive element.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `Chip`'s own theme file:

::theme-source{name="chip"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` | - |
| `icon` | `string` | - |
| `removable` | `boolean` | `false` |
| `removeLabel` | `string` | - |
| `disabled` | `boolean` | `false` |
| `rounded` | `boolean` | `false` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<ChipSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| default | - | Custom content, overrides `label` |
| `icon` | - | Replaces the leading icon entirely |
| `remove` | `{ remove }` | Replaces the whole remove control (not just its icon) - needed when a host context must supply its own interactive element there. Call the scoped `remove` function to fire the same `remove` event the default button does |
| `remove-icon` | - | Replaces the remove button's icon (default: `hugeicons:cancel-01`) |

## Emits

| Event | Payload | Description |
| --- | --- | --- |
| `remove` | - | Fired when the remove button is clicked |
