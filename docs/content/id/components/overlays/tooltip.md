---
title: Tooltip
description: Petunjuk singkat yang tampil saat hover atau fokus, dibangun di atas primitif Tooltip milik Reka UI.
order: 52
---

## Penggunaan

::component-example{name="tooltip-basic"}
::

```vue
<template>
  <STooltip text="I'm a tooltip">
    <SButton variant="outline">
      Hover me
    </SButton>
  </STooltip>
</template>
```

Membutuhkan `<SApp>` di sekitar `app.vue` root Anda (sudah dilakukan oleh shell situs docs ini) - ia membangun `TooltipProvider` bersama milik Reka UI, sehingga berpindah cepat di antara tooltip yang berdekatan melewati delay penuh untuk kedua kalinya, alih-alih setiap tooltip menunggu `delayDuration` secara independen.

### Shortcut keyboard

`kbds` merender deretan badge tombol kecil di samping teks - berguna untuk menampilkan shortcut pada aksi yang sudah dilakukan button. Ia menerima simbol literal untuk ditampilkan, bukan nama tombol semantik - tidak ada pemetaan khusus platform (misalnya `'meta'` ke `⌘`) bawaan, jadi berikan apa pun yang ingin ditampilkan (`['⌘', 'S']`, `['Ctrl', 'S']`, ...).

::component-example{name="tooltip-kbds"}
::

```vue-html
<STooltip text="Save" :kbds="['⌘', 'S']">
  <SButton variant="outline">Save</SButton>
</STooltip>
```

### Menonaktifkan dan arrow

`disabled` menekan tooltip sepenuhnya (ia tidak pernah terbuka); `arrow="false"` menyembunyikan segitiga pointer kecil untuk tooltip mengambang polos. Objek dapat mengatur lebar, tinggi, dan clearance sudut (`padding`) milik arrow:

```vue-html
<STooltip text="Won't show" disabled>...</STooltip>
<STooltip text="No arrow" :arrow="false">...</STooltip>
<STooltip text="Wide arrow" :arrow="{ width: 16, height: 8, padding: 12 }">...</STooltip>
```

### Konten kustom

Slot `content` menggantikan prop `text` teks polos dengan apa pun - berguna untuk petunjuk yang lebih kaya daripada yang bisa diberikan satu baris teks:

```vue-html
<STooltip>
  <SButton variant="outline">
    Hover me
  </SButton>
  <template #content>
    <span class="flex items-center gap-1">
      <SIcon name="hugeicons:information-circle" />
      Custom content
    </span>
  </template>
</STooltip>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `Tooltip` itu sendiri:

::theme-source{name="tooltip"}
::

### Positioning dan portal

Gunakan `positioning` untuk side, alignment, offset, dan perilaku collision milik tooltip. Ia mengoverride prop `side` top-level yang lebih lama ketika keduanya diberikan. `portal` default ke body dokumen; atur ke `false` untuk merender inline atau berikan selector CSS atau `HTMLElement` sebagai target teleport. `ui.content` mengontrol styling, sementara `#content` menyediakan konten kustom.

```vue-html
<STooltip text="Help" :positioning="{ side: 'bottom', align: 'end' }" portal="#overlay-root">...</STooltip>
```

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `text` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `top` |
| `positioning` | `OverlayPositioning` | default tooltip |
| `portal` | `boolean \| string \| HTMLElement` | `true` (body dokumen) |
| `delayDuration` | `number` | `200` |
| `kbds` | `string[]` | - |
| `arrow` | `boolean \| ArrowConfig` | `true` |
| `disabled` | `boolean` | `false` |
| `ui` | `Partial<Record<'content' \| 'arrow' \| 'kbds' \| 'kbd', string \| object>>` | - |


`class` yang diberikan ke `<STooltip>` digabungkan ke elemen trigger default-slot-nya. Gunakan `ui.content` untuk men-style tooltip mengambang.

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Elemen trigger |
| `content` | Menggantikan `text` teks polos dengan konten kustom |
