---
title: useSlideover
description: Open a slideover panel programmatically from anywhere.
order: 20
---

`useSlideover()` mirrors [useModal](/utilities/composables/use-modal) exactly,
for `<SSlideover>` instead - a panel sliding in from an edge of the screen
rather than a centered dialog.

## Usage

```vue
<script setup lang="ts">
const { open } = useSlideover()

async function handleEdit() {
  const saved = await open(EditItemPanel, {
    props: { itemId: '123' },
    side: 'right',
  })
}
</script>
```

## API

```ts
function useSlideover(): {
  slideovers: Ref<SlideoverInstance[]>
  open: <T = void>(component: Component, options?: UseSlideoverOpenOptions) => Promise<T | undefined>
  close: (id: number, value?: unknown) => void
  remove: (id: number) => void
}
```

### `UseSlideoverOpenOptions`

Same options as [`useModal`](/utilities/composables/use-modal), plus two more
unique to a slide-in panel:

| Option | Type | Description |
| --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | Which edge the panel slides in from. |
| `inset` | `boolean` | Whether the panel floats with a gap instead of flush against the edge. |
| `props`, `title`, `description`, `dismissible`, `modal`, `overlay`, `transition` | | Same as `useModal`. |

## Setup

Same as `useModal` - wrap your app's root with `<SApp>` once and
`useSlideover()` works anywhere underneath.
