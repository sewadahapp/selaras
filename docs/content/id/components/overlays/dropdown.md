---
title: Dropdown
description: Menu berisi aksi yang dikelompokkan, dibangun di atas primitif DropdownMenu milik Reka UI.
order: 51
---

## Penggunaan

::component-example{name="dropdown-basic"}
::

```vue
<template>
  <SDropdown
    :items="[
      [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
      [{ label: 'Delete', icon: 'hugeicons:delete-02' }],
    ]"
  >
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
```

Item adalah array grup — separator dirender di antara setiap grup. Item dapat menjalankan aksi `onSelect` atau bernavigasi melalui `to` (termasuk URL eksternal, dengan `target`/`rel` bila diperlukan). `shortcut` merender petunjuk Kbd; atur `hotkey: true` untuk mengikatnya saat dropdown terbuka.

### Grup dan separator

`items` adalah `DropdownItem[][]`: setiap array dalam adalah satu grup. Selaras menambahkan separator di antara grup; item dalam grup yang sama tidak memiliki separator di antaranya. Tidak ada item `type: 'separator'` terpisah dalam API ini. Pisahkan item ke array dalam lain di mana pun batas seharusnya berada.

::component-example{name="dropdown-groups"}
::

```vue
<script setup lang="ts">
const lastAction = ref('')
const profile = { label: 'Profile', onSelect: () => lastAction.value = 'Profile selected' }
const signOut = { label: 'Sign out', onSelect: () => lastAction.value = 'Sign out selected' }
</script>

<template>
  <!-- Dua grup: separator muncul di antara Profile dan Sign out. -->
  <SDropdown :items="[[profile], [signOut]]">
    <SButton variant="outline">
      Two groups
    </SButton>
  </SDropdown>

  <!-- Satu grup: tidak ada separator yang muncul di antara kedua item. -->
  <SDropdown :items="[[profile, signOut]]">
    <SButton variant="outline">
      One group
    </SButton>
  </SDropdown>
</template>
```

Gunakan `ui.separator` untuk mengubah styling separator. Ini berlaku untuk menu berjangkar dan modal mobile adaptif:

```vue-html
<SDropdown :items="[[profile], [signOut]]" :ui="{ separator: 'my-2' }">
  <SButton>Account</SButton>
</SDropdown>
```

### Shortcut dan link

`shortcut` hanya menampilkan petunjuk. Tambahkan `hotkey: true` untuk mengaktifkan item dengan tombol itu saat dropdown ini terbuka. Gunakan `mod` untuk modifier utama platform (⌘ di macOS, Ctrl di tempat lain). Item dengan `to` bernavigasi sebagai link lewat mouse, seleksi keyboard, atau shortcut; item aksi memanggil `onSelect` melalui jalur seleksi yang sama.

::component-example{name="dropdown-shortcuts"}
::

```vue
<script setup lang="ts">
const lastAction = ref('')
const items = [[
  { label: 'Save draft', icon: 'hugeicons:floppy-disk', shortcut: 'mod+s', hotkey: true, onSelect: () => lastAction.value = 'Saved draft' },
  { label: 'Preview', shortcut: 'mod+p', onSelect: () => lastAction.value = 'Preview opened' },
  { label: 'Documentation', to: '/components/overlays/context-menu', shortcut: 'mod+shift+d', hotkey: true },
]]
</script>

<template>
  <SDropdown :items="items">
    <SButton variant="outline">
      Open actions
    </SButton>
  </SDropdown>
</template>
```

Dalam contoh ini, `Save draft` dan `Documentation` merespons shortcut mereka; `Preview` hanya menampilkan petunjuk. Buka dropdown sebelum menekan shortcut menu.

### Konten item kustom

Slot `item` menggantikan label teks polos item dengan apa pun, di-scope dengan `item`, sehingga satu template dapat bervariasi per item. Komponen tetap merender `shortcut` setelah konten slot secara otomatis:

::component-example{name="dropdown-custom-item"}
::

```vue-html
<SDropdown :items="items">
  <template #item="{ item }">
    <span class="flex-1">{{ item.label }}</span>
  </template>
  ...
</SDropdown>
```

### Item destruktif

`destructive: true` men-style item untuk aksi bergaya hapus (teks danger, hover bernuansa danger) - hanya flag ini alih-alih pilihan warna penuh, karena item menu secara realistis hanya membutuhkan satu kasus khusus ini:

::component-example{name="dropdown-destructive"}
::

