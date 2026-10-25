---
title: Badge
description: Pil tema kecil untuk label dan indikator status, dengan opsi bentuk rounded untuk lencana hitungan.
order: 11
---

## Penggunaan

::component-example{name="badge-basic"}
::

```vue-html
<SBadge label="Primary" color="primary" />
<SBadge label="Solid" color="primary" variant="solid" />
<SBadge label="Outline" color="danger" variant="outline" />
<SBadge label="Subtle" color="primary" variant="subtle" />
```

### Ikon

`icon` dan `trailingIcon` menambahkan ikon sebelum atau setelah label - berguna untuk status glyph atau disclosure chevron. Badge murni elemen tampilan, meskipun begitu - untuk tag yang dapat ditutup, lihat [Chip](/components/elements/chip) sebagai gantinya. Slot `icon`/`trailing-icon` yang cocok menggantikan glyph sepenuhnya ketika nama ikon saja tidak cukup (spinner, misalnya).

::component-example{name="badge-icon"}
::

```vue-html
<SBadge label="Verified" icon="hugeicons:tick-02" color="success" />
<SBadge label="New" trailing-icon="hugeicons:arrow-right-01" color="primary" />
```

### Ikon saja

`icon` tanpa `label` (dan tanpa konten slot default) menghilangkan bentuk pil untuk menjadi lingkaran sebagai gantinya - ini terbaca sebagai indikator status/count yang berdekatan dengan avatar daripada label teks. Chip tetap pil bahkan ikon-saja; ini adalah bentuk yang sengaja berbeda untuk peran yang berbeda.

::component-example{name="badge-icon-only"}
::

```vue-html
<SBadge icon="hugeicons:notification-01" color="primary" />
<SBadge icon="hugeicons:tick-02" color="success" size="lg" />
<SBadge icon="hugeicons:notification-01" color="primary" variant="solid" />
<SBadge icon="hugeicons:tick-02" color="success" variant="solid" size="lg" />
```

### Lencana hitungan rounded

Label numerik otomatis menggunakan bentuk yang membulat penuh. Lebar minimum
mengikuti tinggi lencana, sehingga satu digit berbentuk lingkaran sementara
hitungan beberapa digit seperti `12` atau `99+` melebar menjadi pil. Hitungan
numerik juga menggunakan angka tabular agar lebar digit konsisten. Gunakan
`rounded` untuk menerapkan bentuk yang sama pada label teks seperti `Baru`.

::component-example{name="badge-rounded-count"}
::

```vue-html
<SBadge label="1" size="sm" color="primary" />
<SBadge label="12" color="primary" />
<SBadge label="100" color="primary" />
<SBadge rounded label="Baru" color="danger" />
```

### Status dot

`dot` menambahkan lingkaran solid berwarna kecil - indikator online/offline/away klasik. Dikasangkan dengan label, ia duduk di depan teks; sendirian, seluruh badge menciut menjadi hanya dot. Dots inline menggunakan warna badge foreground sehingga tetap terlihat di pil solid; standalone dots menggunakan warna teks role terlepas dari `variant` untuk kontras terhadap permukaan default. Dots inline bersifat dekoratif. Dot standalone memiliki peran gambar dan membutuhkan nama yang dapat diakses seperti `aria-label`.

::component-example{name="badge-dot"}
::

```vue-html
<SBadge label="Online" dot color="success" />
<SBadge label="Away" dot color="warning" />
<SBadge label="Offline" dot color="neutral" />

<!-- Bare dot, no visible label - give it an accessible name directly -->
<SBadge dot color="success" aria-label="Online" />
```

## Dalam markdown

Setiap komponen Selaras sudah terdaftar secara global di bawah nama berawalan `S` - blok `::s-badge{...}` berfungsi tanpa wiring tambahan, props ikut disertakan (lihat bagian "In markdown" di [Callout](/components/typography/callout) untuk cara kerja pola secara umum):

```md
::s-badge{label="New" color="primary"}
::
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Badge` sendiri:

::theme-source{name="badge"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `label` | `string` | - |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `rounded` | `boolean` | `false` |
| `dot` | `boolean` | `false` |
| `color` | `ColorRole` (role bawaan atau semantik terdaftar) | `'neutral'` |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'subtle'` | `'soft'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<BadgeSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Konten kustom, menggantikan `label` |
| `icon` | Menggantikan ikon depan sepenuhnya |
| `trailing-icon` | Menggantikan ikon trailing sepenuhnya |
