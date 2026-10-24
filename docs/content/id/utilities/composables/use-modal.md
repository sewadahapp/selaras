---
title: useModal
description: Membuka modal secara programatik dari mana saja.
order: 10
---

`useModal()` memungkinkan Anda membuka `<SModal>` (atau komponen apa pun yang Anda tunjuk) tanpa menempatkannya di template Anda - berguna untuk dialog konfirmasi yang dipicu dari click handler, atau alur yang konten modalnya belum diketahui sampai runtime.

## Penggunaan

```vue
<script setup lang="ts">
const { open } = useModal()
const modal = useTemplateRef('confirmModal')

async function handleDelete() {
  const confirmed = await open(ConfirmDeleteDialog, {
    props: { itemName: 'My project' },
  })
  if (confirmed) {
    // ...
  }
}
</script>
```

Komponen yang Anda berikan ke `open()` me-resolve promise yang dikembalikan dengan meng-emit `close` beserta hasilnya. Escape, klik di luar, atau tombol tutup milik shell me-resolve-nya dengan `undefined`.

## API

```ts
function useModal(): {
  open: <T = void>(component: Component, options?: UseModalOpenOptions) => Promise<T | undefined>
}
```

`open()` me-resolve dengan `undefined` jika modal ditutup tanpa nilai eksplisit (misalnya Escape, klik backdrop).

### `UseModalOpenOptions`

| Opsi | Tipe | Deskripsi |
| --- | --- | --- |
| `props` | `Record<string, unknown>` | Props yang diberikan ke komponen yang dibuka. |
| `title` | `string` | Didaftarkan ke Reka sebagai nama aksesibel dialog, disembunyikan secara visual - komponen yang dibuka tetap memasok header terlihatnya sendiri via slot content. |
| `description` | `string` | Didaftarkan ke Reka sebagai deskripsi aksesibel dialog, disembunyikan secara visual. |
| `dismissible` | `boolean` | Apakah Escape/klik backdrop menutupnya. |
| `modal` | `boolean` | Apakah ia menjebak fokus dan memblokir interaksi di luar. |
| `overlay` | `boolean` | Apakah backdrop dirender. |
| `transition` | `boolean` | Apakah animasi buka/tutup dimainkan. |

Setiap opsi diteruskan langsung ke instance `SModal` yang mendasarinya, dan default ke default milik `SModal` sendiri ketika dihilangkan. Karena komponen yang dibuka selalu dirender melalui slot `content` milik `SModal` (lihat [Modal](/components/overlays/modal#custom-content)), `title`/`description` adalah satu-satunya cara memberi dialog yang dibuka programatik nama/deskripsi aksesibel yang nyata - berikan mereka jika konten komponen yang dibuka sendiri belum menyertakan heading yang bisa diasosiasikan Reka dengannya.

## Penyiapan

Loop render yang benar-benar me-mount modal yang dibuka berada di dalam `<SApp>` - bungkus root aplikasi Anda dengannya sekali (biasanya di `app.vue`) dan `useModal()` berfungsi di mana saja di bawahnya:

```vue-html
<SApp>
  <NuxtPage />
</SApp>
```
