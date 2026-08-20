---
title: Checkbox
description: A checkbox with an optional label, built on Reka UI's Checkbox primitive.
order: 10
---

## Usage

::component-example{name="checkbox-basic"}
::

```vue
<script setup lang="ts">
const accepted = ref(true)
</script>

<template>
  <SCheckbox v-model="accepted" label="Accept terms" />
</template>
```

Wrap it in [FormField](/components/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `boolean \| 'indeterminate'` | - |
| `label` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'box' \| 'indicator' \| 'label', string \| object>>` | - |
