---
title: InputNumber
description: A numeric input with increment/decrement buttons.
order: 20.5
---

## Usage

`v-model` is a plain `number | undefined` - an empty field commits as
`undefined`, not `0` or `NaN`:

::component-example{name="input-number-basic"}
::

```vue
<script setup lang="ts">
const value = ref<number>()
</script>

<template>
  <SInputNumber v-model="value" />
</template>
```

Type a value directly, use the arrow keys while focused, or click the
±buttons - all three commit through the same `min`/`max`/`step` clamping.

### Min, max, and step

`min`/`max` clamp the committed value and disable the button at whichever
boundary is reached; `step` controls how much each click or arrow-key press
changes the value (default `1`):

::component-example{name="input-number-min-max"}
::

```vue-html
<SInputNumber v-model="value" :min="0" :max="10" :step="2" />
```

### Format options

`format-options` is a plain `Intl.NumberFormatOptions` object - the same
shape every other JS number-formatting API already uses - applied to the
value once it's no longer being edited. Typing itself always shows the
plain number, so the two never fight each other:

::component-example{name="input-number-format"}
::

```vue-html
<SInputNumber v-model="value" :format-options="{ minimumIntegerDigits: 2 }" />
```

### Orientation

`orientation="vertical"` replaces the two full-height flanking buttons with
a single compact up/down pair pinned to the field's end edge - useful when
horizontal space is tight:

::component-example{name="input-number-orientation"}
::

```vue-html
<SInputNumber v-model="value" orientation="vertical" />
```

### Sizes and states

`size` takes `sm` / `md` / `lg`, `disabled` prevents interaction and dims
the control, and `invalid` switches the ring to `--ui-danger`:

::component-example{name="input-number-invalid"}
::

```vue-html
<SInputNumber v-model="value" size="sm" />
<SInputNumber v-model="value" disabled />
<SInputNumber v-model="value" invalid />
```

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/
`invalid` and `aria-describedby` wired up automatically - `invalid` and
`size` both fall back to FormField's own state when not set directly.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `number` | - |
| `min` | `number` | - |
| `max` | `number` | - |
| `step` | `number` | `1` |
| `placeholder` | `string` | - |
| `formatOptions` | `Intl.NumberFormatOptions` | - |
| `locale` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` |
| `ui` | `Partial<Record<'root' \| 'input' \| 'stepper' \| 'stepperButton', string \| object>>` | - |

## Emits

| Emit | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| undefined` | Fires on increment/decrement click, ArrowUp/ArrowDown, or blur/Enter after typing |
