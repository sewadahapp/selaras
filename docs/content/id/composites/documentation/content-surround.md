---
title: ContentSurround
description: Navigasi halaman sebelumnya/berikutnya di bawah halaman konten.
order: 50
---

## Penggunaan

```vue-html
<SContentSurround
  :prev="{ title: 'Installation', path: '/overview/getting-started/installation' }"
  :next="{ title: 'Theming', path: '/overview/theming/overview' }"
/>
```

::component-example{name="content-surround-basic"}
::

Berikan hanya `prev`, hanya `next`, atau tidak keduanya - `SContentSurround` tidak merender apa pun sama sekali ketika keduanya dihilangkan (halaman pertama dan terakhir dalam koleksi tidak memiliki pasangan di satu sisi). Situs docs ini mengambil keduanya dari query halaman-sekeliling milik koleksi konten sendiri (misalnya `queryCollectionItemSurroundings` dari `@nuxt/content`), bukan diketik manual - lihat link "Previous"/"Next" halaman ini sendiri di bawah untuk contoh live.

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `ContentSurround` itu sendiri:

Recipe tema global dan scoped menggunakan `ui.contentSurround`.

::theme-source{name="content-surround"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `prev` | `{ title: string, path: string }` | - |
| `next` | `{ title: string, path: string }` | - |
| `ui` | `Partial<Record<'root' \| 'link' \| 'label' \| 'icon' \| 'title', string \| object>>` | - |
