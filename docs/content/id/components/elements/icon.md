---
title: Icon
description: Wrapper tipis di sekitar Nuxt Icon - satu komponen bersama, di mana saja ikon muncul di pustaka ini atau markup Anda sendiri.
order: 12
---

## Penggunaan

Setiap prop yang menerima ikon di seluruh pustaka ini (`icon` milik `Button`, `icon` milik `Input`, slot milik `Select`, ...) sudah merender melalui `SIcon` secara internal - masing-maya hanya menyediakan kelas ukuran yang tepat (`size-3.5`, `size-4.5`, ...) melalui `class`, sama seperti Anda. `SIcon` tidak memiliki opini tentang ukuran sama sekali; ini hanya pass-through ke Nuxt Icon plus satu prop kenyamanan opsional untuk warna semantik.

::component-example{name="icon-basic"}
::

```vue-html
<SIcon name="hugeicons:star" class="size-4" />
<SIcon name="hugeicons:star" class="size-5" />
<SIcon name="hugeicons:star" class="size-6" />
<SIcon name="hugeicons:favourite" color="danger" />
```

`name` menerima nama ikon terdaftar apa pun, tidak hanya set `hugeicons:*` yang digunakan di seluruh dokumentasi pustaka ini sendiri.

### Ukuran

Tidak ada prop `size` - berikan kelas ukuran Tailwind apa pun yang Anda butuhkan melalui `class` secara langsung, sama seperti penggunaan ikon lainnya. Komponen pustaka ini sendiri masing-masing memilih skala mereka sendiri secara internal (ikon Badge menggunakan `size-2.5`/`size-3`/`size-3.5`, Button `size-4`/`size-4.5`/`size-5`, dan seterusnya) - tidak ada yang memetakan dengan bersih ke satu enum bersama, jadi `SIcon` tidak mencoba memaksakannya.

### Warna

`color` tidak diatur secara default, jadi ikon mewarisi `currentColor` dari warna teks di sekitarnya - perilaku yang sama yang digunakan setiap penggunaan ikon internal di pustaka ini (ikon depan input mengambil `--selaras-resolved-text-muted` dari wrapper-nya, bukan prop warna sendiri). Berikan role semantik terdaftar untuk memaksa warna tertentu:

```vue-html
<SIcon name="hugeicons:checkmark-circle-01" color="success" />
```

`class="text-[var(--selaras-resolved-color-danger-text)]"` masih menggantikan `color` jika Anda membutuhkan sesuatu yang tidak dicakup role preset - keduanya melewati tailwind-merge, jadi kelas `text-*` apa pun yang Anda tambahkan menang.

### Mengganti set ikon default

`SIcon` sendiri hanya merender apa pun `name` yang diberikan - tidak memiliki default sendiri. Tetapi setiap ikon yang dirender komponen *sendiri* (spinner loading tombol, glyph remove chip, chevron dropdown select, ...) diresolve dari registry tujuan semantik terpisah daripada nama hardcoded - lihat [useIcons](/utilities/composables/use-icons) untuk registry lengkap dan cara menggantinya secara global di `app.config.ts`.

## Dalam markdown

Setiap komponen Selaras sudah terdaftar secara global di bawah nama berawalan `S` - blok `::s-icon{...}` berfungsi tanpa wiring tambahan (lihat bagian "In markdown" di [Callout](/components/typography/callout) untuk cara kerja pola secara umum). `Icon` tidak memiliki konten body, tetapi blok masih membutuhkan baris penutupnya sendiri:

```md
::s-icon{name="hugeicons:star" color="warning"}
::
```

### Custom `:ui`

Override resep global dan scoped menggunakan `ui.icon`. Ini sengaja menjadi hook primitif bersama: mempengaruhi instance `<SIcon>` langsung dan ikon yang dirender di dalam komponen Selaras lainnya. Slot ikon komponen pemilik digabungkan kemudian, jadi ukuran dan kelas Tailwind konflik lainnya tetap lebih spesifik.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Icon` sendiri:

::theme-source{name="icon"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `name` | `string` | - |
| `color` | [ColorRole](/overview/theming/color-roles) | - |
| `ui` | `Partial<Record<'base', string \| object>>` | - |
