---
title: Switch
description: Toggle switch dengan label opsional, dibangun di atas primitif Switch milik Reka UI.
order: 26
---

## Penggunaan

::component-example{name="switch-basic"}
::

```vue
<script setup lang="ts">
const notifications = ref(true)
</script>

<template>
  <SSwitch v-model="notifications" label="Notifications" />
</template>
```

### States

`disabled` mencegah interaksi dan meredupkannya, dan `invalid` mengubah track ke role semantik danger:

::component-example{name="switch-states"}
::

```vue-html
<SSwitch v-model="disabledOff" disabled label="Disabled" />
<SSwitch v-model="disabledOn" disabled label="Disabled, on" />
<SSwitch v-model="invalidChoice" invalid label="You must enable this to continue" />
```

Lihat [Props](#props).

### Ukuran

`size` menerima `sm` / `md` / `lg`, menyesuaikan track, thumb, dan label secara bersamaan:

::component-example{name="switch-sizes"}
::

```vue-html
<SSwitch v-model="sm" size="sm" label="Small" />
<SSwitch v-model="md" size="md" label="Medium" />
<SSwitch v-model="lg" size="lg" label="Large" />
```

### Warna

`color` mengatur warna track/thumb saat checked - unchecked selalu tetap track netral yang sama terlepas dari warna:

::component-example{name="switch-colors"}
::

```vue-html
<SSwitch v-model="primary" color="primary" label="Primary" />
<SSwitch v-model="success" color="success" label="Success" />
<SSwitch v-model="danger" color="danger" label="Danger" />
```

### Loading

`loading` menunjukkan spinner di thumb - berguna saat toggle async (API call di balik switch) sedang berlangsung. Ini tidak menyiratkan `disabled` - gabungkan `:loading="x" :disabled="x"` jika switch yang sibuk tidak boleh disentuh sementara waktu:

::component-example{name="switch-loading"}
::

```vue-html
<SSwitch :model-value="enabled" :loading="loading" label="Sync with server" @update:model-value="onUpdate" />
```

### Ikon

`checked-icon`/`unchecked-icon` merender di dalam thumb untuk setiap state - berguna ketika pasangan ikon semantik lebih jelas daripada on/off polos:

::component-example{name="switch-icons"}
::

```vue-html
<SSwitch v-model="airplaneMode" checked-icon="hugeicons:airplane-mode" unchecked-icon="hugeicons:airplane-mode-off" label="Airplane mode" />
```

### Deskripsi

`description` menambahkan baris kedua yang muted di bawah label - untuk toggle standalone (daftar pengaturan, misalnya) di mana membungkus setiap switch dalam [FormField](/components/forms/form-field) sendiri akan menjadi formalitas yang tidak diperlukan:

::component-example{name="switch-description"}
::

```vue-html
<SSwitch v-model="marketing" label="Marketing emails" description="Occasional product updates and offers - unsubscribe any time." />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` fallback ke state FormField sendiri ketika tidak diatur langsung pada switch, dan `size` juga sama (cocok dengan inheritance RadioGroup).

### Aksesibilitas

Switch merender primitif Switch milik Reka UI, jadi semantik aksesibilitas berasal dari sana daripada direimplementasi di sini: `role="switch"` dengan `aria-checked` boolean (tid seperti Checkbox, tidak ada state "mixed" ketiga). Ini adalah satu kontrol native-equivalent, jadi hanya satu <kbd>Tab</kbd> stop tanpa roving focus untuk dikelola, dan <kbd>Space</kbd> men-togglenya - perilaku standar untuk [ARIA switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/), bukan sesuatu untuk dikonfigurasi di sini.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Switch` sendiri:

::theme-source{name="switch"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `boolean` | - |
| `label` | `string` | - |
| `description` | `string` | - |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | [ColorRole](/overview/theming/color-roles) | `'primary'` |
| `loading` | `boolean` | `false` |
| `checkedIcon` | `string` | - |
| `uncheckedIcon` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'track' \| 'thumb' \| 'icon' \| 'label' \| 'description' \| 'labelGroup', string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Konten kustom, menggantikan `label` |
| `description` | Konten kustom, menggantikan `description` |
