---
title: Tabs
description: Daftar tab yang didorong oleh items, dibangun di atas primitif Tabs milik Reka UI.
order: 40
---

## Penggunaan

::component-example{name="tabs-basic"}
::

```vue
<script setup lang="ts">
const active = ref('one')
</script>

<template>
  <STabs v-model="active" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]">
    <template #one>
      Tab one content
    </template>
    <template #two>
      Tab two content
    </template>
  </STabs>
</template>
```

Beralih tab menggeser indikator bersama di antara mereka daripada setiap tab membawa state aktif statis sendiri - indicator mengukur trigger aktif itu sendiri, jadi tetap benar meskipun lebar tab sendiri berubah.

### Konten label kustom

Slot `label` menggantikan label teks polos tab dengan apa pun - di-scope dengan `item` dan `index`, jadi satu template dapat bervariasi per tab:

::component-example{name="tabs-custom-label"}
::

```vue-html
<STabs v-model="active" :items="items">
  <template #label="{ item }">
    <span class="flex items-center gap-2">
      {{ item.label }}
      <SBadge v-if="item.value === 'inbox'" label="3" color="primary" size="sm" />
    </span>
  </template>
  ...
</STabs>
```

### Ikon

Berikan item `icon` dan ia merender sebelum label secara otomatis - tidak perlu slot `label` untuk kasus umum:

::component-example{name="tabs-icons"}
::

```vue-html
<STabs
  v-model="active"
  :items="[
    { label: 'Profile', value: 'profile', icon: 'hugeicons:user' },
    { label: 'Settings', value: 'settings', icon: 'hugeicons:settings-01' },
  ]"
/>
```

### Variants

`variant` menerima `underline` (default) atau `pill`, tampilan segmented-control dengan indikator yang menggeser sebagai background raised alih-alih bar bawah:

::component-example{name="tabs-pill"}
::

```vue-html
<STabs v-model="active" :items="items" variant="pill" />
```

### Scrollable

Atur `scrollable` saat daftar tab mungkin melebihi container-nya. Chevron Previous dan Next muncul hanya saat label overflow. Daftar juga mendukung navigasi touch, trackpad, dan keyboard, dan membawa tab terpilih ke dalam tampilan:

::component-example{name="tabs-scrollable"}
::

```vue-html
<STabs v-model="active" :items="items" scrollable />
```

Kontrol menggunakan `SButton` ghost netral secara default. Gunakan `ui.scrollButton` dan `ui.scrollIcon` untuk styling, atau slot `scroll-left-icon` dan `scroll-right-icon` untuk hanya mengganti chevron. Untuk kontrol yang berbeda, ganti `scroll-left` atau `scroll-right` dan bind `buttonProps` yang diberikan sehingga tombol mempertahankan click handler, state disabled, type, dan label yang dapat diakses:

```vue-html
<STabs :items="items" scrollable>
  <template #scroll-right="{ buttonProps }">
    <MyIconButton v-bind="buttonProps" />
  </template>
</STabs>
```

Slot tombol lengkap juga mengekspos `scroll`, `disabled`, dan `ariaLabel` untuk kontrol kustom yang tidak dapat menggunakan `v-bind="buttonProps"`.

### Orientasi

Atur `orientation="vertical"` untuk menempatkan daftar tab di samping kontennya. Kedua varian `underline` dan `pill` bekerja secara vertikal, dan Reka mengubah navigasi tombol panah ke Atas/Bawah. `scrollable` hanya berlaku untuk tab horizontal.

::component-example{name="tabs-vertical"}
::

```vue-html
<STabs v-model="active" :items="items" orientation="vertical" variant="pill" />
```

### Keep inactive panels mounted

Konten panel yang tidak aktif di-unmount secara default. Atur `unmount-on-hide` ke `false` untuk mempertahankan state lokalnya, seperti form yang belum selesai, saat panel disembunyikan:

```vue-html
<STabs :items="items" :unmount-on-hide="false">
  <!-- panel slots -->
</STabs>
```

## Dalam markdown

Setiap komponen Selaras sudah terdaftar secara global di bawah nama berawalan `S` - blok `::s-tabs{...}` kosan berfungsi tanpa wiring tambahan (lihat bagian "In markdown" di [Callout](/components/typography/callout) untuk cara kerja pola secara umum). `items` adalah array prop, bukan string - bind dengan leading `:` agar `@nuxtjs/mdc` memparse atribut sebagai expression daripada teks literal. Konten setiap tab adalah baris `#slot-name` yang cocok dengan `value` item itu:

```text
::s-tabs{:items='[{"label":"One","value":"one"},{"label":"Two","value":"two"}]'}
#one
Content for the first tab.
#two
Content for the second tab.
::
```

### Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.tabs`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Tabs` sendiri:

::theme-source{name="tabs"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `items` | `{ label: string; value?: string; disabled?: boolean; icon?: string }[]` | - |
| `variant` | `'underline' \| 'pill'` | `'underline'` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `scrollable` | `boolean` | `false` |
| `unmountOnHide` | `boolean` | `true` |
| `modelValue` | `string` | - |
| `defaultValue` | `string` | no initial selection |
| `ui` | `Partial<Record<'root' \| 'scrollRoot' \| 'scrollViewport' \| 'scrollButton' \| 'scrollIcon' \| 'list' \| 'trigger' \| 'icon' \| 'indicator' \| 'content', string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `string` | Terpicu saat tab aktif berubah |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `[item.value]` | - | Konten untuk tab itu, satu named slot per item |
| `label` | `{ item, index }` | Menggantikan konten label tab |
| `scroll-left-icon`, `scroll-right-icon` | `{ class }` | Menggantikan chevron kontrol default |
| `scroll-left`, `scroll-right` | `{ buttonProps, scroll, disabled, ariaLabel }` | Menggantikan seluruh kontrol overflow |

Untuk tabs yang tidak terkontrol, berikan `defaultValue` untuk memilih panel awal. Nilai item menggunakan `item.value`, atau indeks berbasis nol item yang dikonversi ke string saat dihilangkan. Gunakan `v-model` saat parent memiliki seleksi.
