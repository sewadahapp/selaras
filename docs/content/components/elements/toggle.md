---
title: Toggle
description: A two-state pressed/unpressed button, built on Reka UI's Toggle primitive.
order: 12.92
---

## Usage

::component-example{name="toggle-basic"}
::

```vue-html
<SToggle icon="hugeicons:text-bold">Bold</SToggle>
```

### Icon only

Same auto-detection as `Button` - pass `icon` with no default slot
content and it shapes itself to a square automatically. Always add
`aria-label` when there's no visible text:

::component-example{name="toggle-icon-only"}
::

```vue-html
<SToggle icon="hugeicons:text-bold" aria-label="Bold" />
```

### Color

`color` picks which of the seven semantic colors the pressed state
uses - unpressed always looks the same (muted, transparent) regardless
of `color`:

::component-example{name="toggle-color"}
::

```vue-html
<SToggle color="success" default-value>Enabled</SToggle>
```

### Disabled

::component-example{name="toggle-disabled"}
::

```vue-html
<SToggle disabled>Off</SToggle>
<SToggle disabled default-value>On</SToggle>
```

### Multiple toggles

For a set of related toggles that share one selection model (single or
multiple), see [ToggleGroup](/components/elements/toggle-group) -
`Toggle` on its own has no relationship to any other `Toggle`.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `Toggle`'s own theme file:

::theme-source{name="toggle"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | - |
| `defaultValue` | `boolean` | `false` |
| `disabled` | `boolean` | - |
| `icon` | `string` | - |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `square` | `boolean` | - |
| `ui` | `Partial<Record<ToggleSlot, string \| object>>` | - |

## Emits

| Event | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `{ pressed }` | The toggle's own content |
