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

### States

Setting `disabled` on an individual item (rather than the whole
`SRadioGroup`) disables just that one, leaving the rest of the group
interactive:

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
```

`disabled` on the group itself disables every item at once, and `invalid`
switches every item's ring to `--ui-danger` - see [Props](#props).

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` falls back to
FormField's own state when not set directly on the radio group.

### Accessibility

RadioGroup renders Reka UI's RadioGroup primitive, so the accessibility
semantics come from there rather than being reimplemented here: the group
itself is `role="radiogroup"` and each item is `role="radio"` with
`aria-checked`. The whole group is a single <kbd>Tab</kbd> stop (roving
tabindex, not one stop per item) - once focus is inside, the arrow keys move
focus between items and immediately select whichever one it lands on, the
standard behavior for the
[ARIA radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/),
not something to configure here.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `items` | `{ label: string; value: string; disabled?: boolean }[]` | - |
| `modelValue` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'itemWrapper' \| 'item' \| 'indicator' \| 'label', string \| object>>` | - |
