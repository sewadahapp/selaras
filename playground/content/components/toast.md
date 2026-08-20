---
title: Toast
description: A stackable notification, triggered imperatively via useToast().
order: 7
---

## Usage

Wrap your root `app.vue` in `<SApp>` once (already done in this playground),
and place `<SToast />` inside it, wrapped in `<ClientOnly>`. Then push toasts
from anywhere with `useToast()` — see it live on the [home page](/).

```vue-html
<!-- app.vue -->
<SApp>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <SToast />
  </ClientOnly>
</SApp>
```

`SApp` establishes Reka UI's `ToastProvider` around your whole app - it must
be mounted exactly once, at the true app root, not per-layout or per-page.
Mounting it more than once would register multiple providers for the same
toast state, causing every toast to render once per instance.

`SToast` is the part that actually renders toasts - it does real DOM
measurement and CSS-driven animation, so it needs `<ClientOnly>` around it.
`SApp` itself doesn't: it only establishes context, so it renders on the
server like any other component.

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

## Props (`SToast`)

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<'viewport' \| 'root' \| 'title' \| 'description' \| 'close', string \| object>>` | - |
