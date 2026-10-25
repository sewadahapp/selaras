---
title: useMessages
description: Menggantikan teks yang dirender setiap komponen secara internal, di setiap bahasa.
order: 40
---

Setiap string terlihat yang dirender komponen sendiri - "Clear", "No results found", jumlah halaman Pagination, aria-label yang diumumkan screen reader - di-resolve dari satu registry, `useMessages()`, alih-alih di-hardcode per komponen. Teks yang Anda berikan sendiri (`label` milik item sendiri, header kolom sendiri) tidak terpengaruh - registry ini hanya untuk teks yang dipasok komponen sendiri.

## Penggunaan

Gantikan key apa pun secara global di `app.config.ts`:

```ts
export default defineAppConfig({
  selaras: {
    messages: {
      clear: 'Effacer',
      search: 'Rechercher...',
    },
  },
})
```

Hanya key yang Anda atur yang digantikan; sisanya mempertahankan default Inggrisnya. Ini mengubah setiap komponen yang menggunakan key itu sekaligus - mengatur `close` me-reskin label dismiss pada `Modal`, `Toast`, tombol clear milik `Input`, dan petunjuk footer milik `CommandPalette` sekaligus, alih-alih membutuhkan override terpisah untuk masing-masing.

Tidak ada terjemahan bawaan untuk bahasa lain - registry ini adalah mekanismenya, bukan set file locale siap pakai. Terjemahan penuh adalah satu literal objek yang mencakup setiap key di bawah.

## Registry

