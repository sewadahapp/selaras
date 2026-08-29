---
title: Tabs
description: An items-driven tab list built on Reka UI's Tabs primitive.
order: 40
---

## Usage

::component-example{name="tabs-basic"}
::

```vue
<script setup lang="ts">
const active = ref('one')
</script>

<template>
  <STabs v-model="active" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]">
    <template #one>
      Tab one content
    </template>
    <template #two>
      Tab two content
    </template>
  </STabs>
</template>
```

Switching tabs slides a shared indicator between them rather than each tab
carrying its own static active state - the indicator measures the active
trigger itself, so it stays correct even if a tab's own width changes.

### Custom label content

The `label` slot replaces a tab's plain-text label with anything - scoped
with `item` and `index`, so a single template can vary per tab:

::component-example{name="tabs-custom-label"}
::

```vue-html
<STabs v-model="active" :items="items">
  <template #label="{ item }">
    <span class="flex items-center gap-2">
      {{ item.label }}
      <SBadge v-if="item.value === 'inbox'" label="3" color="primary" size="sm" />
    </span>
  </template>
  ...
</STabs>
```

### Icons

Give an item an `icon` and it renders before the label automatically - no
`label` slot needed for the common case:

::component-example{name="tabs-icons"}
::

```vue-html
<STabs
  v-model="active"
  :items="[
    { label: 'Profile', value: 'profile', icon: 'ph:user' },
    { label: 'Settings', value: 'settings', icon: 'ph:gear' },
  ]"
/>
```

### Variants

`variant` takes `underline` (default) or `pill`, a segmented-control look
with the sliding indicator as a raised background instead of a bottom bar:

::component-example{name="tabs-pill"}
::

```vue-html
<STabs v-model="active" :items="items" variant="pill" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; value?: string; disabled?: boolean; icon?: string }[]` | - |
| `variant` | `'underline' \| 'pill'` | `'underline'` |
| `modelValue` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'list' \| 'trigger' \| 'icon' \| 'indicator' \| 'content', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `[item.value]` | - | Content for that tab, one named slot per item |
| `label` | `{ item, index }` | Replaces a tab's label content |
