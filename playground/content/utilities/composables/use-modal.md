---
title: useModal
description: Open a modal programmatically from anywhere.
order: 10
---

`useModal()` lets you open a `<SModal>` (or any component you point it at)
without placing it in your template - useful for confirmation dialogs
triggered from a click handler, or flows where the modal's content isn't
known until runtime.

## Usage

```vue
<script setup lang="ts">
const { open } = useModal()
const modal = useTemplateRef('confirmModal')

async function handleDelete() {
  const confirmed = await open(ConfirmDeleteDialog, {
    props: { itemName: 'My project' },
  })
  if (confirmed) {
    // ...
  }
}
</script>
```

The component you pass to `open()` resolves the returned promise itself
(typically by calling `useModal().close(id, value)` from inside it, or by
emitting an event your host page listens for and resolves in turn).

## API

```ts
function useModal(): {
  modals: Ref<ModalInstance[]>
  open: <T = void>(component: Component, options?: UseModalOpenOptions) => Promise<T | undefined>
  close: (id: number, value?: unknown) => void
  remove: (id: number) => void
}
```

`open()` resolves with `undefined` if the modal is dismissed without an
explicit value (e.g. Escape, backdrop click).

### `UseModalOpenOptions`

| Option | Type | Description |
| --- | --- | --- |
| `props` | `Record<string, unknown>` | Props passed to the opened component. |
| `dismissible` | `boolean` | Whether Escape/backdrop click closes it. |
| `modal` | `boolean` | Whether it traps focus and blocks interaction outside. |
| `overlay` | `boolean` | Whether a backdrop is rendered. |
| `transition` | `boolean` | Whether the open/close animation plays. |

Every option is forwarded straight through to the underlying `SModal`
instance, and defaults to `SModal`'s own defaults when omitted.

`modals` is the full list of currently-open instances, mostly useful if
you're building your own rendering loop instead of relying on the
library's built-in one.

## Setup

The render loop that actually mounts opened modals lives inside `<SApp>` -
wrap your app's root with it once (typically in `app.vue`) and `useModal()`
works anywhere underneath:

```vue-html
<SApp>
  <NuxtPage />
</SApp>
```
