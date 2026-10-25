---
title: PageHeader
description: Merender title dan description halaman konten.
order: 10
---

## Penggunaan

::component-example{name="page-header-basic"}
::

```vue-html
<SPageHeader title="Component name" description="A one-line summary." />
```

Situs docs ini menggunakannya di setiap halaman komponen (via `page.title`/`page.description` dari frontmatter), menutup celah di mana field-field itu sebelumnya sama sekali tidak dipakai.

## Merakit layout halaman penuh

`PageHeader` hanyalah bagian atas kolom konten utama - situs docs ini membungkus empat komponen menjadi shell halaman penuh yang sedang Anda baca sekarang: [PageAside](/composites/documentation/page-aside) kiri yang membungkus [ContentNavigation](/composites/documentation/content-navigation) untuk nav bagian, kolom utama yang dimulai dengan `PageHeader` dan diikuti konten halaman aktual, dan `PageAside` kanan yang membungkus [ContentToc](/composites/documentation/content-toc) untuk rail "on this page". Aplikasi docs Selaras menggunakan susunan yang sama, dengan drawer responsif untuk navigasi di layar lebih kecil.

::component-example{name="page-layout-assembled"}
::

```vue-html
<div class="flex">
  <SPageAside>
    <SContentNavigation :navigation="navigation" />
  </SPageAside>
  <main class="min-w-0 flex-1">
    <SPageHeader :title="page.title" :description="page.description" />
    <!-- page content -->
  </main>
  <SPageAside>
    <SContentToc :links="page.body.toc.links" />
  </SPageAside>
</div>
```

Lihat juga [PageAside](/composites/documentation/page-aside), [ContentNavigation](/composites/documentation/content-navigation) dan [ContentToc](/composites/documentation/content-toc).

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `PageHeader` itu sendiri:

::theme-source{name="page-header"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `description` | `string` | - |
| `ui` | `Partial<Record<PageHeaderSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| `title` | Konten title kustom, mengoverride prop `title` |
| `description` | Konten description kustom, mengoverride prop `description` |
| default | Konten tambahan di bawah description |
