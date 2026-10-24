---
title: ReadMore
description: Memotong konten panjang di balik toggle "Show more" yang memudar.
order: 74
---

## Penggunaan

::component-example{name="read-more-basic"}
::

```vue-html
<SReadMore :preview-height="200">
  <p>A long block of content...</p>
</SReadMore>
```

Tinggi collapsed adalah nilai piksel nyata (`previewHeight`, `200` secara default), bukan line-clamp - sehingga memotong konten apa pun, bukan hanya teks polos. Pengungkapan beranimasi dengan mentransisikan `max-height` menuju tinggi terukur milik konten sendiri (via `ResizeObserver`, diukur ulang jika berubah), bukan keyword `auto` - CSS tidak bisa menganimasikan menuju `auto`, tidak ada nilai antara untuk diinterpolasi.

Konten yang lebih pendek dari `previewHeight` dirender tanpa UI pemotongan sama sekali - fade dan toggle hanya muncul setelah benar-benar ada lagi yang bisa diungkap. Sebelum pengukuran sisi-klien pertama, konten dirender terpotong secara default (asumsi yang lebih aman untuk output SSR/tanpa-JS) - ia tidak pernah sempat berkedip terbuka penuh sebelum menciut.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema `ReadMore` itu sendiri:

::theme-source{name="read-more"}
::

Recipe tema global dan scoped menggunakan `ui.readMore`.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `previewHeight` | `number` | `200` |
| `ui` | `Partial<Record<ReadMoreSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Konten yang dipotong |
