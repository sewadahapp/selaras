---
title: Toast
description: A stackable notification, triggered imperatively via useToast().
---

## Usage

Mount `<SToaster />` once (already in this playground's default layout), then
push toasts from anywhere with `useToast()` — see it live on the
[home page](/).

```vue
<script setup lang="ts">
const { add } = useToast()

function save() {
  add({ title: 'Saved', description: 'Your changes have been saved.' })
}
</script>

<template>
  <SButton @click="save">
    Show toast
  </SButton>
</template>
```

## `useToast()`

| Method | Description |
| --- | --- |
| `add(toast)` | Pushes a toast (`{ title?, description?, duration? }`), returns its id |
| `remove(id)` | Dismisses a toast by id |

## Props (`SToaster`)

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<'viewport' \| 'root' \| 'title' \| 'description' \| 'close', string \| object>>` | - |
