---
title: Chip
description: Tag yang dapat dihapus untuk mewakili nilai yang pengguna dapat tutup - filter, item terpilih, entri teks bebas.
order: 11.5
---

## Penggunaan

Chip berbagi sistem warna/varian/ukuran - dan bentuk defaultnya - dengan [Badge](/components/elements/badge). Perbedaannya adalah `removable`, yang menambahkan tombol tutup dan event `remove`. Chip tidak melacak nilainya sendiri; parent menentukan apa artinya "remove" (hapus dari array, batalkan filter, apa pun yang cocok).

::component-example{name="chip-basic"}
::

```vue-html
<SChip label="Primary" color="primary" />
<SChip label="Solid" color="primary" variant="solid" />
<SChip label="Outline" color="danger" variant="outline" />
```

### Removable

`removable` menambahkan tombol tutup; dengarkan `@remove` untuk bereaksi.

::component-example{name="chip-removable"}
::

```vue-html
<SChip
  v-for="fruit in fruits"
  :key="fruit"
  :label="fruit"
  removable
  @remove="fruits = fruits.filter((f) => f !== fruit)"
/>
```

### Ikon

`icon` menambahkan ikon depan, dan dapat digabungkan dengan `removable` secara bebas - slot `icon` yang cocok menggantikan glyph sepenuhnya ketika nama ikon saja tidak cukup.

::component-example{name="chip-icon"}
::

```vue-html
<SChip label="Verified" icon="hugeicons:tick-02" color="success" />
<SChip label="Starred" icon="hugeicons:star" color="warning" removable />
```

### Rounded

`rounded` mengganti radius kecil default menjadi bentuk pil penuh.

::component-example{name="chip-rounded"}
::

```vue-html
<SChip label="Primary" color="primary" rounded />
<SChip label="Removable" removable rounded @remove="() => {}" />
```

### Aksesibilitas

Tombol remove adalah ikon-saja, jadi ia membutuhkan nama yang dapat diakses dari suatu tempat: secara default ia diturunkan sebagai `Remove {label}` (atau `Remove` saja tanpa `label`) - timpa langsung dengan `removeLabel` ketika konten slot default bukan teks polos yang dapat dijelaskan oleh `label`.

Root Chip sendiri adalah `<span>`, jadi tombol remove merender sebagai `<button>` nyata di dalamnya - tidak ada yang perlu diakali di sana, tidak seperti kontrol yang harus hidup di dalam elemen interaktif lain.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Chip` sendiri:

::theme-source{name="chip"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `label` | `string` | - |
| `icon` | `string` | - |
| `removable` | `boolean` | `false` |
| `removeLabel` | `string` | - |
| `disabled` | `boolean` | `false` |
| `rounded` | `boolean` | `false` |
| `color` | [ColorRole](/overview/theming/color-roles) | `'neutral'` |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<ChipSlot, string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| default | - | Konten kustom, menggantikan `label` |
| `icon` | - | Menggantikan ikon depan sepenuhnya |
| `remove` | `{ remove }` | Menggantikan seluruh kontrol remove (bukan hanya ikonnya) - diperlukan ketika host context harus menyediakan elemen interaktifnya sendiri di sana. Panggil fungsi `remove` scoped untuk memicu event `remove` yang sama seperti tombol default |
| `remove-icon` | - | Menggantikan ikon tombol remove (default: `hugeicons:cancel-01`) |

## Emits

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `remove` | - | Terpicu saat tombol remove diklik |
