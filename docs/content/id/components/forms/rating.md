---
title: Rating
description: Input penilaian bintang, dibangun di atas primitif Rating milik Reka UI.
order: 25.5
---

## Penggunaan

`v-model` adalah `number` biasa antara `0` dan `length` (default `5`):

::component-example{name="rating-basic"}
::

```vue
<script setup lang="ts">
const value = ref(3)
</script>

<template>
  <SRating v-model="value" aria-label="Rate your experience" />
</template>
```

### Presisi setengah bintang

`step` mengatur seberapa halus nilai satu bintang dapat dibagi - salah satu dari `1` (default), `0.5`, `0.25`, atau `0.1`. `0.5` membagi setiap bintang menjadi setengah kiri dan setengah kanan, masing-masing menjadi wilayah kliknya sendiri:

::component-example{name="rating-half-star"}
::

```vue-html
<SRating v-model="value" :step="0.5" />
```

### Clearable

Mengklik bintang yang sedang dipilih lagi mengatur ulang nilai ke `0`:

::component-example{name="rating-clearable"}
::

```vue-html
<SRating v-model="value" clearable />
```

### Ukuran

::component-example{name="rating-sizes"}
::

```vue-html
<SRating :default-value="4" size="lg" />
```

### Warna

::component-example{name="rating-color"}
::

```vue-html
<SRating :default-value="4" color="success" />
```

### Tampilan read-only

`disabled` memblokir interaksi sepenuhnya - dipasangkan dengan `model-value`/`step` pecahan, ini adalah komponen yang sama yang digunakan murn untuk *menampilkan* penilaian (skor ulasan rata-rata, misalnya), bukan hanya mengumpulkannya:

::component-example{name="rating-readonly"}
::

```vue-html
<SRating :model-value="4.5" :step="0.5" disabled aria-label="4.5 out of 5" />
```

### Vertikal

::component-example{name="rating-vertical"}
::

```vue-html
<SRating v-model="value" orientation="vertical" />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` fallback ke state FormField sendiri saat tidak diatur langsung pada rating, dan `size` juga sama.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Rating` sendiri:

::theme-source{name="rating"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `modelValue` | `number` | - |
| `defaultValue` | `number` | - |
| `length` | `number` | `5` |
| `step` | `1 \| 0.5 \| 0.25 \| 0.1` | `1` |
| `clearable` | `boolean` | `false` |
| `hoverable` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `name` | `string` | - |
| `required` | `boolean` | `false` |
| `ui` | `Partial<Record<RatingSlot, string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `number` | Terpicu saat bintang (atau setengah bintang) diklik |