```vue-html
<SDropdown
  :items="[
    [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
    [{ label: 'Delete', icon: 'hugeicons:delete-02', destructive: true }],
  ]"
>
  ...
</SDropdown>
```

### Arrow

`arrow` menampilkan segitiga pointer kecil yang menghubungkan menu ke trigger-nya. Berikan objek untuk mengonfigurasi lebar, tinggi, ujung membulat, atau clearance sudut (`padding`):

::component-example{name="dropdown-arrow"}
::

```vue-html
<SDropdown :items="items" arrow>...</SDropdown>
<SDropdown :items="items" :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }">...</SDropdown>
```

### Presentasi mobile adaptif

Atur `adaptive` untuk menampilkan daftar aksi dalam modal di layar kecil sambil menjaga menu berjangkar di layar lebih besar. Ini opt-in; link, action handler, grup, slot item, dan petunjuk shortcut berfungsi di kedua presentasi. Modal menggunakan button dan link biasa, sehingga pengguna sentuh mendapat target lebih besar dan pengguna keyboard dapat berpindah antar aksi dengan Tab. Escape dan backdrop menutupnya dan mengembalikan fokus ke trigger.

::component-example{name="dropdown-adaptive"}
::

### Aksesibilitas

Dropdown merender primitif DropdownMenu milik Reka UI, sehingga semantik aksesibilitas berasal dari sana alih-alih diimplementasikan ulang di sini: trigger mengekspos `aria-haspopup`/`aria-expanded`, menu itu sendiri adalah `role="menu"` dengan setiap item sebagai `role="menuitem"`, <kbd>↑</kbd>/<kbd>↓</kbd> berpindah antar item (melewati kedua ujung), mengetik huruf melompat ke item cocok berikutnya, dan <kbd>Enter</kbd>/<kbd>Space</kbd> memilih yang disorot - <kbd>Escape</kbd> atau klik di luar menutup menu dan mengembalikan fokus ke trigger. Dengan `adaptive` di layar kecil, daftar aksi menjadi dialog berisi link dan button native; fokus mengikuti urutan Tab normal dialog alih-alih navigasi tombol panah menu.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema menu itu sendiri:

::theme-source{name="dropdown"}
::

### Positioning dan portal

Gunakan `positioning` untuk side, alignment, offset, dan perilaku collision menu. `portal` default ke body dokumen; atur ke `false` untuk merender inline atau berikan selector CSS atau `HTMLElement` sebagai target teleport. `ui.content` tetap menjadi override styling.

```vue-html
<SDropdown :items="items" :positioning="{ side: 'top', align: 'end' }" portal="#overlay-root">...</SDropdown>
```

## Props

Untuk bentuk array `items`, lihat [Grup dan separator](#grup-dan-separator). Untuk item link, gunakan `to` dengan `target` dan `rel` opsional. Petunjuk shortcut hanya tampilan kecuali `hotkey: true` diatur.

| Prop | Tipe | Default |
| --- | --- | --- |
| `open` | `boolean` | tidak terkontrol (awalnya tertutup) |
| `defaultOpen` | `boolean` | `false` |
| [`items`](#grup-dan-separator) | `{ label: string; icon?: string; disabled?: boolean; destructive?: boolean; onSelect?: () => void; to?: string; target?: string; rel?: string; shortcut?: string; hotkey?: boolean }[][]` | - |
| `arrow` | `boolean \| RoundedArrowConfig` | `false` |
| `positioning` | `OverlayPositioning` | default menu |
| `portal` | `boolean \| string \| HTMLElement` | `true` (body dokumen) |
| `adaptive` | `boolean` | `false` |
| `ui` | `Partial<Record<'content' \| 'item' \| 'icon' \| 'separator' \| 'arrow' \| 'mobileList' \| 'mobileGroup', string \| object>>` | - |


`class` yang diberikan ke `<SDropdown>` digabungkan ke elemen trigger default-slot-nya. Gunakan `ui.content` untuk men-style menu mengambang.

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `default` | - | Elemen trigger |
| `item` | `{ item }` | Menggantikan konten label item |

### Visibilitas awal dan terkontrol

`defaultOpen` mengatur visibilitas awal ketika `open` dihilangkan. Gunakan `v-model:open` ketika parent memiliki visibilitas; `update:open` mengusulkan perubahan tanpa mengoverride nilai parent. Mengubah `defaultOpen` setelah mount tidak mengontrol overlay.

## Events

| Event | Payload | Tujuan |
| --- | --- | --- |
| `update:open` | `boolean` | Meminta membuka atau menutup menu atau modal adaptif |
