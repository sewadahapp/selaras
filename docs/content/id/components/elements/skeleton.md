---
title: Skeleton
description: Blok placeholder bertema untuk konten yang masih loading.
order: 12.5
---

## Penggunaan

`Skeleton` tidak memiliki prop shape sendiri - baris teks, avatar melingkar, blok persegi panjang semuanya hanya sizing `class`/`ui` yang berbeda, cara yang sama seperti sizing bekerja di seluruh pustaka ini:

::component-example{name="skeleton-basic"}
::

```vue-html
<SSkeleton class="h-4 w-full" />
<SSkeleton class="h-4 w-full" />
<SSkeleton class="h-4 w-2/3" />
```

### Animasi

`animation` memilih antara `pulse` (default - fading opacity) dan `shimmer` (gradien menyapu melintasi blok):

::component-example{name="skeleton-shimmer"}
::

```vue-html
<SSkeleton animation="shimmer" class="h-4 w-full" />
```

Keduanya secara otomatis menghormati `prefers-reduced-motion` - tidak ada yang perlu diopt-in atau dikonfigurasi.

### Menyusun placeholder

Avatar melingkar di samping beberapa baris teks - `rounded-full` pada blok persegi memberikan lingkaran, sisanya adalah tata letak:

::component-example{name="skeleton-card"}
::

```vue-html
<div class="flex items-center gap-3">
  <SSkeleton class="size-10 rounded-full" />
  <div class="flex flex-col gap-2">
    <SSkeleton class="h-3 w-32" />
    <SSkeleton class="h-3 w-48" />
  </div>
</div>
```

### Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.skeleton`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Skeleton` sendiri:

::theme-source{name="skeleton"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `animation` | `'pulse' \| 'shimmer'` | `pulse` |
| `ui` | `Partial<Record<'base', string \| object>>` | - |
