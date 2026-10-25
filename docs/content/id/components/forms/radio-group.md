---
title: RadioGroup
description: Radio group yang didorong oleh items, dibangun di atas primitif RadioGroup milik Reka UI.
order: 25
---

## Penggunaan

::component-example{name="radio-group-basic"}
::

```vue
<script setup lang="ts">
const choice = ref('one')
</script>

<template>
  <SRadioGroup
    v-model="choice"
    :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]"
  />
</template>
```

### Opsi sederhana

String polos di `items` adalah singkatan untuk `{ label: value, value }`, untuk saat label dan nilai sama:

::component-example{name="radio-group-string-items"}
::

```vue-html
<SRadioGroup v-model="size" :items="['sm', 'md', 'lg']" />
```

### Orientasi

`orientation` mengganti tata letak antara tumpukan vertikal (default) dan baris horizontal - ia juga diteruskan ke primitif yang mendasarinya, jadi navigasi tombol panah mengikuti sumbu yang sama (kiri/kanan daripada atas/bawah):

::component-example{name="radio-group-orientation"}
::

```vue-html
<SRadioGroup v-model="shipping" orientation="horizontal" :items="['standard', 'express', 'overnight']" />
```

### Deskripsi

`description` pada item merender sebagai baris kedua yang muted di bawah label-nya - item top-align dengan baris pertama label daripada center terhadap seluruh blok dua baris saat ada:

::component-example{name="radio-group-description"}
::

```vue-html
<SRadioGroup
  v-model="plan"
  :items="[
    { label: 'Free', value: 'free', description: 'Basic features, community support.' },
    { label: 'Pro', value: 'pro', description: 'Everything in Free, plus priority support.' },
  ]"
/>
```

Untuk apa pun di luar teks polos - harga, badge, markup kustom - ganti seluruh blok label dengan slot `label`; lihat [Slots](#slots).

### Gaya card

`variant="card"` membungkus setiap opsi dalam kotak berborder sendiri alih-alih baris inline polos, menyorot mana yang dipilih. Berfungsi sama dengan atau tanpa `description`:

::component-example{name="radio-group-card"}
::

```vue-html
<SRadioGroup
  v-model="plan"
  variant="card"
  :items="[
    { label: 'Free', value: 'free', description: 'Basic features, community support.' },
    { label: 'Pro', value: 'pro', description: 'Everything in Free, plus priority support.' },
  ]"
/>
```

### Warna

`color` mengatur warna ring/dot saat checked (dan, dikombinasikan dengan `variant="card"`, highlight border/tint card itu sendiri) - unchecked selalu tetap ring netral yang sama terlepas dari warna:

::component-example{name="radio-group-colors"}
::

```vue-html
<SRadioGroup v-model="primary" color="primary" :items="['one', 'two']" />
<SRadioGroup v-model="success" color="success" :items="['one', 'two']" />
<SRadioGroup v-model="danger" color="danger" :items="['one', 'two']" />
```

### States

Mengatur `disabled` pada item individu (bukan seluruh `SRadioGroup`) hanya menonaktifkan item itu satu, meninggalkan sisa grup tetap interaktif - termasuk ketika item itu kebetulan sudah menjadi yang dipilih, misalnya plan yang dipilih konsumen sebelum dihentikan:

::component-example{name="radio-group-states"}
::

```vue-html
<SRadioGroup
  v-model="shipping"
  :items="[
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express', disabled: true },
    { label: 'Overnight', value: 'overnight' },
  ]"
/>
<SRadioGroup
  v-model="plan"
  :items="[
    { label: 'Legacy (discontinued)', value: 'legacy', disabled: true },
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
  ]"
/>
```

`disabled` pada grup itu sendiri menonaktifkan setiap item sekaligus, dan `invalid` mengubah ring dan card state setiap item ke role semantik danger:

```vue-html
<SRadioGroup v-model="frozen" disabled :items="['one', 'two', 'three']" />
<SRadioGroup v-model="invalidChoice" invalid :items="['one', 'two', 'three']" />
```

Lihat [Props](#props).

### Ukuran

`size` menerima `sm` / `md` / `lg`, menyesuaikan item, indicator, hover/focus halo, dan teks label secara bersamaan:

::component-example{name="radio-group-sizes"}
::

```vue-html
<SRadioGroup v-model="size" size="sm" :items="['one', 'two']" />
<SRadioGroup v-model="size" size="md" :items="['one', 'two']" />
<SRadioGroup v-model="size" size="lg" :items="['one', 'two']" />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` dan `size` keduanya fallback ke state FormField sendiri saat tidak diatur langsung pada radio group.

### Aksesibilitas

RadioGroup merender primitif RadioGroup milik Reka UI, jadi semantik aksesibilitas berasal dari sana daripada direimplementasi di sini: grup itu sendiri adalah `role="radiogroup"` dan setiap item adalah `role="radio"` dengan `aria-checked`. Seluruh grup adalah satu <kbd>Tab</kbd> stop (roving tabindex, bukan satu stop per item) - setelah fokus di dalam, tombol panah memindahkan fokus antar item dan segera memilih mana yang ditempati (atas/bawah untuk tata letak vertikal default, kiri/kanan saat `orientation` adalah `horizontal`), perilaku standar untuk [pola ARIA radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), bukan sesuatu untuk dikonfigurasi di sini.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `RadioGroup` sendiri:

::theme-source{name="radio-group"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `items` | `(string \| { label: string; value: string; disabled?: boolean; description?: string })[]` | - |
| `modelValue` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `orientation` | `'vertical' \| 'horizontal'` | `vertical` |
| `variant` | `'default' \| 'card'` | `default` |
| `ui` | `Partial<Record<'root' \| 'itemWrapper' \| 'item' \| 'indicator' \| 'label' \| 'description' \| 'labelGroup', string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `label` | `{ item, checked, disabled }` | Menggantikan seluruh blok label item (teks label dan, jika diatur, `description`) - berguna untuk harga, badge, atau konten kaya lainnya (default: `label`/`description` item) |
