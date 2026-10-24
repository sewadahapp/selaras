---
title: Antarmuka adaptif
description: Aktifkan presentasi seluler untuk kontrol umum.
order: 70
---

Prop `adaptive` mengaktifkan presentasi seluler di bawah breakpoint yang dikonfigurasi. Kontrol yang didukung membuka modal yang sesuai dengan kontennya. Ini opt-in; defaultnya adalah `false`.

## Coba

Gunakan tombol perangkat untuk beralih antara desktop, tablet, dan viewport seluler. Buka kontrol untuk membandingkan presentasi popup dan modalnya. Pratinjau menggunakan viewport tertanam yang nyata, jadi Anda dapat mencoba perilaku seluler tanpa mengubah ukuran browser.

::component-example{name="adaptive-interfaces-basic"}
::

## Kontrol yang didukung

| Komponen | Perilaku adaptif |
| --- | --- |
| [Select](/components/forms/select) | Popup pemilihan menjadi modal. |
| [Autocomplete](/components/forms/autocomplete) | Modal berisi input, saran, dan nilai terpilih. |
| [Dropdown](/components/overlays/dropdown) | Aksi menu muncul di modal. |
| [DatePicker](/components/forms/date-picker) | Konten date dan time picker muncul di modal. |
| [ColorPicker](/components/forms/color-picker) | Kontrol warna muncul di modal. |

Model dan aksi item menggunakan API yang sama di kedua presentasi. Komponen overlay lainnya tidak secara otomatis memperoleh prop `adaptive`.

## Breakpoint

Defaultnya adalah breakpoint `md` milik Tailwind. Atur `selaras.adaptive.breakpoint` di konfigurasi Nuxt untuk memilih token breakpoint Tailwind lainnya. Lihat [Konfigurasi Nuxt](/overview/getting-started/nuxt-configuration#adaptive-breakpoint).

Render server dimulai dengan presentasi desktop. Viewport diukur setelah mount, dan kontrol adaptif terbuka mempertahankan presentasi yang dipilih hingga tertutup. Uji kedua ukuran viewport dan interaksi keyboard di aplikasi Anda.
