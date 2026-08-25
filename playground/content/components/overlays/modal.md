---
title: Modal
description: A dialog overlay built on Reka UI's Dialog primitive.
order: 50
---

## Usage

Modal visibility is controlled with `v-model`, so it needs a ref from the
page it's used on.

::component-example{name="modal-basic"}
::

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

Always pass `title` (or a `header` slot containing a heading) - without one,
the dialog has no accessible name for screen readers, and dev mode warns
about it.

### Intercepting dismissal

`SModal` doesn't override Reka UI's own defaults (Escape and an outside
click both dismiss it), but exposes the underlying events so you can
`preventDefault()` on them - e.g. to confirm before closing a dialog with
unsaved changes:

```vue-html
<SModal
  v-model="open"
  title="Edit profile"
  @escape-key-down="(e) => hasChanges && e.preventDefault()"
  @pointer-down-outside="(e) => hasChanges && e.preventDefault()"
/>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `ui` | `Partial<Record<'overlay' \| 'content' \| 'header' \| 'title' \| 'description' \| 'close' \| 'body' \| 'footer', string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Open state changed |
| `escapeKeyDown` | `KeyboardEvent` | Escape was pressed - `preventDefault()` to stop it from closing |
| `pointerDownOutside` | `Event` | A pointer went down outside the dialog - `preventDefault()` to stop it from closing |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger element |
| `header` | Overrides the default title/description block |
| `body` | Main content |
| `footer` | Usually action buttons |
