---
title: Icon
description: A themed icon wrapper - consistent sizing and semantic color, everywhere an icon shows up in your own markup.
order: 12
---

## Usage

Every icon-accepting prop across this library (`Button`'s `icon`, `Input`'s
`icon`, `Select`'s slots, ...) already renders an icon internally and manages
its own sizing - `SIcon` isn't involved there. It's for icons you place
yourself, in your own templates, that should still look like they belong to
this design system rather than a one-off `<Icon>` with hand-picked classes.

::component-example{name="icon-basic"}
::

```vue-html
<SIcon name="lucide:star" size="sm" />
<SIcon name="lucide:star" size="md" />
<SIcon name="lucide:star" size="lg" />
<SIcon name="lucide:heart" color="danger" />
```

`name` accepts any registered icon name, not just the `lucide:*` set used
throughout this library's own docs.

### Sizes

`size` takes `sm` / `md` / `lg`, mapped to `size-4` / `size-5` / `size-6` -
the same scale [Button](/components/elements/button#props) and
[Input](/components/forms/input) use for their own icon slots.

### Color

`color` is unset by default, so the icon inherits `currentColor` from
whatever text color surrounds it - the same behavior every internal icon
usage in this library already relies on (an input's leading icon takes
`--ui-text-muted` from its wrapper, not a color prop of its own). Pass one of
the seven semantic role names to force a specific color instead:

```vue-html
<SIcon name="lucide:check-circle" color="success" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `name` | `string` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | - |
| `ui` | `Partial<Record<'base', string \| object>>` | - |
