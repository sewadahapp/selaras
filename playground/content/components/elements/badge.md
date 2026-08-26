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

### Icon only

An `icon` with no `label` (and no default slot content) drops the pill
shape for a circle instead - it reads as an avatar-adjacent status/count
indicator rather than a text label. Chip stays a pill even icon-only; this
is a deliberately different shape for a deliberately different role.

::component-example{name="badge-icon-only"}
::

```vue-html
<SBadge icon="lucide:bell" color="primary" />
<SBadge icon="lucide:check" color="success" size="lg" />
<SBadge icon="lucide:bell" color="primary" variant="solid" />
<SBadge icon="lucide:check" color="success" variant="solid" size="lg" />
```

### Status dot

`dot` adds a small solid-colored circle - the classic online/offline/away
indicator. Paired with a label, it sits in front of the text; alone, the
whole badge collapses to just the bare dot. The dot always uses the
color's solid shade, regardless of `variant` - a pale "soft" dot barely
reads as a status indicator at this size.

::component-example{name="badge-dot"}
::

```vue-html
<SBadge label="Online" dot color="success" />
<SBadge label="Away" dot color="warning" />
<SBadge label="Offline" dot color="neutral" />

<!-- Bare dot, no visible label - give it an accessible name directly -->
<SBadge dot color="success" aria-label="Online" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` | - |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `dot` | `boolean` | `false` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<BadgeSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | Custom content, overrides `label` |
