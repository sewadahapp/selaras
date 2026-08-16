---
title: Switch
description: A toggle switch with an optional label, built on Reka UI's Switch primitive.
---

## Usage

See it live on the [home page](/).

```vue
<script setup lang="ts">
const notifications = ref(true)
</script>

<template>
  <SSwitch v-model="notifications" label="Notifications" />
</template>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | - |
| `label` | `string` | - |
| `disabled` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'track' \| 'thumb' \| 'label', string \| object>>` | - |
