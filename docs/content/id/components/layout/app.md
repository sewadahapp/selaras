---
title: App
description: Membungkus root app.vue Anda - diperlukan sekali, untuk setiap aplikasi yang menggunakan Selaras.
order: 59
---

## Penggunaan

`SApp` membungkus root `app.vue` Anda, sekali, di sekitar segala sesuatu yang lain:

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

Ini tidak opsional untuk sebagian besar hal yang Selaras kirimkan - tanpa itu:

- **Tooltip** kehilangan perilaku shared hover-delay-nya (bergerak cepat antar tooltip yang berdekatan harusnya melewatkan delay penuh pada yang kedua) - ia membutuhkan konteks `TooltipProvider` milik Reka UI, yang hanya ada di dalam `SApp`.
- **Toast** tidak memiliki apa pun untuk merender ke dalamnya - konteks `ToastProvider` juga tinggal di sini (Anda tetap meletakkan `<SToast />` sendiri, lihat di bawah).
- **`useModal()`, `useDrawer()`, dan `useSlideover()`** (API programmatic, "buka dari mana saja") tidak memiliki apa pun untuk merender dialog/panel ke dalamnya - `SApp` memasang komponen renderer mereka secara internal. `<SModal>`/`<SDrawer>`/`<SSlideover>` deklaratif biasa yang ditempatkan langsung di halaman tidak membutuhkan ini - hanya versi composable `useX()` yang membutuhkannya.

Jika Anda membuat proyek melalui `npx nuxt module add @sewadah/selaras`, atau menyalin cuplikan Quick Setup dari [panduan instalasi](/overview/getting-started/installation), ini sudah selesai untuk Anda.

### Toast dan CommandPalette masih perlu ditempatkan sendiri

`SApp` membangun *context* yang dibutuhkan kedua komponen tersebut, tetapi tidak merenderkannya untuk Anda seperti yang dilakukan untuk Modal/Drawer/Slideover - tempatkan `<SToast />` dan `<SCommandPalette>` sendiri, sekali, biasanya tepat di samping `SApp` itu sendiri:

```vue-html
<!-- app.vue -->
<template>
  <SApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SToast />
    <SCommandPalette :groups="searchGroups" />
  </SApp>
</template>
```

Lihat [Toast](/components/overlays/toast) dan [CommandPalette](/components/overlays/command-palette) untuk detail penyiapan mereka sendiri.

### Reading direction (RTL)

`dir` melakukan dua hal sekaligus, keduanya dibutuhkan untuk dukungan right-to-left yang nyata:

- diteruskan ke `ConfigProvider` milik Reka UI, yang setiap primitif di bawahnya mewarisi untuk logika internal yang sadar arahnya (arrow-key roving focus di RadioGroup/Tabs, Floating UI positioning, ...);
- diatur sebagai atribut `dir` nyata pada `<html>` - inilah yang benar-benar menggerakkan perilaku browser native (text direction, sisi scrollbar) dan utilitas CSS logical-property apa pun (`ms-*`/`ps-*`/`text-start`/...), yang tidak dapat diresolve hanya dari konteks Vue milik Reka sendiri.

```vue-html
<SApp dir="rtl">
  ...
</SApp>
```

`lang` pada `<html>` juga diatur secara otomatis, melacak locale apa pun yang [`useLocale`](/utilities/composables/use-locale) sudah resolve teks dan date formatting - tidak ada prop terpisah untuk itu, karena harus selalu cocok.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Seluruh aplikasi Anda |
