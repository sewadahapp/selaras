---
title: Stepper
description: A multi-step progress indicator, built on Reka UI's Stepper primitive.
order: 40.5
---

## Usage

`Stepper` only tracks and displays *which* step is current - `v-model`
is a plain 1-indexed `number`, and pairing it with your own step content
and Back/Next buttons is up to you, the same way `v-model` composes with
anything else:

::component-example{name="stepper-basic"}
::

```vue
<script setup lang="ts">
const items = [{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }]
const step = ref(1)
</script>

<template>
  <SStepper v-model="step" :items="items" />
  <SButton :disabled="step === 1" @click="step--">
    Back
  </SButton>
  <SButton :disabled="step === items.length" @click="step++">
    Next
  </SButton>
</template>
```

By default, clicking a step only ever advances at most one step ahead of
the current one - going back to any earlier (completed) step is always
allowed. Pass `linear="false"` to allow jumping to any step directly:

::component-example{name="stepper-non-linear"}
::

```vue-html
<SStepper :items="items" :linear="false" />
```

### Descriptions

Each item can carry a `description` alongside its `title`:

::component-example{name="stepper-descriptions"}
::

```vue-html
<SStepper :items="[{ title: 'Address', description: 'Where to ship' }, ...]" />
```

### Icons

Each item can carry an `icon`, shown once its step is active or upcoming
- a completed step always shows a checkmark instead, regardless of `icon`:

::component-example{name="stepper-icons"}
::

```vue-html
<SStepper :items="[{ title: 'Account', icon: 'hugeicons:user' }, ...]" />
```

### Custom slots

`#indicator`, `#title`, and `#description` each replace that part
entirely, scoped with the item, its index, and its `state` - useful for
always showing an item's own icon (instead of falling back to a
checkmark once completed) or annotating the active step:

::component-example{name="stepper-custom-slots"}
::

```vue-html
<SStepper :items="items">
  <template #indicator="{ item }">
    <SIcon :name="item.icon" class="size-4" />
  </template>
  <template #title="{ item, state }">
    {{ item.title }}
    <span v-if="state === 'active'">· current</span>
  </template>
</SStepper>
```

### Vertical

::component-example{name="stepper-vertical"}
::

```vue-html
<SStepper :items="items" orientation="vertical" />
```

### Color

::component-example{name="stepper-color"}
::

```vue-html
<SStepper :items="items" color="success" />
```

## In markdown

Every Selaras component is already globally registered under its `S`-prefixed
name - a bare `::s-stepper{...}` block works with no extra wiring (see
[Callout](/components/typography/callout)'s own "In markdown" section for how
the pattern works generally). `items` is an array prop, not a string - bind
it with a leading `:` so `@nuxtjs/mdc` parses the attribute as an expression
instead of literal text. Unlike [Tabs](/components/navigation/tabs) or
[Accordion](/components/navigation/accordion), each step's own text comes
from its `title`/`description` fields directly, not a per-item slot - the
block needs no body at all:

```md
::s-stepper{:items='[{"title":"Cart"},{"title":"Shipping"},{"title":"Payment"}]'}
::
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `Step[]` | - |
| `modelValue` | `number` | - |
| `defaultValue` | `number` | - |
| `linear` | `boolean` | `true` |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `ui` | `Partial<Record<StepperSlot, string \| object>>` | - |

`Step` is `{ title?: string, description?: string, icon?: string, disabled?: boolean }`.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Fires when a step's trigger is clicked |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `indicator` | `{ item, index, state }` | Replaces the indicator's content (default: a checkmark once completed, else the item's `icon`, else the step number) |
| `title` | `{ item, index, state }` | Replaces the title text |
| `description` | `{ item, index, state }` | Replaces the description text |

`state` is `'inactive' \| 'active' \| 'completed'`.
