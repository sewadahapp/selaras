---
title: Messages dan lokalisasi
description: Sesuaikan teks internal, label yang dapat diakses, dan locale formatting.
order: 60
---

Label internal dan messages berasal dari registry bahasa Inggris bersama. Ganti hanya key yang dibutuhkan aplikasi Anda; key lainnya mempertahankan defaultnya.

## Messages global

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    locale: 'id-ID',
    messages: {
      close: 'Tutup',
      clear: 'Hapus',
      search: 'Cari...',
      noOptions: 'Tidak ada pilihan',
      paginationInfo: (page: number, total: number) => `Halaman ${page} dari ${total}`,
    },
  },
})
```

Messages mencakup label yang dapat diakses serta teks yang terlihat. Messages berupa fungsi harus tetap berupa fungsi dengan argumen yang didokumentasikan. Lihat [useMessages](/utilities/composables/use-messages) untuk setiap key dan defaultnya.

Untuk pengumuman interpolasi seperti Stepper progress, pertahankan message sebagai fungsi: `` stepperProgress: (step, total) => `Langkah ${step} dari ${total}` ``. Slot [Stepper progress](/components/navigation/stepper#progress-announcements) juga memungkinkan instance individual menyediakan teksnya sendiri.

## Konten lokal

```vue-html
<SInput placeholder="Search customers..." />
<SButton>Save changes</SButton>
```

Teks yang Anda berikan melalui props, label item, dan slot tetap di bawah kontrol Anda. Gunakan props atau slot dari setiap komponen untuk menyesuaikan instance individual. Tidak ada prop `messages` per komponen atau registry message scoped secara umum di `STheme`.

## Formatting locale

`selaras.locale` menetapkan locale BCP 47 yang digunakan oleh formatting yang sadar locale dan kontrol tanggal. Ini tidak menerjemahkan message registry. Konfigurasikan keduanya saat melokalisasi aplikasi. Selaras tidak mengirimkan paket terjemahan tambahan.

Gunakan [useLocale](/utilities/composables/use-locale) dan [useMessages](/utilities/composables/use-messages) di komponen Anda sendiri untuk berbagi konfigurasi aplikasi.
