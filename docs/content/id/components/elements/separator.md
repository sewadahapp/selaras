---
title: Separator
description: Garis visual (dan semantik) antar bagian, dibangun di atas primitif Separator milik Reka UI.
order: 12.75
---

## Penggunaan

::component-example{name="separator-basic"}
::

```vue-html
<p>Above the line</p>
<SSeparator />
<p>Below the line</p>
```

### Vertikal

`orientation="vertical"` membutuhkan tinggi nyata untuk diukur - flex row dengan tinggi tetap (atau `items-stretch`) memberinya satu:

::component-example{name="separator-vertical"}
::

```vue-html
<div class="flex h-5 items-center gap-3">
  <span>Docs</span>
  <SSeparator orientation="vertical" />
  <span>Utilities</span>
</div>
```

### Variant

`variant` mengganti gaya garis antara `solid` (default), `dashed`, `dotted`, dan `double` - cocok dengan keyword `border-style` CSS sendiri, karena itulah yang dipetakan di balik layar:

::component-example{name="separator-variant"}
::

```vue-html
<SSeparator variant="dashed" />
```

### Warna

Tidak seperti kebanyakan komponen di pustaka ini, `color` tidak dibatasi di belakang state fokus/hover - garis selalu terlihat, jadi ia mewarnai langsung. `neutral` (default) adalah warna border halus yang sama yang selalu digunakan komponen ini; yang lain memberi divider penekanan nyata:

::component-example{name="separator-color"}
::

```vue-html
<SSeparator color="danger" />
```

### Dengan label

Konten di slot default berada di tengah garis, membelahnya secara merata di kedua sisi:

::component-example{name="separator-label"}
::

```vue-html
<SSeparator>Or continue with</SSeparator>
```

### Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.separator`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Separator` sendiri:

::theme-source{name="separator"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` |
| `variant` | `'solid' \| 'dashed' \| 'dotted' \| 'double'` | `solid` |
| `color` | `'neutral' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `neutral` |
| `decorative` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'line' \| 'label', string \| object>>` | - |

`decorative` merender `role="none"` daripada default `role="separator"` - gunakan saat garis murni visual (di dalam toolbar, misalnya) daripada menandai break tematik nyata dalam konten.

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `default` | - | Label yang berada di tengah garis |
