---
title: FormField
description: Wrapper label, deskripsi, hint, dan pesan error yang menghubungkan id/aria-describedby/invalid ke kontrol formulir apa pun yang dibungkusnya.
order: 27
---

## Penggunaan

Bungkus satu kontrol formulir apa pun - Input, Textarea, Select, Autocomplete, Checkbox, RadioGroup, atau Switch - dan FormField menghasilkan `id` yang cocok, menautkan label kepadanya, dan menghitung `aria-describedby` dari `hint`/`error` mana yang saat ini ditampilkan. Kontrol yang dibungkus memperoleh semua ini secara otomatis; Anda tidak perlu meneruskan `id` atau `aria-describedby` sendiri.

```vue
<script setup lang="ts">
const email = ref('')
</script>

<template>
  <SFormField label="Email" name="email" hint="We'll never share this.">
    <SInput v-model="email" type="email" placeholder="you@example.com" />
  </SFormField>
</template>
```

### Deskripsi

`description` menambahkan baris kedua yang muted di bawah label, sebelum kontrol - untuk konteks yang harus dibaca pengguna sebelum mencapainya (tid seperti `hint`, yang duduk di bawah kontrol sebagai gantinya):

```vue-html
<SFormField label="Email" description="We'll use this to send your receipt.">
  <SInput v-model="email" type="email" />
</SFormField>
```

### Error state

Atur `error` ke string untuk menunjukkan pesan menggantikan hint dan menandai kontrol `invalid` (ring/outline merah, `aria-invalid="true"`). Meneruskan `error` sebagai `true` (tanpa pesan) tetap menandai kontrol invalid tanpa merender teks apa pun.

```vue-html
<SFormField label="Email" error="Enter a valid email address">
  <SInput v-model="email" type="email" />
</SFormField>
```

### Required indicator

```vue-html
<SFormField label="Name" required>
  <SInput v-model="name" />
</SFormField>
```

### Ukuran

`size` juga menyusutkan/membesarkan teks label/description/hint/error FormField sendiri (`sm` / `md` / `lg`) - ini adalah prop yang sama yang sudah diteruskan ke `size` kontrol yang dibungkus, jadi keduanya tetap sinkron secara visual tanpa mengaturnya dua kali:

```vue-html
<SFormField label="Email" size="sm">
  <SInput v-model="email" size="sm" />
</SFormField>

<SFormField label="Email" size="lg">
  <SInput v-model="email" size="lg" />
</SFormField>
```

### Orientasi

`orientation="horizontal"` menempatkan label di samping kontrol alih-alih di atasnya, dengan kontrol mengisi sisa lebar baris - berguna untuk formulir gaya halaman pengaturan dengan label di kiri. `hint`/`error` tetap merender full-width di bawah baris dalam kedua cara:

```vue-html
<SFormField label="Email" orientation="horizontal">
  <SInput v-model="email" />
</SFormField>
```

### Floating label

`label-mode="floating"` menempatkan label di atas kontrol kosong dan memindahkannya ke atas border saat kontrol difokuskan atau memiliki nilai. Ia mempertahankan asosiasi label native, hint, dan perilaku error yang sama. Input dan Textarea mendeteksi state nilai native mereka; Select, Autocomplete, dan DatePicker mengekspos state seleksi mereka ke field. Untuk kontrol kustom, berikan `:filled` ketika memiliki nilai. Mode floating menggunakan tata letak vertikal bahkan jika `orientation` diatur ke `horizontal`. Field segmented yang dapat diedit DatePicker menjaga label terangkat saat kosong sehingga placeholder hari, bulan, dan tahun tetap terlihat dan dapat diketik.

::component-example{name="form-field-floating"}
::

```vue-html
<SFormField label="Email" label-mode="floating" hint="We'll send your receipt here.">
  <SInput v-model="email" type="email" />
</SFormField>
```

`SInputGroup` yang berisi satu Input atau Select ditambah tombol addon juga berfungsi ketika kontrol datang pertama. Untuk dua kontrol yang dapat diedit, bungkus **setiap** input dalam `SFormField` sendiri sehingga keduanya memiliki label, name, dan state validasi independen. Ini berfungsi dengan kedua orientasi InputGroup:

::component-example{name="form-field-grouped"}
::

### Bekerja dengan kontrol apa pun

```vue-html
<SFormField label="Plan" name="plan">
  <SSelect v-model="plan" :items="planItems" />
</SFormField>

<SFormField error="You must accept the terms">
  <SCheckbox v-model="accepted" label="Accept terms" />
</SFormField>
```

`id`/`name` kontrol sendiri masih menang atas FormField jika Anda mengaturnya secara eksplisit. `invalid` di-OR dengan state error field, sehingga kontrol dapat opt-in terlihat invalid sendiri bahkan tanpa error, tetapi tidak dapat dipaksa kembali valid sementara FormField-nya memiliki error.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `FormField` sendiri:

::theme-source{name="form-field"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | generated unique ID |
| `label` | `string` | - |
| `name` | `string` | - |
| `description` | `string` | - |
| `hint` | `string` | - |
| `error` | `string \| boolean` | - |
| `required` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | - |
| `orientation` | `'vertical' \| 'horizontal'` | `vertical` |
| `labelMode` | `'static' \| 'floating'` | `static` |
| `filled` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'body' \| 'header' \| 'label' \| 'required' \| 'description' \| 'container' \| 'hint' \| 'error', string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| default | `{ id, invalid, describedBy }` | Kontrol yang dibungkus. Props juga tersedia jika Anda perlu mengaitkannya secara manual. |
| `description` | - | Konten kustom, menggantikan `description` |
