---
title: Modal
description: A dialog overlay built on Reka UI's Dialog primitive.
order: 50
---

## Usage

Modal visibility is controlled with `v-model:open`, so it needs a ref from
the page it's used on.

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

  <SModal v-model:open="open" title="Delete item" description="This action cannot be undone.">
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

Always pass `title` (or a `header`/`content` slot containing a heading) -
without one, the dialog has no accessible name for screen readers, and dev
mode warns about it.

### Controlling it programmatically

`open` is a real controlled value, not tied to a click - setting it
from anywhere (a timeout, an async callback, a route watcher, another
component) opens the dialog identically. No trigger element, or even a
default slot, is required:

::component-example{name="modal-programmatic"}
::

```vue-html
<SModal v-model:open="open" title="Opened by the timeout" />
```

```ts
function simulate() {
  setTimeout(() => {
    open.value = true
  }, 1000)
}
```

### Custom content

`content` replaces the header/title/description/body/footer structure
entirely - useful when the dialog doesn't fit the header-plus-body shape at
all (a success screen, a fully custom form layout). `close`/`maximizable`
are ignored once `content` is provided, since the slot owns the whole
visible dialog - but `title`/`description`, if still set, stay registered
with Reka as the dialog's accessible name/description, just visually
hidden instead of rendered as a header. Pass them if your own custom
content doesn't already include a heading Reka can associate with the
dialog:

::component-example{name="modal-content"}
::

```vue-html
<SModal v-model:open="open">
  <template #content>
    <div class="flex flex-col items-center gap-4 p-8 text-center">
      ...
    </div>
  </template>
</SModal>
```

### Fullscreen

`fullscreen` takes the dialog full-viewport instead of the default centered
card - useful for image viewers, complex forms, or anything that benefits
from the extra room.

::component-example{name="modal-fullscreen"}
::

```vue-html
<SModal v-model:open="open" fullscreen title="Fullscreen" />
```

### Maximizable

`fullscreen` alone only sets a fixed initial layout - `maximizable` adds a
header button next to close that lets the user toggle between the default
and full-viewport layout at runtime, matching a comparable reference's
own dialog maximize toggle. `fullscreen` still sets which one it starts
in; pair with `v-model:fullscreen` if you need to read or control the
current state yourself:

::component-example{name="modal-maximizable"}
::

```vue-html
<SModal v-model:open="open" maximizable title="Report" />
```

### Non-modal

`modal="false"` stops the dialog from blocking interaction with the rest of
the page - no focus trap, outside elements stay reachable and aren't hidden
from assistive tech. `overlay` is independent of this - a non-modal dialog
can still show (or hide) its own backdrop:

::component-example{name="modal-non-modal"}
::

```vue-html
<SModal v-model:open="open" :modal="false" title="Non-modal" />
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
  v-model:open="open"
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
<SModal v-model:open="open" :dismissible="false" :close="false" title="Confirm your plan" />
```

The two raw events still fire even with `dismissible="false"` - useful for
something like a shake animation to signal the dialog won't close that way.

### Customizing the close/maximize buttons

Both header buttons render as real `<SButton>`s, so `:ui.close`/`:ui.maximize`
already reach them fully - not just classes. An object `:ui` value's
non-`class` keys apply as raw attrs/props, so `:ui="{ close: { color: 'danger' } }"`
works today without a dedicated prop for it:

```vue-html
<SModal v-model:open="open" title="Delete item" :ui="{ close: { color: 'danger' } }" />
```

## Programmatic usage

`useModal()` opens a dialog from anywhere - a click handler, an async
callback - without a `v-model` of your own to manage. It works
automatically once `<SApp>` wraps your app, exactly like every other
component here; there's nothing extra to place, unlike `<SToast />`.

The given component owns the dialog's entire content, the same as the
`content` slot above - its own heading, its own buttons. `open()` returns
a promise that resolves with whatever value the component's own `close`
event carries, so an explicit action can resolve with real data while
dismissing via Escape or an outside click resolves with `undefined`:

::component-example{name="modal-use-modal"}
::

```vue-html
<!-- ModalConfirmDialog.vue - a self-contained dialog -->
<template>
  <div class="p-8 text-center">
    <h2>Delete this item?</h2>
    <SButton variant="ghost" @click="$emit('close', false)">Cancel</SButton>
    <SButton color="danger" @click="$emit('close', true)">Delete</SButton>
  </div>
</template>
```

```ts
import ModalConfirmDialog from './ModalConfirmDialog.vue'

const modal = useModal()
const confirmed = await modal.open(ModalConfirmDialog)
// true, false, or undefined if dismissed without an explicit choice
```

`open()` also takes the same `title`/`description`/`dismissible`/`modal`/
`overlay`/`transition` options as the declarative props - `title`/
`description` are the only way to give a programmatically-opened dialog a
real accessible name/description, since the opened component always
renders through the `content` slot:

```ts
await modal.open(ModalConfirmDialog, { dismissible: false })
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `open` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `fullscreen` | `boolean` | `false` |
| `maximizable` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `close` | `boolean` | `true` |
| `modal` | `boolean` | `true` |
| `overlay` | `boolean` | `true` |
| `transition` | `boolean` | `true` |
| `ui` | `Partial<Record<'overlay' \| 'content' \| 'header' \| 'headerActions' \| 'title' \| 'description' \| 'close' \| 'maximize' \| 'body' \| 'footer', string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Open state changed |
| `update:fullscreen` | `boolean` | Fired when `maximizable`'s toggle button changes the layout |
| `escapeKeyDown` | `KeyboardEvent` | Escape was pressed - `preventDefault()` to stop it from closing |
| `pointerDownOutside` | `Event` | A pointer went down outside the dialog - `preventDefault()` to stop it from closing |
| `focusOutside` | `Event` | A non-modal dialog's outside element received focus - `preventDefault()` to stop it from closing |
| `afterLeave` | - | The close transition has finished (or fires immediately if `transition` is `false`) |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger element |
| `content` | Replaces the visible header/body/footer entirely (title/description, if set, still register for a11y) |
| `header` | Overrides the default title/description block |
| `body` | Main content |
| `footer` | Usually action buttons |
| `close-icon` | Replaces the close button's icon (default: `hugeicons:cancel-01`) |
| `maximize-icon` | Replaces the maximize button's icon while not fullscreen |
| `minimize-icon` | Replaces the maximize button's icon while fullscreen |
