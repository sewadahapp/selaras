---
title: Input
description: Input teks dengan ikon depan dan trailing opsional.
order: 20
---

## Penggunaan

::component-example{name="input-basic"}
::

```vue
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <SInput v-model="value" placeholder="Type something..." />
</template>
```

Input memiliki lebar penuh secara default, bukan membutuhkan flag opt-in untuk membuatnya demikian - batasi dengan kelas pada komponen itu sendiri (seperti contoh di halaman ini dengan `max-w-xs`), bukan elemen pembungkus.

### Ikon

`icon` dan `trailingIcon` menambahkan ikon sebelum atau setelah teks - props yang sama digunakan [Button](/components/elements/button#icons) untuk miliknya sendiri.

::component-example{name="input-icons"}
::

```vue-html
<SInput v-model="search" icon="hugeicons:search-01" placeholder="Search..." />
<SInput v-model="amount" trailing-icon="hugeicons:dollar-01" placeholder="0.00" />
```

### Konten leading dan trailing kustom

Gunakan `#leading` dan `#trailing` untuk teks, ikon, atau tombol di dalam bingkai field. Slot menerima `{ disabled, size, buttonSize }`; `buttonSize` cocok untuk Button di dalam ukuran field saat ini. Berikan kontrol interaktif dengan label yang dapat diakses, gunakan `type="button"`, dan teruskan `disabled` untuk mencocokkan state field.

Konten kustom tetap terlihat di samping tombol clear bawaan. Ia menggantikan `icon` atau `trailingIcon` dekoratif yang sesuai. Field menyediakan ruang untuk konten yang dirender, termasuk suffix yang lebarnya berubah. Gunakan `ui.leading` dan `ui.trailing` untuk menyesuaikan wrapper-nya.

::component-example{name="input-password"}
::

```vue
<script setup lang="ts">
const password = ref('')
const visible = ref(false)
</script>

<template>
  <SInput v-model="password" :type="visible ? 'text' : 'password'" clearable aria-label="Password">
    <template #trailing="{ disabled, buttonSize }">
      <SButton
        type="button" :disabled="disabled" :size="buttonSize" variant="text" color="neutral" square
        :icon="visible ? 'hugeicons:view-off-slash' : 'hugeicons:view'"
        :aria-label="visible ? 'Hide password' : 'Show password'" :aria-pressed="visible"
        @click="visible = !visible"
      />
    </template>
  </SInput>
</template>
```

Prefix dan suffix teks menggunakan slot yang sama:

::component-example{name="input-addons"}
::

### Clear

`clearable` menambahkan tombol yang mengosongkan nilai, setelah ada sesuatu untuk dihapus - ia mengambil alih posisi trailing dari `trailingIcon` saat aktif, sama seperti yang dilakukan [Select](/components/forms/select#clear).

Ia tetap terlihat selama nilai tidak kosong (termasuk `0`), dan tersembunyi saat input `disabled` atau `readonly`. Clear mengembalikan fokus ke input. Target hover `ghost` netral inset dari border field, dengan ikon yang cocok dengan ukuran input. Sesuaikan dengan `ui.clear` atau `#clear-icon`; lihat [shared clear styling](/overview/theming/component-styling#kontrol-clear-field).

::component-example{name="input-clear"}
::

```vue-html
<SInput v-model="value" clearable placeholder="Type something..." />
```

### Ukuran dan state

`size` menerima `sm` / `md` / `lg`, `disabled` mencegah interaksi dan meredupkan input, dan `invalid` mengubah ring ke warna fokus role danger:

::component-example{name="input-invalid"}
::

```vue-html
<SInput v-model="email" invalid placeholder="you@example.com" />
```

Lihat tabel [Props](#props) di bawah.

### Warna

`color` mengatur warna focus-ring - ring resting (tidak difokuskan) tetap `--selaras-resolved-border-default` terlepas dari apapun, dan `invalid` selalu menang atas `color` kustom:

::component-example{name="input-colors"}
::

```vue-html
<SInput v-model="primary" color="primary" placeholder="Primary" />
<SInput v-model="success" color="success" placeholder="Success" />
<SInput v-model="danger" color="danger" placeholder="Danger" />
```

### Masking

Gunakan direktif [`v-mask`](/utilities/directives/mask) untuk memformat teks saat diketik. `v-model` menyimpan nilai mentah, sementara field menampilkan yang diformat - mengetik `5551234567` di bawah menunjukkan `(555) 123-4567`, dan `phone` adalah `5551234567`:

::component-example{name="input-masked"}
::

```vue-html
<SInput v-model="phone" v-mask="'(###) ###-####'" inputmode="tel" />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis, plus pesan `hint`/`error` di bawah - FormField juga tempat `size` dan `invalid` fallback ketika tidak diatur langsung pada input.

### Aksesibilitas

Input merender `<input>` native polos, jadi dukungan browser dan screen-reader untuk mengetik, seleksi, dan autofill semua gratis. `aria-invalid` dan `aria-describedby` diatur secara otomatis setelah `invalid` true atau input dibungkus dalam [FormField](/components/forms/form-field) - tidak ada yang perlu dikonfigurasi secara manual untuk kasus umum.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Input` sendiri:

::theme-source{name="input"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `string \| number` | - |
| `type` | `string` | `text` |
| `placeholder` | `string` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `clearable` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'base' \| 'leadingIcon' \| 'trailingIcon' \| 'leading' \| 'trailing' \| 'clear', string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `leading` | `{ disabled, size, buttonSize }` | Konten kustom sebelum teks; menggantikan `icon` |
| `trailing` | `{ disabled, size, buttonSize }` | Konten kustom setelah teks, di samping tombol clear; menggantikan `trailingIcon` |
| `clear-icon` | - | Menggantikan ikon tombol clear (default: `hugeicons:cancel-01`) |
