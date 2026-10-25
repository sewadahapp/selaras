---
title: Aksesibilitas
description: Beri label pada kontrol, kelola fokus, dan komunikasikan konten yang berubah.
order: 90
---

Selaras dibangun di atas primitif yang dapat diakses untuk interaksi keyboard, manajemen fokus,
dan relasi ARIA. Aplikasi Anda menyediakan label yang bermakna, konten,
aturan validasi, dan struktur dokumen sekitarnya.

## Beri label pada kontrol

Gunakan `SFormField` untuk label yang terlihat dan teks bantuan atau error yang terkait:

```vue-html
<SFormField label="Email address" description="Used for project updates." :error="emailError">
  <SInput v-model="email" type="email" autocomplete="email" />
</SFormField>
```

Field mengaitkan label, description, error, dan state invalid-nya dengan kontrol yang didukung. Tempatkan setiap kontrol yang memiliki label secara independen dalam fieldnya sendiri. Berikan `aria-label` pada tindakan ikon-saja yang menggambarkan tindakan tersebut, seperti "Close settings".

Placeholder adalah petunjuk, bukan pengganti label field yang terlihat.
Untuk kontrol mandiri tanpa label yang terlihat, berikan `aria-label` atau
`aria-labelledby`.

## Jaga fokus keyboard agar dapat diprediksi

Gunakan tombol dan tautan native untuk tindakan dan navigasi. Hindari nilai `tabindex` positif dan pertahankan style fokus yang terlihat saat menyesuaikan slot komponen.

Dialog modal menjaga fokus di dalam kontennya dan mengembalikan fokus ke pemicu saat ditutup. Escape menutup layer yang dapat ditutup saat ini. Berikan `title` pada dialog dan, bila membantu, `description`. Select atau Autocomplete adaptif memiliki presentasi layar kecil sendiri; konsumen tidak boleh menambahkan focus trap kedua di sekitar konten popup-nya.

Jika tindakan pengguna menghilangkan kontrol yang difokuskan, pindahkan fokus secara eksplisit ke tempat yang masuk akal di tampilan baru setelah DOM diupdate. Contoh [EmptyState table](/components/data/empty-state#table) menunjukkan ini ketika tombol "Add sample project"-nya menghilang.

## Umumkan konten yang berubah

Pertahankan region status yang ter-mount pendek saat memperbarui koleksi secara asinkron:

```vue-html
<p role="status" class="sr-only">{{ resultMessage }}</p>
<STable :data="results" :loading="pending">
  <SColumn field="name" header="Name" />
  <template #empty>
    <SEmptyState title="No matching results" description="Try another search." />
  </template>
</STable>
```

Perbarui `resultMessage` saat request selesai, misalnya "3 results found".
Pertahankan pesan yang ringkas dan biarkan fokus tetap di tempat pengguna sedang bekerja. Gunakan empty state untuk tidak adanya hasil dan pesan error terpisah dengan aksi retry saat request gagal.

Listbox, Select, dan daftar opsi Autocomplete dikhususkan untuk pemilihan. Letakkan tindakan empty-state interaktif di footer atau toolbar terdekat.

## Tema dan gerakan

Pertahankan kontras yang dapat dibaca, indikator fokus, dan state terpilih atau invalid saat mengganti warna. Periksa aplikasi Anda dalam mode terang dan gelap, di lebar sempit, dan dengan zoom browser. Hindari menggunakan warna sebagai satu-satunya indikator state.

Transisi komponen standar dan dot grid dokumentasi menghormati reduced motion. Animasi kustom yang ditambahkan oleh aplikasi Anda juga harus menghormatinya.

## Apa yang kami periksa

Suite browser `test:a11y` di repositori menggabungkan pemeriksaan axe untuk aturan WCAG A/AA melalui WCAG 2.2 dengan skenario keyboard. Ini mencakup field formulir representatif, deskripsi validasi, navigasi, empty state, dialog bertingkat, dan presentasi Select adaptif desktop dan seluler. Ini juga memeriksa error browser dan hydration. Tes browser komponen yang ada mencakup interaksi tambahan.

Pemeriksaan ini menyediakan baseline regresi. Pemeriksaan ini tidak menetapkan bahwa setiap kombinasi komponen atau tema konsumen memenuhi setiap persyaratan aksesibilitas. Uji konten aktual aplikasi Anda dengan navigasi keyboard dan teknologi asistif juga.
