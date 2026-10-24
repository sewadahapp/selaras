---
title: TransferList
description: Menetapkan item antara dua panel seleksi yang dapat dicari dengan tata letak responsif.
order: 22.75
---

## Penggunaan

TransferList memisahkan item yang tersedia dari item yang sudah ditetapkan. `items` adalah koleksi lengkap; `v-model` berisi nilai tujuan. Mencentang baris menandainya untuk ditransfer, dan menekan tombol panah add atau remove memperbarui model tujuan. Komponen tidak pernah memutasi koleksi yang diberikan.

::component-example{name="transfer-list-basic"}
::

```vue
<script setup lang="ts">
const assigned = ref([2])
const items = [
  { id: 1, name: 'Alex Morgan', description: 'Product designer' },
  { id: 2, name: 'Sam Lee', description: 'Software engineer' },
  { id: 3, name: 'Dina Sari', description: 'Project manager' },
  { id: 4, name: 'Taylor Kim', description: 'Workspace owner', disabled: true },
]
</script>

<template>
  <div class="w-full space-y-4">
    <STransferList v-model="assigned" :items="items" value-key="id" label-key="name" source-label="Available members" target-label="Project team" searchable />
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Assigned member IDs: {{ assigned.join(', ') || 'None' }}
    </p>
  </div>
</template>
```

## Nilai dan seleksi

Aturan nilai cocok dengan [Listbox](/components/forms/listbox) dan Select: string dan angka finite adalah nilai mereka sendiri; objek menggunakan `value` saat ada dan jika tidak seluruh objek. Atur `valueKey` dan `labelKey` untuk field kustom. Grup menggunakan `{ label, items }`, dan identitas harus unik di seluruh koleksi. Gunakan `valueKey` yang stabil untuk records yang dimuat dari API.

```vue-html
<STransferList v-model="assignedRoles" :items="['admin', 'editor', 'viewer']" />
<STransferList v-model="assignedIds" :items="users" value-key="id" label-key="name" />
```

Baris yang dicentang bersifat internal secara default. Bind `v-model:checked` saat aplikasi perlu mengontrolnya secara terpisah. Nilai tujuan yang tidak ada di `items` dipertahankan dan muncul di panel yang ditetapkan saat records mereka tiba. Kedua model terkontrol dapat menolak update tanpa mengadopsi state yang diusulkan.

Item yang disabled tidak dapat dicentang atau dipindahkan. Select all mempengaruhi hanya item yang terlihat dan diaktifkan di panelnya. Aksi transfer memindahkan semua item yang dicentang dan diaktifkan dari panel itu, termasuk item yang dicentang tetapi disembunyikan oleh pencarian berikutnya. Kedua panel mempertahankan urutan koleksi asli; urutan array model tidak mengurutkan ulang baris yang ditampilkan. Drag-and-drop dan pengurutan manual tidak disediakan.

## Pencarian dan tata letak

`searchable` menambahkan filter label independen. Bind `v-model:source-search-term` dan `v-model:target-search-term` untuk mengontrol teksnya. Pencarian mempertahankan keanggotaan tujuan dan baris yang dicentang.

`layout="auto"` menempatkan panel berdampingan di layar yang lebih besar dan menumpuknya di layar yang lebih kecil. `horizontal` dan `vertical` memaksa tata letak tertentu. Panel tetap inline; tidak diperlukan presentasi modal atau prop adaptive.

## Konten kustom

Slot `item` menyediakan metadata item asli, state seleksi, dan `side`:

::component-example{name="transfer-list-custom-item"}
::

```vue
<script setup lang="ts">
const assigned = ref(['editor'])
const items = [
  { label: 'Administrator', value: 'admin', description: 'Full workspace access' },
  { label: 'Editor', value: 'editor', description: 'Create and edit content' },
  { label: 'Viewer', value: 'viewer', description: 'Read-only access' },
]
</script>

<template>
  <STransferList v-model="assigned" :items="items" source-label="Available roles" target-label="Assigned roles" class="w-full">
    <template #item="{ item, side }">
      <div class="min-w-0 flex-1">
        <p class="font-medium">
          {{ item.label }}
        </p>
        <p class="text-xs text-[var(--selaras-resolved-text-muted)]">
          {{ item.description }}
        </p>
      </div>
      <SBadge v-if="side === 'target'" size="sm" variant="soft" label="Assigned" />
    </template>
  </STransferList>
</template>
```

