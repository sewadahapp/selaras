---
title: useDrawer
description: Open a drawer panel programmatically from anywhere.
order: 15
---

`useDrawer()` mirrors [useModal](/utilities/composables/use-modal) exactly,
for `<SDrawer>` instead - a panel sliding in from an edge of the screen,
draggable and snap-point aware, rather than a centered dialog.

## Usage

```vue
<script setup lang="ts">
const { open } = useDrawer()

async function handleFilters() {
  const applied = await open(FilterPanel, {
    props: { category: 'shoes' },
    side: 'bottom',
  })
}
</script>
```

## API

```ts
function useDrawer(): {
  drawers: Ref<DrawerInstance[]>
  open: <T = void>(component: Component, options?: UseDrawerOpenOptions) => Promise<T | undefined>
  close: (id: number, value?: unknown) => void
  remove: (id: number) => void
}
```

### `UseDrawerOpenOptions`

Same options as [`useModal`](/utilities/composables/use-modal), plus a few
more unique to a draggable, snap-point-aware panel:

| Option | Type | Description |
| --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | Which edge the panel slides in from. |
| `handle` | `boolean` | Whether a grip bar shows at the top, signaling it's draggable. |
| `snapPoints` | `(number \| string)[]` | Resting heights/widths the panel snaps to while dragging - fractions (0-1), pixels (>1), or CSS length strings. |
| `snapPoint` | `number \| string \| null` | The currently active snap point. |
| `snapToSequentialPoints` | `boolean` | Snap to the next sequential point one step at a time, instead of whichever is nearest by drag distance. |
| `modal` | `boolean \| 'trap-focus'` | `'trap-focus'` traps focus but allows outside pointer events - see [Drawer](/components/overlays/drawer). |
| `props`, `title`, `description`, `dismissible`, `overlay`, `transition` | | Same as `useModal`. |

## Setup

Same as `useModal` - wrap your app's root with `<SApp>` once and
`useDrawer()` works anywhere underneath.
