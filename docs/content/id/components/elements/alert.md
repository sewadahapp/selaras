---
title: Alert
description: Banner status inline - ikon, judul, deskripsi, dan tombol tutup opsional.
order: 12.9
---

## Penggunaan

::component-example{name="alert-basic"}
::

```vue-html
<SAlert
  color="info"
  title="Heads up"
  description="This changes how the export command behaves - check the migration notes before upgrading."
/>
```

### Variant

`variant` memilih antara `soft` (default), `outline`, dan `solid`:

::component-example{name="alert-variant"}
::

```vue-html
<SAlert color="success" variant="outline" title="Payment received" description="Your subscription is now active." />
```

### Warna

`color` menerima role semantik terdaftar apa pun. Empat intent umpan balik bawaan - `success`, `danger`, `warning`, dan `info` - masing-masing memilih ikon default yang cocok. Role lain tetap mengontrol resep visual, tetapi tidak menebak ikon; atur `icon` secara eksplisit ketika role itu membutuhkan ikon. Ikon default hanya merender setelah `color` diberikan, jadi `SAlert` tanpa keduanya tidak merender ikon:

::component-example{name="alert-color"}
::

```vue-html
<SAlert color="danger" title="Error" description="Something went wrong while saving." />
```

### Closable

`closable` menunjukkan tombol tutup dan memancarkan `close` saat diklik - alert tidak memiliki open state sendiri, jadi menyembunyikannya terserah `v-if` Anda sendiri, sama cara kerja `removable` milik `Chip`:

::component-example{name="alert-closable"}
::

```vue-html
<SAlert v-if="visible" title="Unsaved changes" closable @close="visible = false" />
```

### Dengan aksi

Slot `actions` merender tombol di bawah deskripsi:

::component-example{name="alert-actions"}
::

```vue-html
<SAlert color="danger" title="Upload failed" description="Check your connection and try again.">
  <template #actions>
    <SButton size="sm" color="danger">Retry</SButton>
    <SButton size="sm" variant="ghost" color="neutral">Dismiss</SButton>
  </template>
</SAlert>
```

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `description` | `string` | - |
| `icon` | `string` | - |
| `closable` | `boolean` | `false` |
| `color` | `ColorRole` | `info` |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `soft` |
| `ui` | `Partial<Record<AlertSlot, string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `close` | - | Terpicu saat tombol tutup diklik |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `title` | - | Menggantikan teks judul |
| `description` | - | Menggantikan teks deskripsi |
| `actions` | - | Tombol aksi di bawah deskripsi |
