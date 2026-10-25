---
title: Penggunaan komponen
description: Gunakan provider, props komponen, slot, model, dan konfigurasi bersama.
order: 30
---

Komponen Selaras diimpor secara otomatis dengan awalan `S`. Mulai dengan komponen yang sudah ada, lalu sesuaikan props dan slot-nya sebelum membuat pengganti.

## State dan event

```vue
<script setup lang="ts">
const selected = ref<'Small' | 'Medium' | 'Large'>()
</script>

<template>
  <SSelect v-model="selected" :items="['Small', 'Medium', 'Large']" placeholder="Choose a size" />
</template>
```

Halaman referensi komponen mendokumentasikan model, event, bentuk item, dan slot. Label item adalah konten Anda; label internal dikontrol melalui [messages](/overview/getting-started/messages).

## Penyesuaian

Gunakan props untuk perilaku dan tampilan yang didukung. Gunakan slot untuk konten kustom, `class` untuk root, dan `:ui` untuk bagian bergaya tertentu. Lihat [Penyesuaian komponen](/overview/theming/component-styling) untuk penggabungan dan prioritas.

Bungkus aplikasi Anda di [SApp](/components/layout/app) untuk provider. Tambahkan [Toast](/components/overlays/toast) dan [CommandPalette](/components/overlays/command-palette) di mana referensi mereka menjelaskan; provider saja tidak merender kontrol ini.

## Antarmuka responsif

Gunakan [kontrol adaptif](/overview/getting-started/adaptive-interfaces) untuk mengaktifkan presentasi modal di layar kecil. Utilitas tata letak responsif dan presentasi adaptif memenuhi kebutuhan yang berbeda.
