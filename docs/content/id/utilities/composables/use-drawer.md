---
title: useDrawer
description: Membuka panel drawer secara programatik dari mana saja.
order: 15
---

`useDrawer()` mencerminkan [useModal](/utilities/composables/use-modal) persis, untuk `<SDrawer>` - panel yang meluncur masuk dari tepi layar, dapat di-drag dan sadar snap-point, alih-alih dialog terpusat.

## Penggunaan

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
  open: <T = void>(component: Component, options?: UseDrawerOpenOptions) => Promise<T | undefined>
}
```

### `UseDrawerOpenOptions`

Opsi yang sama seperti [`useModal`](/utilities/composables/use-modal), plus beberapa lagi yang unik untuk panel yang dapat di-drag dan sadar snap-point:

| Opsi | Tipe | Deskripsi |
| --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | Tepi mana panel meluncur masuk. |
| `handle` | `boolean` | Apakah bilah grip tampil di atas, menandakan ia dapat di-drag. |
| `snapPoints` | `(number \| string)[]` | Tinggi/lebar istirahat yang ditempati panel saat di-drag - fraksi (0-1), piksel (>1), atau string panjang CSS. |
| `snapPoint` | `number \| string \| null` | Snap point yang sedang aktif. |
| `snapToSequentialPoints` | `boolean` | Snap ke titik berurutan berikutnya satu langkah setiap kali, alih-alih yang terdekat berdasarkan jarak drag. |
| `modal` | `boolean \| 'trap-focus'` | `'trap-focus'` menjebak fokus tetapi mengizinkan event pointer luar - lihat [Drawer](/components/overlays/drawer). |
| `props`, `title`, `description`, `dismissible`, `overlay`, `transition` | | Sama seperti `useModal`. |

## Penyiapan

Sama seperti `useModal` - bungkus root aplikasi Anda dengan `<SApp>` sekali dan `useDrawer()` berfungsi di mana saja di bawahnya.
