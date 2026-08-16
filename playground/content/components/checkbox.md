---
title: Checkbox
description: A checkbox with an optional label, built on Reka UI's Checkbox primitive.
---

## Usage

See it live on the [home page](/).

```vue
<script setup lang="ts">
const accepted = ref(true)
</script>

<template>
  <SCheckbox v-model="accepted" label="Accept terms" />
</template>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean \| 'indeterminate'` | - |
| `label` | `string` | - |
| `disabled` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'box' \| 'indicator' \| 'label', string \| object>>` | - |
