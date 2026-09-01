---
title: Slideover
description: A panel that slides in from an edge of the screen, built on Reka UI's Dialog primitive.
order: 54
---

## Usage

Slideover visibility is controlled with `v-model:open`, so it needs a ref
from the page it's used on.

::component-example{name="slideover-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open slideover
  </SButton>

  <SSlideover v-model:open="open" title="Edit profile" description="Update your personal details.">
    <template #body>
      Slideover content goes here.
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Cancel
      </SButton>
      <SButton @click="open = false">
        Save
      </SButton>
    </template>
  </SSlideover>
</template>
```

Always pass `title` (or a `header`/`content` slot containing a heading) -
without one, the panel has no accessible name for screen readers, and dev
mode warns about it.

### Side

`side` picks which edge the panel slides in from - `top`, `right`
(default), `bottom`, or `left`:

::component-example{name="slideover-side"}
::

```vue-html
<SSlideover v-model:open="open" side="left" title="Filters" />
```

### Inset

`inset` floats the panel with a margin and rounded corners instead of
sitting flush against the edge:

::component-example{name="slideover-inset"}
::

```vue-html
<SSlideover v-model:open="open" inset title="Notifications" />
```

### Custom content

`content` replaces the header/title/description/body/footer structure
entirely - useful when the panel doesn't fit the header-plus-body shape at
all. `title`/`description`/`close` are all ignored once `content` is
provided, since the slot owns the whole panel:

::component-example{name="slideover-content"}
::

```vue-html
<SSlideover v-model:open="open">
  <template #content>
    <div class="flex flex-col items-center gap-4 p-8 text-center">
      ...
    </div>
  </template>
</SSlideover>
```

### Non-modal

`modal="false"` stops the panel from blocking interaction with the rest of
the page - no focus trap, outside elements stay reachable and aren't hidden
from assistive tech. `overlay` is independent of this - a non-modal panel
can still show (or hide) its own backdrop:

::component-example{name="slideover-non-modal"}
::

```vue-html
<SSlideover v-model:open="open" :modal="false" title="Non-modal" />
```

### Scrollable content

The panel is capped to the viewport - a body taller than that scrolls
internally on its own, while the header and footer stay pinned in place.

::component-example{name="slideover-scrollable"}
::

### Intercepting dismissal

`SSlideover` doesn't override Reka UI's own defaults (Escape and an
outside click both dismiss it), but exposes the underlying events so you
can `preventDefault()` on them - e.g. to confirm before closing a panel
with unsaved changes:

```vue-html
<SSlideover
  v-model:open="open"
  title="Edit profile"
  @escape-key-down="(e) => hasChanges && e.preventDefault()"
  @pointer-down-outside="(e) => hasChanges && e.preventDefault()"
/>
```

For the simpler, all-or-nothing case - a panel that must not be dismissed
by anything but an explicit choice - `dismissible="false"` disables both
Escape and outside-click at once, and `close="false"` removes the close
button too:

```vue-html
<SSlideover v-model:open="open" :dismissible="false" :close="false" title="Confirm your plan" />
```

The two raw events still fire even with `dismissible="false"` - useful for
something like a shake animation to signal the panel won't close that way.

### Customizing the close button

The close button renders as a real `<SButton>`, so `:ui.close` already
reaches it fully - not just classes. An object `:ui` value's non-`class`
keys apply as raw attrs/props, so `:ui="{ close: { color: 'danger' } }"`
works today without a dedicated prop for it:

```vue-html
<SSlideover v-model:open="open" title="Delete item" :ui="{ close: { color: 'danger' } }" />
```

## Programmatic usage

`useSlideover()` opens a panel from anywhere - a click handler, an async
callback - without a `v-model` of your own to manage. It works
automatically once `<SApp>` wraps your app, exactly like `useModal()`;
there's nothing extra to place.

The given component owns the panel's entire content, the same as the
`content` slot above - its own heading, its own buttons. `open()` returns
a promise that resolves with whatever value the component's own `close`
event carries, so an explicit action can resolve with real data while
dismissing via Escape or an outside click resolves with `undefined`:

::component-example{name="slideover-use-slideover"}
::

```vue-html
<!-- SlideoverFilterPanel.vue - a self-contained panel -->
<template>
  <div class="flex h-full flex-col">
    <h2>Filters</h2>
    <SCheckbox label="In stock only" />
    <SButton variant="ghost" @click="$emit('close', false)">Cancel</SButton>
    <SButton @click="$emit('close', true)">Apply</SButton>
  </div>
</template>
```

```ts
import SlideoverFilterPanel from './SlideoverFilterPanel.vue'

const slideover = useSlideover()
const applied = await slideover.open(SlideoverFilterPanel)
// true, false, or undefined if dismissed without an explicit choice
```

`open()` also takes the same `side`/`inset`/`dismissible`/`modal`/
`overlay`/`transition` options as the declarative props:

```ts
await slideover.open(SlideoverFilterPanel, { side: 'left' })
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `open` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `inset` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `close` | `boolean` | `true` |
| `modal` | `boolean` | `true` |
| `overlay` | `boolean` | `true` |
| `transition` | `boolean` | `true` |
| `ui` | `Partial<Record<'overlay' \| 'content' \| 'header' \| 'title' \| 'description' \| 'close' \| 'body' \| 'footer', string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Open state changed |
| `escapeKeyDown` | `KeyboardEvent` | Escape was pressed - `preventDefault()` to stop it from closing |
| `pointerDownOutside` | `Event` | A pointer went down outside the panel - `preventDefault()` to stop it from closing |
| `focusOutside` | `Event` | A non-modal panel's outside element received focus - `preventDefault()` to stop it from closing |
| `afterLeave` | - | The close transition has finished (or fires immediately if `transition` is `false`) |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger element |
| `content` | Replaces header/title/description/body/footer entirely |
| `header` | Overrides the default title/description block |
| `body` | Main content |
| `footer` | Usually action buttons |
| `close-icon` | Replaces the close button's icon (default: `hugeicons:cancel-01`) |
