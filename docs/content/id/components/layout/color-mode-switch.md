---
title: ColorModeSwitch
description: Switch yang mengubah antara light dan dark mode.
order: 65
---

## Penggunaan

::component-example{name="color-mode-switch-basic"}
::

```vue-html
<SColorModeSwitch />
<SColorModeSwitch label="Dark mode" description="Choose your preferred appearance." />
```

Switch dicentang dalam dark mode dan tidak dicentang dalam light mode. Ia mengikuti resolved appearance saat preferensi adalah `system`; mengubahnya mengatur preferensi eksplisit `light` atau `dark` melalui `useColorMode()`. Preferensi dipersist oleh color-mode module yang Selaras instal secara otomatis. Switch dinonaktifkan pada halaman dengan forced color mode.

Selama server rendering dan render klien pertama, switch tidak dicentang dan dinonaktifkan. Setelah mounting, ia mencerminkan saved atau system appearance. Ini menjaga konsistensi hydration pada halaman synchronous dan async tanpa memerlukan wrapper `ClientOnly`.

Ia menggunakan tema dan slot `ui` yang sama seperti [Switch](/components/forms/switch), dengan ikon matahari dan bulan di thumb. Gunakan [ColorModeToggle](/components/layout/color-mode-toggle) untuk tombol sebagai gantinya.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | — |
| `label` | `string` | — |
| `description` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `ColorRole` | `'primary'` |
| `disabled` | `boolean` | `false` |
| `checkedIcon` | `string` | Ikon dark-mode terdaftar |
| `uncheckedIcon` | `string` | Ikon light-mode terdaftar |
| `ui` | Switch slot overrides | — |

Tanpa label, switch memiliki nama yang dapat diakses yang dilokalisasi. Atur `aria-label` untuk menyesuaikannya. Atur salah satu prop ikon ke string kosong untuk menyembunyikan ikon itu.

## Slots

| Slot | Deskripsi |
| --- | --- |
| `default` | Menggantikan label. |
| `description` | Menggantikan description saat `description` diberikan. |
