---
title: Editable
description: Edit text in place with a separate draft, keyboard shortcuts, and optional controls.
order: 20.5
---

## Usage

Editable shows saved text until editing begins. Typing changes an internal draft;
`v-model` updates only when you save. Cancel restores the saved text.
It fills the available width; constrain it with a class when needed.

::component-example{name="editable-basic"}
::

```vue
<script setup lang="ts">
const title = ref('Website refresh')
</script>

<template>
  <SEditable v-model="title" aria-label="Project name" />
</template>
```

### Activation and submission

`activationMode="focus"` starts editing when the preview receives focus or is
clicked. `dblclick` requires a double click, or Enter/Space when focused.
`none` turns off preview activation; the edit control, exposed `edit()` method,
or `v-model:editing` can still start editing.

| `submitMode` | Enter | Focus leaves the component |
| --- | --- | --- |
| `both` (default) | Save | Save |
| `enter` | Save | Cancel |
| `blur` | Keep editing | Save |
| `none` | Keep editing | Keep editing |

Save and Cancel controls remain available in every mode. Escape cancels.
Moving focus between the editor and its built-in controls does not submit.
IME confirmation does not save text.

### External controls and programmatic editing

Use `v-model:editing` to control editing from a toolbar or menu. Setting it to
`true` opens and focuses the editor; setting it to `false` discards the draft.
Call `submit()` to save before closing, rather than setting editing to false.

This example disables automatic activation and built-in controls. **Use
`submit-mode="none"` for external Save/Cancel buttons**, so leaving the input
to click Cancel does not save through a blur event first.

::component-example{name="editable-external-controls"}
::

```vue
<script setup lang="ts">
const title = ref('Design system')
const editing = ref(false)
const editable = useTemplateRef('editable')
</script>

<template>
  <SButton v-if="!editing" @click="editing = true">
    Rename
  </SButton>
  <template v-else>
    <SButton @click="editable?.submit()">
      Save
    </SButton>
    <SButton @click="editable?.cancel()">
      Cancel
    </SButton>
  </template>
  <SEditable
    ref="editable" v-model="title" v-model:editing="editing"
    activation-mode="none" submit-mode="none" :controls="false"
    aria-label="Project name"
  />
</template>
```

### Multiline

`multiline` renders a textarea. Enter adds a new line; Ctrl/Cmd+Enter saves when
`submitMode` includes Enter. Escape still cancels. `rows` defaults to 3.

::component-example{name="editable-multiline"}
::

### Forms, validation, and states

[FormField](/components/forms/form-field) supplies the label, id, descriptions,
name, size, and invalid state. Without FormField, provide an `aria-label` or
`aria-labelledby`. When `name` is set, native form data contains the **saved**
value, never an unsubmitted draft.

`required`, `maxLength`, and native attributes such as `minlength` and `pattern`
apply to the editor. Saving checks native validity and keeps invalid drafts
open for correction. `invalid` changes the visual state; it does not add a
validation rule. Native attributes and input event listeners reach the editor.

`disabled` and `readonly` prevent editing and discard an active draft. `loading`
blocks typing and actions while retaining the draft. Updating `modelValue`
externally replaces both saved text and any current draft.

::component-example{name="editable-states"}
::

### Custom content and controls

The `preview` slot replaces the saved-text display; the default slot is its
fallback. Keep interactive elements outside the preview button. The `controls`
slot receives the current saved value, draft, editing/disabled state, and
`edit`, `submit`, and `cancel` functions.

::component-example{name="editable-custom-controls"}
::

### Customization

`size` accepts `sm`, `md`, and `lg`. `color` sets the editor focus color and
Save button color; invalid fields use the danger focus color. Global or scoped
[theme configuration](/overview/theming/component-styling) supports
`defaults.editable` and `ui.editable`; per-instance `ui` overrides individual
slots. `editIcon`, `submitIcon`, and `cancelIcon` override the controls.
`editLabel`, `submitLabel`, and `cancelLabel` override their accessible text.

Global icon keys are `edit`, `check`, and `close`. Message keys are `edit`,
`save`, `cancel`, `editableInput`, and `editablePlaceholder`.

::theme-source{name="editable"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `string` | — |
| `defaultValue` | `string` | `''` |
| `editing` | `boolean` | Uncontrolled |
| `defaultEditing` | `boolean` | `false` |
| `activationMode` | `'focus' \| 'dblclick' \| 'none'` | `focus` |
| `submitMode` | `'enter' \| 'blur' \| 'both' \| 'none'` | `both` |
| `controls` | `boolean` | `true` |
| `multiline` | `boolean` | `false` |
| `rows` | `number` | `3` |
| `placeholder` | `string \| { preview: string, edit: string }` | Preview message / empty input |
| `selectOnFocus` | `boolean` | `true` |
| `disabled` / `readonly` / `loading` / `invalid` / `required` | `boolean` | `false` |
| `maxLength` | `number` | — |
| `id` / `name` | `string` | From FormField |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `ColorRole` | `primary` |
| `editIcon` / `submitIcon` / `cancelIcon` | `string` | Global icons |
| `editLabel` / `submitLabel` / `cancelLabel` | `string` | Global messages |
| `ui` | Slot class overrides | — |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | A valid draft was saved |
| `update:editing` | `boolean` | Requests an editing-state change |
| `edit` | — | Editing began |
| `submit` | `string` | Saved value |
| `cancel` | `string` | Unchanged saved value after discarding the draft |

## Slots

All slots receive `{ value, draft, editing, disabled, edit, submit, cancel }`.

| Slot | Description |
| --- | --- |
| `preview` | Saved-text display |
| `default` | Fallback saved-text display |
| `controls` | Replacement editing controls |

## Exposed methods

| Method | Description |
| --- | --- |
| `edit()` | Starts editing unless blocked |
| `submit()` | Saves and closes; returns `false` if blocked, invalid, or already closed |
| `cancel()` | Discards the draft and closes |
