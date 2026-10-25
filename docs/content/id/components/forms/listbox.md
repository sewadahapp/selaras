---
title: Listbox
description: Daftar seleksi inline dengan pencarian, grup, konten kaya, dan virtualisasi.
order: 22.5
---

## Penggunaan

Listbox menampilkan opsinya langsung di halaman. Gunakan saat pilihan harus tetap terlihat; gunakan [Select](/components/forms/select) saat mereka harus terbuka di popup. Seleksi defaultnya tunggal.

::component-example{name="listbox-basic"}
::

```vue
<script setup lang="ts">
const selected = ref('Design')
const items = ['Design', 'Engineering', 'Operations', 'Support']
</script>

<template>
  <div class="w-full max-w-sm space-y-3">
    <SListbox v-model="selected" :items="items" label="Department" />
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Selected: {{ selected ?? 'None' }}
    </p>
  </div>
</template>
```

`items` menerima string, angka finite, dan objek. Primitif adalah label dan nilai sekaligus. Objek menampilkan `label` dan menggunakan properti `value` saat ada; jika tidak, seluruh objek adalah nilai. `labelKey` dan `valueKey` eksplisit memilih properti yang berbeda. `1` numerik dan `'1'` string adalah berbeda. Nilai harus unik di semua grup. Objek utuh dibandingkan berdasarkan identitas; gunakan `valueKey` yang stabil saat mengganti records yang di-fetch dari API.

### Multiple selection

`multiple` menggunakan model array. Klik atau tekan Space men toggle baris tanpa memerlukan tombol modifier. `selectionBehavior="replace"` mengaktifkan seleksi penggantian dengan tombol modifier untuk seleksi tambahan. `checkbox` menampilkan indikator dekoratif yang dirender oleh [Checkbox](/components/forms/checkbox) dalam mode dekoratifnya; opsi tetap menjadi satu-satunya elemen interaktif di setiap baris.

::component-example{name="listbox-multiple"}
::

```vue
<script setup lang="ts">
const selected = ref(['read'])
const items = [
  { label: 'Workspace', items: [{ label: 'Read projects', value: 'read' }, { label: 'Create projects', value: 'create' }, { label: 'Delete projects', value: 'delete', disabled: true }] },
  { label: 'Team', items: [{ label: 'Invite members', value: 'invite' }, { label: 'Manage roles', value: 'roles' }] },
]
</script>

<template>
  <div class="w-full max-w-sm space-y-3">
    <SListbox v-model="selected" :items="items" label="Permissions" multiple checkbox searchable select-all />
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      {{ selected.length }} permissions selected
    </p>
  </div>
</template>
```

`selectAll` menambahkan checkbox header dalam mode multiple. Ia mencentang atau menghapus centang hanya opsi yang terlihat dan diaktifkan, dan mempertahankan seleksi di luar filter saat ini. Ctrl/Cmd+A dalam daftar mengikuti aturan yang sama. Grup menggunakan bentuk `{ label, items }` yang sama seperti Select.

### Pencarian dan empty states

`searchable` menambahkan input filter. Bind `v-model:search-term` untuk mengontrol teksnya. Pencarian mencocokkan label tanpa memperhatikan case atau aksen. Filtering mempertahankan seleksi, dan memilih item membiarkan teks pencarian tetap utuh. Gunakan `empty` untuk koleksi kosong dan `empty-filter` untuk tidak ada hasil yang cocok. [EmptyState](/components/data/empty-state) menyediakan pesan yang lebih kaya untuk salah satu slot. Konten kosong dirender bersama daftar opsi. Tempatkan aksi interaktif di `footer`, menjaga listbox hanya untuk opsi yang dapat dipilih.

### Item kaya dan kunci kustom

Objek dapat mencakup `description`, `icon`, dan `disabled`. `descriptionKey` default ke `description`. Slot `item` menerima item asli plus `index`, `selected`, dan `disabled`; indeks mengidentifikasi posisinya dalam koleksi flattened utuh. Gunakan `group` untuk mengganti label grup.

::component-example{name="listbox-custom-objects"}
::

```vue
<script setup lang="ts">
const selected = ref(1)
const items = [
  { id: 1, name: 'Product design', description: 'Interfaces and user experience', icon: 'hugeicons:paint-brush-01' },
  { id: 2, name: 'Engineering', description: 'Application development', icon: 'hugeicons:code' },
  { id: 3, name: 'Support', description: 'Customer care', icon: 'hugeicons:customer-support' },
]
</script>

<template>
  <SListbox v-model="selected" :items="items" value-key="id" label-key="name" label="Teams" class="w-full max-w-sm" />
</template>
```

