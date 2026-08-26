---
title: Badge
description: A small themed pill for labels, tags, and status indicators.
order: 11
---

## Usage

::component-example{name="badge-basic"}
::

```vue-html
<SBadge label="Primary" color="primary" />
<SBadge label="Solid" color="primary" variant="solid" />
<SBadge label="Outline" color="danger" variant="outline" />
```

### Icons

`icon` and `trailingIcon` add an icon before or after the label - useful for
a status glyph or a disclosure chevron. Badge is purely a display element,
though - for a dismissible tag, see [Chip](/components/elements/chip)
instead.

::component-example{name="badge-icon"}
::

```vue-html
<SBadge label="Verified" icon="lucide:check" color="success" />
<SBadge label="New" trailing-icon="lucide:chevron-right" color="primary" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` | - |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<BadgeSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | Custom content, overrides `label` |
