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

### Sizes

`size` takes `sm` / `md` / `lg`, scaling the box, checkmark, and label
together:

::component-example{name="checkbox-sizes"}
::

```vue-html
<SCheckbox v-model="sm" size="sm" label="Small" />
<SCheckbox v-model="md" size="md" label="Medium" />
<SCheckbox v-model="lg" size="lg" label="Large" />
```

### Colors

`color` sets the checked/indeterminate fill, ring, and checkmark color -
unchecked always stays the same neutral ring regardless:

::component-example{name="checkbox-colors"}
::

```vue-html
<SCheckbox v-model="primary" color="primary" label="Primary" />
<SCheckbox v-model="success" color="success" label="Success" />
<SCheckbox v-model="danger" color="danger" label="Danger" />
```

### Description

`description` adds a second, muted line under the label - for a
standalone checkbox (an "Accept terms" checkbox, say) where wrapping it in
its own [FormField](/components/forms/form-field) would be needless
ceremony:

::component-example{name="checkbox-description"}
::

```vue-html
<SCheckbox v-model="accepted" label="Accept terms" description="You agree to our Terms of Service and Privacy Policy." />
```

### Card style

`variant="card"` wraps the checkbox and label in a bordered box instead of
a plain inline row, highlighting it when checked - works the same with or
without `description`:

::component-example{name="checkbox-card"}
::

```vue-html
<SCheckbox v-model="accepted" variant="card" label="Accept terms" description="You agree to our Terms of Service and Privacy Policy." />
```

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` falls back to
FormField's own state when not set directly on the checkbox, and `size`
does the same (matching RadioGroup's/Switch's own inheritance).

### Accessibility

Checkbox renders Reka UI's Checkbox primitive, so the accessibility
semantics come from there rather than being reimplemented here: `role="checkbox"`
with `aria-checked` reflecting all three states (`true`/`false`, or `"mixed"`
for indeterminate). It's a single native-equivalent control, so it's just
one <kbd>Tab</kbd> stop with no roving focus to manage, and <kbd>Space</kbd>
toggles it - standard behavior for the
[ARIA checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/),
not something to configure here.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `Checkbox`'s own theme file:

::theme-source{name="checkbox"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `boolean \| 'indeterminate'` | - |
| `label` | `string` | - |
| `description` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'primary'` |
| `variant` | `'default' \| 'card'` | `'default'` |
| `ui` | `Partial<Record<'root' \| 'box' \| 'indicator' \| 'checkIcon' \| 'indeterminateIcon' \| 'label' \| 'description' \| 'labelGroup', string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | Custom content, overrides `label` |
| `description` | Custom content, overrides `description` |
