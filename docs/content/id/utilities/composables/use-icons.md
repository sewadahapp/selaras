---
title: useIcons
description: Menggantikan set ikon yang digunakan secara internal di setiap komponen.
order: 30
---

Setiap ikon internal yang dirender pustaka ini sendiri - spinner loading milik button, glyph remove milik chip, chevron dropdown milik select, ikon success/danger milik toast, dan seterusnya - di-resolve dari satu registry tujuan semantik, `useIcons()`, alih-alih di-hardcode per komponen. Prop `name` yang Anda atur sendiri (`icon` milik `SButton`, `icon` milik `SInput`, ...) tidak terpengaruh - registry ini hanya untuk ikon yang dirender komponen sendiri.

## Penggunaan

Gantikan key apa pun secara global di `app.config.ts`:

```ts
export default defineAppConfig({
  selaras: {
    icons: {
      close: 'lucide:x',
      loading: 'lucide:loader-2',
    },
  },
})
```

Hanya key yang Anda atur yang digantikan; sisanya mempertahankan default [Hugeicons](https://hugeicons.com)-nya. Ini mengubah setiap komponen yang menggunakan key itu sekaligus - mengatur `close` me-reskin ikon dismiss pada `Modal`, `Toast`, tombol clear milik `Input`, dan tombol remove milik `Chip` sekaligus, alih-alih membutuhkan override terpisah untuk masing-masing.

## Registry

| Kunci | Default | Digunakan oleh |
| --- | --- | --- |
| `edit` | `hugeicons:pencil-edit-01` | Kontrol edit milik Editable |
| `close` | `hugeicons:cancel-01` | Modal, Toast, Chip, tombol clear milik Input, CommandPalette, kontrol cancel milik Editable |
| `check` | `hugeicons:tick-02` | Checkbox, penanda item terpilih milik Select, kontrol save milik Editable |
| `indeterminate` | `hugeicons:minus-sign` | State indeterminate milik Checkbox |
| `chevronUp` | `hugeicons:arrow-up-01` | Accordion, stepper milik InputNumber |
| `chevronDown` | `hugeicons:arrow-down-01` | Select, Autocomplete, DatePicker, stepper milik InputNumber |
| `chevronRight` | `hugeicons:arrow-right-01` | Tree, NavigationMenu |
| `chevronLeft` | `hugeicons:arrow-left-01` | Pagination, nav bulan milik DatePicker |
| `chevronsLeft` | `hugeicons:previous` | Kontrol halaman pertama milik Pagination |
| `chevronsRight` | `hugeicons:next` | Kontrol halaman terakhir milik Pagination |
| `loading` | `hugeicons:loading-02` | Spinner loading milik Button/Switch |
| `search` | `hugeicons:search-01` | CommandPalette, Autocomplete |
| `sortUnsorted` | `hugeicons:sorting-05` | Header kolom sortable milik Table saat tidak di-sort |
| `sortAscending` | `hugeicons:arrow-up-02` | State sort menaik milik Table |
| `sortDescending` | `hugeicons:arrow-down-02` | State sort menurun milik Table |
| `filter` | `hugeicons:filter` | Trigger filter kolom milik Table |
| `columns` | `hugeicons:table-columns-split` | Kontrol toggle kolom milik Table |
| `copy` | `hugeicons:copy` | CodeButton |
| `lightMode` | `hugeicons:sun-01` | ColorModeToggle |
| `darkMode` | `hugeicons:moon` | ColorModeToggle |
| `calendar` | `hugeicons:calendar-01` | DatePicker |
| `clock` | `hugeicons:clock-01` | Time picker milik DatePicker |
| `plus` | `hugeicons:plus-sign` | Stepper milik InputNumber |
| `minus` | `hugeicons:minus-sign` | Stepper milik InputNumber |
| `success` | `hugeicons:checkmark-circle-01` | Toast, Alert |
| `danger` | `hugeicons:cancel-circle` | Toast, Alert |
| `warning` | `hugeicons:alert-circle` | Toast, Alert |
| `info` | `hugeicons:information-circle` | Toast, Alert |
| `user` | `hugeicons:user` | Fallback milik Avatar |
| `maximize` | `hugeicons:fullscreen` | Toggle fullscreen milik Modal |
| `minimize` | `hugeicons:collapse` | Toggle fullscreen milik Modal |
| `star` | `hugeicons:star` | Rating |
| `upload` | `hugeicons:upload-01` | FileUpload |
| `file` | `hugeicons:file-01` | FileUpload, FileTree |
| `folder` | `hugeicons:folder-01` | FileTree |
| `folderOpen` | `hugeicons:folder-open` | FileTree |
| `more` | `hugeicons:more-horizontal` | Trigger row-actions milik Table |
| `sidebarCollapse` | `hugeicons:sidebar-left-01` | DashboardSidebarToggle |

## API

```ts
function useIcons(): ComputedRef<IconRegistry>
```

Mengembalikan registry gabungan (override `app.config.selaras.icons` Anda diterapkan di atas default Hugeicons di atas) - gunakan ini jika Anda membangun komponen sendiri dan ingin ia menghormati override yang sama yang sudah diatur consumer, alih-alih meng-hardcode nama ikon langsung:

```vue
<script setup lang="ts">
const icons = useIcons()
</script>

<template>
  <SIcon :name="icons.close" />
</template>
```
