---
title: Input
description: A text input with optional leading and trailing icons.
order: 20
---

## Usage

::component-example{name="input-basic"}
::

```vue
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <SInput v-model="value" placeholder="Type something..." />
</template>
```

Input is full-width by default, rather than needing an opt-in flag to make
it so - constrain it with a class on the component itself (as the examples
on this page do with `max-w-xs`), not a wrapping element.

### Icons

`icon` and `trailingIcon` add an icon before or after the text - the same
props [Button](/components/elements/button#icons) uses for its own.

::component-example{name="input-icons"}
::

```vue-html
<SInput v-model="search" icon="ph:magnifying-glass" placeholder="Search..." />
<SInput v-model="amount" trailing-icon="ph:currency-dollar" placeholder="0.00" />
```

### Clear

`clearable` adds a button that empties the value, once there's something to
clear - it takes over the trailing position from `trailingIcon` while active,
the same way [Select's](/components/forms/select#clear) does.

::component-example{name="input-clear"}
::

```vue-html
<SInput v-model="value" clearable placeholder="Type something..." />
```

### Sizes and states

`size` takes `sm` / `md` / `lg`, `disabled` prevents interaction and dims the
input, and `invalid` switches the ring to `--ui-danger`:

::component-example{name="input-invalid"}
::

```vue-html
<SInput v-model="email" invalid placeholder="you@example.com" />
```

See the [Props](#props) table below.

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid`
and `aria-describedby` wired up automatically, plus a `hint`/`error` message
underneath - FormField is also where `size` and `invalid` fall back to when
not set directly on the input.

### Accessibility

Input renders a plain native `<input>`, so browser and screen-reader support
for typing, selection, and autofill all come for free. `aria-invalid` and
`aria-describedby` are set automatically once `invalid` is true or the input
is wrapped in [FormField](/components/forms/form-field) - nothing to
configure by hand for the common case.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `string \| number` | - |
| `type` | `string` | `text` |
| `placeholder` | `string` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'base' \| 'leadingIcon' \| 'trailingIcon' \| 'clear', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `clear-icon` | - | Replaces the clear button's icon (default: `ph:x`) |
