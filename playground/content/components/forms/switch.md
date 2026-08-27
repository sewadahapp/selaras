---
title: Switch
description: A toggle switch with an optional label, built on Reka UI's Switch primitive.
order: 26
---

## Usage

::component-example{name="switch-basic"}
::

```vue
<script setup lang="ts">
const notifications = ref(true)
</script>

<template>
  <SSwitch v-model="notifications" label="Notifications" />
</template>
```

### States

`disabled` prevents interaction and dims it, and `invalid` switches the
track's outline to `--ui-danger`:

::component-example{name="switch-states"}
::

```vue-html
<SSwitch v-model="disabledOff" disabled label="Disabled" />
<SSwitch v-model="disabledOn" disabled label="Disabled, on" />
<SSwitch v-model="invalidChoice" invalid label="You must enable this to continue" />
```

See [Props](#props).

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` falls back to
FormField's own state when not set directly on the switch.

### Accessibility

Switch renders Reka UI's Switch primitive, so the accessibility semantics
come from there rather than being reimplemented here: `role="switch"` with
a boolean `aria-checked` (unlike Checkbox, there's no third "mixed" state).
It's a single native-equivalent control, so it's just one <kbd>Tab</kbd>
stop with no roving focus to manage, and <kbd>Space</kbd> toggles it -
standard behavior for the
[ARIA switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/),
not something to configure here.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `boolean` | - |
| `label` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'track' \| 'thumb' \| 'label', string \| object>>` | - |
