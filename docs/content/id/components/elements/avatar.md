---
title: Avatar
description: Gambar melingkar (atau rounded) atau placeholder inisial untuk mewakili seseorang atau entitas.
order: 11.25
---

## Penggunaan

Avatar menampilkan orang atau entitas: foto saat `src` tersedia, dan fallback - inisial, ikon, atau glyph pengguna default - saat foto loading atau gagal dimuat.

::component-example{name="avatar-basic"}
::

```vue-html
<SAvatar />
<SAvatar text="JD" />
<SAvatar src="https://i.pravatar.cc/96?img=3" alt="Jane Doe" />
```

`<SAvatar />` kosong - tanpa `src`, `text`, atau `icon` - merender ikon pengguna default di atas warna placeholder, masih diberi tema oleh `color`/`size`/`shape`.

### Fallback

`text` biasanya berisi inisial orang. `icon` mengganti fallback dengan glyph, dan `text` menang ketika keduanya diberikan. Slot `fallback` menggantikan seluruh konten fallback untuk sesuatu yang kustom.

::component-example{name="avatar-fallback"}
::

```vue-html
<SAvatar text="JD" color="primary" />
<SAvatar icon="hugeicons:user-group" color="success" />
<SAvatar color="warning">
  <template #fallback>
    <span class="text-sm font-semibold">ACME</span>
  </template>
</SAvatar>
```

### Ukuran

::component-example{name="avatar-sizes"}
::

```vue-html
<SAvatar size="sm" text="JD" />
<SAvatar size="md" text="JD" color="primary" />
<SAvatar size="lg" text="JD" color="success" />
```

### Warna

`color` memberi style background placeholder dan inisial/ikon-nya, terlihat saat gambar loading (atau sebagai gantinya). `neutral` menggunakan background elevated polos, cocok dengan treatment neutral soft lainnya di pustaka ini.

::component-example{name="avatar-colors"}
::

```vue-html
<SAvatar text="OK" color="success" />
<SAvatar text="NG" color="danger" />
<SAvatar text="IF" color="info" />
```

### Shape

Avatar default menjadi lingkaran; `shape="rounded"` menggunakan radius kecil standar sebagai gantinya.

::component-example{name="avatar-shape"}
::

```vue-html
<SAvatar text="JD" />
<SAvatar text="JD" shape="rounded" color="primary" />
<SAvatar src="https://i.pravatar.cc/96?img=3" alt="Jane Doe" shape="rounded" />
```

### Status

`status` menambahkan dot presence kecil solid di pojok kanan bawah avatar. Warnanya independen dari `color` (`statusColor`, default `neutral`) karena semantik presence - online, offline, busy - jarang cocok dengan warna identitas avatar.

::component-example{name="avatar-status"}
::

```vue-html
<SAvatar text="JD" status status-color="success" />
<SAvatar text="JD" status />
<SAvatar src="https://i.pravatar.cc/96?img=3" alt="Jane Doe" status status-color="danger" />
```

### Aksesibilitas

- Ketika `src` diberikan, `alt` diteruskan ke elemen gambar.
- Tanpa gambar, avatar menurunkan nama yang dapat diakses dari `alt` (fallback ke `text`) dan menempatkannya di root - timpa kapan saja dengan fallthrough `aria-label` langsung.
- Ikon pengguna default sendiri tidak memiliki teks, jadi `<SAvatar />` kosong yang digunakan sebagai kontrol yang bermakna (misalnya, link profil) harus mendapatkan `aria-label`. Status dot bersifat dekoratif; jika state-nya membawa makna, berikan avatar `aria-label` yang menyatakannya.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Avatar` sendiri:

::theme-source{name="avatar"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `as` | `string \| Component` | `'span'` |
| `src` | `string` | - |
| `alt` | `string` | - |
| `text` | `string` | - |
| `icon` | `string` | - |
| `color` | [ColorRole](/overview/theming/color-roles) | `'neutral'` |
| `statusColor` | [ColorRole](/overview/theming/color-roles) | `'neutral'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `shape` | `'circle' \| 'rounded'` | `'circle'` |
| `status` | `boolean` | `false` |
| `referrerPolicy` | `'' \| 'no-referrer' \| 'no-referrer-when-downgrade' \| 'origin' \| 'origin-when-cross-origin' \| 'same-origin' \| 'strict-origin' \| 'strict-origin-when-cross-origin' \| 'unsafe-url'` | - |
| `crossOrigin` | `'anonymous' \| 'use-credentials' \| ''` | - |
| `ui` | `Partial<Record<AvatarSlot, string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `fallback` | - | Menggantikan seluruh konten fallback - inisial, ikon, atau ikon pengguna default |
| `icon` | `{ class }` | Menggantikan ikon fallback (ketika tidak ada `text` yang diberikan); class scoped membawa kelas ukuran yang diresolve dari ikon |

Sesuaikan gambar itu sendiri (kelas slot `image`) melalui `:ui="{ image: '...' }"`.
