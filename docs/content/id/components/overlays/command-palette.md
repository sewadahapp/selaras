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

### Hasil dari server (eksternal)

Secara default palette memfilter setiap item secara lokal dengan fuzzy match.
Untuk mencari dataset besar atau remote, ikat `v-model:search-term` untuk
membaca query yang diketik dan menggerakkan sumber data Anda sendiri, lalu
tandai grup yang diisinya dengan `ignoreFilter` agar palette merender item
tersebut apa adanya (urutan saat diterima) alih-alih memfilter ulang. Atur
`loading` saat permintaan berjalan untuk menampilkan spinner di baris input -
ini tidak pernah memblokir pengetikan atau seleksi:

```vue
<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

const actions = [
  { label: 'Buka pengaturan', onSelect: () => navigateTo('/settings') },
]
const searchTerm = ref('')
const debounced = refDebounced(searchTerm, 200)
const { data, status } = useFetch<{ label: string }[]>('/api/search', {
  query: { q: debounced },
  server: false,
})

const groups = computed(() => [
  { label: 'Actions', items: actions }, // difilter oleh palette
  { label: 'Results', ignoreFilter: true, items: data.value ?? [] }, // sudah difilter oleh server
])
</script>

<template>
  <SCommandPalette v-model:search-term="searchTerm" :groups="groups" :loading="status === 'pending'" />
</template>
```

`searchTerm` dikosongkan otomatis setiap kali palette ditutup. `ignoreFilter`
juga bisa dipasang di komponen untuk menonaktifkan filter lokal pada semua grup;
`ignoreFilter: false` pada sebuah grup mengambil alih default itu. Navigasi
keyboard, hotkey item, dan kondisi "No results found" bekerja lintas grup yang
difilter maupun yang tidak.

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
| `groups` | `{ label?: string; ignoreFilter?: boolean; items: { label: string; icon?: string; shortcut?: string; hotkey?: boolean; disabled?: boolean; onSelect?: () => void }[] }[]` | - |
| `open` | `boolean` | - |
| `shortcut` | `boolean` | `true` |
| `searchTerm` | `string` | - |
| `ignoreFilter` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `ui` | `Partial<Record<CommandPaletteSlot, string \| object>>` | - |

### Beberapa instance

Berikan `v-model:open` jika Anda membutuhkan palette kedua yang dikontrol independen (daftar `groups` berbeda, di-scope ke sebagian aplikasi) alih-alih satu instance bersama:

```vue-html
<SCommandPalette v-model:open="open" :groups="scopedGroups" />
```

Instance ini berhenti bereaksi terhadap `useCommandPalette()` sepenuhnya - state `open`/`close`/Cmd-K miliknya sepenuhnya lokal. Default (tanpa prop `open`) tetap terhubung ke singleton bersama yang dijelaskan di atas, yang merupakan yang Anda inginkan untuk satu palette seluruh aplikasi.

## Events

| Event | Payload | Tujuan |
| --- | --- | --- |
| `update:open` | `boolean` | Menopang `v-model:open` - meminta palette terbuka atau tertutup |
| `update:searchTerm` | `string` | Menopang `v-model:search-term` - dipicu setiap ketikan dan saat ditutup (dengan `''`) |

## `useCommandPalette()`

| Member | Tipe | Deskripsi |
| --- | --- | --- |
| `isOpen` | `Ref<boolean>` | State terbuka bersama |
| `open` | `() => void` | Membukanya |
| `close` | `() => void` | Menutupnya |
| `toggle` | `() => void` | Membaliknya |
