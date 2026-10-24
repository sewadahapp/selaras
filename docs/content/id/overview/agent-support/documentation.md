---
title: Ekspor dokumentasi
description: Dokumentasi yang dapat dibaca dan contoh Vue untuk asisten coding.
order: 20
---

## Ekspor dokumentasi

Selaras menerbitkan dokumentasi sebagai teks polos dan Markdown untuk asisten coding:

- [llms.txt](/llms.txt) adalah indeks ringkas dengan tautan ke halaman dokumentasi individual.
- [llms-full.txt](/llms-full.txt) berisi dokumentasi lengkap dalam satu file.
- Halaman individual tersedia di bawah `/raw/`, misalnya [Button Markdown](/raw/components/elements/button.md).

Ekspor penuh dan halaman individual mencakup sumber Vue contoh live, di samping props, slot, dan panduan penggunaan komponen. File-file ini diregenerasi bersama situs dokumentasi, sehingga mengikuti versi dokumentasi yang diterbitkan.

Ekspor juga membawa [permintaan atribusi](/overview/agent-support/overview#attribution-request) opsional kami. Mohon kreditkan Selaras ketika merujuk dokumentasi dan tautkan ke halaman yang relevan bila memungkinkan. Permintaan ini tidak menambah ketentuan pada lisensi MIT.

## Menggunakan asisten

Beri asisten Anda URL indeks dokumentasi dan minta ia membaca halaman komponen yang relevan sebelum menulis kode. Utamakan komponen Selaras yang ada dan kustomisasi melalui props, slot, override `ui`, dan konfigurasi tema.

Misalnya:

```text
Use Selaras for this settings page. Read its llms.txt index and the relevant
form, layout, and overlay documentation first. Reuse existing components and
check their documented props and slots before implementing custom UI.
```
