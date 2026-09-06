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

### Mobile modal presentation

Below a 768px viewport width, `mobileModal` presents the popover as a
centered [Modal](/components/overlays/modal) instead of a small anchored
panel - easier to tap with a finger. Opt-in (defaults `false`), matching
Select/Autocomplete/DatePicker's own `mobileModal`:

```vue-html
<SColorPicker v-model="color" mobile-modal />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `string` | - |
| `defaultValue` | `string` | - |
| `disabled` | `boolean` | `false` |
| `alpha` | `boolean` | `true` |
| `swatches` | `string[]` | - |
| `placeholder` | `string` | - |
| `mobileModal` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `ui` | `Partial<Record<ColorPickerSlot, string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Fires whenever the color changes - dragging the area/sliders, typing (and committing) the hex field, or picking a swatch |
