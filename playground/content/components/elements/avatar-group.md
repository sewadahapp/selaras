---
title: AvatarGroup
description: Stack multiple avatars with overlapping rings and an optional overflow count.
order: 11.5
---

## Usage

Wrap multiple `SAvatar` components inside `SAvatarGroup` to stack them with overlapping rings. The group propagates its `size` to every child avatar automatically — individual avatars that set their own `size` still take precedence.

::component-example{name="avatar-group-basic"}
::

```vue-html
<SAvatarGroup>
  <SAvatar text="AB" color="primary" />
  <SAvatar text="CD" color="success" />
  <SAvatar text="EF" color="info" />
</SAvatarGroup>
```

### Max

`max` limits how many avatars are visible. Extra avatars collapse into a `+N` count indicator.

::component-example{name="avatar-group-max"}
::

```vue-html
<SAvatarGroup :max="2">
  <SAvatar text="AB" color="primary" />
  <SAvatar text="CD" color="success" />
  <SAvatar text="EF" color="info" />
  <SAvatar text="GH" color="warning" />
</SAvatarGroup>
```

### Sizes

`size` controls the ring thickness and overlap spacing, and propagates to every child avatar that doesn't set its own size.

::component-example{name="avatar-group-sizes"}
::

```vue-html
<SAvatarGroup size="sm">
  <SAvatar text="AB" color="primary" />
  <SAvatar text="CD" color="success" />
</SAvatarGroup>
```

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `AvatarGroup`'s own theme file:

::theme-source{name="avatar-group"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `max` | `number` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<'root' \| 'item' \| 'count', string \| object>>` | - |
