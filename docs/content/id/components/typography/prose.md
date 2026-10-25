---
title: Prose
components: [SProseH1, SProseH2, SProseH3, SProseH4, SProseH5, SProseH6, SProsePre]
description: Class tipografi agnostik-pipeline untuk konten long-form, plus dua komponen enhanced untuk renderer yang mendukungnya.
order: 70
---

## Penggunaan

Bungkus HTML yang dirender apa pun - output markdown, body rich-text milik CMS, konten tulisan tangan, apa pun yang menghasilkannya - dalam class `selaras-prose` untuk tipografi long-form yang konsisten, tanpa komponen atau `@nuxt/content` yang diperlukan:

::component-example{name="prose-standalone"}
::

```vue-html
<div class="selaras-prose">
  <h3>A heading</h3>
  <p>Some <strong>bold</strong> text.</p>
</div>
```

Ia stylesheet terpisah yang opt-in - tidak dibundel ke `theme.css` (yang sudah Anda import sendiri, lihat [Instalasi](/overview/getting-started/installation)) - sehingga proyek tanpa konten long-form tidak pernah membayarnya:

```css
@import "tailwindcss";
@import "@sewadah/selaras/prose.css";
```

Setiap selector elemen di dalamnya dibungkus `:where(...)`, yang membawa spesifisitas nol - class Anda sendiri, atau bahkan selector elemen polos lain yang digabung dengan satu hal lagi, selalu menang. Tanpa `!important`, dan tidak ada yang perlu di-override satu aturan setiap kali di halaman yang default-nya tidak cocok.

Tabel mengisi lebar konten secara default. Ketika kolom membutuhkan lebih banyak ruang, tabel scroll horizontal tanpa melebarkan halaman. Header dan sel body menjaga kolomnya tetap sejajar.

### Font

`selaras-prose` tidak menghardcode tumpukan font - ia mengikuti apa pun yang sudah digunakan proyek Anda, melalui tiga variabel CSS yang bisa Anda override independen dari font seluruh situs jika prose secara khusus harus terlihat berbeda:

```css
:root {
  --selaras-prose-font-body: inherit;
  --selaras-prose-font-heading: inherit;
  --selaras-prose-font-mono: var(--font-mono, ui-monospace, monospace);
}
```

## Dua komponen enhanced

Dua elemen memiliki perilaku interaktif nyata yang tidak bisa direplikasi class CSS, sehingga mereka tetap komponen nyata: `SProsePre` (tombol copy-to-clipboard, via [Button](/components/elements/button), plus header filename/language polos dengan [Icon](/components/elements/icon) tipe-file) dan `SProseH1`-`SProseH6` (membungkus konten heading dalam self-anchor `<a href="#id">` ketika diberi `id` - heading halaman ini sendiri bekerja persis seperti ini).

Keduanya bisa dipakai langsung, sama seperti komponen lainnya:

```vue-html
<SProseH3 id="a-heading">A heading</SProseH3>
<SProsePre code="const x = 1" language="ts"><code>const x = 1</code></SProsePre>
```

## Props

### `SProsePre`

| Prop | Tipe | Default |
| --- | --- | --- |
| `code` | `string` | - |
| `language` | `string` | - |
| `filename` | `string` | - |
| `icon` | `string` | di-resolve dari `filename`/`language` |
| `showHeader` | `boolean` | `true` |
| `highlights` | `number[]` | - |
| `meta` | `string` | - |

`code` memasok teks clipboard; slot default memasok kode yang terlihat. Tombol copy disembunyikan ketika `code` kosong. Renderer Markdown memasok konten slot yang di-highlight sekaligus sumber aslinya secara otomatis. Bar header menampilkan `filename` jika diatur, jika tidak label polos untuk `language` jika itu diatur, jika tidak tidak ada; atur `showHeader` ke `false` untuk menyembunyikan seluruh bar metadata/copy. CodeGroup melakukan ini otomatis dan memindahkan filename dan ikon tipe-file ke tab-nya. Di samping keduanya, ikon tipe-file di-resolve dari ekstensi filename terlebih dahulu, lalu bahasa fence - misalnya `vue` merender glyph `vscode-icons:file-type-vue` - tanpa ikon untuk tipe yang tidak dikenali. Berikan `icon` untuk mengoverride resolusi itu. Filename panjang terpotong di header, dengan path penuh tersedia saat hover. Menyalin mengubah tombol menjadi centang berwarna success; labelnya berasal dari `copyCode` dan `codeCopied` dalam [message registry](/utilities/composables/use-messages).

