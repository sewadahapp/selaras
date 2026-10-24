---
title: Command Palette
description: Overlay cari-dan-jalankan ala ⌘K - pencarian fuzzy lintas perintah yang dikelompokkan, dapat dinavigasi keyboard, dibuka dari mana saja.
order: 54.5
---

## Penggunaan

Letakkan `SCommandPalette` sekali (layout root Anda tempat yang bagus) dan kendalikan dari mana saja dengan `useCommandPalette()` - pola composable-driven yang sama seperti `useModal()`/`useSlideover()`. Tekan <kbd>⌘</kbd><kbd>K</kbd> (atau <kbd>Ctrl</kbd><kbd>K</kbd>) untuk membukanya juga - shortcut itu terikat otomatis, tidak ada yang perlu dihubungkan sendiri:

::component-example{name="command-palette-basic"}
::

```vue
<script setup lang="ts">
const palette = useCommandPalette()

const groups = [
  {
    label: 'Actions',
    items: [
      { label: 'New file', icon: 'hugeicons:file-add', shortcut: 'mod+n', hotkey: true, onSelect: () => {} },
      { label: 'New folder', icon: 'hugeicons:folder-add', onSelect: () => {} },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { label: 'Go to settings', icon: 'hugeicons:settings-01', shortcut: 'mod+,', hotkey: true, onSelect: () => {} },
      { label: 'Go to profile', icon: 'hugeicons:user', onSelect: () => {} },
    ],
  },
]
</script>

<template>
  <SButton @click="palette.open()">
    Open command palette
  </SButton>
  <SCommandPalette :groups="groups" />
</template>
```

`items` adalah array grup, bentuk yang sama seperti [Dropdown](/components/overlays/dropdown)/[ContextMenu](/components/overlays/context-menu) - separator (di sini, label grup kecil) di antara setiap grup. Mengetik memfilter setiap item dengan fuzzy match ringan (bukan pemeriksaan substring polos) - "nf" cocok dengan "New File" - dan hasil di-rerank live saat query berubah; pencarian kosong menjaga urutan authoring masing-masing grup alih-alih mengacak tampilan default.

### Shortcut item

`shortcut` milik item dirender via [Kbd](/components/elements/kbd) sebagai petunjuk tampilan. Tambahkan `hotkey: true` untuk mengikatnya saat palette terbuka; perilaku seleksi normal item berjalan dan palette menutup. Gunakan `mod` untuk menampilkan ⌘ di macOS dan Ctrl di platform lain. Contoh live di atas menyertakan shortcut yang diaktifkan untuk membuat file dan membuka settings, plus item yang tidak menampilkan petunjuk sehingga tidak memiliki shortcut khusus item:

```vue-html
{ label: 'New file', shortcut: 'mod+n', hotkey: true, onSelect: () => {} }
```

### Menonaktifkan shortcut bawaan

Atur `:shortcut="false"` jika Anda lebih suka menghubungkan trigger sendiri (item menu, kombo tombol berbeda) alih-alih binding <kbd>⌘</kbd><kbd>K</kbd>/<kbd>Ctrl</kbd><kbd>K</kbd> otomatis - `useCommandPalette().open()` tetap berfungsi dari mana saja.

```vue-html
<SCommandPalette :groups="groups" :shortcut="false" />
```

### Interaksi keyboard

<kbd>↑</kbd>/<kbd>↓</kbd> memindahkan hasil yang disorot (melewati kedua ujung, melewati item disabled), <kbd>Enter</kbd> menjalankan `onSelect` item yang disorot dan menutup palette, <kbd>Esc</kbd> atau klik di luar menutupnya tanpa menjalankan apa pun.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema palette itu sendiri:

::theme-source{name="command-palette"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `groups` | `{ label?: string; items: { label: string; icon?: string; shortcut?: string; hotkey?: boolean; disabled?: boolean; onSelect?: () => void }[] }[]` | - |
| `open` | `boolean` | - |
| `shortcut` | `boolean` | `true` |
| `ui` | `Partial<Record<CommandPaletteSlot, string \| object>>` | - |

### Beberapa instance

Berikan `v-model:open` jika Anda membutuhkan palette kedua yang dikontrol independen (daftar `groups` berbeda, di-scope ke sebagian aplikasi) alih-alih satu instance bersama:

```vue-html
<SCommandPalette v-model:open="open" :groups="scopedGroups" />
```

Instance ini berhenti bereaksi terhadap `useCommandPalette()` sepenuhnya - state `open`/`close`/Cmd-K miliknya sepenuhnya lokal. Default (tanpa prop `open`) tetap terhubung ke singleton bersama yang dijelaskan di atas, yang merupakan yang Anda inginkan untuk satu palette seluruh aplikasi.

## `useCommandPalette()`

| Member | Tipe | Deskripsi |
| --- | --- | --- |
| `isOpen` | `Ref<boolean>` | State terbuka bersama |
| `open` | `() => void` | Membukanya |
| `close` | `() => void` | Menutupnya |
| `toggle` | `() => void` | Membaliknya |
