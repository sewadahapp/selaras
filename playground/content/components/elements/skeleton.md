---
title: Skeleton
description: A themed placeholder block for content that's still loading.
order: 12.5
---

## Usage

`Skeleton` has no shape prop of its own - a text line, a circular avatar,
a rectangular block are all just different `class`/`:ui` sizing, the same
way sizing works everywhere else in this library:

::component-example{name="skeleton-basic"}
::

```vue-html
<SSkeleton class="h-4 w-full" />
<SSkeleton class="h-4 w-full" />
<SSkeleton class="h-4 w-2/3" />
```

### Animation

`animation` picks between `pulse` (default - a fading opacity) and
`shimmer` (a gradient sweeping across the block):

::component-example{name="skeleton-shimmer"}
::

```vue-html
<SSkeleton animation="shimmer" class="h-4 w-full" />
```

Both respect `prefers-reduced-motion` automatically - there's nothing to
opt into or configure.

### Composing a placeholder

A circular avatar next to a couple of text lines - `rounded-full` on a
square block gives the circle, everything else is layout:

::component-example{name="skeleton-card"}
::

```vue-html
<div class="flex items-center gap-3">
  <SSkeleton class="size-10 rounded-full" />
  <div class="flex flex-col gap-2">
    <SSkeleton class="h-3 w-32" />
    <SSkeleton class="h-3 w-48" />
  </div>
</div>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `animation` | `'pulse' \| 'shimmer'` | `pulse` |
| `ui` | `Partial<Record<'base', string \| object>>` | - |
