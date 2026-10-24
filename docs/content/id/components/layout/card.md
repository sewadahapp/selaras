---
title: Card
description: Container sederhana untuk mengelompokkan konten yang terkait.
order: 66
---

## Penggunaan

::component-example{name="card-basic"}
::

```vue-html
<SCard>
  A card is a simple container for grouping related content.
</SCard>
```

### Header dan footer

`header` dan `footer` opsional - masing-masing hanya merender (dengan border pemisahnya sendiri) saat Anda benar-benar meneruskannya:

::component-example{name="card-header-footer"}
::

```vue-html
<SCard>
  <template #header>
    <p class="font-semibold text-[var(--selaras-resolved-text-default)]">Delete project</p>
  </template>

  This action cannot be undone. All data associated with this project
  will be permanently removed.

  <template #footer>
    <div class="flex justify-end gap-2">
      <SButton variant="ghost">Cancel</SButton>
      <SButton color="danger">Delete</SButton>
    </div>
  </template>
</SCard>
```

### Variant

::component-example{name="card-variants"}
::

```vue-html
<SCard variant="outline">
  <!-- bordered, no shadow -->
</SCard>
<SCard variant="solid">
  <!-- elevated, no border -->
</SCard>
<SCard variant="soft">
  <!-- subtle tinted background -->
</SCard>
<SCard variant="subtle">
  <!-- tinted background, plus a border -->
</SCard>
```

### Blog post

Badge `header` dan byline `footer`, dibangun seluruhnya dari komponen Selaras lainnya:

::component-example{name="card-blog-post"}
::

```vue-html
<SCard class="w-80">
  <template #header>
    <SBadge label="Design" color="primary" variant="soft" />
  </template>

  <h3 class="font-semibold text-[var(--selaras-resolved-text-default)]">
    Building a scalable design token system
  </h3>
  <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
    A look at how semantic tokens keep a component library themeable
    without ever touching a single component file.
  </p>

  <template #footer>
    <div class="flex items-center gap-2">
      <SAvatar text="JS" size="sm" />
      <div class="text-sm leading-tight">
        <p class="font-medium text-[var(--selaras-resolved-text-default)]">Jane Smith</p>
        <p class="text-[var(--selaras-resolved-text-muted)]">Mar 12, 2026</p>
      </div>
    </div>
  </template>
</SCard>
```

### Product

Mengganti `ui.body` ke `p-0` memungkinkan gambar full-bleed duduk rata dengan tepi card, dengan wrapper padded Anda sendiri di bawahnya untuk detail:

::component-example{name="card-product"}
::

```vue-html
<SCard :ui="{ body: 'p-0' }" class="w-64">
  <img
    src="https://picsum.photos/seed/selaras-headphones/400/300"
    alt="Wireless headphones"
    class="aspect-[4/3] w-full object-cover"
  >
  <div class="flex flex-col gap-1 p-4">
    <p class="font-medium text-[var(--selaras-resolved-text-default)]">Wireless headphones</p>
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">Noise-cancelling, 30-hour battery life</p>
    <div class="mt-2 flex items-center justify-between">
      <span class="font-semibold text-[var(--selaras-resolved-text-default)]">$129</span>
      <SButton size="sm">Add to cart</SButton>
    </div>
  </div>
</SCard>
```

## Dalam markdown

Setiap komponen Selaras sudah terdaftar secara global di bawah nama berawalan `S` - blok `::s-card{...}` kosan berfungsi tanpa wiring tambahan (lihat bagian "In markdown" di [Callout](/components/typography/callout) untuk cara kerja pola secara umum). Slot named `header`/`footer` masing-masing adalah baris `#slot-name` di dalam blok, konvensi `@nuxtjs/mdc` sendiri:

```text
::s-card
#header
Design
#footer
Posted March 2026
::
```

Blok yang mencampur penanda `header`/`footer` dengan teks body yang tidak ditandai tidak memisahkan keduanya dengan andal - dikonfirmasi secara empiris, bukan hanya tidak didokumentasikan - jadi pertahankan card yang ditulis di markdown hanya ke slot named saja; gunakan `<SCard>` langsung di file `.vue` setelah body membutuhkan teksnya sendiri.

## Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.card`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Card` sendiri:

::theme-source{name="card"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `variant` | `'outline' \| 'solid' \| 'soft' \| 'subtle'` | `'outline'` |
| `ui` | `Partial<Record<CardSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| `header` | Konten opsional di atas body, dipisahkan oleh border. Hanya dirender saat diberikan. |
| default | Konten body card. |
| `footer` | Konten opsional di bawah body, dipisahkan oleh border. Hanya dirender saat diberikan. |
