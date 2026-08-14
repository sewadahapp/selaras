---
title: Select
description: A listbox-style select built on Reka UI's Select primitive.
---

## Usage

See it live on the [home page](/).

```vue
<script setup lang="ts">
const fruit = ref('apple')
</script>

<template>
  <SSelect
    v-model="fruit"
    placeholder="Pick a fruit"
    :items="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true },
    ]"
  />
</template>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; value: string; disabled?: boolean }[]` | - |
| `modelValue` | `string` | - |
| `placeholder` | `string` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | `false` |
| `ui` | `Partial<Record<'trigger' \| 'value' \| 'icon' \| 'content' \| 'viewport' \| 'item' \| 'itemIndicator', string \| object>>` | - |
