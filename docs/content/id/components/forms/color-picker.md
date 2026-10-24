---
title: ColorPicker
description: Kontrol trigger-and-popover untuk memilih warna, dibangun di atas lima primitif warna Reka UI yang independen yang berbagi satu nilai hex.
order: 23.75
---

## Penggunaan

`v-model` adalah string hex (`#rrggbb`, atau `#rrggbbaa` setelah alpha turun di bawah 1) - trigger menunjukkan preview swatch live plus nilai hex, dan membuka popover dengan area saturation/brightness, slider hue, slider alpha, dan field teks hex:

::component-example{name="color-picker-basic"}
::

```vue
<script setup lang="ts">
const color = ref('#7c3aed')
</script>

<template>
  <SColorPicker v-model="color" />
</template>
```

### Alpha

`alpha` (default `true`) menunjukkan slider opacity. Atur ke `false` untuk konsumen yang hanya ingin warna opaque:

::component-example{name="color-picker-no-alpha"}
::

```vue-html
<SColorPicker v-model="color" :alpha="false" />
```

### Swatches

`swatches` merender baris warna preset di bawah field hex - dihilangkan sepenuhnya kecuali diberikan. Mengklik satu mengatur warna persis itu (termasuk alpha sendiri, jika ada):

::component-example{name="color-picker-swatches"}
::

```vue-html
<SColorPicker v-model="color" :swatches="['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']" />
```

### Warna

Mengontrol warna focus-ring trigger sendiri, scope yang sama seperti prop `color` kontrol formulir lainnya - tidak berpengaruh pada warna yang dipilih:

::component-example{name="color-picker-color"}
::

```vue-html
<SColorPicker v-model="color" color="danger" />
```

### Ukuran

Trigger default mengikuti skala tinggi 32 / 40 / 44px yang sama seperti Button dan Input untuk `sm` / `md` / `lg` pada root font size 16px. Lihat [Ukuran kontrol](/overview/theming/component-styling#control-sizes).

::component-example{name="color-picker-size"}
::

```vue-html
<SColorPicker v-model="color" size="sm" />
<SColorPicker v-model="color" size="md" />
<SColorPicker v-model="color" size="lg" />
```

### Adaptive presentation

Di bawah breakpoint adaptif yang dikonfigurasi, `adaptive` menampilkan popover sebagai [Modal](/components/overlays/modal) yang dipusatkan sebagai gantinya. Ini opt-in (default `false`) dan mengikuti kontrak adaptive bersama:

::component-example{name="color-picker-adaptive"}
::

### Arrow

`arrow` menambahkan penunjuk antara picker anchored dan trigger-nya. Default mati dan tidak berpengaruh pada modal adaptive.

```vue-html
<SColorPicker v-model="color" arrow />
<SColorPicker v-model="color" :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }" />
```

Gunakan `positioning` untuk menempatkan picker anchored dan `portal` untuk merender inline (`false`) atau teleport ke CSS selector atau `HTMLElement`. Target portal default adalah document body. Props ini berlaku untuk popover anchored, yang secara default mulai sejajar dengan trigger-nya; modal adaptive memiliki tata letak sendiri. Atur `positioning.align` untuk override alignment. `ui.content` men-style panel.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `ColorPicker` sendiri:

::theme-source{name="color-picker"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `name` | `string` | - |
| `form` | `string` | - |
| `modelValue` | `string` | - |
| `defaultValue` | `string` | - |
| `open` | `boolean` | - |
| `defaultOpen` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `alpha` | `boolean` | `true` |
| `swatches` | `string[]` | - |
| `placeholder` | `string` | - |
| `adaptive` | `boolean` | `false` |
| `arrow` | `boolean \| RoundedArrowConfig` | `false` |
| `positioning` | `OverlayPositioning` | anchored picker defaults |
| `portal` | `boolean \| string \| HTMLElement` | `true` (document body) |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `ui` | `Partial<Record<ColorPickerSlot, string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:open` | `boolean` | Terpicu saat picker meminta membuka atau menutup |
| `update:modelValue` | `string` | Terpicu saat warna berubah - dragging area/slider, mengetik (dan committing) field hex, atau memilih swatch |
