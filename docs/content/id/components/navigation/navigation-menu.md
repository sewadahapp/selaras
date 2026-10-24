---
title: NavigationMenu
description: Navbar horizontal atau vertikal, dibangun di atas primitif NavigationMenu milik Reka UI.
order: 45
---

## Penggunaan

`items` adalah array datar - `label` diperlukan, sisanya opsional:

::component-example{name="navigation-menu-basic"}
::

```vue-html
<SNavigationMenu :items="[
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs' },
  { label: 'Pricing', to: '/pricing' },
]" />
```

### Ikon

Berikan item `icon` dan ia merender sebelum label-nya:

::component-example{name="navigation-menu-icons"}
::

```vue-html
<SNavigationMenu :items="[{ label: 'Home', icon: 'hugeicons:home-01', to: '/' }]" />
```

### Dengan children

Item dengan `children` merender sebagai trigger alih-alih link - mengklik (atau hover) membuka dropdown. Dropdown terbuka merender dalam satu viewport bersama di dalam NavigationMenu. Secara default, panel adalah daftar single-column kompak di bawah trigger aktifnya. Viewport mengubah ukuran saat Anda bergerak antar item top-level:

::component-example{name="navigation-menu-children"}
::

```vue-html
<SNavigationMenu :items="[
  { label: 'Products', children: [
    { label: 'Analytics', to: '/components/data/table' },
    { label: 'Automation', to: '/components/forms/validation' },
  ] },
]" />
```

