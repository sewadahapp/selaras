---
title: RadioGroup
description: An items-driven radio group built on Reka UI's RadioGroup primitive.
---

## Usage

See it live on the [home page](/).

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

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; value: string; disabled?: boolean }[]` | - |
| `modelValue` | `string` | - |
| `disabled` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'itemWrapper' \| 'item' \| 'indicator' \| 'label', string \| object>>` | - |
