---
title: Migrasi ke 1.0
description: Perbarui tema, konfigurasi, dan kontrol adaptif Selaras pra-1.0.
order: 90
---

Selaras 1.0 membuat kontrak tema dan komponen menjadi eksplisit. Sebagian besar aplikasi
dapat mempertahankan instalasi dan penggunaan komponen biasa. Tinjau panduan ini jika Anda menyesuaikan variabel CSS, menentukan tema, menggunakan konfigurasi scoped, atau menggunakan picker adaptif.

## 1. Pertahankan impor CSS agregat kecuali Anda memiliki tema lengkap

Impor normal tetap menjadi titik awal yang direkomendasikan:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

Ini mencakup fondasi default dan resep semantik Selaras. Jika sistem desain Anda menyediakan setiap role dan token fungsional yang dapat dirender Selaras, gunakan entry struktural sebagai gantinya:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras/structural.css";
@import "#selaras/tailwind.css";
```

CSS struktural adalah kontrak tema lengkap yang eksplisit. Ini tidak jatuh ke fondasi palet Selaras atau mendiagnosis role yang dihapus pada waktu runtime. Lihat [Tema](/overview/theming/overview) untuk resep semantik dan input fungsional yang diperlukan.

## 2. Gunakan namespace token publik

Variabel `--selaras-*` adalah input kustomisasi. Gunakan
`--selaras-resolved-*` hanya ketika CSS Anda sendiri membutuhkan nilai efektif setelah
Selaras menerapkan default, mode, dan scope. Alias `--ui-*` lama
bukan bagian dari kontrak 1.0; pindahkan override ke input semantik yang
sesuai dengan tujuannya.

```css
/* Sebelum: alias implementasi lama yang rentan tabrakan. */
:root { --ui-border: oklch(0.8 0.02 260); }

/* Sesudah: input semantik publik. */
:root { --selaras-border-default: oklch(0.8 0.02 260); }
```

Untuk role warna, berikan leaf resep individual seperti
`--selaras-color-primary-fill`. Jangan targetkan selector yang dihasilkan,
variabel `--_selaras-*`, atau atribut mode/portal: mereka adalah detail
implementasi dan dapat berubah tanpa jalur migrasi publik.

## 3. Daftarkan warna di waktu build Nuxt

Nama `color` kustom harus didaftarkan di `nuxt.config.ts`. Pendaftaran
menghasilkan binding CSS-nya dan menambahkannya ke `ColorRole`, sehingga role yang sama berfungsi
di seluruh komponen tanpa konfigurasi khusus komponen:

```ts [nuxt.config.ts]
import { defineColor } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  selaras: {
    theme: {
      colors: {
        tertiary: defineColor({
          light: {
            fill: 'var(--brand-tertiary)',
            onFill: '#fff',
            subtle: 'var(--brand-tertiary-subtle)',
            onSubtle: '#172033',
            text: '#284772',
            border: '#7aa1d6',
          },
          dark: {
            fill: '#91bcf5',
            onFill: '#10213b',
            subtle: '#18385f',
            onSubtle: '#e9f2ff',
            text: '#b7d4ff',
            border: '#6b9bd8',
          },
        }),
      },
    },
  },
})
```

Lalu gunakan `<SButton color="tertiary" />`, `<SBadge color="tertiary" />`, dan
komponen lain yang berlaku secara normal. Untuk satu warna brand sRGB opaque,
`defineColorFromSeed()` dapat membuat resep lengkap yang dapat diakses. Sistem
token yang ada dapat memetakan nilai CSS yang diresolve ke `defineColor()`; helper DTCG
mengonversi nilai warna yang diresolve, tetapi tidak mengimpor atau me-resolve seluruh dokumen DTCG.

## 4. Pindahkan pengaturan runtime ke bawah `selaras`

Tempatkan konfigurasi Selaras tingkat aplikasi di bawah `app.config.selaras`.
Ini mencegah tabrakan dengan modul Nuxt lain dan memberi override scoped `STheme
vokabular yang sama:

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    ui: {
      button: { slots: { base: 'rounded-full' } },
    },
    defaults: {
      button: { size: 'lg' },
    },
    tokens: {
      light: { surfaces: { default: '#f8fafc' } },
    },
  },
})
```

Gunakan prop `defaults` dari `STheme` untuk default props komponen scoped. Ini hanya mendukung komponen yang mendokumentasikan dukungan default; override resep `ui` tetap tersedia untuk setiap key resep yang diberi tipe.

## 5. Ganti `mobileModal` dengan `adaptive`

Select, Autocomplete, DatePicker, dan ColorPicker sekarang opt-in ke presentasi layar kecil
 dengan `adaptive`:

```vue-html
<!-- Sebelum -->
<SDatePicker mobile-modal />

<!-- Sesudah -->
<SDatePicker adaptive />
```

Presentasi dipilih saat kontrol dibuka dan tetap stabil hingga
ditutup. Autocomplete menempatkan input dan saran di dalam modal seluler. Modul membaca breakpoint Tailwind yang dipilih oleh
`selaras.adaptive.breakpoint`; lihat [Instalasi](/overview/getting-started/nuxt-configuration#adaptive-breakpoint).

## 6. Ikuti konvensi controlled dan native-control

Gunakan `v-model` untuk nilai controlled dan `default-value` untuk nilai awal uncontrolled. Kontrol dengan open state menggunakan `v-model:open` dan `default-open`
sama saja. Jangan teruskan kedua bentuk untuk state yang sama.

```vue-html
<!-- Controlled -->
<SSelect v-model="country" v-model:open="isCountryPickerOpen" />

<!-- Uncontrolled -->
<SSelect default-value="id" :default-open="false" />
```

Untuk perilaku formulir native, letakkan `name`, `form`, `required`, `readonly`, atribut ARIA, dan listener fokus pada kontrol Selaras itu sendiri. Select dan kontrol picker menyinkronkan nilai formulir native dan perilaku reset; Select multiple menolak identitas terpilih yang duplikat.

## 7. Gunakan impor yang didukung

Impor dari root paket, secondary entry yang didokumentasikan, atau
`@sewadah/selaras/components/*`. Jangan impor renderer queues, internal
composables, file resep mentah, atau file implementasi yang dihasilkan dari `dist`.
Jalur tersebut tidak pernah menjadi titik integrasi yang stabil dan sengaja di luar API publik 1.0.

Baca [Instalasi](/overview/getting-started/installation), [Tema](/overview/theming/overview),
dan halaman komponen individual untuk referensi API yang dihasilkan. Changelog yang dihasilkan tetap menjadi catatan historis; halaman ini adalah kontrak migrasi.
