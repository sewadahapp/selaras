---
title: ColorModeToggle
description: Tombol yang mengalihkan antara light dan dark mode.
order: 64
---

## Penggunaan

::component-example{name="color-mode-toggle-basic"}
::

```vue-html
<SColorModeToggle />
```

Dibangun di atas [`@nuxtjs/color-mode`](https://color-mode.nuxtjs.org/) (entry `moduleDependencies` di modul Nuxt Selaras sendiri, jadi diatur secara otomatis untuk konsumen apa pun) - mengalihkan membalik antara `light` dan `dark`, menerapkan kelas `dark`/`light` minimal pada `<html>` yang cocok dengan Tailwind v4 dark variant milik pustaka ini (`theme.css`'s `@custom-variant dark (&:where(.dark, .dark *))`) tanpa konfigurasi ekstra.

Untuk apa pun di luar simple two-way toggle (misalnya picker light/dark/system), panggil `useColorMode()` sendiri - itu adalah composable yang sama yang komponen ini gunakan secara internal (`colorMode.preference` dapat ditulis, `colorMode.value` adalah mode yang diresolve).

Tombol merender ikon light-mode yang dinonaktifkan selama server rendering dan render klien pertama. Setelah mounting, ia mencerminkan saved atau system appearance dan menjadi interaktif. Ini juga berfungsi pada halaman dengan async data loading; tidak diperlukan wrapper `ClientOnly`. Halaman dengan forced color mode menjaga tombol tetap dinonaktifkan.

## Props

`SColorModeToggle` tidak mengambil props.
