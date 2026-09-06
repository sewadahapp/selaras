---
title: Rating
description: A star rating input, built on Reka UI's Rating primitive.
order: 25.5
---

## Usage

`v-model` is a plain `number` between `0` and `length` (`5` by
default):

::component-example{name="rating-basic"}
::

```vue
<script setup lang="ts">
const value = ref(3)
</script>

<template>
  <SRating v-model="value" aria-label="Rate your experience" />
</template>
```

### Half-star precision

`step` sets how fine-grained a single star's own value can be - one of
`1` (default), `0.5`, `0.25`, or `0.1`. `0.5` splits each star into a
left (half) and right (whole) half, each its own clickable region:

::component-example{name="rating-half-star"}
::

```vue-html
<SRating v-model="value" :step="0.5" />
```

### Clearable

Clicking the currently-selected star again resets the value to `0`:

::component-example{name="rating-clearable"}
::

```vue-html
<SRating v-model="value" clearable />
```

### Sizes

::component-example{name="rating-sizes"}
::

```vue-html
<SRating :default-value="4" size="lg" />
```

### Color

::component-example{name="rating-color"}
::

```vue-html
<SRating :default-value="4" color="success" />
```

### Read-only display

`disabled` blocks interaction entirely - paired with a fractional
`model-value`/`step`, this is the same component used purely to
*display* a rating (an average review score, for one), not just collect
one:

::component-example{name="rating-readonly"}
::

```vue-html
<SRating :model-value="4.5" :step="0.5" disabled aria-label="4.5 out of 5" />
```

### Vertical

::component-example{name="rating-vertical"}
::

```vue-html
<SRating v-model="value" orientation="vertical" />
```

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` falls back to
FormField's own state when not set directly on the rating, and `size`
does the same.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `modelValue` | `number` | - |
| `defaultValue` | `number` | - |
| `length` | `number` | `5` |
| `step` | `1 \| 0.5 \| 0.25 \| 0.1` | `1` |
| `clearable` | `boolean` | `false` |
| `hoverable` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `name` | `string` | - |
| `required` | `boolean` | `false` |
| `ui` | `Partial<Record<RatingSlot, string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Fires when a star (or half-star) is clicked |
