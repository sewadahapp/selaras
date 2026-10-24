---
title: ScrollArea
description: Wilayah dapat digulir bertema, dibangun di atas primitif ScrollArea milik Reka UI.
order: 65
---

## Penggunaan

::component-example{name="scroll-area-basic"}
::

```vue-html
<SScrollArea class="h-32">
  <div class="flex flex-col gap-2 p-3">
    <p v-for="i in 15" :key="i">Line {{ i }}</p>
  </div>
</SScrollArea>
```

Berikan tinggi melalui `class` (fallthrough) - `SScrollArea` mengisi kotak apa pun tempat ia ditempatkan. [PageAside](/composites/documentation/page-aside) menggunakan ini secara internal untuk body yang dapat digulir.

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot - berikut adalah file tema `ScrollArea` sendiri:

Global dan scoped theme recipes menggunakan `ui.scrollArea`.

::theme-source{name="scroll-area"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` |
| `ui` | `Partial<Record<ScrollAreaSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Konten yang dapat digulir |
