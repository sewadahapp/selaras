---
title: Progress
description: Indikator progress linear atau melingkar, dibangun di atas primitif Progress milik Reka UI.
order: 12.97
---

## Penggunaan

::component-example{name="progress-basic"}
::

```vue-html
<SProgress :model-value="40" />
```

### Indeterminate

Hilangkan `modelValue` (atau atur `null`) untuk indikator sibuk tanpa persentase penyelesaian yang diketahui - bar meluncur terus-menerus daripada melacak lebar:

::component-example{name="progress-indeterminate"}
::

```vue-html
<SProgress />
```

### Warna

::component-example{name="progress-color"}
::

```vue-html
<SProgress :model-value="65" color="success" />
```

### Melingkar

`type="circular"` menggambar ring daripada bar - slot default, jika diberikan, berada di tengahnya (tidak ada ruang untuk overlay teks di bar 8px, jadi `linear` tidak mendapat perlakuan ini):

::component-example{name="progress-circular"}
::

```vue-html
<SProgress type="circular" :model-value="70">
  <template #default="{ percent }">{{ Math.round(percent) }}%</template>
</SProgress>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Progress` sendiri:

::theme-source{name="progress"}
::

Global dan scoped theme recipes menggunakan `ui.progress`.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `modelValue` | `number \| null` | - |
| `max` | `number` | `100` |
| `type` | `'linear' \| 'circular'` | `'linear'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | [ColorRole](/overview/theming/color-roles) | `'primary'` |
| `ui` | `Partial<Record<ProgressSlot, string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `default` | `{ percent }` | Konten label - di tengah ring untuk `circular` |
