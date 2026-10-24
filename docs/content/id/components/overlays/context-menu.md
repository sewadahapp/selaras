---
title: Context Menu
description: Menu klik-kanan, dibangun di atas primitif ContextMenu milik Reka UI.
order: 51.5
---

## Penggunaan

Klik-kanan area target - di mana saja di dalam slot default membuka menu pada posisi kursor, alih-alih pada elemen trigger tetap seperti cara `Dropdown`:

::component-example{name="context-menu-basic"}
::

```vue
<template>
  <SContextMenu
    :items="[
      [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
      [{ label: 'Delete', icon: 'hugeicons:delete-02' }],
    ]"
  >
    <div>Right-click here</div>
  </SContextMenu>
</template>
```

Item adalah array grup — separator dirender di antara setiap grup, bentuk yang sama seperti [Dropdown](/components/overlays/dropdown). `shortcut` merender petunjuk Kbd; atur `hotkey: true` untuk mengaktifkannya saat context menu terbuka.

### Shortcut

`shortcut` hanyalah petunjuk tampilan. Tambahkan `hotkey: true` untuk menjalankan aksi `onSelect` normal item saat context menu terbuka. Gunakan `mod` untuk ⌘ di macOS atau Ctrl di platform lain. Klik-kanan area contoh terlebih dahulu, lalu coba shortcut yang diaktifkan; item yang hanya memiliki `shortcut` tidak mengikat tombol.

::component-example{name="context-menu-shortcuts"}
::

```vue
<script setup lang="ts">
const lastAction = ref('')
const items = [[
  { label: 'Rename', shortcut: 'mod+e', hotkey: true, onSelect: () => lastAction.value = 'Rename selected' },
  { label: 'Share', shortcut: 'mod+shift+s', onSelect: () => lastAction.value = 'Share selected' },
]]
</script>

<template>
  <SContextMenu :items="items">
    <div>Right-click here</div>
  </SContextMenu>
</template>
```

### Konten item kustom

Slot `item` menggantikan label teks polos item dengan apa pun, di-scope dengan `item`, sehingga satu template dapat bervariasi per item. Komponen tetap merender `shortcut` setelah konten slot secara otomatis:

::component-example{name="context-menu-custom-item"}
::

```vue-html
<SContextMenu :items="items">
  <template #item="{ item }">
    <span class="flex-1">{{ item.label }}</span>
  </template>
  ...
</SContextMenu>
```

### Item destruktif

`destructive: true` men-style item untuk aksi bergaya hapus, flag tunggal yang sama dengan yang digunakan item milik `Dropdown`:

::component-example{name="context-menu-destructive"}
::

```vue-html
<SContextMenu
  :items="[
    [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
    [{ label: 'Delete', icon: 'hugeicons:delete-02', destructive: true }],
  ]"
>
  ...
</SContextMenu>
```

### Aksesibilitas

Mesin menu dasar yang sama seperti [Dropdown](/components/overlays/dropdown#accessibility): menu itu sendiri adalah `role="menu"` dengan setiap item sebagai `role="menuitem"`, <kbd>↑</kbd>/<kbd>↓</kbd> berpindah antar item (melewati kedua ujung), mengetik huruf melompat ke item cocok berikutnya, dan <kbd>Enter</kbd>/<kbd>Space</kbd> memilih yang disorot - <kbd>Escape</kbd> atau klik di luar menutup menu. Tekan-tahan sentuh/pen juga membukanya, bukan hanya klik-kanan mouse.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `ContextMenu` itu sendiri:

::theme-source{name="context-menu"}
::

### Positioning dan portal

ContextMenu berjangkar pada titik klik-kanan, sehingga tidak menerima `side` atau `align`. Prop `positioning`-nya mengontrol offset yang didukung dan perilaku collision. `portal` default ke body dokumen; atur ke `false` untuk merender inline atau berikan selector CSS atau `HTMLElement` sebagai target teleport.

```vue-html
<SContextMenu :items="items" :positioning="{ collisionPadding: 12 }" portal="#overlay-root">...</SContextMenu>
```

## Props

Atur `hotkey: true` bersama `shortcut` untuk mendaftarkan tombol yang ditampilkan saat context menu terbuka. Jika tidak, shortcut hanyalah petunjuk visual.

| Prop | Tipe | Default |
| --- | --- | --- |
| `items` | `{ label: string; icon?: string; disabled?: boolean; destructive?: boolean; onSelect?: () => void; shortcut?: string; hotkey?: boolean }[][]` | - |
| `positioning` | `ContextMenuPositioning` | default berjangkar-pointer |
| `portal` | `boolean \| string \| HTMLElement` | `true` (body dokumen) |
| `ui` | `Partial<Record<'content' \| 'item' \| 'icon' \| 'separator', string \| object>>` | - |


`class` yang diberikan ke `<SContextMenu>` digabungkan ke target konteks default-slot-nya. Gunakan `ui.content` untuk men-style menu mengambang.

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `default` | - | Area target klik-kanan |
| `item` | `{ item }` | Menggantikan konten label item |
