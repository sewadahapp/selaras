---
title: Modal
description: A dialog overlay built on Reka UI's Dialog primitive.
---

## Usage

Modal visibility is controlled with `v-model`, so it needs a ref from the
page it's used on — see it live on the [home page](/).

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open modal
  </SButton>

  <SModal v-model="open" title="Delete item" description="This action cannot be undone.">
    <template #body>
      Are you sure you want to delete this item?
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Cancel
      </SButton>
      <SButton color="danger" @click="open = false">
        Delete
      </SButton>
    </template>
  </SModal>
</template>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `ui` | `Partial<Record<'overlay' \| 'content' \| 'header' \| 'title' \| 'description' \| 'close' \| 'body' \| 'footer', string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger element |
| `header` | Overrides the default title/description block |
| `body` | Main content |
| `footer` | Usually action buttons |
