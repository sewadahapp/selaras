---
title: Slider
description: A draggable control for picking a number (or a range) within a min/max, built on Reka UI's Slider primitive.
order: 20.75
---

## Usage

`v-model` is a plain `number` for a single handle:

::component-example{name="slider-basic"}
::

```vue
<script setup lang="ts">
const value = ref(30)
</script>

<template>
  <SSlider v-model="value" aria-label="Volume" />
</template>
```

### Range

Pass an array instead to get a range slider with one handle per entry -
`minStepsBetweenThumbs` keeps them from crossing (or getting closer than
that many steps apart). The value you get back always matches the shape
you passed in - an array in, an array out:

::component-example{name="slider-range"}
::

```vue
<script setup lang="ts">
const priceRange = ref([20, 80])
</script>

<template>
  <SSlider v-model="priceRange" :min-steps-between-thumbs="5" />
</template>
```

### Min, max, and step

`min`/`max` (default `0`/`100`) bound the value, `step` (default `1`)
controls the increment - both the drag and the arrow keys snap to it.

### Ticks

`show-ticks` marks every step along the track - a Selaras addition, not
part of Reka's own primitive:

::component-example{name="slider-ticks"}
::

```vue-html
<SSlider v-model="value" :step="25" show-ticks />
```

### Color

::component-example{name="slider-color"}
::

```vue-html
<SSlider :model-value="60" color="danger" />
```

### Vertical

`orientation="vertical"` needs a real height to size against - the theme
gives it a sensible default (override via `:ui.root` for a taller/shorter
one):

::component-example{name="slider-vertical"}
::

```vue-html
<SSlider v-model="value" orientation="vertical" />
```

### Accessible labeling

A slider thumb has no visible text of its own, so it needs an accessible
name from somewhere. `aria-label` (a single string) applies to every
thumb - fine for a single-handle slider. For a range slider, Reka's own
primitive already falls back to "Minimum"/"Maximum" for a two-thumb
slider with no label at all; pass an array to `aria-label` to say
something more specific instead (`['Low priority', 'High priority']`, for
one):

```vue-html
<SSlider v-model="priceRange" :aria-label="['Minimum price', 'Maximum price']" />
```

### Committing vs. continuous updates

`update:model-value` (what `v-model` uses) fires continuously while
dragging. `value-commit` fires once, only when a drag finishes with an
actually-changed value - useful for anything that shouldn't run on every
intermediate frame, like a debounced request:

```vue-html
<SSlider v-model="value" @value-commit="(v) => fetchResultsFor(v)" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `number \| number[]` | - |
| `defaultValue` | `number \| number[]` | - |
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `step` | `number` | `1` |
| `minStepsBetweenThumbs` | `number` | - |
| `disabled` | `boolean` | `false` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `inverted` | `boolean` | `false` |
| `showTicks` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `ariaLabel` | `string \| string[]` | - |
| `name` | `string` | - |
| `ui` | `Partial<Record<SliderSlot, string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| number[]` | Fires continuously while dragging |
| `valueCommit` | `number \| number[]` | Fires once, when a drag finishes with a changed value |
