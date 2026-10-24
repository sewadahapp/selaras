---
title: MCP
description: Ambil dokumentasi komponen berversi dan contoh melalui server MCP lokal.
order: 40
---

Selaras menyediakan server MCP lokal yang read-only dalam paket terpisah `@sewadah/selaras-mcp`. Klien agen Anda meluncurkannya sebagai subprocess dan berkomunikasi melalui input dan output standar (`stdio`). Tidak perlu server ter-hosting, akun, API key, atau layanan autentikasi.

Katalog dokumentasi dikirim di dalam `@sewadah/selaras` sendiri, dihasilkan dari dokumentasi dan contoh Vue yang sama dengan situs web. Server membaca katalog dari instalasi Selaras milik proyek Anda sendiri, sehingga jawabannya selalu cocok dengan versi yang Anda gunakan, dan ia berfungsi tanpa mengambil dokumentasi dari jaringan. Ia membutuhkan `@sewadah/selaras` 0.11.0 atau lebih baru.

Menyimpan server dalam paketnya sendiri berarti aplikasi yang hanya menggunakan komponen tidak pernah menginstal server itu atau dependensinya.

## Konfigurasikan klien Anda

Tambahkan entri ini ke konfigurasi MCP klien Anda:

```json
{
  "mcpServers": {
    "selaras": {
      "command": "npx",
      "args": ["-y", "@sewadah/selaras-mcp"]
    }
  }
}
```

Server mencari Selaras di direktori tempat ia dimulai, yaitu proyek Anda untuk klien yang meluncurkan server lokal di sana. Jika klien Anda memulai server di tempat lain, tambahkan `"--project", "/absolute/path/to/your-project"` ke `args`.

Contoh menggunakan bentuk konfigurasi JSON umum; klien Anda mungkin menggunakan file atau format berbeda. Gunakan versi Node.js yang didukung Selaras dan restart atau hubungkan ulang klien setelah mengubah konfigurasinya.

Untuk menyematkan versi server dengan proyek Anda alih-alih mengambil yang terbaru, instal sebagai dependensi pengembangan (`bun add -d @sewadah/selaras-mcp`) dan gunakan `npx --no-install selaras-mcp` sebagai command.

Untuk pengembangan di repositori ini, jalankan `bun run agent:build` terlebih dahulu, lalu arahkan klien ke `packages/mcp/mcp.mjs` milik repositori, berikan `--project` dengan path repositori.

## Tools

| Tool | Argumen | Hasil |
| --- | --- | --- |
| `list_components` | `category` opsional, seperti `forms` atau `overlays` | Nama komponen, deskripsi, path panduan, dan nama contoh. |
| `search_documentation` | `query`; `limit` opsional dari 1 sampai 20 | Cocok panduan berperingkat lintas komponen, composable, setup, dan theming. |
| `get_documentation` | `path` atau nama komponen; heading `section` opsional | Panduan API Markdown dengan sumber contoh Vue lengkap. |
| `get_example` | `name` contoh dari katalog | Sumber Vue persis contoh itu. |

Komponen pendamping seperti `SColumn`, `SToolbarButton`, dan `SProsePre` didaftar individual dan me-resolve ke panduan Table, Toolbar, atau Prose bersama mereka. Ringkasan panduan mencakup `components`, nama-nama yang dicakup panduan itu. Ini membutuhkan katalog yang dihasilkan dengan metadata pendamping; katalog terinstal lama tetap mengekspos nama komponen primer aslinya.

Server juga mengekspos `selaras://catalog` dan sumber daya dokumentasi di bawah `selaras://docs/...` untuk klien yang mendukung sumber daya MCP.

## Contoh alur kerja

```text
Use Selaras for this settings page. Discover components with list_components,
then read the Select, FormField, and Modal documentation and relevant examples.
Use the project's existing theme and enable adaptive presentation where useful.
```

Tools mengambil informasi; agen membuat rekomendasi komponen berdasarkan kebutuhan Anda. Mereka tidak memodifikasi proyek Anda atau menghasilkan file.

## MCP versus skill

[Skill](/overview/agent-support/skills) menyediakan panduan tentang cara membangun dengan Selaras. MCP menyediakan akses terstruktur ke dokumentasi versi terinstal. Keduanya dapat digunakan independen; menggabungkannya memberi agen panduan sekaligus tools pengambilan.

Dokumentasi publik tidak membutuhkan MCP. [Ekspor llms.txt dan Markdown](/overview/agent-support/documentation) tetap tersedia untuk klien yang dapat membaca URL. Layanan MCP HTTP ter-hosting akan menjadi opsi distribusi lain, tetapi Selaras saat ini hanya menyediakan server stdio lokal.
