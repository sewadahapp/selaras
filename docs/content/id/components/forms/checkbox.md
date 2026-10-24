---
title: Checkbox
description: Checkbox dengan label opsional, dibangun di atas primitif Checkbox milik Reka UI.
order: 24
---

## Penggunaan

::component-example{name="checkbox-basic"}
::

```vue
<script setup lang="ts">
const accepted = ref(true)
</script>

<template>
  <SCheckbox v-model="accepted" label="Accept terms" />
</template>
```

### States

`modelValue` juga menerima `'indeterminate'`, untuk checkbox "select all" yang anak-anetnya hanya dipilih sebagian - ia merender garis daripada tanda centang dan bukan state toggle nyata tempat klik bisa mendarat (mengklik checkbox indeterminate langsung ke checked). `disabled` mencegah interaksi dan meredupkannya, dan `invalid` mengubah ring dan fill checked ke role semantik danger:

::component-example{name="checkbox-states"}
::

```vue-html
<SCheckbox v-model="indeterminate" label="Select all" />
<SCheckbox :model-value="false" disabled label="Disabled" />
<SCheckbox v-model="disabledChecked" disabled label="Disabled, checked" />
<SCheckbox v-model="invalidChoice" invalid label="You must accept to continue" />
```

Lihat [Props](#props).

### Ukuran

`size` menerima `sm` / `md` / `lg`, menyesuaikan kotak, tanda centang, dan label secara bersamaan:

::component-example{name="checkbox-sizes"}
::

```vue-html
<SCheckbox v-model="sm" size="sm" label="Small" />
<SCheckbox v-model="md" size="md" label="Medium" />
<SCheckbox v-model="lg" size="lg" label="Large" />
```

### Warna

`color` mengatur warna fill/ring/checkmark checked/indeterminate - unchecked selalu tetap ring netral yang sama terlepas dari warna:

::component-example{name="checkbox-colors"}
::

```vue-html
<SCheckbox v-model="primary" color="primary" label="Primary" />
<SCheckbox v-model="success" color="success" label="Success" />
<SCheckbox v-model="danger" color="danger" label="Danger" />
```

### Deskripsi

`description` menambahkan baris kedua yang muted di bawah label - untuk checkbox standalone (checkbox "Accept terms", misalnya) di mana membungkusnya dalam [FormField](/components/forms/form-field) sendiri akan menjadi formalitas yang tidak diperlukan:

::component-example{name="checkbox-description"}
::

```vue-html
<SCheckbox v-model="accepted" label="Accept terms" description="You agree to our Terms of Service and Privacy Policy." />
```

### Gaya card

`variant="card"` membungkus checkbox dan label dalam kotak berborder alih-alih baris inline polos, menyorotnya saat checked - berfungsi sama dengan atau tanpa `description`:

::component-example{name="checkbox-card"}
::

```vue-html
<SCheckbox v-model="accepted" variant="card" label="Accept terms" description="You agree to our Terms of Service and Privacy Policy." />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` fallback ke state FormField sendiri ketika tidak diatur langsung pada checkbox, dan `size` juga sama (cocok dengan inheritance RadioGroup/Switch).

### Aksesibilitas

Checkbox merender primitif Checkbox milik Reka UI, jadi semantik aksesibilitas berasal dari sana daripada direimplementasi di sini: `role="checkbox"` dengan `aria-checked` mencerminkan ketiga state (`true`/`false`, atau `"mixed"` untuk indeterminate). Ini adalah satu kontrol native-equivalent, jadi hanya satu <kbd>Tab</kbd> stop tanpa roving focus untuk dikelola, dan <kbd>Space</kbd> men togglenya - perilaku standar untuk [ARIA checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/), bukan sesuatu untuk dikonfigurasi di sini.

`decorative` hanya merender indikator bertema, disembunyikan dari teknologi asistif, tanpa target fokus atau input form. Ia tidak mewarisi state FormField atau memancarkan perubahan seleksi. [Listbox](/components/forms/listbox) dan [TransferList](/components/forms/transfer-list) menggunakan mode ini di dalam opsi mereka; opsi sekitarnya memiliki interaksi keyboard dan pengumuman seleksi.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Checkbox` sendiri:

::theme-source{name="checkbox"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `boolean \| 'indeterminate'` | - |
| `label` | `string` | - |
| `description` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `decorative` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `ColorRole` (role bawaan atau semantik terdaftar) | `'primary'` |
| `variant` | `'default' \| 'card'` | `'default'` |
| `ui` | `Partial<Record<'root' \| 'box' \| 'indicator' \| 'checkIcon' \| 'indeterminateIcon' \| 'label' \| 'description' \| 'labelGroup', string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Konten kustom, menggantikan `label` |
| `description` | Konten kustom, menggantikan `description` |
