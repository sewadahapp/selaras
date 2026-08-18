---
title: Tabs
description: An items-driven tab list built on Reka UI's Tabs primitive.
---

## Usage

::component-example{name="tabs-basic"}
::

```vue
<script setup lang="ts">
const active = ref('one')
</script>

<template>
  <STabs v-model="active" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]">
    <template #one>
      Tab one content
    </template>
    <template #two>
      Tab two content
    </template>
  </STabs>
</template>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; value?: string; disabled?: boolean }[]` | - |
| `modelValue` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'list' \| 'trigger' \| 'content', string \| object>>` | - |
