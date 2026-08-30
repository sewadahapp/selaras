---
title: Icon
description: A thin wrapper around Nuxt Icon - one shared component, everywhere an icon shows up in this library or your own markup.
order: 12
---

## Usage

Every icon-accepting prop across this library (`Button`'s `icon`, `Input`'s
`icon`, `Select`'s slots, ...) already renders through `SIcon` internally -
each one just supplies its own precise size class (`size-3.5`, `size-4.5`,
...) via `class`, the same way you would. `SIcon` doesn't have an opinion on
size at all; it's a bare pass-through to Nuxt Icon plus one optional
convenience prop for semantic color.

::component-example{name="icon-basic"}
::

```vue-html
<SIcon name="hugeicons:star" class="size-4" />
<SIcon name="hugeicons:star" class="size-5" />
<SIcon name="hugeicons:star" class="size-6" />
<SIcon name="hugeicons:favourite" color="danger" />
```

`name` accepts any registered icon name, not just the `hugeicons:*` set
used throughout this library's own docs.

### Sizes

There's no `size` prop - pass whatever Tailwind size class you need via
`class` directly, same as any other icon usage. This library's own
components each pick their own scale internally (Badge's icons run
`size-2.5`/`size-3`/`size-3.5`, Button's `size-4`/`size-4.5`/`size-5`, and so
on) - none of those map cleanly onto one shared enum, so `SIcon` doesn't try
to impose one.

### Color

`color` is unset by default, so the icon inherits `currentColor` from
whatever text color surrounds it - the same behavior every internal icon
usage in this library already relies on (an input's leading icon takes
`--ui-text-muted` from its wrapper, not a color prop of its own). Pass one of
the seven semantic role names to force a specific color instead:

```vue-html
<SIcon name="hugeicons:checkmark-circle-01" color="success" />
```

A plain `class="text-[var(--ui-danger)]"` still overrides `color` if you need
something the preset roles don't cover - both flow through the same
tailwind-merge, so whichever `text-*` class you add wins.

### Overriding the default icon set

Every internal icon (a button's loading spinner, a chip's remove glyph, a
select's dropdown chevron, ...) is [Hugeicons](https://hugeicons.com) by
default, resolved from one semantic-purpose registry rather than hardcoded
per component - `close`, `check`, `chevronDown`, `loading`, and so on.
Override any of them globally in `app.config.ts`:

```ts
export default defineAppConfig({
  icons: {
    close: 'lucide:x',
    loading: 'lucide:loader-2',
  },
})
```

Only the keys you set are overridden; everything else keeps its Hugeicons
default. This changes every component that uses that key at once - setting
`close` reskins the dismiss icon on `Modal`, `Toast`, `Input`'s clear
button, and `Chip`'s remove button all together, rather than needing a
separate override for each.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `name` | `string` | - |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | - |
| `ui` | `Partial<Record<'base', string \| object>>` | - |
