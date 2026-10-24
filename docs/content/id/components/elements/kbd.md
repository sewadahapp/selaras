---
title: Kbd
description: Petunjuk tombol keyboard / shortcut dengan tema.
order: 12.95
---

## Penggunaan

`value` me-resolve set kecil nama tombol umum ke simbolnya - yang lain (huruf, angka) dirender apa adanya:

::component-example{name="kbd-basic"}
::

```vue-html
<SKbd value="meta" /><SKbd>K</SKbd>
```

### Tombol

Setiap simbol bawaan yang di-resolve `value`:

::component-example{name="kbd-keys"}
::

`meta`/`command`/`cmd` → , `ctrl`/`control` → ⌃, `alt`/`option` → , `shift` → ⇧, `enter`/`return` → ↵, `backspace` → ⌫, `delete` → ⌦, `tab` → , `capslock` → ⇪, `escape`/`esc` → Esc, `up`/`down`/`left`/`right` → ↑/↓/←/→, `space` → Space. Yang lain - `K` kosong, digit - dipertahankan sebagai string literal, jadi `value` juga berfungsi sebagai shorthand untuk slot default.

### Ukuran

::component-example{name="kbd-sizes"}
::

```vue-html
<SKbd size="sm" value="meta" />
<SKbd size="md" value="meta" />
<SKbd size="lg" value="meta" />
```

## Dalam markdown

Setiap komponen Selaras sudah terdaftar secara global di bawah nama berawalan `S` - blok `::s-kbd{...}` berfungsi tanpa wiring tambahan (lihat bagian "In markdown" di [Callout](/components/typography/callout) untuk cara kerja pola secara umum):

```md
::s-kbd{value="meta"}
::
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Kbd` sendiri:

::theme-source{name="kbd"}
::

Global dan scoped theme recipes menggunakan `ui.kbd`.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `value` | `string` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<'base', string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `default` | - | Menggantikan `value` sepenuhnya - combo yang sudah dirakit, ikon, apa pun |
