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

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically.

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
