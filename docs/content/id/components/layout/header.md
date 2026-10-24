---
title: Header
description: Top bar sticky dengan slot kiri/kanan - logo di satu sisi, aksi seperti ColorModeToggle di sisi lain.
order: 63
---

## Penggunaan

::component-example{name="header-basic"}
::

```vue-html
<SHeader>
  <span class="font-semibold">My App</span>
  <template #right>
    <SColorModeToggle />
  </template>
</SHeader>
```

`SHeader` adalah `sticky top-0` secara default, dimaksudkan untuk duduk di atas segala sesuatu di halaman - top bar situs docs ini sendiri persis komponen ini. Jika Anda juga menggunakan [PageAside](/composites/documentation/page-aside) di bawahnya (untuk nav atau TOC), berikan offset yang cocok melalui prop `ui` agar tidak duduk di bawah header:

```vue-html
<SPageAside :ui="{ root: 'top-16 h-[calc(100vh-4rem)]' }">
```

(`top-16`/`h-4rem` cocok dengan default `h-16` milik `SHeader` - sesuaikan keduanya bersamaan jika Anda menimpa tinggi header.)

## Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.header`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot - berikut adalah file tema `Header` sendiri:

::theme-source{name="header"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<HeaderSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Konten rata kiri (misalnya logo) |
| `right` | Konten rata kanan (misalnya aksi) |
