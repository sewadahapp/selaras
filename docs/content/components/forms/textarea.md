---
title: Textarea
description: A multi-line text input, matching Input's border interaction pattern.
order: 21
---

## Usage

::component-example{name="textarea-basic"}
::

```vue
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <STextarea v-model="value" placeholder="Write something..." />
</template>
```

Textarea is full-width by default, the same as [Input](/components/forms/input) -
constrain it with a class on the component itself, not a wrapping element.
Native `<textarea>` attributes not listed below (`maxlength`, `pattern`,
`readonly`, `spellcheck`, ...) already pass straight through to the real
element - no dedicated prop needed for them.

### Icons

`icon` and `trailingIcon` add an icon before or after the text, the same
props [Input](/components/forms/input#icons) uses for its own - anchored
to the top corner here rather than vertically centered, since centering
against the whole box would drift away from the first line once content
wraps past one line:

::component-example{name="textarea-icons"}
::

```vue-html
<STextarea v-model="value" icon="hugeicons:chat" placeholder="Leave a comment..." />
```

### Custom leading and trailing content

Use `#leading` and `#trailing` for text, icons, or buttons inside the field frame.
The slots receive `{ disabled, size, buttonSize }`; `buttonSize` fits a Button
inside the current field size. Give interactive controls an accessible label,
use `type="button"`, and pass `disabled` through to match the field state.

Custom content stays visible alongside the built-in clear button. It replaces the corresponding decorative `icon` or `trailingIcon`.
The field reserves space for the rendered content, including suffixes whose
width changes. Use `ui.leading` and `ui.trailing` to customize its wrappers.

::component-example{name="textarea-addons"}
::

### Clear

`clearable` adds a button that empties the value, once there's something to
clear. It hides when empty, `disabled`, or `readonly`, and restores focus to
the textarea after clearing. Like [Input](/components/forms/input#clear), it
uses an inset neutral `ghost` target. Customize it with `ui.clear` or
`#clear-icon`; see [shared clear styling](/overview/theming/component-styling#field-clear-controls).

::component-example{name="textarea-clear"}
::

```vue-html
<STextarea v-model="value" clearable placeholder="Write something..." />
```

### Autoresize

`autoresize` grows the box to fit its content instead of a fixed height with
a scrollbar/drag-handle; `maxrows` caps how far it can grow before falling
back to a scrollbar (unset or `0` grows indefinitely). Manual resizing
(the drag-handle in the box's own corner) is disabled while `autoresize` is
on - the two would otherwise fight each other on the very next keystroke:

::component-example{name="textarea-autoresize"}
::

```vue-html
<STextarea v-model="value" autoresize :maxrows="6" placeholder="Keep typing..." />
```

### Sizes and states

`size` takes `sm` / `md` / `lg`, `disabled` prevents interaction and dims the
textarea, and `invalid` switches the ring to the danger role's focus color:

::component-example{name="textarea-invalid"}
::

```vue-html
<STextarea v-model="value" invalid placeholder="Write something..." />
```

See the [Props](#props) table below.

### Colors

`color` sets the focus-ring color - the resting (unfocused) ring stays
`--selaras-resolved-border-default` regardless, and `invalid` always wins over a custom `color`:

::component-example{name="textarea-colors"}
::

```vue-html
<STextarea v-model="primary" color="primary" placeholder="Primary" />
<STextarea v-model="success" color="success" placeholder="Success" />
<STextarea v-model="danger" color="danger" placeholder="Danger" />
```

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid`
and `aria-describedby` wired up automatically, plus a `hint`/`error` message
underneath - FormField is also where `size` and `invalid` fall back to when
not set directly on the textarea.

### Accessibility

Textarea renders a plain native `<textarea>`, so browser and screen-reader
support for typing, selection, and autofill all come for free. `aria-invalid`
and `aria-describedby` are set automatically once `invalid` is true or the
textarea is wrapped in [FormField](/components/forms/form-field) - nothing
to configure by hand for the common case.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `Textarea`'s own theme file:

::theme-source{name="textarea"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `string` | - |
| `placeholder` | `string` | - |
| `rows` | `number` | `3` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `clearable` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `autoresize` | `boolean` | `false` |
| `maxrows` | `number` | - |
| `ui` | `Partial<Record<'root' \| 'base' \| 'leadingIcon' \| 'trailingIcon' \| 'leading' \| 'trailing' \| 'clear', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `leading` | `{ disabled, size, buttonSize }` | Custom content before the text; replaces `icon` |
| `trailing` | `{ disabled, size, buttonSize }` | Custom content after the text, alongside the clear button; replaces `trailingIcon` |
| `clear-icon` | - | Replaces the clear button's icon (default: `hugeicons:cancel-01`) |
