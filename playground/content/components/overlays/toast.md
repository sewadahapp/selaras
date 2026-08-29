---
title: Toast
description: A stackable notification, triggered imperatively via useToast().
order: 53
---

## Usage

Wrap your root `app.vue` in `<SApp>` once (already done in this playground),
and place `<SToast />` inside it, wrapped in `<ClientOnly>`. Then push toasts
from anywhere with `useToast()`:

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

::component-example{name="toast-basic"}
::

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

### Colors

`color` (`success`/`danger`/`warning`/`info`) tints the toast's icon and
adds a matching left-edge accent - a status this narrow rather than the
full color palette `Button`/`Badge` expose, since a toast's color only
ever means "what kind of status is this." Each color resolves to its own
default icon unless `icon` overrides it:

::component-example{name="toast-colors"}
::

```vue-html
<SButton @click="add({ color: 'success', title: 'Saved' })">
  Show success toast
</SButton>
```

### Accessibility

Toast renders Reka UI's Toast primitive, so the accessibility semantics
come from there rather than being reimplemented here: each toast announces
itself via `aria-live` without stealing focus from whatever the user was
doing, a hover or focus inside it pauses its own dismiss timer (resuming
once it's left), and on touch devices it can be swiped away.

## `useToast()`

| Method | Description |
| --- | --- |
| `add(toast)` | Pushes a toast (`{ title?, description?, duration?, color?, icon? }`), returns its id |
| `remove(id)` | Dismisses a toast by id |

## Props (`SToast`)

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<'viewport' \| 'root' \| 'title' \| 'description' \| 'icon' \| 'close', string \| object>>` | - |
