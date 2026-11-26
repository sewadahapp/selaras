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

## Menggulir lewat kode

Ref komponen menyediakan `viewport`, yaitu elemen HTML yang menggulir.
Gunakan setelah komponen terpasang, misalnya dari penangan klik.

```vue
<script setup lang="ts">
const area = useTemplateRef('area')

function scrollToBottom() {
  const viewport = area.value?.viewport
  viewport?.scrollTo({ top: viewport.scrollHeight })
}
</script>

<template>
  <SScrollArea ref="area" class="h-32">
    <p v-for="i in 15" :key="i">
      Line {{ i }}
    </p>
  </SScrollArea>
  <SButton @click="scrollToBottom">
    Ke bagian bawah
  </SButton>
</template>
```

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot - berikut adalah file tema `ScrollArea` sendiri:

Global dan scoped theme recipes menggunakan `ui.scrollArea`.

::theme-source{name="scroll-area"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` |
| `type` | `'auto' \| 'always' \| 'scroll' \| 'hover' \| 'glimpse'` | `'hover'` |
| `scrollHideDelay` | `number` | `600` ms |
| `dir` | `'ltr' \| 'rtl'` | Dari aplikasi |
| `ui` | `Partial<Record<ScrollAreaSlot, string \| object>>` | - |

Atur default untuk `type`, `scrollHideDelay`, dan `dir` di
`app.config.selaras.defaults.scrollArea`.

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Konten yang dapat digulir |