Jaga opsi kustom untuk menampilkan konten. Tempatkan link independen atau tombol aksi dalam daftar atau tabel biasa daripada di dalam opsi listbox.

### Virtualisasi

`virtualize` merender jendela opsi untuk koleksi besar. Berikan `true` atau `{ estimateSize, overscan }`. Header grup dihilangkan saat divirtualisasi. Ini tidak mengambil halaman tambahan.

::component-example{name="listbox-virtualize"}
::

```vue
<script setup lang="ts">
const selected = ref<number[]>([])
const items = Array.from({ length: 5000 }, (_, index) => ({ label: `Item ${index + 1}`, value: index + 1 }))
</script>

<template>
  <SListbox v-model="selected" :items="items" label="Large collection" multiple searchable virtualize class="w-full max-w-sm" />
</template>
```

### Nilai terkontrol dan formulir

Gunakan `v-model` untuk seleksi terkontrol, atau `defaultValue` untuk seleksi awal yang tidak terkontrol. `modelValue: undefined` eksplisit tetap terkontrol dan kosong sampai parent menerima update. Nilai async yang hilang tetap terpilih saat opsi dimuat.

Perubahan `multiple` yang tidak terkontrol mengonversi skalar menjadi array atau menyimpan item array pertama untuk mode single. Parent terkontrol harus memperbarui bentuk model dan mode bersamaan. Nilai/default duplikat ditolak.

Bungkus Listbox dalam [FormField](/components/forms/form-field) untuk label, deskripsi, state invalid, ukuran, dan nama. `name` mensubmit setiap nilai terpilih; objek diserialisasi sebagai JSON. `form` mengasosiasikan form eksternal, dan `required` mengharuskan seleksi tidak kosong. Native reset mengembalikan default yang ditangkap pada mount dalam mode seleksi saat ini dan menghapus pencarian. Reset yang dibatalkan diabaikan.

### Aksesibilitas

`label` atau `aria-label` memberi nama listbox; FormField dapat menyediakan labelnya. Tombol panah memindahkan fokus, Home/End mencapai tepi, dan Enter/Space memilih opsi. Fokus dan seleksi tetap terpisah. Pencarian menggunakan combobox yang dapat diedit yang ditautkan ke opsi inline. Listbox tetap inline di setiap ukuran viewport.

### Styling

`size` menerima `sm`, `md`, atau `lg`; `color` mengontrol token seleksi dan fokus. `invalid` menggunakan role danger. Override `ui.listbox` secara global atau dalam Theme, atau berikan `:ui` ke satu instance.

Indikator item dan kontrol select-all berbagi tema `ui.checkbox`, termasuk bentuk kotak dan animasi centang. Ukuran dan warnanya mengikuti listbox. Slot `checkbox` listbox men-style wrapper indikator; untuk menyesuaikan Checkbox itu sendiri untuk satu list, scope `ui.checkbox` dengan [Theme](/overview/theming/scoped-themes):

```vue-html
<STheme :ui="{ checkbox: { slots: { box: 'rounded-none' } } }">
  <SListbox v-model="selected" :items="items" multiple checkbox select-all />
</STheme>
```

::theme-source{name="listbox"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `items` | readonly primitive, object, atau grouped entries | required |
| `modelValue` / `defaultValue` | selected value atau array | - |
| `labelKey` / `valueKey` | object property | `label` / `value` saat ada, jika tidak objek |
| `descriptionKey` | object property | `description` |
| `multiple` | `boolean` | `false` |
| `selectionBehavior` | `'toggle' \| 'replace'` | `toggle` |
| `checkbox` / `selectAll` | `boolean` | `false` |
| `searchable` | `boolean` | `false` |
| `searchTerm` | `string` | kosong |
| `virtualize` | `boolean` atau `{ estimateSize, overscan }` | `false` |
| `label` | `string` | form label atau configured select message |
| `disabled` / `loading` / `invalid` | `boolean` | `false` |
| `size` / `color` | control size / semantic role | `md` / `primary` |
| `id` / `name` / `form` | `string` | - |
| `required` | `boolean` | `false` |
| `ui` | slot overrides | - |

## Slots

| Slot | Props | Tujuan |
| --- | --- | --- |
| `item` | `{ item, index, selected, disabled }` | Konten opsi asli |
| `group` | `{ group }` | Judul grup |
| `header` / `footer` | - | Konten di sekitar daftar |
| `empty` / `empty-filter` | - | Koleksi kosong / pencarian tanpa kecocokan |

Public `ListboxProps`, `ListboxEmits`, dan `ListboxSlots` tersedia dari `@sewadah/selaras/types`. Mereka menyimpulkan item, identity key, dan mode multiple dengan cara yang sama seperti Select.
