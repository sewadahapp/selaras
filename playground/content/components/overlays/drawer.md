---
title: Drawer
description: A drag-to-dismiss panel that slides in from an edge, built on Reka UI's Drawer primitive.
order: 56
---

## Usage

Drawer visibility is controlled with `v-model:open`, so it needs a ref
from the page it's used on. Unlike [Slideover](/components/overlays/slideover),
which is built on Reka's Dialog primitive, Drawer is built on Reka's own
Drawer primitive - real drag-to-dismiss and (below) resting snap points,
not just a slide animation:

::component-example{name="drawer-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open drawer
  </SButton>

  <SDrawer v-model:open="open" title="Edit profile" description="Update your personal details.">
    <template #body>
      Drawer content goes here.
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Cancel
      </SButton>
      <SButton @click="open = false">
        Save
      </SButton>
    </template>
  </SDrawer>
</template>
```

Always pass `title` (or a `header`/`content` slot containing a heading) -
without one, the panel has no accessible name for screen readers, and dev
mode warns about it.

### Side

`side` picks which edge the panel slides in from (and the direction it's
swiped toward to dismiss it) - `top`, `right`, `bottom` (default), or
`left`. Unlike Slideover's `'right'` default, a drawer defaults to `bottom`
- the classic mobile bottom sheet:

::component-example{name="drawer-side"}
::

```vue-html
<SDrawer v-model:open="open" side="left" title="Filters" />
```

### Snap points

`snapPoints` gives the panel resting heights (or widths, for a `left`/
`right` drawer) to drag between before it's fully open - fractions
(`0`-`1`), pixels (`> 1`), or CSS length strings (`'30rem'`). Pair with
`v-model:snap-point` to read or control which one is currently active.
`snapToSequentialPoints` (default `false`) restricts dragging to one step
at a time instead of jumping to whichever point is nearest:

::component-example{name="drawer-snap-points"}
::

```vue-html
<SDrawer
  v-model:open="open"
  v-model:snap-point="snapPoint"
  :snap-points="[0.3, 0.6, 1]"
  title="Drag me"
/>
```

### Handle

A small grip bar shows at the top of the panel by default, signaling it's
draggable - set `handle="false"` to remove it:

```vue-html
<SDrawer v-model:open="open" :handle="false" title="No handle" />
```

### Custom content

`content` replaces the header/title/description/body/footer structure
entirely - useful when the panel doesn't fit the header-plus-body shape at
all. `close`/`handle` are ignored once `content` is provided, since the
slot owns the whole visible panel - but `title`/`description`, if still
set, stay registered with Reka as the panel's accessible name/description,
just visually hidden instead of rendered as a header. Pass them if your
own custom content doesn't already include a heading Reka can associate
with the panel:

::component-example{name="drawer-content"}
::

```vue-html
<SDrawer v-model:open="open">
  <template #content>
    <div class="flex flex-col items-center gap-4 p-8 text-center">
      ...
    </div>
  </template>
</SDrawer>
```

### Non-modal

`modal="false"` stops the panel from blocking interaction with the rest of
the page - no focus trap, outside elements stay reachable and aren't hidden
from assistive tech. `overlay` is independent of this - a non-modal panel
can still show (or hide) its own backdrop:

```vue-html
<SDrawer v-model:open="open" :modal="false" title="Non-modal" />
```

### Intercepting dismissal

`SDrawer` doesn't override Reka UI's own defaults (Escape, an outside
click, and a drag-to-dismiss swipe all dismiss it), but exposes the
underlying events so you can `preventDefault()` on them - e.g. to confirm
before closing a panel with unsaved changes. A swipe has no separate event
of its own to intercept ahead of time (Reka only reports it after the
fact), so it can only be blocked wholesale via `dismissible`, not
conditionally per attempt like Escape/outside-click:

```vue-html
<SDrawer
  v-model:open="open"
  title="Edit profile"
  @escape-key-down="(e) => hasChanges && e.preventDefault()"
  @pointer-down-outside="(e) => hasChanges && e.preventDefault()"
/>
```

For the simpler, all-or-nothing case - a panel that must not be dismissed
by anything but an explicit choice - `dismissible="false"` disables
Escape, outside-click, and swipe-to-dismiss all at once, and
`close="false"` removes the close button too:

```vue-html
<SDrawer v-model:open="open" :dismissible="false" :close="false" title="Confirm your plan" />
```

## Programmatic usage

`useDrawer()` opens a panel from anywhere - a click handler, an async
callback - without a `v-model` of your own to manage. It works
automatically once `<SApp>` wraps your app, exactly like `useModal()`/
`useSlideover()`; there's nothing extra to place.

The given component owns the panel's entire content, the same as the
`content` slot. `open()` returns a promise that resolves with whatever
value the component's own `close` event carries, so an explicit action can
resolve with real data while dismissing via Escape, an outside click, or a
swipe resolves with `undefined`:

::component-example{name="drawer-use-drawer"}
::

```ts
import DrawerCartPanel from './DrawerCartPanel.vue'

const drawer = useDrawer()
const checkedOut = await drawer.open(DrawerCartPanel)
// true, false, or undefined if dismissed without an explicit choice
```

`open()` also takes the same `title`/`description`/`side`/`handle`/
`snapPoints`/`snapPoint`/`snapToSequentialPoints`/`dismissible`/`modal`/
`overlay`/`transition` options as the declarative props.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `open` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `handle` | `boolean` | `true` |
| `snapPoints` | `(number \| string)[]` | - |
| `snapPoint` | `number \| string \| null` | - |
| `snapToSequentialPoints` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `close` | `boolean` | `true` |
| `modal` | `boolean \| 'trap-focus'` | `true` |
| `overlay` | `boolean` | `true` |
| `transition` | `boolean` | `true` |
| `ui` | `Partial<Record<DrawerSlot, string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Open state changed |
| `update:snapPoint` | `number \| string \| null` | Active snap point changed |
| `escapeKeyDown` | `KeyboardEvent` | Escape was pressed - `preventDefault()` to stop it from closing |
| `pointerDownOutside` | `Event` | A pointer went down outside the panel - `preventDefault()` to stop it from closing |
| `focusOutside` | `Event` | A non-modal panel's outside element received focus - `preventDefault()` to stop it from closing |
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
