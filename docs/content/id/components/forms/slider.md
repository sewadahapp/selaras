---
title: Slider
description: Kontrol draggable untuk memilih angka (atau rentang) dalam min/max, dibangun di atas primitif Slider milik Reka UI.
order: 20.75
---

## Penggunaan

`v-model` adalah `number` biasa untuk satu handle:

::component-example{name="slider-basic"}
::

```vue
<script setup lang="ts">
const value = ref(30)
</script>

<template>
  <SSlider v-model="value" aria-label="Volume" />
</template>
```

### Range

Berikan array sebagai gantinya untuk mendapatkan range slider dengan satu handle per entri - `minStepsBetweenThumbs` mencegah mereka bersilangan (atau mendekat lebih dekat dari sejumlah langkah tersebut). Nilai yang Anda dapatkan selalu cocok dengan bentuk yang Anda berikan - array masuk, array keluar:

::component-example{name="slider-range"}
::

```vue
<script setup lang="ts">
const priceRange = ref([20, 80])
</script>

<template>
  <SSlider v-model="priceRange" :min-steps-between-thumbs="5" />
</template>
```

### Min, max, dan step

`min`/`max` (default `0`/`100`) membatasi nilai, `step` (default `1`) mengontrol increment - baik drag maupun tombol panah snap kepadanya.

### Ticks

`show-ticks` menandai setiap langkah di sepanjang track - tambahan Selaras, bukan bagian dari primitif Reka sendiri:

::component-example{name="slider-ticks"}
::

```vue-html
<SSlider v-model="value" :step="25" show-ticks />
```

### Warna

::component-example{name="slider-color"}
::

```vue-html
<SSlider :model-value="60" color="danger" />
```

### Vertikal

`orientation="vertical"` membutuhkan tinggi nyata untuk diukur - tema memberikan default yang masuk akal (timpa melalui `:ui.root` untuk yang lebih tinggi/pendek):

::component-example{name="slider-vertical"}
::

```vue-html
<SSlider v-model="value" orientation="vertical" />
```

### Inverted

`inverted` secara visual (dan secara arah) membalik slider - ujung max merender di tempat ujung min biasanya, dan dragging dibalik untuk mencocokkan:

::component-example{name="slider-inverted"}
::

```vue-html
<SSlider v-model="value" inverted aria-label="Volume (inverted)" />
```

### Thumb variant

`thumb-variant="bar"` mengganti thumb lingkaran default dengan bar tipis, berukuran dari `size` dan `orientation` track sendiri:

::component-example{name="slider-thumb-variant"}
::

```vue-html
<SSlider v-model="value" thumb-variant="bar" />
```

### Start dan end slots

`#start`/`#end` merender konten yang mengapit track - ikon, emoji, label unit:

::component-example{name="slider-flanking"}
::

```vue-html
<SSlider v-model="value">
  <template #start>😞</template>
  <template #end></template>
</SSlider>
```

### Tooltip

`tooltip` membungkus setiap thumb dalam tooltip yang menunjukkan nilai saat ini saat hover atau fokus:

::component-example{name="slider-tooltip"}
::

```vue-html
<SSlider v-model="value" tooltip />
```

### Controls

`controls` menambahkan tombol `-`/`+` yang mengapit track dan melangkahkan nilai sebesar `step`, menonaktifkan di `min`/`max` - hanya dirender untuk slider nilai tunggal, karena melangkahkan dua thumb rentang independen dengan satu pasang tombol bersama tidak memiliki arti tunggal yang jelas:

::component-example{name="slider-controls"}
::

```vue-html
<SSlider v-model="value" controls />
```

### Side labels

Teks polos di kedua sisi track dikomposisi tanpa API ekstra:

::component-example{name="slider-labels"}
::

```vue-html
<div class="flex items-center gap-3">
  <span>Low</span>
  <SSlider v-model="value" />
  <span>High</span>
</div>
```

### Dipasangkan dengan number input

`SSlider` dan `SInputNumber` berbagi satu `v-model` memberikan nilai yang dapat diketik persis di samping kontrol drag:

::component-example{name="slider-with-input"}
::

```vue-html
<div class="flex items-center gap-3">
  <SSlider v-model="value" />
  <SInputNumber v-model="value" :min="0" :max="100" />
</div>
```

### Label aksesibel

Thumb slider tidak memiliki teks yang terlihat sendiri, jadi ia membutuhkan nama yang dapat diakses dari suatu tempat. `aria-label` (string tunggal) berlaku untuk setiap thumb - baik untuk slider satu handle. Untuk range slider, primitif Reka sendiri sudah fallback ke "Minimum"/"Maximum" untuk slider dua thumb tanpa label sama sekali; berikan array ke `aria-label` untuk mengatakan sesuatu yang lebih spesifik sebagai gantinya (`['Low priority', 'High priority']`, misalnya):

```vue-html
<SSlider v-model="priceRange" :aria-label="['Minimum price', 'Maximum price']" />
```

### Committing vs. continuous updates

`update:model-value` (yang digunakan `v-model`) terpicu terus-menerus saat dragging. `value-commit` terpicu sekali, hanya ketika drag selesai dengan nilai yang benar-benar berubah - berguna untuk apa pun yang tidak boleh dijalankan pada setiap frame perantara, seperti request yang di-debounce:

```vue-html
<SSlider v-model="value" @value-commit="(v) => fetchResultsFor(v)" />
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Slider` sendiri:

::theme-source{name="slider"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `modelValue` | `number \| number[]` | - |
| `defaultValue` | `number \| number[]` | - |
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `step` | `number` | `1` |
| `minStepsBetweenThumbs` | `number` | - |
| `disabled` | `boolean` | `false` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `inverted` | `boolean` | `false` |
| `showTicks` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `thumbVariant` | `'circle' \| 'bar'` | `circle` |
| `tooltip` | `boolean` | `false` |
| `controls` | `boolean` | `false` |
| `ariaLabel` | `string \| string[]` | - |
| `name` | `string` (disubmit melalui hidden input yang Reka render secara internal - hanya berfungsi di dalam `<form>` nyata) | - |
| `ui` | `Partial<Record<SliderSlot, string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `number \| number[]` | Terpicu terus-menerus saat dragging |
| `valueCommit` | `number \| number[]` | Terpicu sekali, ketika drag selesai dengan nilai yang berubah |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `start` | - | Konten mengapit awal track |
| `end` | - | Konten mengapit akhir track |
