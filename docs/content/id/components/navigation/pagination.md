---
title: Pagination
description: Kontrol nomor halaman, dibangun di atas primitif Pagination milik Reka UI.
order: 44
---

## Penggunaan

::component-example{name="pagination-basic"}
::

```vue
<script setup lang="ts">
const page = ref(1)
</script>

<template>
  <SPagination v-model:page="page" :total="120" :items-per-page="10" />
</template>
```

### Ukuran

`size` menerima `sm` / `md` / `lg`, menyesuaikan setiap tombol (dan ellipsis, agar tetap sejajar) bersamaan:

::component-example{name="pagination-sizes"}
::

```vue-html
<SPagination v-model:page="page" size="sm" :total="50" :items-per-page="10" />
<SPagination v-model:page="page" size="md" :total="50" :items-per-page="10" />
<SPagination v-model:page="page" size="lg" :total="50" :items-per-page="10" />
```

### Sibling count & edges

` sibling-count` mengontrol berapa nomor halaman yang ditampilkan di kedua sisi halaman saat ini sebelum diciutkan menjadi ellipsis; `show-edges` (aktif secara default) menjaga halaman 1 dan halaman terakhir terlihat untuk jumping cepat bahkan ketika mereka jika tidak berada dalam collapsed range:

::component-example{name="pagination-edges-siblings"}
::

```vue-html
<SPagination v-model:page="page" :total="200" :items-per-page="10" :sibling-count="1" />
<SPagination v-model:page="page" :total="200" :items-per-page="10" :sibling-count="3" />
<SPagination v-model:page="page" :total="200" :items-per-page="10" :sibling-count="1" :show-edges="false" />
```

### Links

`to` memetakan nomor halaman ke route/href, merender setiap kontrol sebagai `<a>` nyata alih-alih tombol polos - berguna untuk pagination yang dapat di-crawl dan SEO-friendly pada situs konten. Klik masih menggerakkan perubahan halaman melalui penanganan yang sama seperti tombol polos (tidak ada navigasi penuh) - `to` hanya mengubah markup yang dirender, bukan perilakunya:

::component-example{name="pagination-links"}
::

```vue-html
<SPagination v-model:page="page" :total="120" :items-per-page="10" :to="(p) => `/posts?page=${p}`" />
```

### Menyembunyikan kontrol

`show-controls` (aktif secara default) men toggle Previous/Next - atur ke `false` untuk strip nomor halaman saja:

::component-example{name="pagination-show-controls"}
::

```vue-html
<SPagination v-model:page="page" :total="50" :items-per-page="10" :show-controls="false" />
```

### Warna & varian

`color`/`variant` men-style setiap kontrol tidak aktif (First/Prev/Next/Last dan nomor halaman non-current); `active-color`/`active-variant` menstyle tombol halaman saat ini secara terpisah:

::component-example{name="pagination-colors"}
::

```vue-html
<SPagination
  v-model:page="page"
  :total="50"
  :items-per-page="10"
  color="primary"
  variant="outline"
  active-color="danger"
  active-variant="solid"
/>
```

### Tombol First/Last

`show-first-last` menambahkan tombol jump-to-first/jump-to-last di kedua ujung, di samping tombol Previous/Next yang selalu ditampilkan:

::component-example{name="pagination-first-last"}
::

```vue-html
<SPagination v-model:page="page" :total="200" :items-per-page="10" show-first-last />
```

### Disabled

`disabled` menonaktifkan setiap tombol sekaligus, terlepas dari halaman mana yang sedang aktif:

::component-example{name="pagination-disabled"}
::

```vue-html
<SPagination v-model:page="page" :total="120" :items-per-page="10" disabled />
```

### Aksesibilitas

Pagination merender primitif Pagination milik Reka UI, jadi sebagian besar semantik aksesibilitas berasal dari sana: root adalah landmark `<nav>` (diberi label "Pagination" secara default, dapat diterjemahkan melalui message registry), setiap tombol nomor halaman mendapat `aria-label="Page N"` plus `aria-current="page"` pada yang sedang aktif, dan Previous/Next/First/Last adalah tombol ikon-saja yang dilabel melalui message registry (`Previous`, `Next`, `First`, `Last`) daripada dibiarkan tanpa label. Previous/Next/First/Last menonaktifkan diri secara otomatis di batas yang relevan (Previous/First di halaman 1, Next/Last di halaman terakhir) - logika batas tersebut berasal dari primitif yang mendasarinya, bukan sesuatu yang komponen ini reimplementasi.

### Custom `:ui`

Global dan scoped `ui.pagination` overrides mencakup root, page list, dan ellipsis. Page controls adalah instance Button: gunakan props color/variant Pagination untuk presentasi mereka dan `ui.button` untuk perubahan resep Button bersama.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Pagination` sendiri:

::theme-source{name="pagination"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `total` | `number` | `0` |
| `itemsPerPage` | `number` | `10` |
| `page` | `number` | - |
| `defaultPage` | `number` | `1` |
| `siblingCount` | `number` | `1` |
| `showEdges` | `boolean` | `true` |
| `showFirstLast` | `boolean` | `false` |
| `showControls` | `boolean` | `true` |
| `to` | `(page: number) => string` | - |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `'neutral'` |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'text'` | `'ghost'` |
| `activeColor` | same as `color` | `'primary'` |
| `activeVariant` | same as `variant` | `'solid'` |
| `ui` | `Partial<Record<'root' \| 'list' \| 'ellipsis', string \| object>>` | - |

## Emits

| Emit | Payload | Deskripsi |
| --- | --- | --- |
| `update:page` | `number` | Terpicu saat halaman saat ini berubah, baik dari tombol nomor halaman, Previous/Next, atau First/Last |
