---
title: PinInput
description: Baris kotak single-character untuk kode PIN/OTP, dibangun di atas primitif PinInput milik Reka UI.
order: 20.9
---

## Penggunaan

`v-model` adalah array string, satu entri per kotak - mengetik otomatis memajukan fokus, backspace di kotak kosong bergerak ke belakang dan menghapus kotak sebelumnya, dan paste nilai multi-karakter mengisi beberapa kotak sekaligus:

::component-example{name="pin-input-basic"}
::

```vue
<script setup lang="ts">
const value = ref<string[]>([])
</script>

<template>
  <SPinInput v-model="value" aria-label="Verification code" />
</template>
```

`length` mengatur berapa kotak yang dirender (default `5`).

### OTP autofill

`otp` mengatur `autocomplete="one-time-code"`, memungkinkan browser/OS menawarkan autofill kode dari SMS yang masuk, dan otomatis memfokuskan kotak kosong pertama kapan pun fokus mendarat di mana saja di grup:

::component-example{name="pin-input-otp"}
::

```vue-html
<SPinInput v-model="value" otp :length="6" />
```

### Masked

`mask` merender setiap kotak sebagai field password (titik-titik alih-alih karakter yang diketik) - kode PIN yang mungkin dimasukkan di tempat umum:

::component-example{name="pin-input-mask"}
::

```vue-html
<SPinInput v-model="value" mask />
```

### Numeric

`type="number"` mendapatkan keypad numerik mobile (`inputmode="numeric"`) dan menyaring input non-digit - tetapi menyimpan setiap kotak sebagai `number` nyata, bukan string, sehingga nol di depan hilang (`"0"` menjadi `0`, dan kode seperti `"007"` menjadi `7`). Tetaplah menggunakan default `type="text"` kapan pun nol di depan penting, yang merupakan kasus umum untuk kode PIN/OTP:

::component-example{name="pin-input-numeric"}
::

```vue-html
<SPinInput v-model="value" type="number" />
```

### Warna

Varian `color` hanya mewarnai ulang focus ring - ring resting tetap netral terlepas dari warna, cocok dengan `Input`:

::component-example{name="pin-input-color"}
::

```vue-html
<SPinInput color="success" />
```

### Ukuran

`size="sm"`, `md`, dan `lg` memberi setiap kotak tinggi dan lebar default 32 / 40 / 44px pada root font size 16px. Setiap kotak cocok dengan Button atau Input dengan ukuran yang sama. Lihat [Ukuran kontrol](/overview/theming/component-styling#control-sizes).

```vue-html
<SPinInput v-model="value" size="sm" />
<SPinInput v-model="value" size="md" />
<SPinInput v-model="value" size="lg" />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` fallback ke state FormField sendiri saat tidak diatur langsung pada pin input, dan `size` juga sama.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `PinInput` sendiri:

::theme-source{name="pin-input"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `modelValue` | `(string \| number)[]` | - |
| `defaultValue` | `(string \| number)[]` | - |
| `length` | `number` | `5` |
| `placeholder` | `string` | - |
| `mask` | `boolean` | `false` |
| `otp` | `boolean` | `false` |
| `type` | `'text' \| 'number'` | `text` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `name` | `string` | - |
| `required` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'input', string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `(string \| number)[]` | Terpicu pada setiap keystroke/paste |
| `complete` | `(string \| number)[]` | Terpicu sekali, ketika setiap kotak memiliki nilai |
