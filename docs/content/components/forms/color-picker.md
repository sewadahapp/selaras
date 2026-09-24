---
title: ColorPicker
description: A trigger-and-popover control for picking a color, built on five independent Reka UI color primitives sharing one hex value.
order: 23.75
---

## Usage

`v-model` is a hex color string (`#rrggbb`, or `#rrggbbaa` once alpha
drops below 1) - the trigger shows a live swatch preview plus the hex
value, and opens a popover with a saturation/brightness area, a hue
slider, an alpha slider, and a hex text field:

::component-example{name="color-picker-basic"}
::

```vue
<script setup lang="ts">
const color = ref('#7c3aed')
</script>

<template>
  <SColorPicker v-model="color" />
</template>
```

### Alpha

`alpha` (default `true`) shows the opacity slider. Set it to `false`
for a consumer that only ever wants an opaque color:

::component-example{name="color-picker-no-alpha"}
::

```vue-html
<SColorPicker v-model="color" :alpha="false" />
```

### Swatches

`swatches` renders a row of preset colors below the hex field - omitted
entirely unless given. Clicking one sets that exact color (including its
own alpha, if it has one):

::component-example{name="color-picker-swatches"}
::

```vue-html
<SColorPicker v-model="color" :swatches="['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']" />
```

### Color

Controls the trigger's own focus-ring color, same scope as every other
form control's `color` prop - it has no effect on the color being
picked:

::component-example{name="color-picker-color"}
::

```vue-html
<SColorPicker v-model="color" color="danger" />
```

### Size

::component-example{name="color-picker-size"}
::

```vue-html
<SColorPicker v-model="color" size="sm" />
<SColorPicker v-model="color" size="md" />
<SColorPicker v-model="color" size="lg" />
```

### Adaptive presentation

Below your configured adaptive breakpoint, `adaptive` presents the popover as
a centered [Modal](/components/overlays/modal) instead of a small anchored
panel. It is opt-in (defaults `false`) and follows the shared adaptive
contract:

```vue-html
<SColorPicker v-model="color" adaptive />
```

### Arrow

`arrow` adds a pointer between the anchored picker and its trigger. It is off
by default and has no effect on the adaptive modal.

```vue-html
<SColorPicker v-model="color" arrow />
<SColorPicker v-model="color" :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }" />
```

Use `positioning` to place the anchored picker and `portal` to render it
inline (`false`) or teleport it to a CSS selector or `HTMLElement`. The
default portal target is the document body. These props apply to the anchored
popover, which starts aligned with its trigger by default; the adaptive modal
has its own layout. Set `positioning.align` to override the alignment.
`ui.content` styles the panel.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `ColorPicker`'s own theme file:

::theme-source{name="color-picker"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `name` | `string` | - |
| `form` | `string` | - |
| `modelValue` | `string` | - |
| `defaultValue` | `string` | - |
| `open` | `boolean` | - |
| `defaultOpen` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `alpha` | `boolean` | `true` |
| `swatches` | `string[]` | - |
| `placeholder` | `string` | - |
| `adaptive` | `boolean` | `false` |
| `arrow` | `boolean \| RoundedArrowConfig` | `false` |
| `positioning` | `OverlayPositioning` | anchored picker defaults |
| `portal` | `boolean \| string \| HTMLElement` | `true` (document body) |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `ui` | `Partial<Record<ColorPickerSlot, string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Fires when the picker requests opening or closing |
| `update:modelValue` | `string` | Fires whenever the color changes - dragging the area/sliders, typing (and committing) the hex field, or picking a swatch |
