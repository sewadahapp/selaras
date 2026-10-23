---
title: Mode warna
description: Gunakan terang, gelap, dan tampilan sistem dengan mode scoped opsional.
order: 40
---

Selaras secara otomatis menginstal Nuxt Color Mode dan mengirimkan resep token terang dan gelap. Preferensi `system` mengikuti sistem operasi; tampilan yang diresolve adalah `light` atau `dark`.

## Kontrol bawaan

```vue-html
<SColorModeToggle />
<SColorModeSwitch />
```

[ColorModeToggle](/components/layout/color-mode-toggle) mengubah tampilan melalui tombol. [ColorModeSwitch](/components/layout/color-mode-switch) menawarkan switch. Keduanya menggunakan state color-mode yang sama.

## Preferensi dan tampilan yang diresolve

```vue
<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <SButton @click="colorMode.preference = 'system'">
    Gunakan tampilan sistem
  </SButton>
</template>
```

Baca `colorMode.preference` untuk pilihan pengguna dan `colorMode.value` untuk mode yang diresolve. Nuxt Color Mode mengelola kelas root `.light` dan `.dark` serta persistensi. Konfigurasikan opsi `colorMode` di `nuxt.config.ts` saat Anda membutuhkan preferensi awal atau kebijakan penyimpanan yang berbeda.

## Tampilan scoped

```vue-html
<STheme as="section" mode="dark">
  <SCard>Dark content inside a light page</SCard>
</STheme>
```

`STheme` menerima `inherit`, `light`, dan `dark`. Mode scoped eksplisit membutuhkan pemilik DOM melalui `as`. Lihat [Tema scoped](/overview/theming/scoped-themes) untuk konfigurasi komponen dan penimpaan token.

Mode warna memilih resep terang atau gelap. Role semantik seperti `primary` dan `danger` memilih tujuan warna; preset tema dokumentasi memilih desain visual. Ini adalah pengaturan yang terpisah.