`source-header` dan `target-header` menerima `count` dan `checkedCount`. Footer panel dan empty states juga dapat dikustomisasi. Opsi harus berisi konten tampilan daripada link atau tombol independen yang interaktif.

## Formulir dan aksesibilitas

Gunakan `name`, `form`, dan `required` seperti Listbox. Hanya nilai tujuan yang disubmit; nilai panel yang dicentang dikecualikan. Nilai objek diserialisasi sebagai JSON. FormField menyediakan size, name, deskripsi, dan state validasi. Native reset mengembalikan default tujuan yang ditangkap dan menghapus baris yang dicentang serta pencarian. Parent terkontrol menerima proposal reset; reset yang dibatalkan tidak memperbarui state.

Setiap panel memiliki nama yang dapat diakses dari `sourceLabel` atau `targetLabel`. Tombol transfer menggunakan ikon panah dengan label aksesibel dan judul hover. Fokus keyboard berpindah ke panel penerima setelah transfer. Live region mengumumkan jumlah item yang ditransfer.

Event `transfer` menerima `{ direction, items, values }`, di mana direction adalah `to-target` atau `to-source` dan array berisi hanya item/nilai yang dipindahkan. Untuk model terkontrol, event mengusulkan perubahan untuk diterima parent.

## Styling dan pesan

Override `ui.transferList` untuk tata letak dan chrome panel; `ui.listbox` men-style panel seleksi. Keduanya mendukung app config global, override Theme scoped, dan nilai `:ui` lokal. `ui.listbox` pada instance transfer dapat mencakup atribut seperti `{ ui: { content: 'max-h-96' } }` untuk mengonfigurasi panelnya.

Baik indikator item maupun kontrol select-all menggunakan [Checkbox](/components/forms/checkbox), jadi override `ui.checkbox` global atau scoped berlaku untuk kedua panel. Indikator item bersifat dekoratif: opsi memiliki seleksi, fokus keyboard, dan semantik aksesibilitas. Mereka tidak mensubmit nilai form tambahan.

```vue-html
<STheme :ui="{ checkbox: { slots: { box: 'rounded-none' } } }">
  <STransferList v-model="assigned" :items="items" />
</STheme>
```

Label menggunakan message registry: `transferSource`, `transferTarget`, `moveToTarget`, `moveToSource`, `selectAll`, `listSelectionCount`, dan `transferItems`. Pesan pencarian dan empty menggunakan ulang `search`, `noOptions`, dan `noResultsFound`. Ikon aksi menggunakan registry chevron bersama.

::theme-source{name="transfer-list"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `items` | readonly primitive, object, atau grouped entries | required |
| `modelValue` / `defaultValue` | destination value array | kosong |
| `checked` | temporarily checked value array | internal |
| `labelKey` / `valueKey` / `descriptionKey` | object property | sama seperti Listbox |
| `sourceLabel` / `targetLabel` | `string` | configured Available / Assigned |
| `searchable` | `boolean` | `false` |
| `sourceSearchTerm` / `targetSearchTerm` | `string` | kosong |
| `showSelectAll` | `boolean` | `true` |
| `layout` | `'auto' \| 'horizontal' \| 'vertical'` | `auto` |
| `virtualize` | `boolean` atau `{ estimateSize, overscan }` | `false` |
| `disabled` / `loading` / `invalid` | `boolean` | `false` |
| `size` / `color` | control size / semantic role | `md` / `primary` |
| `id` / `name` / `form` | `string` | - |
| `required` | `boolean` | `false` |
| `ui` | slot overrides | - |

## Slots

| Slot | Props | Tujuan |
| --- | --- | --- |
| `item` | `{ item, index, selected, disabled, side }` | Konten opsi asli |
| `source-header` / `target-header` | `{ count, checkedCount }` | Judul panel |
| `source-footer` / `target-footer` | - | Footer panel |
| `empty` / `empty-filter` | `{ side }` | Panel kosong / pencarian tanpa kecocokan |

`TransferListProps`, `TransferListEmits`, `TransferListSlots`, `TransferSide`, dan `TransferDirection` diekspor dari `@sewadah/selaras/types`.
