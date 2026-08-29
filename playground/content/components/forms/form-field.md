---
title: FormField
description: Label, description, hint, and error-message wrapper that wires id/aria-describedby/invalid into whatever form control it wraps.
order: 27
---

## Usage

Wrap any single form control - Input, Textarea, Select, Autocomplete, Checkbox,
RadioGroup, or Switch - and FormField generates a matching `id`, links the
label to it, and computes `aria-describedby` from whichever of `hint`/`error`
is currently showing. The wrapped control picks all of this up automatically;
you don't pass `id` or `aria-describedby` yourself.

```vue
<script setup lang="ts">
const email = ref('')
</script>

<template>
  <SFormField label="Email" name="email" hint="We'll never share this.">
    <SInput v-model="email" type="email" placeholder="you@example.com" />
  </SFormField>
</template>
```

### Description

`description` adds a second, muted line under the label, before the
control - for context the user should read before reaching it (unlike
`hint`, which sits below the control instead):

```vue-html
<SFormField label="Email" description="We'll use this to send your receipt.">
  <SInput v-model="email" type="email" />
</SFormField>
```

### Error state

Set `error` to a string to show a message in place of the hint and mark the
control `invalid` (a red ring/outline, `aria-invalid="true"`). Passing
`error` as `true` (no message) still marks the control invalid without
rendering any text.

```vue-html
<SFormField label="Email" error="Enter a valid email address">
  <SInput v-model="email" type="email" />
</SFormField>
```

### Required indicator

```vue-html
<SFormField label="Name" required>
  <SInput v-model="name" />
</SFormField>
```

### Works with any control

```vue-html
<SFormField label="Plan" name="plan">
  <SSelect v-model="plan" :items="planItems" />
</SFormField>

<SFormField error="You must accept the terms">
  <SCheckbox v-model="accepted" label="Accept terms" />
</SFormField>
```

A control's own `id`/`name` still win over FormField's if you set them
explicitly. `invalid` is OR'd with the field's error state instead, so a
control can opt into looking invalid on its own even without an error, but
can't be forced back to valid while its FormField has one.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` | - |
| `name` | `string` | - |
| `description` | `string` | - |
| `hint` | `string` | - |
| `error` | `string \| boolean` | - |
| `required` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | - |
| `ui` | `Partial<Record<'root' \| 'label' \| 'required' \| 'description' \| 'container' \| 'hint' \| 'error', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| default | `{ id, invalid, describedBy }` | The wrapped control. Props are also available if you need to bind them manually. |
| `description` | - | Custom content, overrides `description` |
