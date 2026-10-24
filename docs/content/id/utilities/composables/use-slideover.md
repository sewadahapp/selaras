---
title: useSlideover
description: Membuka panel slideover secara programatik dari mana saja.
order: 20
---

`useSlideover()` mencerminkan [useModal](/utilities/composables/use-modal) persis, untuk `<SSlideover>` - panel yang meluncur masuk dari tepi layar alih-alih dialog terpusat.

## Penggunaan

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
  open: <T = void>(component: Component, options?: UseSlideoverOpenOptions) => Promise<T | undefined>
}
```

### `UseSlideoverOpenOptions`

Opsi yang sama seperti [`useModal`](/utilities/composables/use-modal), plus dua lagi yang unik untuk panel geser-masuk:

| Opsi | Tipe | Deskripsi |
| --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | Tepi mana panel meluncur masuk. |
| `inset` | `boolean` | Apakah panel mengambang dengan celah alih-alih rapat di tepi. |
| `props`, `title`, `description`, `dismissible`, `modal`, `overlay`, `transition` | | Sama seperti `useModal`. |

## Penyiapan

Sama seperti `useModal` - bungkus root aplikasi Anda dengan `<SApp>` sekali dan `useSlideover()` berfungsi di mana saja di bawahnya.
