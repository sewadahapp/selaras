---
title: Skill
description: Pandu agen coding ke komponen Selaras yang tepat dan API kustomisasi.
order: 30
---

Skill `selaras` mengajarkan agen cara menemukan komponen, membaca kontraknya, dan mengkustomisasinya melalui props, slot, tema, ikon, dan message. Ia bekerja dengan dokumentasi Markdown publik dan juga dapat menggunakan [server MCP lokal](/overview/agent-support/mcp).

## Instal

Gunakan [Skills CLI](https://github.com/vercel-labs/skills) dari direktori aplikasi Anda:

```bash
npx skills add sewadahapp/selaras --skill selaras
```

Pilih agen dan scope instalasi Anda ketika diminta. Repositori menyimpan skill di `skills/selaras/SKILL.md`; Anda juga dapat menyalin folder itu ke direktori skill yang didukung agen Anda.

Paket npm juga menyertakan skill. Untuk menginstal salinan yang cocok dengan versi dependensi Anda:

```bash
npx skills add ./node_modules/@sewadah/selaras/skills/selaras
```

Instalasi repositori tersedia ketika perubahan ini di-push; instalasi paket membutuhkan rilis yang memuat skill. Salinan repositori mengikuti branch-nya saat ini, sementara salinan paket mengikuti versi terinstal Anda.

## Gunakan

Minta agen Anda menggunakan skill Selaras untuk antarmuka konkret:

```text
Use the Selaras skill to build a customer management page with a searchable
Table, an edit Modal, and a confirmation dialog. Read the relevant component
contracts and examples first, and use the project's existing theme.
```

Klien dengan penemuan skill otomatis dapat memilihnya saat mengerjakan proyek Selaras. Sintaks pemanggilan eksplisit bergantung pada klien Anda.

## Apa yang disediakannya

Skill membantu agen melihat melampaui button dan input dasar, menemukan komponen dan composable untuk interaksi yang diminta, dan memeriksa API aktual sebelum mengimplementasikan. Ia juga membedakan konfigurasi global dari props dan slot lokal.

Skill menyediakan instruksi, bukan rekomendasi komponen yang dapat dieksekusi. Agen tetap memilih komponen dan memvalidasi implementasinya. Tanpa MCP, ia membaca ekspor dokumentasi langsung; dengan MCP, ia dapat mengambil katalog dan contoh versi terinstal melalui tools.
