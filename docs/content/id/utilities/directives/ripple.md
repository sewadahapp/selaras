---
title: v-ripple
description: Efek ripple umpan-balik klik untuk elemen apa pun.
order: 10
---

`v-ripple` memunculkan lingkaran yang membesar dan memudar dari posisi pointer pada `pointerdown` - umpan-balik klik gaya ripple klasik. Ia berfungsi pada elemen apa pun, bukan hanya komponen Selaras.

## Penggunaan

Auto-import, tidak perlu import eksplisit di dalam aplikasi Nuxt:

```vue-html
<button v-ripple>
  Click me
</button>
```

Keluar per elemen dengan `v-ripple="false"`, atau override default-nya:

```vue-html
<button v-ripple="{ color: 'var(--selaras-resolved-color-primary-fill)', opacity: 0.4, duration: 700 }">
  Click me
</button>
```

### `RippleOptions`

| Opsi | Tipe | Default | Deskripsi |
| --- | --- | --- | --- |
| `color` | `string` | `'currentColor'` | Warna isi untuk ripple. |
| `opacity` | `number` | `0.25` | Opasitas puncak sebelum memudar. |
| `duration` | `number` | `500` | Berapa lama ripple membesar dan memudar, dalam ms. |

### Menonaktifkannya secara global

`app.config.selaras.ripple = false` mematikan ripple di mana saja, alih-alih keluar satu elemen setiap kali:

```ts
// app.config.ts
export default defineAppConfig({
  selaras: {
    ripple: false,
  },
})
```

Ini hanya menjangkau komponen yang benar-benar memeriksanya - komponen Selaras sendiri yang menggunakan `v-ripple` secara internal (seperti `SButton`) sudah melakukannya, via composable `useRippleEnabled()`. `v-ripple` telanjang yang Anda tulis sendiri pada elemen polos tidak membaca `app.config.selaras.ripple` secara otomatis (hook lifecycle direktif sendiri tidak bisa memanggil `useAppConfig()` - ia membutuhkan konteks `setup()` milik komponen) - baca sendiri dan berikan sebagai nilai binding jika Anda ingin elemen Anda sendiri menghormati toggle global yang sama:

```vue-html
<script setup lang="ts">
const rippleEnabled = useRippleEnabled()
</script>

<template>
  <button v-ripple="rippleEnabled">
    Click me
  </button>
</template>
```

## Catatan perilaku

- Elemen host mendapat `position: relative; overflow: hidden` yang diterapkan otomatis jika ia belum memiliki pendapat tentang keduanya, sehingga ripple tetap terkandung pada bentuknya tanpa CSS tambahan dari Anda.
- Menghormati `prefers-reduced-motion` secara otomatis, melalui penanganan reduced-motion yang sama dengan yang dilalui setiap animasi lain di pustaka - tidak perlu konfigurasi terpisah.
