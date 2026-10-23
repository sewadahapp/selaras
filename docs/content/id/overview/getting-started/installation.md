---
title: Instalasi
description: Instal Selaras dan hubungkan provider serta style-nya.
order: 20
---

## Persyaratan

Selaras mendukung Nuxt `^4.5.2`, Tailwind CSS `^4.3.0`, dan Node.js
`^22.19.0 || ^24.11.0 || >=26.0.0`. Nuxt menyediakan runtime Vue dan kompiler SFC,
jadi keduanya tidak diinstal atau di-version secara terpisah. Pemeriksaan tipe diuji
 dengan TypeScript `>=5.9.3`; TypeScript adalah alat waktu build, bukan dependensi
runtime Selaras.

## Instal paket

Nuxt dan Tailwind CSS adalah peer dependencies - instal Selaras di proyek Nuxt yang sudah ada dan pertahankan Tailwind di bawah kontrol langsung proyek Anda:

::code-group

```bash [bun]
bun add @sewadah/selaras tailwindcss
```

```bash [npm]
npm install @sewadah/selaras tailwindcss
```

```bash [pnpm]
pnpm add @sewadah/selaras tailwindcss
```

::

## Daftarkan modul

Tambahkan `@sewadah/selaras` ke `modules` di `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
})
```

Komponen sekarang diimpor secara otomatis, dan modul menarik dependensinya sendiri (`@nuxt/icon`, `@nuxtjs/color-mode`) secara otomatis.

## Bungkus aplikasi Anda dalam `SApp`

Bungkus root `app.vue` Anda dalam `<SApp>`, satu kali:

```vue-html
<!-- app.vue -->
<template>
  <SApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </SApp>
</template>
```

Ini tidak opsional - tanpa itu, Tooltip kehilangan perilaku delay hover yang dibagi, dan `useModal()`/`useDrawer()`/`useSlideover()`/`useConfirm()` (API "buka dari mana saja") tidak memiliki tempat untuk merender. Lihat [App](/components/layout/app) untuk gambaran lengkap, termasuk dua komponen (`SToast`, `SCommandPalette`) yang masih perlu Anda tempatkan sendiri meskipun `SApp` sudah membungkus semuanya.

## Impor CSS

Selaras tidak menyuntikkan CSS sendiri untuk Anda - impor secara eksplisit di stylesheet Anda sendiri, setelah Tailwind:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

Lalu arahkan Nuxt ke file tersebut:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  css: ['~/assets/css/main.css'],
})
```

`@import "@sewadah/selaras";` membawa tema default dan style base komponen - lihat [Tema](/overview/theming/overview). `#selaras/tailwind.css` dihasilkan oleh modul Nuxt. Impor di entry yang sama sehingga kandidat kelas library dan presentasi adaptif menggunakan tema Tailwind final aplikasi Anda.

### Tema eksplisit lengkap

Aplikasi dengan tema semantik lengkap yang sudah ada dapat mengimpor entry struktural Selaras alih-alih fondasi default yang dimiliki Selaras:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras/structural.css";
@import "#selaras/tailwind.css";
```

Entry ini mempertahankan discovery sumber, varian, gerakan, dan binding semantik. Berikan resep terang dan gelap untuk setiap role yang dapat dirender komponen Anda, termasuk role bawaan apa pun yang Anda pertahankan dan setiap role kustom yang Anda daftarkan. Berikan input `--selaras-*` fungsional yang diperlukan oleh sistem desain Anda juga. Ini bukan mode zero-configuration tanpa tema: tema struktural yang tidak lengkap tidak memiliki palet fallback atau diagnostik kelengkapan runtime dari Selaras. Gunakan impor agregat kecuali Anda menyediakan kontrak lengkap tersebut. Jika proyek Anda juga merender konten markdown/CMS panjang, tambahkan [prose.css](/components/typography/prose) dengan cara yang sama:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
@import "@sewadah/selaras/prose.css";
```



Lanjutkan ke [Penggunaan komponen](/overview/getting-started/component-usage) dan [Konfigurasi Nuxt](/overview/getting-started/nuxt-configuration).
