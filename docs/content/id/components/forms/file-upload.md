---
title: FileUpload
description: Dropzone drag-and-drop untuk memilih file - hanya seleksi dan validasi, unggah ke server diserahkan kepada Anda.
order: 21.5
---

## Penggunaan

`v-model` selalu berupa `File[]`, bahkan untuk satu file - klik dropzone atau seret file ke atasnya:

::component-example{name="file-upload-basic"}
::

```vue
<script setup lang="ts">
const files = ref<File[]>([])
</script>

<template>
  <SFileUpload v-model="files" />
</template>
```

`FileUpload` hanya memilih dan memvalidasi file - mengirimkannya ke server terserah Anda (panggilan `fetch`/`FormData` biasa menggunakan apa pun di `v-model`, kapan pun Anda ingin memicunya).

### Multiple files

`multiple` memungkinkan memilih lebih dari satu file sekaligus (setiap seleksi baru atau drop menambahkan ke daftar daripada menggantikannya); `max-files` membatasi berapa banyak yang diizinkan secara total:

::component-example{name="file-upload-multiple"}
::

```vue-html
<SFileUpload v-model="files" multiple :max-files="4" />
```

### Validasi

`accept` (MIME types/wildcards yang dipisahkan koma seperti `image/*`, atau ekstensi seperti `.pdf`) dan `max-size` (bytes) menolak file yang tidak cocok - diterapkan pada dialog file native dan apa pun yang di-drop (drop memotong filtering sendiri dari dialog sepenuhnya). File yang ditolak tidak pernah mencapai `v-model` - dengarkan `@error` untuk mengetahui mengapa dan tampilkan sesuka Anda:

::component-example{name="file-upload-validation"}
::

```vue-html
<SFileUpload
  v-model="files"
  accept="image/*"
  :max-size="1024 * 1024"
  @error="(rejected) => console.log(rejected)"
/>
```

### Warna

::component-example{name="file-upload-color"}
::

```vue-html
<SFileUpload color="success" />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` fallback ke state FormField sendiri saat tidak diatur langsung pada file upload, dan `size` juga sama.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `FileUpload` sendiri:

::theme-source{name="file-upload"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `modelValue` | `File[]` | - |
| `accept` | `string` | - |
| `multiple` | `boolean` | `false` |
| `maxFiles` | `number` | - |
| `maxSize` | `number` | - |
| `preview` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `name` | `string` | - |
| `required` | `boolean` | `false` |
| `ui` | `Partial<Record<FileUploadSlot, string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `File[]` | Terpicu saat file ditambahkan atau dihapus |
| `error` | `{ file: File, reason: string }[]` | Terpicu saat satu atau lebih file ditolak |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `default` | `{ isDragging }` | Menggantikan konten ikon/label/deskripsi dropzone sendiri |
| `file` | `{ file, index, remove }` | Menggantikan konten satu baris file |
