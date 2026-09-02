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

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `BreadcrumbItem[]` | - |
| `separatorIcon` | `string` | `icons.chevronRight` |
| `ui` | `Partial<Record<BreadcrumbSlot, string \| object>>` | - |

`BreadcrumbItem` is `{ label: string, icon?: string, to?: string, disabled?: boolean }`.

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item, index, current }` | Replaces one item's content |
| `separator` | - | Replaces the separator between items |