Kustomisasi header melalui slot `preHeader`, `preLabel`, `preIcon`, `preFilename`, `preLanguage`, dan `preCopyButton` milik tema `prose` dalam `app.config.selaras.ui` atau `STheme`. `highlights` dan `meta` diterima tapi saat ini tidak berpengaruh - belum ada logika line-highlighting yang terhubung di mana pun dalam komponen, sehingga memberikan keduanya tidak melakukan apa pun yang terlihat hari ini. Keduanya dicadangkan agar fitur itu mendarat nanti; jangan menghubungkannya dengan harapan ada output.

### `SProseH1`-`SProseH6`

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |

### Mengapa hanya dua ini yang bukan CSS

Semua yang dihasilkan renderer markdown lainnya - link, gambar, paragraf, list, tabel, emphasis - adalah styling murni tanpa perilakunya sendiri, sehingga `selaras-prose` mencakupnya sepenuhnya. Tombol copy membutuhkan JavaScript nyata; heading anchor-link membutuhkan elemen `<a>` nyata dalam DOM aktual yang dihasilkan renderer, yang hanya bisa dilakukan renderer *berbasis komponen* (yang me-resolve setiap elemen markdown ke instance komponen nyata dengan props, `id` termasuk - `@nuxt/content`/`@nuxtjs/mdc` adalah kasus umum). Pipeline string-HTML-mentah (kebanyakan kasus non-Nuxt-Content: CMS, markdown-it rakitan tangan, body hasil render headless CMS) tidak memiliki hook untuk menukar komponen per elemen - `selaras-prose` tetap men-style `<pre>`/`<h1 id="...">` polos apa pun yang dipancarkan pipeline itu, hanya tanpa tombol copy atau anchor yang bisa diklik.

## Menghubungkan ke `@nuxt/content`

Berikan objek komponen yang di-import ke `ContentRenderer`. Ini menjaga anchor heading dan kontrol copy kode tersedia selama rendering server dan hydration. Nama komponen telanjang bisa bertabrakan dengan komponen prose bawaan milik renderer.

Misalnya, buat wrapper yang menerima dokumen yang dikembalikan panggilan `queryCollection` Anda:

```vue
<script setup lang="ts">
import ProseH1 from '@sewadah/selaras/components/ProseH1.vue'
import ProseH2 from '@sewadah/selaras/components/ProseH2.vue'
import ProseH3 from '@sewadah/selaras/components/ProseH3.vue'
import ProseH4 from '@sewadah/selaras/components/ProseH4.vue'
import ProseH5 from '@sewadah/selaras/components/ProseH5.vue'
import ProseH6 from '@sewadah/selaras/components/ProseH6.vue'
import ProsePre from '@sewadah/selaras/components/ProsePre.vue'

defineProps<{ document: Record<string, unknown> }>()
const proseComponents = {
  h1: ProseH1,
  h2: ProseH2,
  h3: ProseH3,
  h4: ProseH4,
  h5: ProseH5,
  h6: ProseH6,
  pre: ProsePre,
}
</script>

<template>
  <ContentRenderer :value="document" :components="proseComponents" class="selaras-prose" />
</template>
```

Import stylesheet prose dalam entry CSS Anda seperti ditunjukkan di atas. Lapisan docs sudah memasok pemetaan dan stylesheet ini; proyek yang memperluas `@sewadah/selaras-docs` hanya membutuhkan wiring kustom ketika mengganti renderer-nya. Situs dokumentasi dan konsumen docs-layer yang dipak menggunakan komponen import dengan cara yang sama. Elemen polos tetap menggunakan style `selaras-prose` tanpa pemetaan komponen.

## Custom `:ui`

`SProsePre` dan `SProseH1`-`SProseH6` berbagi tema `prose`. Konfigurasikan `app.config.selaras.ui.prose`, atau scope `STheme` dengan `:ui="{ prose: { slots: { pre: 'font-mono' } } }"`. Komponen-komponen ini tidak mengekspos prop instance `ui`. Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema `Prose` itu sendiri:

::theme-source{name="prose"}
::
