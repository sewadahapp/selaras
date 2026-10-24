---
title: Blok
description: Contoh antarmuka lengkap. Pratinjau, salin, dan sesuaikan ke aplikasi Anda.
order: 10
toc: true
editLink: false
prevNext: false
---

| Blok | Berisi |
| --- | --- |
| [Masuk](/blocks/sign-in) | Formulir masuk dan reset kata sandi, visibilitas kata sandi dan state pending. |
| [Ringkasan dasbor](/blocks/dashboard-overview) | Sidebar ruang kerja responsif, proyek, aktivitas, dan detail proyek. |
| [Pengaturan profil](/blocks/profile-settings) | Field profil, preferensi email, simpan dan reset. |
| [Manajemen data](/blocks/data-management) | Pencarian, filter peran, sorting, pagination, dan editor anggota. |
| [Editor Tiptap](/blocks/editors/tiptap) | Rich text, heading, daftar, tautan, undo/redo dan binding HTML. |
| [Editor Lexical](/blocks/editors/lexical) | Kontrol toolbar yang sama terhubung ke editor berbasis node. |
| [Editor Quill](/blocks/editors/quill) | Editor ringkas dengan formatting, riwayat, dan binding HTML. |

Setiap blok memiliki pratinjau interaktif, kontrol perangkat, dan sumber yang dapat disalin. Pratinjau mengikuti tema dokumentasi yang dipilih. Semua data bersifat ilustratif; perubahan tetap di memori dan request disimulasikan.

## Penyiapan

Ikuti [Instalasi](/overview/getting-started/installation) di aplikasi Nuxt, lalu salin blok ke `app/pages/`. **Code** mencakup modul, stylesheet, dan penyiapan `SApp`; **Copy Vue** menyalin halaman. Contoh menggunakan prefiks komponen `S` default dan auto-import Nuxt.

Untuk ikon lokal, instal `@iconify-json/hugeicons` sebagai dependensi pengembangan; lihat [Ikon](/overview/getting-started/icons). Tidak perlu paket formulir atau chart tambahan untuk blok antarmuka. Blok editor menunjukkan dependensi engine tambahannya di atas pratinjau. Blok menggunakan tema aplikasi Anda; preset showcase dokumentasi tidak ikut terinstal saat menyalin sumbernya.

Ganti request simulasi dengan layanan Anda dan tegakkan validasi serta izin di server. Komentar sumber menandai titik integrasi. Sumber blok juga tersedia melalui [llms.txt](/llms.txt), [llms-full.txt](/llms-full.txt), Markdown mentah, dan katalog MCP.

## Blok editor

Pilih satu engine editor dan instal perintah yang ditampilkan di halamannya. Dependensi ini milik aplikasi Anda; menginstal Selaras tidak menginstal editor. Setiap blok adalah file Vue lengkap yang menggunakan [Toolbar](/components/elements/toolbar) bersama dan mengekspos `v-model` HTML, plus prop `readonly`, `disabled`, dan `placeholder`. Sakelar Read only lokal, aksi Reset content, dan disclosure HTML membantu Anda mencoba contoh; hapus mereka saat menyesuaikannya ke antarmuka Anda.

Engine memiliki skema dokumen dan format JSON native yang berbeda. HTML nyaman untuk contoh dasar ini, tetapi tidak mempertahankan setiap node atau ekstensi kustom. Untuk dokumen lanjutan, gunakan format persistensi native milik engine yang dipilih. Validasi dan sanitasi rich text yang disimpan sebelum merendernya di tempat lain. Blok-blok ini menginisialisasi editor browser setelah mount dan membuang listener-nya saat unmount. Mereka menyediakan editing sisi-klien, bukan pratinjau dokumen yang di-render server.
