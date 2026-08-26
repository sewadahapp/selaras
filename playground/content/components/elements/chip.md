---
title: Chip
description: A removable tag for representing a value the user can dismiss - a filter, a selected item, a free-text entry.
order: 11.5
---

## Usage

Chip shares its color/variant/size system with [Badge](/components/elements/badge) - the
difference is `removable`, which adds a dismiss button and a `remove` event.
Chip doesn't track its own value; the parent decides what "remove" means
(splice it out of an array, unset a filter, whatever fits).

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

`icon` adds a leading icon, and combines with `removable` freely.

::component-example{name="chip-icon"}
::

```vue-html
<SChip label="Verified" icon="lucide:check" color="success" />
<SChip label="Starred" icon="lucide:star" color="warning" removable />
```

### Accessibility

The remove button is icon-only, so it needs an accessible name from
somewhere: by default it's derived as `Remove {label}` (or plain `Remove`
without a `label`) - override it directly with `removeLabel` when the
default slot's content isn't plain text `label` can describe.

Chip's own root is a `<span>`, so the remove button renders as a real
`<button>` inside it - nothing unusual to work around there, unlike a
control that has to live inside another interactive element.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` | - |
| `icon` | `string` | - |
| `removable` | `boolean` | `false` |
| `removeLabel` | `string` | - |
| `disabled` | `boolean` | `false` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<ChipSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | Custom content, overrides `label` |
| remove-icon | Replaces the remove button's icon (default: `lucide:x`) |

## Emits

| Event | Payload | Description |
| --- | --- | --- |
| `remove` | - | Fired when the remove button is clicked |
