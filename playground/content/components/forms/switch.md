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

### Sizes

`size` takes `sm` / `md` / `lg`, scaling the track, thumb, and label
together:

::component-example{name="switch-sizes"}
::

```vue-html
<SSwitch v-model="sm" size="sm" label="Small" />
<SSwitch v-model="md" size="md" label="Medium" />
<SSwitch v-model="lg" size="lg" label="Large" />
```

### Colors

`color` sets the checked-state track/thumb color - unchecked always stays
the same neutral track regardless:

::component-example{name="switch-colors"}
::

```vue-html
<SSwitch v-model="primary" color="primary" label="Primary" />
<SSwitch v-model="success" color="success" label="Success" />
<SSwitch v-model="danger" color="danger" label="Danger" />
```

### Loading

`loading` shows a spinner in the thumb - useful while an async toggle (an
API call behind the switch) is in flight. It doesn't imply `disabled` -
combine `:loading="x" :disabled="x"` if a busy switch shouldn't be
touchable in the meantime:

::component-example{name="switch-loading"}
::

```vue-html
<SSwitch :model-value="enabled" :loading="loading" label="Sync with server" @update:model-value="onUpdate" />
```

### Icons

`checked-icon`/`unchecked-icon` render inside the thumb for each state -
useful when a plain on/off doesn't read as clearly as a semantic pair of
icons:

::component-example{name="switch-icons"}
::

```vue-html
<SSwitch v-model="airplaneMode" checked-icon="hugeicons:airplane-mode" unchecked-icon="hugeicons:airplane-mode-off" label="Airplane mode" />
```

### Description

`description` adds a second, muted line under the label - for a
standalone toggle (a settings list, say) where wrapping every switch in
its own [FormField](/components/forms/form-field) would be needless
ceremony:

::component-example{name="switch-description"}
::

```vue-html
<SSwitch v-model="marketing" label="Marketing emails" description="Occasional product updates and offers - unsubscribe any time." />
```

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` falls back to
FormField's own state when not set directly on the switch, and `size`
does the same (matching RadioGroup's own inheritance).

### Accessibility

Switch renders Reka UI's Switch primitive, so the accessibility semantics
come from there rather than being reimplemented here: `role="switch"` with
a boolean `aria-checked` (unlike Checkbox, there's no third "mixed" state).
It's a single native-equivalent control, so it's just one <kbd>Tab</kbd>
stop with no roving focus to manage, and <kbd>Space</kbd> toggles it -
standard behavior for the
[ARIA switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/),
not something to configure here.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `Switch`'s own theme file:

::theme-source{name="switch"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `boolean` | - |
| `label` | `string` | - |
| `description` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'primary'` |
| `loading` | `boolean` | `false` |
| `checkedIcon` | `string` | - |
| `uncheckedIcon` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'track' \| 'thumb' \| 'icon' \| 'label' \| 'description' \| 'labelGroup', string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | Custom content, overrides `label` |
| `description` | Custom content, overrides `description` |
