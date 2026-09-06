---
title: Popover
description: A generic floating content container built on Reka UI's Popover primitive.
order: 55
---

## Usage

Popover's `content` slot can hold anything - unlike
[Dropdown](/components/overlays/dropdown) (menu items) or
[Tooltip](/components/overlays/tooltip) (hover-only text), it's a blank,
interactive panel for things like a quick-edit form or a filter list:

::component-example{name="popover-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
const name = ref('')
</script>

<template>
  <SPopover v-model:open="open">
    <SButton variant="outline">
      Edit name
    </SButton>
    <template #content>
      <div class="flex w-64 flex-col gap-3">
        <p class="text-sm font-medium text-[var(--ui-text)]">
          Display name
        </p>
        <SInput v-model="name" placeholder="Jane Doe" />
        <SButton size="sm" @click="open = false">
          Save
        </SButton>
      </div>
    </template>
  </SPopover>
</template>
```

`v-model:open` is optional - omit it and the popover manages its own open
state internally, toggled by clicking the trigger.

### Side and align

`side` picks which edge of the trigger the panel opens from (`top`,
`right`, `left`, default `bottom`); `align` controls how it lines up
along that edge (`start`, `center` default, `end`):

::component-example{name="popover-side"}
::

```vue-html
<SPopover side="right" align="start">...</SPopover>
```

### Arrow

`arrow` shows a small pointer triangle connecting the panel to its
trigger:

::component-example{name="popover-arrow"}
::

```vue-html
<SPopover arrow>...</SPopover>
```

### Modal

Popover is non-modal by default - the rest of the page stays reachable,
and it isn't hidden from assistive tech. `modal="true"` traps focus and
blocks outside interaction instead, closer to how Modal/Slideover behave:

```vue-html
<SPopover modal>...</SPopover>
```

### Intercepting dismissal

Popover doesn't override Reka UI's own defaults (Escape and an outside
click both dismiss it), but exposes the underlying events so you can
`preventDefault()` on them:

```vue-html
<SPopover
  @escape-key-down="(e) => hasChanges && e.preventDefault()"
  @pointer-down-outside="(e) => hasChanges && e.preventDefault()"
>
  ...
</SPopover>
```

For the simpler, all-or-nothing case, `dismissible="false"` disables
Escape and outside-click (and, for a non-modal popover, an outside
element merely receiving focus) all at once - the raw events still fire,
so a consumer can still react, but none of them close it on their own:

```vue-html
<SPopover :dismissible="false">...</SPopover>
```

### Return focus on close

Reka returns keyboard focus to the trigger whenever the popover closes,
regardless of *why* it closed - including a purely programmatic `open`
change. That matters for a popover that can open on hover rather than a
deliberate click/keypress: focus landing back on a trigger nobody meant
to focus can itself count as focus moving "outside" whatever *other*
popover the pointer has since moved on to, closing that one too.
`returnFocusOnClose="false"` disables the behavior for cases like that:

```vue-html
<SPopover :return-focus-on-close="false">...</SPopover>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `open` | `boolean` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` |
| `modal` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `returnFocusOnClose` | `boolean` | `true` |
| `arrow` | `boolean` | `false` |
| `ui` | `Partial<Record<'content' \| 'arrow', string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Open state changed |
| `escapeKeyDown` | `KeyboardEvent` | Escape was pressed - `preventDefault()` to stop it from closing |
| `pointerDownOutside` | `Event` | A pointer went down outside the popover - `preventDefault()` to stop it from closing |
| `focusOutside` | `Event` | A non-modal popover's outside element received focus - `preventDefault()` to stop it from closing |
| `openAutoFocus` | `Event` | Fires right before focus moves into the popover on open - `preventDefault()` to skip autofocus for that open (e.g. a hover-triggered open that shouldn't yank focus, while a keyboard-triggered one still should) |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger element |
| `content` | The popover's own content |
