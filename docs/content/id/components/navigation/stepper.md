---
title: Stepper
description: Indikator progress multi-step, dibangun di atas primitif Stepper milik Reka UI.
order: 40.5
---

## Penggunaan

`Stepper` hanya melacak dan menampilkan *which* step sedang aktif - `v-model` adalah `number` 1-indexed biasa, dan memasangkannya dengan konten step Anda sendiri dan tombol Back/Next terserah Anda, sama seperti `v-model` berkomposisi dengan apa pun:

::component-example{name="stepper-basic"}
::

```vue
<script setup lang="ts">
const items = [{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }]
const step = ref(1)
</script>

<template>
  <SStepper v-model="step" :items="items" />
  <SButton :disabled="step === 1" @click="step--">
    Back
  </SButton>
  <SButton :disabled="step === items.length" @click="step++">
    Next
  </SButton>
</template>
```

Secara default, mengklik step hanya memajukan paling banyak satu langkah di depan step saat ini - kembali ke step sebelumnya yang sudah completed selalu diizinkan. Berikan `linear="false"` untuk mengizinkan melompat ke step mana pun secara langsung:

::component-example{name="stepper-non-linear"}
::

```vue-html
<SStepper :items="items" :linear="false" />
```

### Descriptions

Setiap item dapat membawa `description` bersama `title`-nya:

::component-example{name="stepper-descriptions"}
::

```vue-html
<SStepper :items="[{ title: 'Address', description: 'Where to ship' }, ...]" />
```

### Ikon

Setiap item dapat membawa `icon`, ditunjukkan setelah step aktif atau yang akan datang - step yang completed selalu menunjukkan centang, terlepas dari `icon`:

::component-example{name="stepper-icons"}
::

```vue-html
<SStepper :items="[{ title: 'Account', icon: 'hugeicons:user' }, ...]" />
```

### Slot kustom

`#indicator`, `#title`, dan `#description` masing-masing menggantikan bagian itu sepenuhnya, di-scope dengan item, indeks, dan `state`-nya - berguna untuk selalu menunjukkan ikon item sendiri (alih-aliah fallback ke centang setelah completed) atau memberi anotasi pada step aktif:

::component-example{name="stepper-custom-slots"}
::

```vue-html
<SStepper :items="items">
  <template #indicator="{ item }">
    <SIcon :name="item.icon" class="size-4" />
  </template>
  <template #title="{ item, state }">
    {{ item.title }}
    <span v-if="state === 'active'">· current</span>
  </template>
</SStepper>
```

### Vertikal

::component-example{name="stepper-vertical"}
::

```vue-html
<SStepper :items="items" orientation="vertical" />
```

### Warna

::component-example{name="stepper-color"}
::

```vue-html
<SStepper :items="items" color="success" />
```

## Progress announcements

Stepper memiliki live region yang tersembunyi secara visual, polite, yang mengumumkan step saat ini. Default bahasa Inggrisnya adalah `Step 1 of 2`. Terjemahkan secara global melalui [message registry](/overview/getting-started/messages):

```ts
export default defineAppConfig({
  selaras: {
    messages: {
      stepper: 'Progres',
      stepperProgress: (step, total) => `Langkah ${step} dari ${total}`,
    },
  },
})
```

`stepper` memberi nama root group; `aria-label` eksplisit pada komponen mengambil prioritas. `stepperProgress(step, total)` memformat pesan live-region. Mengubah `selaras.locale` memformat nilai yang sadar locale tetapi tidak menerjemahkan pesan UI secara otomatis. Perbarui message registry saat mengganti bahasa; announcements bereaksi terhadap perubahan tersebut dan terhadap perubahan step atau jumlah item.

Untuk satu instance, slot `progress` hanya menggantikan teks announcement. Jaga tetap ringkas; komponen menyediakan semantik live-region dan penyembunyian. Daftar item kosong tidak memiliki announcement default.

::component-example{name="stepper-progress"}
::

```vue-html
<SStepper v-model="step" :items="items" aria-label="Progres pembuatan kunci">
  <template #progress="{ step: currentStep, total }">
    Langkah {{ currentStep }} dari {{ total }}
  </template>
</SStepper>
```

## Dalam markdown

Setiap komponen Selaras sudah terdaftar secara global di bawah nama berawalan `S` - blok `::s-stepper{...}` kosan berfungsi tanpa wiring tambahan (lihat bagian "In markdown" di [Callout](/components/typography/callout) untuk cara kerja pola secara umum). `items` adalah array prop, bukan string - bind dengan leading `:` agar `@nuxtjs/mdc` memparse atribut sebagai expression daripada teks literal. Berbeda dengan [Tabs](/components/navigation/tabs) atau [Accordion](/components/navigation/accordion), teks setiap step berasal langsung dari field `title`/`description`-nya, bukan slot per-item - blok tidak membutuhkan body sama sekali:

```md
::s-stepper{:items='[{"title":"Cart"},{"title":"Shipping"},{"title":"Payment"}]'}
::
```

### Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.stepper`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Stepper` sendiri:

::theme-source{name="stepper"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `items` | `Step[]` | - |
| `modelValue` | `number` | - |
| `defaultValue` | `number` | - |
| `linear` | `boolean` | `true` |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `ui` | `Partial<Record<StepperSlot, string \| object>>` | - |

`Step` adalah `{ title?: string, description?: string, icon?: string, disabled?: boolean }`.

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `number` | Terpicu saat trigger step diklik |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `progress` | `{ step, total }` | Menggantikan teks progress screen-reader; `step` mungkin undefined saat tidak ada step aktif |
| `indicator` | `{ item, index, state }` | Menggantikan konten indicator (default: centang setelah completed, jika tidak ikon item, jika tidak nomor step) |
| `title` | `{ item, index, state }` | Menggantikan teks title |
| `description` | `{ item, index, state }` | Menggantikan teks description |

`state` adalah `'inactive' \| 'active' \| 'completed'`.