| Kunci | Default | Digunakan oleh |
| --- | --- | --- |
| `edit` | `Edit` | Kontrol edit milik Editable |
| `save` | `Save` | Kontrol save milik Editable |
| `editableInput` | `Editable text` | Nama aksesibel fallback milik editor Editable |
| `editablePlaceholder` | `Click to edit` | Pratinjau kosong milik Editable |
| `loading` | `Loading` | State loading milik Button/Switch |
| `clear` | `Clear` | Tombol clear milik Input, Select, DatePicker |
| `close` | `Close` | Modal, Toast, petunjuk footer milik CommandPalette |
| `cancel` | `Cancel` | Footer default milik AlertDialog, Editable |
| `continue` | `Continue` | Footer default milik AlertDialog |
| `colorModeToggle` | `Toggle color mode` | ColorModeToggle |
| `colorPicker` | `Color picker` | ColorPicker |
| `colorPickerDescription` | `Drag to adjust hue, saturation, and lightness` | Deskripsi sr-only adaptif milik ColorPicker |
| `search` | `Search...` | CommandPalette, Autocomplete |
| `searchDescription` | `Type to filter, then use arrow keys and enter to select` | Deskripsi sr-only adaptif milik Select/Autocomplete |
| `columns` | `Columns` | Kontrol toggle kolom milik Table |
| `filterPlaceholder` | `Filter...` | Input filter milik Table |
| `filterColumn` | `column => \`Filter ${column}\`` | Label aksesibel dan heading untuk filter kolom Table |
| `previous` | `Previous` | Pagination, ContentSurround |
| `next` | `Next` | Pagination, ContentSurround |
| `first` | `First` | Pagination |
| `last` | `Last` | Pagination |
| `stepper` | `Progress` | Nama aksesibel grup milik Stepper |
| `stepperProgress` | `` (step, total) => `Step ${step} of ${total}` `` | Pengumuman live-region milik Stepper |
| `pagination` | `Pagination` | Aria-label nav milik Pagination |
| `scrollTabsLeft` | `Scroll tabs left` | Tombol overflow kiri milik Tabs |
| `scrollTabsRight` | `Scroll tabs right` | Tombol overflow kanan milik Tabs |
| `datePicker` | `Date picker` | DatePicker |
| `datePickerDescription` | `Use arrow keys to navigate days, enter to select` | Deskripsi sr-only adaptif milik DatePicker |
| `dateRangePicker` | `Date range picker` | DatePicker (mode range) |
| `dateRangePickerDescription` | `Use arrow keys to navigate days, enter to select a start and end date` | Deskripsi sr-only adaptif milik DatePicker (mode range) |
| `timePicker` | `Time picker` | DatePicker (bagian time) |
| `timePickerDescription` | `Use arrow keys to adjust the highlighted field` | Deskripsi sr-only adaptif milik DatePicker (bagian time) |
| `pickTime` | `Pick a time` | DatePicker (mode timeOnly) |
| `previousMonth` | `Previous month` | DatePicker |
| `nextMonth` | `Next month` | DatePicker |
| `previousYear` | `Previous year` | DatePicker |
| `nextYear` | `Next year` | DatePicker |
| `previousDecade` | `Previous decade` | DatePicker (tampilan tahun) |
| `nextDecade` | `Next decade` | DatePicker (tampilan tahun) |
| `pickDate` | `Pick a date` | DatePicker |
| `chooseMonth` | `Choose month` | DatePicker (tampilan bulan) |
| `chooseYear` | `Choose year` | DatePicker (tampilan tahun) |
| `hour` | `Hour` | Time stepper milik DatePicker |
| `minute` | `Minute` | Time stepper milik DatePicker |
| `done` | `Done` | Bagian time milik DatePicker |
| `increment` | `Increment` | Stepper milik InputNumber |
| `decrement` | `Decrement` | Stepper milik InputNumber |
| `noOptions` | `No options` | Select, Autocomplete |
| `selectAll` | `Select all` | Listbox, TransferList |
| `transferSource` | `Available` | Heading sumber milik TransferList |
| `transferTarget` | `Assigned` | Heading tujuan milik TransferList |
| `moveToTarget` | `Add selected` | Tombol tambah milik TransferList |
| `moveToSource` | `Remove selected` | Tombol hapus milik TransferList |
| `listSelectionCount(selected, total)` | `${selected} of ${total} selected` | Jumlah panel milik TransferList |
| `transferItems(count, target)` | `${count} item(s) moved to ${target}` | Pengumuman live milik TransferList |
| `noResultsFound` | `No results found` | Autocomplete, CommandPalette |
| `createOption(value)` | `Create "${value}"` | Saran teks bebas milik Autocomplete |
| `noData` | `No data` | Table |
| `selectAllRows` | `Select all rows` | Checkbox pilih-semua milik Table |
| `selectRow(index)` | `Select row ${index}` | Checkbox baris milik Table; indeks data asli berbasis satu |
| `expandRow` | `Expand row` | Table |
| `collapseRow` | `Collapse row` | Table |
| `maximize` | `Maximize` | Toggle fullscreen milik Modal |
| `minimize` | `Minimize` | Toggle fullscreen milik Modal |
| `removeItem(label?)` | `Remove ${label}` / `Remove` | Tombol remove milik Chip, FileUpload |
| `moreItems(count)` | `+${count} more` | Indikator chip-overflow milik Select/Autocomplete |
| `avatarGroupOverflow(count)` | `+${count}` | Indikator overflow milik AvatarGroup |
| `paginationInfo(page, total)` | `Page ${page} of ${total}` | Pagination |
| `codeTabFallback(index)` | `Tab ${index}` | Tabs (grup blok kode) |
| `copyCode` | `Copy code` | Tombol copy blok kode |
| `codeCopied` | `Copied!` | Umpan balik copy blok kode |
| `dropFiles` | `Drop files here or click to browse` | FileUpload |
| `invalidFileType(name)` | `${name}: invalid file type` | FileUpload |
| `invalidFileSize(name, max)` | `${name}: exceeds the ${max} size limit` | FileUpload |
| `tooManyFiles(max)` | `Only ${max} file(s) allowed` | FileUpload |
| `showMore` | `Show more` | ReadMore |
| `showLess` | `Show less` | ReadMore |
| `selectFile` | `Select a file to view its content` | FileTree |
| `toggleSidebar` | `Toggle sidebar` | DashboardSidebarToggle |
| `breadcrumb` | `Breadcrumb` | Aria-label nav milik Breadcrumb |
| `showHiddenBreadcrumbItems` | `Show hidden breadcrumb items` | Trigger overflow milik Breadcrumb |
| `commandPalette` | `Command palette` | Title sr-only milik CommandPalette |
| `commandPaletteDescription` | `Search for a command and press enter` | Deskripsi sr-only milik CommandPalette |
| `navigate` | `Navigate` | Petunjuk footer milik CommandPalette |
| `select` | `Select` | Petunjuk footer milik CommandPalette |
| `onThisPage` | `On this page` | Heading default milik ContentToc |
| `upToSize(size)` | `Up to ${size}` | Petunjuk max-size milik FileUpload |

Sengaja tidak ada entri `am`/`pm`: bagian time milik `DatePicker` menurunkan teks itu langsung dari [`useLocale`](/utilities/composables/use-locale) via `Intl`, sehingga selalu cocok dengan locale yang sama yang menggerakkan tampilan hour-cycle di sampingnya, alih-alih membutuhkan terjemahan terpisah yang dijaga sinkron manual.

## API

```ts
function useMessages(): ComputedRef<MessageRegistry>
```

Mengembalikan registry gabungan (override `app.config.selaras.messages` Anda diterapkan di atas default Inggris di atas) - gunakan ini jika Anda membangun komponen sendiri dan ingin ia menghormati override yang sama yang sudah diatur consumer, alih-alih meng-hardcode string langsung:

```vue
<script setup lang="ts">
const messages = useMessages()
</script>

<template>
  <button :aria-label="messages.close">
    ...
  </button>
</template>
```
