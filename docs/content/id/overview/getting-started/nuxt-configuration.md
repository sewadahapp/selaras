---
title: Konfigurasi Nuxt
description: Konfigurasikan impor komponen, prefix kelas, breakpoint adaptif, dan role warna.
order: 40
---

## Opsi

Konfigurasikan modul di bawah key `selaras`:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  selaras: {
    // Prefix yang digunakan untuk komponen auto-import.
    prefix: 'S', // default
  },
})
```

| Opsi | Tipe | Default | Deskripsi |
| --- | --- | --- | --- |
| `prefix` | `string` | `'S'` | Prefix untuk komponen auto-import (`SButton`, `SModal`, ...). |
| `classPrefix` | `string` | tidak ada | Namespace setiap kelas yang dirender oleh komponen Selaras sendiri - lihat di bawah. |
| `theme.colors` | `Record<string, ColorModePair<ColorRecipeInput>>` | role bawaan | Resep warna terang dan gelap waktu build; juga mendaftarkan role kustom. |
| `adaptive.breakpoint` | `string` | `'md'` | Memilih token Tailwind `--breakpoint-*` untuk presentasi adaptif. |

## Breakpoint adaptif

CSS memiliki nilai breakpoint. Ganti kondisi default di stylesheet Anda:

```css
@theme {
  --breakpoint-md: 60rem;
}
```

Atau definisikan token `--breakpoint-tablet` Anda sendiri dan pilih dengan `selaras: { adaptive: { breakpoint: 'tablet' } }`. Nilai yang didukung adalah panjang sederhana dalam `px`, `rem` atau `em`. Pertahankan unit breakpoint konsisten dengan kondisi Tailwind Anda yang lain. Selaras membaca panjang yang diresolve setelah mount dan menggunakan media query native `(width < …)`, termasuk di bawah class prefix. Render SSR awalnya menggunakan presentasi desktop; kontrol adaptif yang sudah terbuka mempertahankan presentasi yang dipilih hingga tertutup.

Ini adalah kondisi `@theme` waktu build. Mengubah variabel CSS breakpoint secara runtime tidak menulis ulang aturan responsif Tailwind yang sudah dikompilasi. Binding yang tidak ada atau tidak didukung menghasilkan diagnostik di konsol dan menonaktifkan presentasi seluler; tidak ada fallback implisit 768px.

## Class prefix

Tailwind v4 mendukung namespace setiap utilitasnya sendiri di belakang prefix (`@import "tailwindcss" prefix(tw);`, yang mengubah `px-4` menjadi
`tw:px-4`) - biasanya untuk menghindari tabrakan dengan framework CSS lain atau build Tailwind kedua yang dikonfigurasi berbeda dalam proyek yang sama. Selaras dapat mencocokkan prefix tersebut di kelas yang dirender oleh komponennya sendiri, melalui `classPrefix` di bawah key `selaras` di `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  selaras: {
    classPrefix: 'tw',
  },
})
```

Ini adalah opsi modul, bukan nilai `app.config.ts` - pembuatan Tailwind CSS terjadi pada waktu build, jadi Selaras perlu mengetahui prefix-nya cukup awal untuk menghasilkan kandidat kelas yang diimpor melalui `#selaras/tailwind.css`. Entry Tailwind Anda sendiri menghasilkan CSS yang cocok (Tailwind tidak pernah menghasilkan CSS untuk kelas yang tidak dapat ditemukan sebagai teks literal di mana pun, baik di template Anda sendiri maupun safelist - nilai `app.config.ts` saja, yang hanya dibaca saat render, tidak pernah bisa menghasilkannya).

**Nilai ini harus cocok dengan prefix Tailwind Anda secara persis.** Selaras tidak memiliki cara untuk mendeteksi konfigurasi Tailwind Anda, jadi jika keduanya berbeda - `classPrefix: 'tw'` di sini sementara CSS Anda masih mengatakan `prefix(ui)`, atau satu diatur dan yang lainnya tidak - setiap komponen merender kelas yang build Tailwind Anda tidak pernah menghasilkan CSS, dan seluruh UI terlihat seperti stylesheet kosong. Tidak ada error yang muncul di kedua cara; ini secara diam-diam terlihat seperti stylesheet kosong. Hanya atur ini jika Anda sudah menambahkan `prefix(...)` ke `@import "tailwindcss"` Anda sendiri.

**Kelas Anda sendiri memerlukan prefix yang sama, ditulis manual.** Penanganan otomatis Selaras hanya mencakup kelas yang tertanam dalam komponen yang dikirimkannya sendiri - ia tidak memiliki cara untuk melihat string yang Anda tulis sendiri, jadi override `:ui` (atau komponen kustom Anda yang dibangun dengan cara yang sama, pada `resolveSlot`/`tv()`) membutuhkan prefix yang ditulis langsung ke dalam string:

```vue-html
<!-- classPrefix: 'tw' -->
<SButton :ui="{ base: 'tw:bg-purple-700' }" />
```

Ini bukan masalah khusus Selaras - ini adalah aturan yang sama yang fitur prefix Tailwind sudah terapkan pada setiap kelas lain di proyek Anda setelah Anda mengadopsinya (sebuah `<div class="tw:flex">` biasa membutuhkan prefix literal yang sama). Lihat [Tema](/overview/theming/overview) untuk cara lain menyesuaikan komponen.



## Role warna kustom

`selaras.theme.colors` mendaftarkan resep warna waktu build, termasuk nama role kustom. Setiap role menyediakan resep terang dan gelap. Lihat [Role warna](/overview/theming/color-roles) untuk kontrak lengkap. Kelas runtime, default, messages, dan ikon ada di `app.config.ts`, bukan di opsi modul ini.

Lihat [Konfigurasi global](/overview/theming/global-configuration) dan [Mode warna](/overview/theming/color-modes).
