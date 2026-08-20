---
title: Switch
description: A toggle switch with an optional label, built on Reka UI's Switch primitive.
order: 26
---

## Usage

::component-example{name="switch-basic"}
::

```vue
<script setup lang="ts">
const notifications = ref(true)
</script>

<template>
  <SSwitch v-model="notifications" label="Notifications" />
</template>
```

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `boolean` | - |
| `label` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'track' \| 'thumb' \| 'label', string \| object>>` | - |
