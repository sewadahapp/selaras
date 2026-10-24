---
title: ContentToc
description: Daftar isi dengan penyorotan heading aktif scroll-spy.
order: 40
---

## Penggunaan

::component-example{name="content-toc-basic"}
::

```vue-html
<SContentToc :links="page.body.toc.links" />
```

`links` cocok langsung dengan bentuk `page.body.toc.links` milik `@nuxt/content` (`{ id, text, depth, children? }[]`) - teruskan langsung, tidak perlu adapter. Seperti [ContentNavigation](/composites/documentation/content-navigation), tidak ada dependensi keras pada `@nuxt/content` - bangun array sendiri jika Anda tidak menggunakannya.

Ia biasanya dibungkus [PageAside](/composites/documentation/page-aside) alih-alih digunakan telanjang, yang memasok positioning sticky dan chrome rail yang dapat di-scroll - lihat bagian "Merakit layout halaman penuh" milik [PageHeader](/composites/documentation/page-header) untuk bagaimana ia dan [ContentNavigation](/composites/documentation/content-navigation) cocok dengan sisa halaman.

Heading aktif dilacak dengan membandingkan posisi scroll terhadap rentang konten masing-masing heading (dari posisinya turun ke heading berikutnya, atau ke akhir dokumen untuk yang terakhir) - bukan satu titik trigger tetap, itulah mengapa lebih dari satu bisa aktif sekaligus (bagian pendek yang berdekatan sama-sama tumpang tindih dengan pita trigger) dan mengapa bagian terakhir selalu akhirnya menyala terlepas dari seberapa sedikit kontennya, bahkan setelah Anda scroll sejauh yang diizinkan halaman.

Heading aktif ditampilkan pada rail zigzag di kiri daftar - "kawat" kontinu yang menghubungkan setiap heading, menekuk ke dalam pada setiap perubahan depth, dengan rentang aktif menyala dalam warna primer. Coba scroll halaman ini sendiri dan perhatikan rail kanan. Rail digambar sebagai path SVG yang diterapkan sebagai mask CSS (bukan dicat langsung), sehingga bentuk kurva yang sama berfungsi untuk track samar yang selalu terlihat maupun overlay aktif berwarna primer - tidak ada pustaka animasi JS yang terlibat, hanya `transition` CSS pada posisi/ukuran overlay, batasan "animasi CSS-saja" yang sama yang diikuti setiap komponen lain di pustaka ini.

### Konten link kustom

Slot `link` menggantikan konten teks polos milik link - di-scope dengan `link` dan `active`, sehingga satu template dapat bereaksi terhadap bagian mana yang sedang dibaca:

::component-example{name="content-toc-custom-link"}
::

```vue-html
<SContentToc :links="links">
  <template #link="{ link, active }">
    <span class="flex items-center gap-2">
      {{ link.text }}
      <SBadge v-if="active" label="Reading" color="primary" size="sm" />
    </span>
  </template>
</SContentToc>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `ContentToc` itu sendiri:

Recipe tema global dan scoped menggunakan `ui.contentToc`.

::theme-source{name="content-toc"}
::

### Aksesibilitas

Link aktif mendapat `aria-current="location"` - token WAI-ARIA untuk "lokasi saat ini dalam suatu lingkungan," yang cocok khusus daftar isi (bukan `"page"`, yang untuk pagination). Rail itu sendiri murni dekoratif (`aria-hidden`) - ia gema visual khusus-terlihat dari apa yang sudah disampaikan `aria-current` pada link nyata, bukan sumber informasi terpisah.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `links` | `{ id: string, text: string, depth: number, children?: [...] }[]` | - (required) |
| `title` | `string` | `'On this page'` |
| `ui` | `Partial<Record<ContentTocSlot, string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `title` | - | Konten title kustom, mengoverride prop `title` |
| `link` | `{ link, active }` | Menggantikan konten link |
