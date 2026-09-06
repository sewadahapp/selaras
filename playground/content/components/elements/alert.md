---
title: Alert
description: An inline status banner - icon, title, description, and an optional dismiss button.
order: 12.9
---

## Usage

::component-example{name="alert-basic"}
::

```vue-html
<SAlert
  color="info"
  title="Heads up"
  description="This changes how the export command behaves - check the migration notes before upgrading."
/>
```

### Variant

`variant` picks between `soft` (default), `outline`, and `solid`:

::component-example{name="alert-variant"}
::

```vue-html
<SAlert color="success" variant="outline" title="Payment received" description="Your subscription is now active." />
```

### Color

`color` is one of the four semantic states - `success`, `danger`,
`warning`, `info` - each with its own default icon, matching `Toast`. That
default only kicks in when `icon` itself is unset, and only once `color`
is given too - an `SAlert` with neither renders no icon at all:

::component-example{name="alert-color"}
::

```vue-html
<SAlert color="danger" title="Error" description="Something went wrong while saving." />
```

### Closable

`closable` shows a dismiss button and emits `close` when clicked - the
alert has no open state of its own, so hiding it is up to your own
`v-if`, the same way `Chip`'s own `removable` works:

::component-example{name="alert-closable"}
::

```vue-html
<SAlert v-if="visible" title="Unsaved changes" closable @close="visible = false" />
```

### With actions

The `actions` slot renders buttons below the description:

::component-example{name="alert-actions"}
::

```vue-html
<SAlert color="danger" title="Upload failed" description="Check your connection and try again.">
  <template #actions>
    <SButton size="sm" color="danger">Retry</SButton>
    <SButton size="sm" variant="ghost" color="neutral">Dismiss</SButton>
  </template>
</SAlert>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `description` | `string` | - |
| `icon` | `string` | - |
| `closable` | `boolean` | `false` |
| `color` | `'success' \| 'danger' \| 'warning' \| 'info'` | `info` |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `soft` |
| `ui` | `Partial<Record<AlertSlot, string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | - | Fires when the dismiss button is clicked |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `title` | - | Replaces the title text |
| `description` | - | Replaces the description text |
| `actions` | - | Action buttons below the description |
