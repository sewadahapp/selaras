---
title: Toggle
description: Tombol dua state ditekan/tidak ditekan, dibangun di atas primitif Toggle milik Reka UI.
order: 12.92
---

## Penggunaan

::component-example{name="toggle-basic"}
::

```vue-html
<SToggle icon="hugeicons:text-bold">Bold</SToggle>
```

### Ikon saja

Deteksi otomatis yang sama seperti `Button` - berikan `icon` tanpa konten slot default dan bentuknya otomatis menjadi persegi. Selalu tambahkan `aria-label` ketika tidak ada teks yang terlihat:

::component-example{name="toggle-icon-only"}
::

```vue-html
<SToggle icon="hugeicons:text-bold" aria-label="Bold" />
```

### Warna

`color` memilih salah satu dari tujuh warna semantik yang digunakan state ditekan - state tidak ditekan selalu terlihat sama (muted, transparan) terlepas dari `color`:

::component-example{name="toggle-color"}
::

```vue-html
<SToggle color="success" default-value>Enabled</SToggle>
```

### Disabled

::component-example{name="toggle-disabled"}
::

```vue-html
<SToggle disabled>Off</SToggle>
<SToggle disabled default-value>On</SToggle>
```

### Multiple toggles

Untuk set toggle terkait yang berbagi satu model seleksi (single atau multiple), lihat [ToggleGroup](/components/elements/toggle-group) - `Toggle` sendiri tidak memiliki hubungan dengan `Toggle` lain.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Toggle` sendiri:

::theme-source{name="toggle"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | - |
| `defaultValue` | `boolean` | `false` |
| `disabled` | `boolean` | - |
| `icon` | `string` | - |
| `color` | [ColorRole](/overview/theming/color-roles) | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `square` | `boolean` | - |
| `ui` | `Partial<Record<ToggleSlot, string \| object>>` | - |

## Emits

| Event | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `default` | `{ pressed }` | Konten toggle sendiri |
