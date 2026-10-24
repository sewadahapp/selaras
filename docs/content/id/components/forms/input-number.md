---
title: InputNumber
description: Input numerik dengan tombol increment/decrement.
order: 20.5
---

## Penggunaan

`v-model` adalah `number | undefined` biasa - field kosong meng-commit sebagai `undefined`, bukan `0` atau `NaN`:

::component-example{name="input-number-basic"}
::

```vue
<script setup lang="ts">
const value = ref<number>()
</script>

<template>
  <SInputNumber v-model="value" />
</template>
```

Ketik nilai langsung, gunakan tombol panah saat difokus, atau klik tombol ± - ketiganya melewati clamping `min`/`max`/`step` yang sama.

### Min, max, dan step

`min`/`max` meng-clamp nilai yang di-commit dan menonaktifkan tombol di batas mana pun yang tercapai; `step` mengontrol seberapa besar setiap klik atau tekan tombol panah mengubah nilai (default `1`):

::component-example{name="input-number-min-max"}
::

```vue-html
<SInputNumber v-model="value" :min="0" :max="10" :step="2" />
```

`wrap` mengubah apa yang terjadi di batas - alih-alih clamping dan menonaktifkan tombol di sana, melangkah melewati `max` berputar ke `min` (dan melewati `min` berputar ke `max`), sama seperti jam atau kompas yang berputar daripada macet:

::component-example{name="input-number-wrap"}
::

```vue-html
<SInputNumber v-model="hour" :min="1" :max="12" wrap />
```

### Format options

`format-options` adalah objek `Intl.NumberFormatOptions` biasa - bentuk yang sama yang sudah digunakan setiap API pemformatan angka JS lainnya - diterapkan pada nilai setelah tidak lagi diedit. Pengetikan sendiri selalu menunjukkan angka polos, jadi keduanya tidak pernah bertabrakan:

::component-example{name="input-number-format"}
::

```vue-html
<SInputNumber v-model="value" :format-options="{ minimumIntegerDigits: 2 }" />
```

### Orientasi

`orientation="vertical"` mengganti dua tombol full-height di samping dengan sepasang tombol up/down kompak yang dipasang di ujung akhir field - berguna ketika ruang horizontal terbatas:

::component-example{name="input-number-orientation"}
::

```vue-html
<SInputNumber v-model="value" orientation="vertical" />
```

### Ukuran dan state

`size` menerima `sm` / `md` / `lg`, `disabled` mencegah interaksi dan meredupkan kontrol, dan `invalid` mengubah ring ke warna fokus role danger:

::component-example{name="input-number-invalid"}
::

```vue-html
<SInputNumber v-model="value" size="sm" />
<SInputNumber v-model="value" disabled />
<SInputNumber v-model="value" invalid />
```

### Warna

`color` mengatur warna focus-ring - ring resting (tidak difokuskan) tetap `--selaras-resolved-border-default` terlepas dari apapun, dan `invalid` selalu menang atas `color` kustom:

::component-example{name="input-number-colors"}
::

```vue-html
<SInputNumber v-model="primary" color="primary" />
<SInputNumber v-model="success" color="success" />
<SInputNumber v-model="danger" color="danger" />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` dan `size` keduanya fallback ke state FormField sendiri saat tidak diatur langsung.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `InputNumber` sendiri:

::theme-source{name="input-number"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `number` | - |
| `min` | `number` | - |
| `max` | `number` | - |
| `step` | `number` | `1` |
| `wrap` | `boolean` | `false` |
| `placeholder` | `string` | - |
| `formatOptions` | `Intl.NumberFormatOptions` | - |
| `locale` | `string` | - |
| `disabled` / `readonly` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` |
| `ui` | `Partial<Record<'root' \| 'input' \| 'stepper' \| 'stepperButton', string \| object>>` | - |

## Emits

| Emit | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `number \| undefined` | Terpicu saat klik increment/decrement, ArrowUp/ArrowDown, atau blur/Enter setelah mengetik |
