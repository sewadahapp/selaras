---
title: Breadcrumb
description: Jejak nav "Anda di sini".
order: 39
---

## Penggunaan

Item terakhir selalu merender sebagai halaman saat ini - label polos, tidak interaktif, bukan link, terlepas dari apakah ia memiliki `to` sendiri:

::component-example{name="breadcrumb-basic"}
::

```vue-html
<SBreadcrumb :items="[
  { label: 'Home', to: '/' },
  { label: 'Components', to: '/components' },
  { label: 'Breadcrumb' },
]" />
```

### Dengan ikon

::component-example{name="breadcrumb-icons"}
::

```vue-html
<SBreadcrumb :items="[
  { label: 'Home', to: '/', icon: 'hugeicons:home-01' },
  { label: 'Settings', to: '/settings', icon: 'hugeicons:settings-01' },
]" />
```

### Item disabled

Item sebelumnya tanpa `to` (atau dengan `disabled`) merender inert - tampilan sama seperti trail, tanpa dapat diklik:

::component-example{name="breadcrumb-disabled"}
::

```vue-html
<SBreadcrumb :items="[
  { label: 'Home', to: '/' },
  { label: 'Archived project', to: '/projects/archived', disabled: true },
  { label: 'Report' },
]" />
```

### Separator kustom

`separator-icon` menggantikan chevron default:

::component-example{name="breadcrumb-separator"}
::

```vue-html
<SBreadcrumb :items="items" separator-icon="hugeicons:slash" />
```

### Collapsing long trails

`max-items` menciutkan bagian tengah trail yang panjang di belakang tombol ellipsis setelah ada lebih banyak item daripada itu - item pertama dan `maxItems - 1` terakhir tetap terlihat, yang lain masuk ke overflow menu:

::component-example{name="breadcrumb-max-items"}
::

```vue-html
<SBreadcrumb :items="items" :max-items="4" />
```

### Truncate label panjang

`truncate` menjaga satu label panjang - misalnya judul produk dinamis - agar tidak merusak layout trail. `true` membatasinya pada `12rem`; berikan string panjang CSS (`'20rem'`, `'300px'`) untuk batas kustom. Label lengkap masih tersedia saat hover melalui atribut native `title`:

::component-example{name="breadcrumb-truncate"}
::

```vue-html
<SBreadcrumb :items="items" truncate />
```

### Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.breadcrumb`. Overflow menu yang diciutkan dan ikon tetap merupakan komponen `ui.dropdown` dan `ui.icon` bersarang biasa.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Breadcrumb` sendiri:

::theme-source{name="breadcrumb"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `items` | `BreadcrumbItem[]` | - |
| `maxItems` | `number` | - |
| `truncate` | `boolean \| string` | `false` |
| `separatorIcon` | `string` | `icons.chevronRight` |
| `ui` | `Partial<Record<BreadcrumbSlot, string \| object>>` | - |

`BreadcrumbItem` adalah `{ label: string, icon?: string, to?: string, disabled?: boolean }`.

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `item` | `{ item, index, current }` | Menggantikan konten satu item |
| `separator` | - | Menggantikan separator antar item |
