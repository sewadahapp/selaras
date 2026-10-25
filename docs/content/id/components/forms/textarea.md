---
title: Textarea
description: Input teks multi-baris, mencocokkan pola interaksi border Input.
order: 21
---

## Penggunaan

::component-example{name="textarea-basic"}
::

```vue
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <STextarea v-model="value" placeholder="Write something..." />
</template>
```

Textarea memiliki lebar penuh secara default, sama seperti [Input](/components/forms/input) - batasi dengan kelas pada komponen itu sendiri, bukan elemen pembungkus. Atribut native `<textarea>` yang tidak tercantum di bawah (`maxlength`, `pattern`, `readonly`, `spellcheck`, ...) sudah diteruskan langsung ke elemen nyata - tidak perlu prop khusus untuk mereka.

### Ikon

`icon` dan `trailingIcon` menambahkan ikon sebelum atau setelah teks, props yang sama digunakan [Input](/components/forms/input#icons) untuk miliknya sendiri - dijangkarkan di pojok atas di sini daripada di tengah vertikal, karena memusatkan terhadap seluruh kotak akan bergeser dari baris pertama setelah konten wrap melewati satu baris:

::component-example{name="textarea-icons"}
::

```vue-html
<STextarea v-model="value" icon="hugeicons:chat" placeholder="Leave a comment..." />
```

### Konten leading dan trailing kustom

Gunakan `#leading` dan `#trailing` untuk teks, ikon, atau tombol di dalam bingkai field. Slot menerima `{ disabled, size, buttonSize }`; `buttonSize` cocok untuk Button di dalam ukuran field saat ini. Berikan kontrol interaktif dengan label yang dapat diakses, gunakan `type="button"`, dan teruskan `disabled` untuk mencocokkan state field.

Konten kustom tetap terlihat di samping tombol clear bawaan. Ia menggantikan `icon` atau `trailingIcon` dekoratif yang sesuai. Field menyediakan ruang untuk konten yang dirender, termasuk suffix yang lebarnya berubah. Gunakan `ui.leading` dan `ui.trailing` untuk menyesuaikan wrapper-nya.

::component-example{name="textarea-addons"}
::

### Clear

`clearable` menambahkan tombol yang mengosongkan nilai, setelah ada sesuatu untuk dihapus. Ia tersembunyi saat kosong, `disabled`, atau `readonly`, dan mengembalikan fokus ke textarea setelah clear. Seperti [Input](/components/forms/input#clear), ia menggunakan target `ghost` netral inset. Sesuaikan dengan `ui.clear` atau `#clear-icon`; lihat [shared clear styling](/overview/theming/component-styling#kontrol-clear-field).

::component-example{name="textarea-clear"}
::

```vue-html
<STextarea v-model="value" clearable placeholder="Write something..." />
```

### Autoresize

`autoresize` membuat kotak tumbuh sesuai kontennya alih-alih tinggi tetap dengan scrollbar/handle seret; `maxrows` membatasi seberapa jauh ia tumbuh sebelum kembali ke scrollbar (tidak diatur atau `0` tumbuh tanpa batas). Manual resizing (handle seret di pojok kotak sendiri) dinonaktifkan saat `autoresize` aktif - keduanya akan bertarung pada keystroke berikutnya:

::component-example{name="textarea-autoresize"}
::

```vue-html
<STextarea v-model="value" autoresize :maxrows="6" placeholder="Keep typing..." />
```

### Ukuran dan state

`size` menerima `sm` / `md` / `lg`, `disabled` mencegah interaksi dan meredupkan textarea, dan `invalid` mengubah ring ke warna fokus role danger:

::component-example{name="textarea-invalid"}
::

```vue-html
<STextarea v-model="value" invalid placeholder="Write something..." />
```

Lihat tabel [Props](#props) di bawah.

### Warna

`color` mengatur warna focus-ring - ring resting (tidak difokuskan) tetap `--selaras-resolved-border-default` terlepas dari apapun, dan `invalid` selalu menang atas `color` kustom:

::component-example{name="textarea-colors"}
::

```vue-html
<STextarea v-model="primary" color="primary" placeholder="Primary" />
<STextarea v-model="success" color="success" placeholder="Success" />
<STextarea v-model="danger" color="danger" placeholder="Danger" />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis, plus pesan `hint`/`error` di bawah - FormField juga tempat `size` dan `invalid` fallback ketika tidak diatur langsung pada textarea.

### Aksesibilitas

Textarea merender `<textarea>` native polos, jadi dukungan browser dan screen-reader untuk mengetik, seleksi, dan autofill semua gratis. `aria-invalid` dan `aria-describedby` diatur secara otomatis setelah `invalid` true atau textarea dibungkus dalam [FormField](/components/forms/form-field) - tidak ada yang perlu dikonfigurasi secara manual untuk kasus umum.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Textarea` sendiri:

::theme-source{name="textarea"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `string` | - |
| `placeholder` | `string` | - |
| `rows` | `number` | `3` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `clearable` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `autoresize` | `boolean` | `false` |
| `maxrows` | `number` | - |
| `ui` | `Partial<Record<'root' \| 'base' \| 'leadingIcon' \| 'trailingIcon' \| 'leading' \| 'trailing' \| 'clear', string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `leading` | `{ disabled, size, buttonSize }` | Konten kustom sebelum teks; menggantikan `icon` |
| `trailing` | `{ disabled, size, buttonSize }` | Konten kustom setelah teks, di samping tombol clear; menggantikan `trailingIcon` |
| `clear-icon` | - | Menggantikan ikon tombol clear (default: `hugeicons:cancel-01`) |
