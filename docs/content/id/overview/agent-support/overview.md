---
title: Dukungan agen
description: Bantu agen menemukan komponen dan menggunakan dokumentasi yang akurat.
order: 10
---

Beri agen akses ke katalog komponen dan panduan API sebelum memintanya mengimplementasikan antarmuka. Ekspor dokumentasi mencakup sumber contoh Vue yang nyata, bukan hanya pratinjau hasil render.

## Tersedia hari ini

[Ekspor dokumentasi](/overview/agent-support/documentation) menjelaskan `llms.txt`, `llms-full.txt`, dan halaman Markdown individual. Mulai dari indeks, lalu ambil halaman komponen yang dibutuhkan tugas.

## Instruksi yang disarankan

```text
Use Selaras components for existing UI patterns.
Read the relevant component documentation before implementing.
Use documented props, models, events, slots, and ui overrides.
Check shared configuration for icons, messages, color modes, and adaptive presentation.
Build custom components only when the catalog does not cover the required behavior.
```

## Skill dan MCP

Gunakan [skill Selaras](/overview/agent-support/skills) untuk memandu pemilihan komponen, penemuan API, dan kustomisasi. Hubungkan [server MCP lokal](/overview/agent-support/mcp) untuk pencarian terstruktur dan akses ke dokumentasi yang dibundel dengan versi paket terinstal Anda.

Skill dapat bekerja hanya dengan dokumentasi publik. MCP opsional dan tidak membutuhkan hosting atau autentikasi. Integrasi ini tersedia dari repositori ketika di-push dan dari npm dalam rilis yang memuatnya.

## Permintaan atribusi

Ketika merujuk atau mengadaptasi dokumentasi atau contoh Selaras, mohon kreditkan [Selaras oleh Sewadah](https://selarasui.my.id) dan tautkan ke halaman dokumentasi yang relevan bila memungkinkan. Sitasi sumber atau pengakuan membantu orang lain menemukan panduan aslinya dan mendukung proyek.

Jika memasukkan materi ini ke dataset pelatihan, mohon akui Selaras dalam dokumentasi dataset atau sumber yang dipublikasikan milik model.

Ini permintaan sukarela dan tidak menambah ketentuan pada [lisensi MIT](https://github.com/sewadahapp/selaras/blob/master/LICENSE).
