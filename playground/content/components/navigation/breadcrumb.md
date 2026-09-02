---
title: Breadcrumb
description: A "you are here" nav trail.
order: 39
---

## Usage

The last item always renders as the current page - a plain, non-
interactive label, never a link, regardless of whether it has its own
`to`:

::component-example{name="breadcrumb-basic"}
::

```vue-html
<SBreadcrumb :items="[
  { label: 'Home', to: '/' },
  { label: 'Components', to: '/components' },
  { label: 'Breadcrumb' },
]" />
```

### With icons

::component-example{name="breadcrumb-icons"}
::

```vue-html
<SBreadcrumb :items="[
  { label: 'Home', to: '/', icon: 'hugeicons:home-01' },
  { label: 'Settings', to: '/settings', icon: 'hugeicons:settings-01' },
]" />
```

### Disabled item

An earlier item without a `to` (or with `disabled` set) renders inert -
same look as the trail, without being clickable:

::component-example{name="breadcrumb-disabled"}
::

```vue-html
<SBreadcrumb :items="[
  { label: 'Home', to: '/' },
  { label: 'Archived project', to: '/projects/archived', disabled: true },
  { label: 'Report' },
]" />
```

### Custom separator

`separator-icon` replaces the default chevron:

::component-example{name="breadcrumb-separator"}
::

```vue-html
<SBreadcrumb :items="items" separator-icon="hugeicons:slash" />
```

### Collapsing long trails

`max-items` collapses the middle of a long trail behind an ellipsis
button once there are more items than that - the first item and the
last `maxItems - 1` stay visible, everything else moves into an
overflow menu:

::component-example{name="breadcrumb-max-items"}
::

```vue-html
<SBreadcrumb :items="items" :max-items="4" />
```

### Truncating long labels

`truncate` keeps a single long label - a dynamic product title, say -
from breaking the trail's layout. `true` caps it at `12rem`; pass a
CSS length string (`'20rem'`, `'300px'`) for a custom cap. The full
label is still available on hover via the native `title` attribute:

::component-example{name="breadcrumb-truncate"}
::

```vue-html
<SBreadcrumb :items="items" truncate />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `BreadcrumbItem[]` | - |
| `maxItems` | `number` | - |
| `truncate` | `boolean \| string` | `false` |
| `separatorIcon` | `string` | `icons.chevronRight` |
| `ui` | `Partial<Record<BreadcrumbSlot, string \| object>>` | - |

`BreadcrumbItem` is `{ label: string, icon?: string, to?: string, disabled?: boolean }`.

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item, index, current }` | Replaces one item's content |
| `separator` | - | Replaces the separator between items |
