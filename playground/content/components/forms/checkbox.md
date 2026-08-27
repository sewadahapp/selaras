---
title: Checkbox
description: A checkbox with an optional label, built on Reka UI's Checkbox primitive.
order: 24
---

## Usage

::component-example{name="checkbox-basic"}
::

```vue
<script setup lang="ts">
const accepted = ref(true)
</script>

<template>
  <SCheckbox v-model="accepted" label="Accept terms" />
</template>
```

### States

`modelValue` also takes `'indeterminate'`, for a "select all" checkbox
whose children are only partially selected - it renders a dash instead of
a checkmark and isn't a real toggle state a click can land on (clicking an
indeterminate checkbox goes straight to checked). `disabled` prevents
interaction and dims it, and `invalid` switches the ring to `--ui-danger`:

::component-example{name="checkbox-states"}
::

```vue-html
<SCheckbox v-model="indeterminate" label="Select all" />
<SCheckbox :model-value="false" disabled label="Disabled" />
<SCheckbox v-model="disabledChecked" disabled label="Disabled, checked" />
<SCheckbox v-model="invalidChoice" invalid label="You must accept to continue" />
```

See [Props](#props).

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` falls back to
FormField's own state when not set directly on the checkbox.

### Accessibility

Checkbox renders Reka UI's Checkbox primitive, so the accessibility
semantics come from there rather than being reimplemented here: `role="checkbox"`
with `aria-checked` reflecting all three states (`true`/`false`, or `"mixed"`
for indeterminate). It's a single native-equivalent control, so it's just
one <kbd>Tab</kbd> stop with no roving focus to manage, and <kbd>Space</kbd>
toggles it - standard behavior for the
[ARIA checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/),
not something to configure here.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `boolean \| 'indeterminate'` | - |
| `label` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'box' \| 'indicator' \| 'checkIcon' \| 'indeterminateIcon' \| 'label', string \| object>>` | - |
