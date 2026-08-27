---
title: RadioGroup
description: An items-driven radio group built on Reka UI's RadioGroup primitive.
order: 25
---

## Usage

::component-example{name="radio-group-basic"}
::

```vue
<script setup lang="ts">
const choice = ref('one')
</script>

<template>
  <SRadioGroup
    v-model="choice"
    :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]"
  />
</template>
```

### Simple options

A plain string in `items` is shorthand for `{ label: value, value }`, for
when the label and value are the same:

::component-example{name="radio-group-string-items"}
::

```vue-html
<SRadioGroup v-model="size" :items="['sm', 'md', 'lg']" />
```

### Orientation

`orientation` switches the layout between a vertical stack (the default)
and a horizontal row - it's also forwarded to the underlying primitive, so
arrow-key navigation follows the same axis (left/right instead of up/down):

::component-example{name="radio-group-orientation"}
::

```vue-html
<SRadioGroup v-model="shipping" orientation="horizontal" :items="['standard', 'express', 'overnight']" />
```

### Card style

`variant="card"` wraps each option in its own bordered box instead of a
plain inline row, highlighting whichever one is selected. Pair it with the
`label` slot for a description, price, or any other content alongside the
option:

::component-example{name="radio-group-card"}
::

```vue-html
<SRadioGroup v-model="plan" variant="card" :items="[{ label: 'Free', value: 'free' }, { label: 'Pro', value: 'pro' }]">
  <template #label="{ item }">
    <div>
      <p class="font-medium">{{ item.label }}</p>
      <p class="text-sm text-[var(--ui-text-muted)]">A short description</p>
    </div>
  </template>
</SRadioGroup>
```

### States

Setting `disabled` on an individual item (rather than the whole
`SRadioGroup`) disables just that one, leaving the rest of the group
interactive - including when that item happens to already be the selected
one, e.g. a plan a consumer picked before it was discontinued:

::component-example{name="radio-group-states"}
::

```vue-html
<SRadioGroup
  v-model="shipping"
  :items="[
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express', disabled: true },
    { label: 'Overnight', value: 'overnight' },
  ]"
/>
<SRadioGroup
  v-model="plan"
  :items="[
    { label: 'Legacy (discontinued)', value: 'legacy', disabled: true },
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
  ]"
/>
```

`disabled` on the group itself disables every item at once, and `invalid`
switches every item's ring to `--ui-danger` - see [Props](#props).

### Sizes

`size` takes `sm` / `md` / `lg`, scaling the item, indicator, hover/focus
halo, and label text together:

::component-example{name="radio-group-sizes"}
::

```vue-html
<SRadioGroup v-model="size" size="sm" :items="['one', 'two']" />
<SRadioGroup v-model="size" size="md" :items="['one', 'two']" />
<SRadioGroup v-model="size" size="lg" :items="['one', 'two']" />
```

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` and `size` both fall
back to FormField's own state when not set directly on the radio group.

### Accessibility

RadioGroup renders Reka UI's RadioGroup primitive, so the accessibility
semantics come from there rather than being reimplemented here: the group
itself is `role="radiogroup"` and each item is `role="radio"` with
`aria-checked`. The whole group is a single <kbd>Tab</kbd> stop (roving
tabindex, not one stop per item) - once focus is inside, the arrow keys move
focus between items and immediately select whichever one it lands on (up/
down for the default vertical layout, left/right when `orientation` is
`horizontal`), the standard behavior for the
[ARIA radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/),
not something to configure here.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `items` | `(string \| { label: string; value: string; disabled?: boolean })[]` | - |
| `modelValue` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `orientation` | `'vertical' \| 'horizontal'` | `vertical` |
| `variant` | `'default' \| 'card'` | `default` |
| `ui` | `Partial<Record<'root' \| 'itemWrapper' \| 'item' \| 'indicator' \| 'label', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `label` | `{ item, checked, disabled }` | Replaces an item's plain label text - useful for a description, price, or other rich content (default: the item's `label`) |
