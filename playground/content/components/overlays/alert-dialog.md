---
title: AlertDialog
description: A confirmation dialog that can't be dismissed by an outside click, built on Reka UI's AlertDialog primitive.
order: 50.5
---

## Usage

AlertDialog is Modal's stricter sibling for a "are you sure?" confirmation -
an outside click never closes it (Reka blocks that unconditionally), and it
already ships default Cancel/Continue buttons, so the common case needs no
`footer` slot at all:

::component-example{name="alert-dialog-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
const { add } = useToast()

function onConfirm() {
  add({ title: 'Account deleted', color: 'success' })
}
</script>

<template>
  <SButton color="danger" variant="soft" @click="open = true">
    Delete account
  </SButton>

  <SAlertDialog
    v-model:open="open"
    title="Delete account"
    description="This will permanently delete your account. This action cannot be undone."
    action-color="danger"
    action-label="Delete account"
    @confirm="onConfirm"
  />
</template>
```

Always pass `title` (or a `header` slot containing a heading) - without
one, the dialog has no accessible name for screen readers, and dev mode
warns about it.

The action button already closes the dialog on click (same as Cancel) -
`confirm`/`cancel` fire alongside that, not instead of it, so `@confirm`
only needs to run the actual side effect.

### Custom footer

A `footer` slot replaces the default Cancel/Continue pair entirely -
useful for more than two choices:

::component-example{name="alert-dialog-custom-footer"}
::

```vue-html
<SAlertDialog v-model:open="open" title="Unsaved changes" description="You have unsaved changes. What would you like to do?">
  <template #footer>
    <SButton variant="ghost" @click="open = false">Cancel</SButton>
    <SButton color="danger" variant="soft" @click="discard">Discard</SButton>
    <SButton color="primary" @click="save">Save changes</SButton>
  </template>
</SAlertDialog>
```

A custom footer owns its own buttons and click handlers entirely - it
doesn't emit `confirm`/`cancel` (those are specific to the default footer),
and nothing auto-closes the dialog for you, same as Modal's own `footer`
slot.

### Why not just Modal?

`SModal` already supports `dismissible="false"` for a dialog that can't be
dismissed by Escape or an outside click - but that's opt-in per instance,
and still lets a consumer plug it back in wrong. `SAlertDialog` bakes the
outside-click block into Reka's own primitive instead, so it's not a
setting to get right or forget - the two components exist for genuinely
different intents:

```vue-html
<!-- Escape and outside click both work by default -->
<SModal v-model:open="open" title="Edit profile" />

<!-- Outside click can never close it - Escape still can (dismissible="false" blocks that too) -->
<SAlertDialog v-model:open="open" title="Delete account" description="..." />
```

Escape still closes an `SAlertDialog` by default, the same as `SModal` -
`dismissible="false"` blocks that too, for a dialog that must be answered
via one of the footer buttons:

```vue-html
<SAlertDialog v-model:open="open" :dismissible="false" title="Confirm your plan" description="..." />
```

The `escapeKeyDown`/`pointerDownOutside` events still fire either way -
useful for something like a shake animation to signal the dialog won't
close that way.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's the dialog's own theme file:

::theme-source{name="alert-dialog"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `open` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `cancelLabel` | `string` | `'Cancel'` |
| `actionLabel` | `string` | `'Continue'` |
| `actionColor` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | - |
| `dismissible` | `boolean` | `true` |
| `overlay` | `boolean` | `true` |
| `transition` | `boolean` | `true` |
| `ui` | `Partial<Record<'overlay' \| 'content' \| 'header' \| 'title' \| 'description' \| 'body' \| 'footer', string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Open state changed |
| `cancel` | - | The default Cancel button was clicked |
| `confirm` | - | The default action button was clicked |
| `escapeKeyDown` | `KeyboardEvent` | Escape was pressed - `preventDefault()` to stop it from closing |
| `pointerDownOutside` | `Event` | A pointer went down outside the dialog - can never actually close it, but still useful for e.g. a shake animation |
| `afterLeave` | - | The close transition has finished (or fires immediately if `transition` is `false`) |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger element |
| `header` | Overrides the default title/description block |
| `body` | Optional extra content between the header and footer |
| `footer` | Overrides the default Cancel/Continue buttons |
