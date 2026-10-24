---
title: Editable
description: Edit teks di tempat dengan draft terpisah, shortcut keyboard, dan kontrol opsional.
order: 20.5
---

## Penggunaan

Editable menampilkan teks yang disimpan sampai pengeditan dimulai. Mengetik mengubah draft internal; `v-model` diperbarui hanya ketika Anda menyimpan. Cancel mengembalikan teks yang disimpan. Ia memenuhi lebar yang tersedia; batasi dengan kelas saat dibutuhkan.

::component-example{name="editable-basic"}
::

```vue
<script setup lang="ts">
const title = ref('Website refresh')
</script>

<template>
  <SEditable v-model="title" aria-label="Project name" />
</template>
```

### Aktivasi dan pengiriman

`activationMode="focus"` memulai pengeditan saat preview menerima fokus atau diklik. `dblclick` membutuhkan klik ganda, atau Enter/Space saat difokus. `none` mematikan aktivasi preview; kontrol edit, metode `edit()` yang diekspos, atau `v-model:editing` masih dapat memulai pengeditan.

| `submitMode` | Enter | Fokus meninggalkan komponen |
| --- | --- | --- |
| `both` (default) | Simpan | Simpan |
| `enter` | Simpan | Cancel |
| `blur` | Tetap edit | Simpan |
| `none` | Tetap edit | Tetap edit |

Kontrol Simpan dan Cancel tetap tersedia di setiap mode. Escape membatalkan. Memindahkan fokus antara editor dan kontrol bawaannya tidak mensubmit. Konfirmasi IME tidak menyimpan teks.

### Kontrol eksternal dan pengeditan programatik

Gunakan `v-model:editing` untuk mengontrol pengeditan dari toolbar atau menu. Mengaturnya ke `true` membuka dan memfokuskan editor; mengaturnya ke `false` membuang draft. Panggil `submit()` untuk menyimpan sebelum menutup, daripada mengatur editing ke false.

Contoh ini menonaktifkan aktivasi otomatis dan kontrol bawaan. **Gunakan `submit-mode="none"` untuk tombol Simpan/Cancel eksternal**, sehingga meninggalkan input untuk mengklik Cancel tidak menyimpan melalui event blur terlebih dahulu.

::component-example{name="editable-external-controls"}
::

```vue
<script setup lang="ts">
const title = ref('Design system')
const editing = ref(false)
const editable = useTemplateRef('editable')
</script>

<template>
  <SButton v-if="!editing" @click="editing = true">
    Rename
  </SButton>
  <template v-else>
    <SButton @click="editable?.submit()">
      Save
    </SButton>
    <SButton @click="editable?.cancel()">
      Cancel
    </SButton>
  </template>
  <SEditable
    ref="editable" v-model="title" v-model:editing="editing"
    activation-mode="none" submit-mode="none" :controls="false"
    aria-label="Project name"
  />
</template>
```

### Multiline

`multiline` merender textarea. Enter menambahkan baris baru; Ctrl/Cmd+Enter menyimpan ketika `submitMode` mencakup Enter. Escape tetap membatalkan. `rows` default ke 3.

::component-example{name="editable-multiline"}
::

### Formulir, validasi, dan state

[FormField](/components/forms/form-field) menyediakan label, id, deskripsi, nama, ukuran, dan state invalid. Tanpa FormField, berikan `aria-label` atau `aria-labelledby`. Ketika `name` diatur, data formulir native berisi nilai **yang disimpan**, bukan draft yang belum disubmit.

`required`, `maxLength`, dan atribut native seperti `minlength` dan `pattern` berlaku untuk editor. Penyimpanan memeriksa validitas native dan mempertahankan draft invalid terbuka untuk koreksi. `invalid` mengubah state visual; tidak menambahkan aturan validasi. Atribut native dan listener input event mencapai editor.

`disabled` dan `readonly` mencegah pengeditan dan membuang draft aktif. `loading` memblokir pengetikan dan aksi sambil mempertahankan draft. Memperbarui `modelValue` secara eksternal menggantikan teks yang disimpan dan draft apa pun saat ini.

::component-example{name="editable-states"}
::

### Konten dan kontrol kustom

Slot `preview` menggantikan tampilan teks yang disimpan; slot default adalah fallbacknya. Jaga elemen interaktif di luar tombol preview. Slot `controls` menerima nilai yang disimpan saat ini, draft, state editing/disabled, dan fungsi `edit`, `submit`, dan `cancel`.

::component-example{name="editable-custom-controls"}
::

### Kustomisasi

`size` menerima `sm`, `md`, dan `lg`. `color` mengatur warna fokus editor dan warna tombol Simpan; field invalid menggunakan warna fokus danger. [Konfigurasi tema](/overview/theming/component-styling) global atau scoped mendukung `defaults.editable` dan `ui.editable`; `ui` per-instance mengganti slot individual. `editIcon`, `submitIcon`, dan `cancelIcon` mengganti kontrol. `editLabel`, `submitLabel`, dan `cancelLabel` mengganti teks aksesibel mereka.

Kunci ikon global adalah `edit`, `check`, dan `close`. Kunci pesan adalah `edit`, `save`, `cancel`, `editableInput`, dan `editablePlaceholder`.

::theme-source{name="editable"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `modelValue` | `string` | — |
| `defaultValue` | `string` | `''` |
| `editing` | `boolean` | Uncontrolled |
| `defaultEditing` | `boolean` | `false` |
| `activationMode` | `'focus' \| 'dblclick' \| 'none'` | `focus` |
| `submitMode` | `'enter' \| 'blur' \| 'both' \| 'none'` | `both` |
| `controls` | `boolean` | `true` |
| `multiline` | `boolean` | `false` |
| `rows` | `number` | `3` |
| `placeholder` | `string \| { preview: string, edit: string }` | Preview message / empty input |
| `selectOnFocus` | `boolean` | `true` |
| `disabled` / `readonly` / `loading` / `invalid` / `required` | `boolean` | `false` |
| `maxLength` | `number` | — |
| `id` / `name` | `string` | Dari FormField |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `editIcon` / `submitIcon` / `cancelIcon` | `string` | Ikon global |
| `editLabel` / `submitLabel` / `cancelLabel` | `string` | Pesan global |
| `ui` | Slot class overrides | — |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `string` | Draft valid telah disimpan |
| `update:editing` | `boolean` | Meminta perubahan state editing |
| `edit` | — | Pengeditan dimulai |
| `submit` | `string` | Nilai yang disimpan |
| `cancel` | `string` | Nilai yang disimpan tidak berubah setelah membuang draft |

## Slots

Semua slot menerima `{ value, draft, editing, disabled, edit, submit, cancel }`.

| Slot | Deskripsi |
| --- | --- |
| `preview` | Tampilan teks yang disimpan |
| `default` | Fallback tampilan teks yang disimpan |
| `controls` | Pengganti kontrol pengeditan |

## Exposed methods

| Method | Deskripsi |
| --- | --- |
| `edit()` | Memulai pengeditan kecuali diblokir |
| `submit()` | Menyimpan dan menutup; mengembalikan `false` jika diblokir, invalid, atau sudah tertutup |
| `cancel()` | Membuang draft dan menutup |
