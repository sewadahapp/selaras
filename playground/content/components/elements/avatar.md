---
title: Avatar
description: A circular (or rounded) image or initials placeholder for representing a person or entity.
order: 11.25
---

## Usage

An avatar shows a person or entity: a photo when a `src` is available, and a fallback - initials, an icon, or the default user glyph - while the photo loads or when it fails to load.

::component-example{name="avatar-basic"}
::

```vue-html
<SAvatar />
<SAvatar text="JD" />
<SAvatar src="https://i.pravatar.cc/96?img=3" alt="Jane Doe" />
```

A bare `<SAvatar />` - no `src`, `text`, or `icon` - renders the default user icon on top of the placeholder color, still themed by `color`/`size`/`shape`.

### Fallback

`text` usually holds the person's initials. `icon` swaps the fallback for a glyph instead, and `text` wins when both are given. The `fallback` slot replaces the whole fallback content for anything custom.

::component-example{name="avatar-fallback"}
::

```vue-html
<SAvatar text="JD" color="primary" />
<SAvatar icon="hugeicons:user-group" color="success" />
<SAvatar color="warning">
  <template #fallback>
    <span class="text-sm font-semibold">ACME</span>
  </template>
</SAvatar>
```

### Sizes

::component-example{name="avatar-sizes"}
::

```vue-html
<SAvatar size="sm" text="JD" />
<SAvatar size="md" text="JD" color="primary" />
<SAvatar size="lg" text="JD" color="success" />
```

### Colors

`color` styles the placeholder background and its initials/icon, visible while the image loads (or instead of one). `neutral` uses the plain elevated background, matching the rest of the library's soft neutral treatment.

::component-example{name="avatar-colors"}
::

```vue-html
<SAvatar text="OK" color="success" />
<SAvatar text="NG" color="danger" />
<SAvatar text="IF" color="info" />
```

### Shape

Avatars default to a circle; `shape="rounded"` uses the standard small radius instead.

::component-example{name="avatar-shape"}
::

```vue-html
<SAvatar text="JD" />
<SAvatar text="JD" shape="rounded" color="primary" />
<SAvatar src="https://i.pravatar.cc/96?img=3" alt="Jane Doe" shape="rounded" />
```

### Status

`status` adds a small solid presence dot at the avatar's bottom-right corner. Its color is independent of `color` (`statusColor`, default `neutral`) since presence semantics - online, offline, busy - rarely match the avatar's identity color.

::component-example{name="avatar-status"}
::

```vue-html
<SAvatar text="JD" status status-color="success" />
<SAvatar text="JD" status />
<SAvatar src="https://i.pravatar.cc/96?img=3" alt="Jane Doe" status status-color="danger" />
```

### Accessibility

- When `src` is given, `alt` is forwarded to the image element.
- With no image, the avatar derives an accessible name from `alt` (falling back to `text`) and puts it on the root - override it any time with a direct `aria-label` fallthrough.
- The default user icon alone has no text at all, so a bare `<SAvatar />` used as a meaningful control (say, a profile link) should get an `aria-label`. The status dot is decorative; if its state carries meaning, give the avatar an `aria-label` that says so.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `as` | `string \| Component` | `'span'` |
| `src` | `string` | - |
| `alt` | `string` | - |
| `text` | `string` | - |
| `icon` | `string` | - |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` |
| `statusColor` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `shape` | `'circle' \| 'rounded'` | `'circle'` |
| `status` | `boolean` | `false` |
| `referrerPolicy` | `string` | - |
| `crossOrigin` | `string` | - |
| `ui` | `Partial<Record<AvatarSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `fallback` | - | Replaces the whole fallback content - initials, icon, or the default user icon |
| `icon` | `{ class }` | Replaces the fallback icon (when no `text` is given); the scoped class carries the icon's resolved size classes |

Customize the image itself (the `image` slot's classes) via `:ui="{ image: '...' }"`.