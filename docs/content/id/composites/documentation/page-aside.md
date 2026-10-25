---
title: PageAside
description: Rail samping yang sticky dan dapat di-scroll, dipakai untuk kolom nav maupun daftar isi halaman.
order: 20
---

## Penggunaan

::component-example{name="page-aside-basic"}
::

```vue-html
<SPageAside>
  <template #header>
    <strong>Header</strong>
  </template>
  <SContentNavigation :navigation="navigation" />
</SPageAside>
```

Secara default `SPageAside` `sticky` dan mengisi tinggi viewport (`h-screen`) - dimaksudkan duduk langsung di dalam baris flex tingkat halaman, seperti yang dilakukan layout situs docs ini sendiri untuk nav kiri maupun rail [ContentToc](/composites/documentation/content-toc) kanan. Contoh di atas mengoverride `root` via prop `ui` ke tinggi tetap agar muat inline dalam docs ini.

Ia juga tersembunyi di bawah breakpoint `lg` secara default - rail lebar tetap di samping kolom konten utama tidak punya tempat di viewport sempit. Rail ToC kanan milik situs docs ini sendiri hilang begitu saja di sana; nav kirinya malah muncul melalui Drawer yang dipicu dari header, karena berbeda dengan ToC ia tetap harus dapat dijangkau di mobile.

Scrolling ditangani [ScrollArea](/components/layout/scroll-area) bertema secara internal, bukan div `overflow-y-auto` polos - sehingga styling scrollbar tetap konsisten dengan sisa pustaka.

Biasanya membungkus [ContentNavigation](/composites/documentation/content-navigation) (nav kiri) atau [ContentToc](/composites/documentation/content-toc) (rail kanan) - lihat bagian "Merakit layout halaman penuh" milik [PageHeader](/composites/documentation/page-header) untuk bagaimana ketiganya bergabung dengan kolom konten utama menjadi satu halaman.

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `PageAside` itu sendiri:

Recipe tema global dan scoped menggunakan `ui.pageAside`. Slot `scrollArea`-nya adalah override layout untuk region scroll yang dikomposisikan; `ui.scrollArea` tetap mengonfigurasi `SScrollArea` secara independen.

::theme-source{name="page-aside"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<PageAsideSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| `header` | Konten tetap di atas body yang dapat di-scroll |
| default | Konten body yang dapat di-scroll |
