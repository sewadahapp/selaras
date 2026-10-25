---
title: Splitter
components: [SSplitterPanel, SSplitterResizeHandle]
description: Tata letak split-pane yang dapat diubah ukurannya - seret handle untuk mengubah ukuran, dibangun di atas primitif resizable-panel milik Reka UI.
order: 68
---

## Penggunaan

::component-example{name="splitter-basic"}
::

```vue-html
<SSplitter>
  <SSplitterPanel :default-size="30" :min-size="20">Panel one</SSplitterPanel>
  <SSplitterResizeHandle />
  <SSplitterPanel :min-size="20">Panel two</SSplitterPanel>
</SSplitter>
```

Tiga komponen digunakan bersamaan - `SSplitter` (grupnya), satu `SSplitterPanel` per pane, dan satu `SSplitterResizeHandle` di antara setiap pasangan panel yang ingin draggable. Ukuran default adalah persentase dari total grup (`sizeUnit="%"` pada `SSplitterPanel`); berikan `sizeUnit="px"` untuk panel berbasis pixel sebagai gantinya. `defaultSize` berbasis pixel juga diterapkan pada layout server-rendered, sebelum grup mengukur container-nya. [DashboardSidebar](/composites/dashboard/dashboard-sidebar) menggunakan ini untuk menjaga lebar default 260px sementara panel utama memenuhi ruang yang tersisa.

`SSplitterPanel` tidak memiliki visual styling sendiri di luar clipping overflow-nya - penampilan panel sepenuhnya bergantung pada apa yang digunakan, diserahkan kepada konsumen.

### Collapsible panels

Panel dengan `collapsible` tertutup sepenuhnya saat diseret melewati `minSize` sendiri, hingga `collapsedSize` (`0` secara default - sepenuhnya tersembunyi). Panggil `.collapse()`/`.expand()` pada template ref untuk melakukan hal yang sama secara programatik - lihat source [DashboardSidebar](/composites/dashboard/dashboard-sidebar) untuk contoh nyata, yang digerakkan oleh tombol di tempat lain di halaman daripada gesture seret.

Slot default `SSplitterPanel` di-scope dengan `{ isCollapsed, isExpanded, collapse, expand }` - fungsi `collapse()`/`expand()` yang sama seperti metode template-ref di atas, plus boolean `isCollapsed`/`isExpanded` live, sehingga konten di dalam panel dapat bereaksi terhadap (atau memicu) state collapse tanpa memerlukan ref sama sekali:

```vue-html
<SSplitterPanel collapsible :collapsed-size="0">
  <template #default="{ isCollapsed, expand }">
    <button v-if="isCollapsed" @click="expand()">Expand</button>
    <p v-else>Panel content</p>
  </template>
</SSplitterPanel>
```

### Persistence

`autoSaveId` (pada `SSplitter`) mengingat ukuran setiap panel di seluruh reload, melalui `localStorage` secara default - berikan objek `storage` kustom (apa pun yang berbentuk `{ getItem, setItem }`) untuk persist di tempat lain, mekanisme yang sama yang [DashboardGroup](/composites/dashboard/dashboard-group) gunakan untuk persist ke cookie. Storage mana pun yang digunakan, layout yang diingat hanya diterapkan setelah mounting, bukan selama SSR - pemanggilan restore layout milik Reka sendiri berjalan di dalam callback `watch()`, yang SSR render pass Vue tidak flush.

## Custom `:ui`

Masing-masing dari tiga komponen menjaga file tema sendiri. Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot - berikut mereka:

### Splitter

::theme-source{name="splitter"}
::

### SplitterPanel

`SplitterPanel` tidak memiliki visual styling sendiri di luar clipping overflow (lihat [Penggunaan](#penggunaan) di atas), tetapi slot masih ada untuk di-override jika Anda perlu menambahkan milik Anda sendiri:

::theme-source{name="splitter-panel"}
::

### SplitterResizeHandle

::theme-source{name="splitter-resize-handle"}
::

## Props

### Splitter

| Prop | Tipe | Default |
| --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `autoSaveId` | `string` | - |
| `keyboardResizeBy` | `number` | `10` |
| `storage` | `{ getItem, setItem }` | - (default `localStorage`-backed milik Reka) |
| `ui` | `Partial<Record<'root', string \| object>>` | - |

### SplitterPanel

| Prop | Tipe | Default |
| --- | --- | --- |
| `defaultSize` | `number` | - |
| `minSize` | `number` | - |
| `maxSize` | `number` | - |
| `collapsedSize` | `number` | - |
| `collapsible` | `boolean` | - |
| `sizeUnit` | `'px' \| '%'` | `'%'` |
| `order` | `number` | - |
| `ui` | `Partial<Record<'root', string \| object>>` | - |

### SplitterResizeHandle

| Prop | Tipe | Default |
| --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `disabled` | `boolean` | - |
| `ui` | `Partial<Record<SplitterResizeHandleSlot, string \| object>>` | - |

## Emits

### Splitter

| Event | Payload |
| --- | --- |
| `layout` | `number[]` - ukuran current setiap panel |

### SplitterPanel

| Event | Payload |
| --- | --- |
| `collapse` | - |
| `expand` | - |
| `resize` | `number` |

## Slots

### SplitterPanel

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `default` | `{ isCollapsed, isExpanded, collapse, expand }` | Konten panel, di-scope dengan live collapse state dan fungsi `collapse()`/`expand()` yang sama seperti metode template-ref di bawah |

## Methods

### SplitterPanel

Akses ini melalui template ref pada `SSplitterPanel`.

| Method | Deskripsi |
| --- | --- |
| `collapse()` | Menutup panel ke `collapsedSize` |
| `expand()` | Mengembalikan panel ke ukuran sebelum terakhir kali ditutup |
| `resize(size: number)` | Mengatur ukuran panel secara langsung, dalam unit apa pun `sizeUnit` berada |
| `getSize()` | Mengembalikan ukuran current panel, dalam unit apa pun `sizeUnit` berada |
| `isCollapsed` | Apakah panel saat ini ditutup |
| `isExpanded` | Apakah panel saat ini dibuka |
