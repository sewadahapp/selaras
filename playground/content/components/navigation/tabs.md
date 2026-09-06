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
    { label: 'Profile', value: 'profile', icon: 'hugeicons:user' },
    { label: 'Settings', value: 'settings', icon: 'hugeicons:settings-01' },
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

## In markdown

Every Selaras component is already globally registered under its `S`-prefixed
name - a bare `::s-tabs{...}` block works with no extra wiring (see
[Callout](/components/typography/callout)'s own "In markdown" section for how
the pattern works generally). `items` is an array prop, not a string - bind
it with a leading `:` so `@nuxtjs/mdc` parses the attribute as an expression
instead of literal text. Each tab's own content is a `#slot-name` line
matching that item's `value`:

```text
::s-tabs{:items='[{"label":"One","value":"one"},{"label":"Two","value":"two"}]'}
#one
Content for the first tab.
#two
Content for the second tab.
::
```

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `Tabs`'s own theme file:

::theme-source{name="tabs"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; value?: string; disabled?: boolean; icon?: string }[]` | - |
| `variant` | `'underline' \| 'pill'` | `'underline'` |
| `modelValue` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'list' \| 'trigger' \| 'icon' \| 'indicator' \| 'content', string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Fires when the active tab changes |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `[item.value]` | - | Content for that tab, one named slot per item |
| `label` | `{ item, index }` | Replaces a tab's label content |
