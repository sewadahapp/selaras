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

### Fullscreen

`fullscreen` takes the dialog full-viewport instead of the default centered
card - useful for image viewers, complex forms, or anything that benefits
from the extra room.

::component-example{name="modal-fullscreen"}
::

```vue-html
<SModal v-model="open" fullscreen title="Fullscreen" />
```

### Scrollable content

The dialog is capped to the viewport height - a body taller than that
scrolls internally on its own, while the header and footer stay pinned in
place.

::component-example{name="modal-scrollable"}
::

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

For the simpler, all-or-nothing case - a dialog that must not be dismissed
by anything but an explicit choice - `dismissible="false"` disables both
Escape and outside-click at once, and `close="false"` removes the close
button too:

::component-example{name="modal-dismissible"}
::

```vue-html
<SModal v-model="open" :dismissible="false" :close="false" title="Confirm your plan" />
```

The two raw events still fire even with `dismissible="false"` - useful for
something like a shake animation to signal the dialog won't close that way.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `fullscreen` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `close` | `boolean` | `true` |
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
