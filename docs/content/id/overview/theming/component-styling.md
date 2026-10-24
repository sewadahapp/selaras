---
title: Penyesuaian komponen
description: Sesuaikan slot komponen individual dan pahami prioritas style.
order: 50
---

## Ukuran kontrol

Tombol dan field satu baris memiliki tinggi luar default yang sama untuk setiap ukuran:

| Ukuran | Tinggi | Pada root font-size 16px |
| --- | --- | --- |
| `sm` | `2rem` | 32px |
| `md` | `2.5rem` | 40px |
| `lg` | `2.75rem` | 44px |

Ini berlaku untuk Button, Input, InputNumber, Select, Autocomplete, DatePicker,
ColorPicker trigger, dan setiap kotak PinInput. DatePicker mempertahankan tinggi yang sama
dengan `trigger-mode="field"` dan `trigger-mode="button"`, termasuk range dan mode time-only. Tombol clear dan indikator loading tidak menambah tinggi luar.

Gunakan `size` yang sama saat menempatkan field di samping aksi:

```vue-html
<div class="flex items-center gap-2">
  <SInput size="md" placeholder="Search projects" />
  <SButton size="md">Search</SButton>
</div>
```

Tinggi mengacu pada kontrol itu sendiri; label, deskripsi, dan pesan validasi FormField menambah ruang di sekitarnya. Textarea dan pilihan wrapping dapat tumbuh sesuai kontennya. Tombol yang tertanam di dalam field menggunakan dimensi yang lebih kecil agar menyisakan ruang di dalam field. Default dapat disesuaikan melalui tema dan override `:ui` lokal.

## Kontrol clear field

Input, Textarea, Select, Autocomplete, dan DatePicker berbagi Button `ghost` netral untuk aksi clear bawaan. Background hover-nya berada di dalam border field. Target dan glyph memiliki ukuran independen, sehingga ikon clear cocok dengan ikon field di sebelahnya tanpa membutuhkan tombol setinggi field:

| Ukuran field | Target clear | Ikon |
| --- | --- | --- |
| `sm` | 24px | 16px |
| `md` | 28px | 18px |
| `lg` | 32px | 20px |

Dimensi ini diskalakan dengan root font-size. Dengan `clearable`, aksi tetap terlihat setiap kali ada konten, termasuk angka `0` dan query draft Autocomplete. Field kosong, disabled, dan read-only menyembunyikannya. Indikator loading dan konten `trailing` kustom dapat muncul di sampingnya. Clear mengembalikan fokus ke editor atau trigger.

Sesuaikan satu field dengan `ui.clear`, atau ganti glyph dengan `#clear-icon`:

```vue-html
<SInput v-model="query" clearable :ui="{ clear: 'rounded-sm' }" />
```

Gunakan resep `fieldClearButton` bersama di `app.config.ts` untuk menstyle setiap kontrol clear field bawaan. Resep yang sama berfungsi di dalam `STheme`:

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    ui: {
      fieldClearButton: {
        slots: { base: 'rounded-sm' },
      },
    },
  },
})
```

Override target atau ikon spesifik ukuran menggunakan `compoundVariants` dengan kondisi `size` dan slot `base` dan `icon`. DatePicker juga mengekspos `ui.buttonClear` untuk penempatan clear dalam mode button trigger, dan `ui.triggerIcon` untuk glyph calendar/clock mode field. Pertahankan ruang yang cukup di dalam field saat mengubah ukuran target.

## Prop `:ui` dan `STheme`

Token warna dan override kelas komponen adalah sistem terpisah.

Gunakan token tema untuk nilai desain. Gunakan `:ui` saat Anda ingin mengubah kelas atau atribut untuk satu instance komponen.

```vue-html
<SButton :ui="{ base: 'font-mono' }">
  Custom
</SButton>
```

Setiap key `:ui` adalah slot komponen.

String menambahkan kelas. Selaras menggabungkan kelas Tailwind yang bertentangan dengan `tailwind-merge`.

Objek dapat berisi `class` dan atribut Vue lainnya:

```vue-html
<SButton
  :ui="{
    base: {
      class: 'font-mono',
      'data-test': 'save-button',
    },
  }"
>
  Save
</SButton>
```

## Precedence

Untuk kelas komponen, urutan dari prioritas rendah ke tinggi adalah:

1. tema dasar `tv()` komponen
2. `app.config.selaras.ui`
3. resep `STheme` ancestor, dari luar ke dalam
4. kelas root komponen
5. kelas slot `:ui` komponen

Untuk token desain, aturan cascade CSS normal berlaku pada input publik `--selaras-*`. Scope `STheme` dan runtime token yang dikelola membuat pemilik tema eksplisit untuk subtree dan portal yang didukung.