Ini hanya satu level children - dropdown shared-viewport milik Reka sendiri tidak dibangun untuk nesting lebih dalam. Untuk tree dengan kedalaman arbitrari, gunakan [Vertical](#vertical) sebagai gantinya.

Untuk panel multi-column yang lebar, atur `contentOrientation="horizontal"`. Contoh ini menunjukkan layout itu dengan lebih banyak item, children, dan ikon:

::component-example{name="navigation-menu-full"}
::

```vue-html
<SNavigationMenu :items="items" content-orientation="horizontal" />
```

### Orientasi dan alignment konten

Untuk navigation bar horizontal, `contentOrientation="vertical"` adalah default: dropdown single-column kompak di bawah trigger aktifnya. `contentOrientation="horizontal"` beralih ke dropdown multi-column full-width. Navigation bar itu sendiri tetap horizontal dalam kedua layout.

::component-example{name="navigation-menu-content-orientation"}
::

```vue-html
<SNavigationMenu
  :items="items"
  :positioning="{ align: 'start' }"
/>
```

`positioning.align` menerima `start`, `center` (default), atau `end`. Start dan end mengikuti reading direction, dan panel kompak bergeser di tepi layar agar tetap terlihat. Gunakan `ui.content` untuk menyesuaikan lebarnya; viewport mengukur setiap panel yang terbuka dan mengubah ukuran bersamaannya.

Pengaturan ini hanya berlaku untuk horizontal navigation; alignment hanya memengaruhi compact dropdown-nya. Mereka tidak mengubah vertical accordions atau collapsed sidebar flyouts. Konfigurasi flyout tersebut melalui `popover`. `positioning` milik NavigationMenu saat ini hanya mendukung `align`, bukan set lengkap opsi positioning yang tersedia di Popover dan Dropdown.

### Item aktif

Item yang `to` cocok dengan route saat ini disorot secara otomatis, melalui state `active` link nyata milik Reka (`aria-current="page"` disertakan, bukan hanya class). `active` pada item itu sendiri mengoverride nilai auto-detection di kedua arah - berguna untuk route yang tidak dipetakan dengan rapi ke satu item `to`, atau untuk item non-navigasi yang tetap harus terlihat sebagai current:

::component-example{name="navigation-menu-active"}
::

```vue-html
<SNavigationMenu :items="[{ label: 'Docs', active: true }]" />
```

### Vertical

`orientation="vertical"` beralih ke tata letak atas-ke-bawah. Berbeda dengan horizontal dropdown single-level, vertical mendukung nesting arbitrari - setiap level dengan children merender sebagai grup accordion collapsible sendiri, tertutup secara default:

::component-example{name="navigation-menu-vertical"}
::

```vue-html
<SNavigationMenu :items="items" orientation="vertical" />
```

Pada skala yang lebih realistis - sidebar settings/docs-style, tiga level dalam, ikon di seluruhnya, mencampur leaf links dengan grup bersarang, plus item aktif dan disabled:

::component-example{name="navigation-menu-vertical-full"}
::

### Collapsed

`collapsed` (vertical saja) menciutkan setiap item hingga hanya ikonnya sendiri - icon rail, bentuk yang umum sidebar nav ambil saat collapsed. Label tetap ada di DOM untuk teknologi asistif (`sr-only`, tidak dihapus), jadi ini CSS-only dan tidak mengubah apa yang diumumkan screen reader. Parent dengan children merender sebagai themed flyout trigger alih-alih baris accordion yang dapat diperluas - tidak ada ruang untuk nested list dalam icon rail, jadi children-nya muncul di popover kecil di samping ikon, pola yang sama seperti collapsed sidebar umumnya gunakan di tempat lain:

::component-example{name="navigation-menu-collapsed"}
::

```vue-html
<SNavigationMenu :items="items" orientation="vertical" collapsed tooltip />
```

### Collapsed labels dan flyouts

Tambahkan `tooltip` untuk menunjukkan label leaf yang diciutkan saat hover atau keyboard focus. Teks default ke `ariaLabel`, lalu `label`. Item disabled, label grup, dan separator tidak menunjukkan tooltip. Menu yang diperluas dan horizontal tidak terpengaruh. Bungkus aplikasi Anda dalam `SApp` untuk menyediakan konteks tooltip bersama.

```vue-html
<SNavigationMenu
  :items="items"
  orientation="vertical"
  collapsed
  :tooltip="{ delayDuration: 150, arrow: false }"
  :popover="{ side: 'right', positioning: { sideOffset: 10 } }"
/>
```

Gunakan `tooltip: false` pada item untuk menonaktifkannya, atau objek seperti `tooltip: { text: 'Account settings', side: 'left' }` untuk mengoverride item itu. Pengaturan tooltip global dan item digabungkan, dengan pengaturan item mengambil prioritas. Tooltip default membuka segera di sisi kanan pada LTR dan kiri pada RTL. Link tetap menjadi trigger, mempertahankan navigasi, shortcut, dan slot item kustom.

Item dengan children tetap mempertahankan child flyout daripada menambahkan tooltip yang bersaing. `popover` mengonfigurasi sisi, alignment, positioning, portal, arrow, dan `ui`; `popover` pada item mengoverride pengaturan menu. Flyouts tetap diaktifkan dan mempertahankan perilaku hover, klik, dan keyboard. Sisi default juga mengikuti text direction.

### Labels dan separators

Item dapat menjadi link nyata (default), atau `type: 'label'`/`type: 'separator'` sebagai gantinya - section heading non-interaktif dan garis divider tipis, masing-masing. Keduanya hanyalah item dalam array datar yang sama, bukan struktur wrapping - "grup" tidak lebih dari item `label` diikuti oleh item yang diperkenalkannya:

::component-example{name="navigation-menu-labels"}
::

```vue-html
<SNavigationMenu :items="[
  { label: 'Guide', type: 'label' },
  { label: 'Introduction', to: '/introduction' },
  { label: 'Installation', to: '/installation' },
  { label: 'sep-1', type: 'separator' },
  { label: 'Components', type: 'label' },
  { label: 'Button', to: '/components/button' },
]" orientation="vertical" />
```

Dalam vertical rail yang diciutkan, heading tetap ada di DOM tetapi disembunyikan secara visual. Secara default, `collapsedGroups="separator"` menambahkan garis tipis antar bagian yang berisi. Gunakan `"spacing"` untuk gap atau `"none"` untuk tidak ada batas otomatis. Array `items` yang sama berfungsi saat expand dan collapse. Separator eksplisit masih menggambar garis dalam ketiga mode; rails yang diciutkan menghapus separator leading, trailing, dan berulang. Bagian kosong tidak menambahkan batas terlihat. Menu horizontal tidak berubah.

```vue-html
<SNavigationMenu :items="items" orientation="vertical" collapsed collapsed-groups="spacing" tooltip />
```

Gunakan `ui.separator`, `ui.groupSpacer`, dan `ui.collapsedGroupLabel` untuk menyesuaikan garis, gap, dan heading yang disembunyikan secara visual. Tidak ada yang menjadi fokusable menu actions; label link dan tooltip mempertahankan perilaku mereka yang ada.

Item `separator` masih membutuhkan `label` yang unik meskipun tidak pernah ditampilkan - setiap `label` item berfungsi ganda sebagai list key-nya. Top-level saja: array `children` tidak memeriksa `type`, jadi tree bersarang tidak dapat mengelompokkan children-nya sendiri di bawah sub-heading.

### Variant

`variant="pill"` (default) memberi item aktif background yang terisi; `variant="link"` hanya mengubah warna teks, tanpa background:

::component-example{name="navigation-menu-variant"}
::

```vue-html
<SNavigationMenu :items="items" variant="link" />
```

### Highlight

`highlight` menggambar bar kecil di samping item aktif, selain color styling-nya sendiri - garis di bawahnya dalam horizontal, atau di sampingnya dalam vertical:

::component-example{name="navigation-menu-highlight"}
::

```vue-html
<SNavigationMenu :items="items" highlight />
```

### Item disabled

`disabled` pada item membuatnya tetap terlihat tetapi non-interaktif - tidak ada navigasi, tidak ada `onSelect`, ditandai `aria-disabled`:

::component-example{name="navigation-menu-disabled"}
::

```vue-html
<SNavigationMenu :items="[{ label: 'Coming soon', disabled: true }]" />
```

### Shortcuts

`shortcut` menampilkan petunjuk Kbd di samping leaf item. Atur `hotkey: true` untuk mengikatnya, sehingga key mengaktifkan item itu dari mana saja di halaman. Ia tetap nonaktif saat seseorang mengetik di field. `mod` memetakan ke ⌘ pada macOS dan Ctrl pada platform lain. Leaf dapat menavigasi dengan `to` atau menjalankan `onSelect` seperti tombol.

::component-example{name="navigation-menu-shortcuts"}
::

```vue
<script setup lang="ts">
const lastAction = ref('')
const items = [
  { label: 'Overview', shortcut: 'mod+1', hotkey: true, onSelect: () => lastAction.value = 'Overview selected' },
  { label: 'Settings', shortcut: 'mod+2', hotkey: true, onSelect: () => lastAction.value = 'Settings selected' },
  { label: 'Help', shortcut: 'mod+/', onSelect: () => lastAction.value = 'Help selected' },
]
</script>

<template>
  <SNavigationMenu :items="items" />
</template>
```

Tekan ⌘1 atau ⌘2 (Ctrl pada platform lain) untuk memilih item. `Help` menunjukkan petunjuk tetapi tidak mengikat key karena menghilangkan `hotkey: true`.

### Warna

`color` mengikuti palet yang sama seperti setiap komponen lain di sini (`primary`, `neutral`, `secondary`, `success`, `danger`, `info`, `warning`) dan hanya memengaruhi item aktif:

::component-example{name="navigation-menu-color"}
::

```vue-html
<SNavigationMenu :items="items" color="secondary" />
```

### Kustomisasi konten

Setiap tempat rendering memiliki slot yang cocok, di-scope dengan data item itu sendiri - `item-leading`/`item-label`/`item-trailing` menggantikan satu bagian sekaligus, `item` menggantikan seluruh konten item, dan `item-content` menggantikan seluruh body dropdown, memungkinkan Anda membangun mega menu multi-column yang sesungguhnya daripada daftar single-column default:

Buka **Products** untuk melihat layout `item-content` umum, atau **Help** untuk melihat override `help-content` per-item.

::component-example{name="navigation-menu-custom"}
::

```vue-html
<SNavigationMenu :items="items" content-orientation="horizontal">
  <template #item-content="{ item }">
    <ul class="grid w-96 grid-cols-2 gap-2 p-2">
      <li v-for="child in item.children" :key="child.label">
        <NuxtLink :to="child.to">{{ child.label }}</NuxtLink>
      </li>
    </ul>
  </template>
</SNavigationMenu>
```

Setiap slot ini juga memiliki bentuk **per-item**: atur `slot` pada satu item dan ia menargetkan `#{slot}-content` (atau `-leading`/`-label`/`-trailing`) sebelum slot umum di atas - berguna ketika hanya satu atau dua item yang membutuhkan konten bespoke dan sisanya puas dengan default:

```vue-html
<SNavigationMenu :items="[{ label: 'Help', slot: 'help', children: [...] }]">
  <template #help-content="{ item }">
    <!-- only this item's dropdown uses this -->
  </template>
</SNavigationMenu>
```

`list-leading`/`list-trailing` duduk di luar daftar item sepenuhnya - berguna untuk logo atau tombol call-to-action di samping menu:

```vue-html
<SNavigationMenu :items="items">
  <template #list-leading>
    <img src="/logo.svg" class="h-6">
  </template>
  <template #list-trailing>
    <SButton size="sm">Sign up</SButton>
  </template>
</SNavigationMenu>
```

Slot yang sama bekerja identik dalam mode vertical.

### Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.navigationMenu`. Recursive accordion renderer dan collapsed flyout sengaja mengkonsumsi key yang sama; mereka adalah detail implementasi daripada theme surface terpisah.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `NavigationMenu` sendiri:

::theme-source{name="navigation-menu"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `items` | `NavigationMenuItem[]` | - (required) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `contentOrientation` | `'horizontal' \| 'vertical'` | `'vertical'` |
| `positioning` | `NavigationMenuPositioning` (`{ align?: 'start' \| 'center' \| 'end' }`) | `{ align: 'center' }` |
| `color` | [ColorRole](/overview/theming/color-roles) | `'primary'` |
| `variant` | `'pill' \| 'link'` | `'pill'` |
| `highlight` | `boolean` | `false` |
| `collapsed` | `boolean` | `false` |
| `collapsedGroups` | `'separator' \| 'spacing' \| 'none'` | `'separator'` |
| `tooltip` | `boolean \| TooltipProps` | `false` |
| `popover` | `NavigationMenuPopover` | - |
| `ui` | `Partial<Record<NavigationMenuSlot, string \| object>>` | - |

`NavigationMenuItem`:

| Field | Tipe | Deskripsi |
| --- | --- | --- |
| `label` | `string` | Required. |
| `icon` | `string` | Dirender sebelum label. |
| `to` | `string` | Route path untuk leaf item. |
| `disabled` | `boolean` | Terlihat tetapi non-interaktif. |
| `active` | `boolean` | Mengoverride route match yang terdeteksi otomatis. |
| `children` | `NavigationMenuItem[]` | Satu level untuk horizontal; kedalaman arbitrari untuk vertical. |
| `description` | `string` | Tidak dibaca oleh rendering default NavigationMenu - dibawa murni agar custom `#item-content`/`#{slot}-content` slot override dapat menampilkannya (deskripsi di bawah setiap link mega menu, misalnya) - lihat [Kustomisasi konten](#kustomisasi-konten), yang contoh langsungnya sudah merender field ini. |
| `onSelect` | `(event: Event) => void` | Terpicu saat leaf item diaktifkan. |
| `shortcut` | `string` | Menampilkan petunjuk Kbd di samping item. |
| `hotkey` | `boolean` | Mengikat `shortcut` di seluruh halaman, kecuali saat mengetik di field. |
| `slot` | `string` | Menargetkan slot named item itu sendiri sebelum slot umum - lihat [Kustomisasi konten](#kustomisasi-konten). |
| `type` | `'link' \| 'label' \| 'separator'` | `'link'` kecuali diatur - lihat [Labels dan separators](#labels-dan-separators). |

## Slots

| Slot | Scope | Deskripsi |
| --- | --- | --- |
| `item` | `{ item, active }` | Menggantikan seluruh konten item (icon+label, atau icon+label+chevron untuk trigger) |
| `item-leading` | `{ item, active }` | Menggantikan ikon depan |
| `item-label` | `{ item, active }` | Menggantikan teks label - juga satu-satunya slot yang digunakan oleh item `type: 'label'` |
| `item-trailing` | `{ item, active }` | Menggantikan trailing content (chevron, untuk trigger) |
| `item-content` | `{ item }` | Menggantikan seluruh body dropdown/accordion |
| `list-leading` | - | Dirender sebelum daftar item |
| `list-trailing` | - | Dirender setelah daftar item |

Setiap slot di atas juga memiliki bentuk per-item melalui `item.slot` - lihat [Kustomisasi konten](#kustomisasi-konten).
