---
title: Table
components: [SColumn, SColumnGroup]
description: Tabel yang dibangun di atas TanStack Table, dengan API kolom deklaratif - sorting, row selection, pagination, filtering, expansion, column visibility, virtual scroll, dan pinned columns langsung siap pakai.
order: 30
---

## Penggunaan

Berikan `data` dan deklarasikan kolom dengan anak `<SColumn>` - tidak perlu objek konfigurasi kolom untuk kasus umum:

::component-example{name="table-basic"}
::

```vue
<script setup lang="ts">
interface User { name: string, email: string, role: string }

const users = ref<User[]>([
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Member' },
])

const rowSelection = ref({})
const globalFilter = ref('')
const getUserId = (user: User) => user.email
</script>

<template>
  <SInput v-model="globalFilter" placeholder="Search users..." />
  <STable
    v-model:row-selection="rowSelection"
    v-model:global-filter="globalFilter"
    :data="users"
    :get-row-id="getUserId"
    selectable
    :page-size="3"
  >
    <SColumn field="name" header="Name" filterable sortable />
    <SColumn field="email" header="Email" />
    <SColumn field="role" header="Role" />
  </STable>
</template>
```

Kolom tidak dapat disortir secara default. Tambahkan `sortable` ke `<SColumn>` untuk mengaktifkan sorting; ikon di sebelah menunjukkan state saat ini (unsorted, ascending, atau descending). Klik header yang dapat disortir, atau fokuskan dan tekan <kbd>Enter</kbd>/<kbd>Space</kbd>, untuk mengcycle state tersebut. Shift-click header sortable kedua untuk menambahkannya sebagai sort sekunder tanpa menghapus yang pertama. `filterable` menambahkan tombol corong di samping header kolom itu; membuka popover dengan filter teks live dan aksi Clear. `selectable` menambahkan kolom checkbox depan yang dihubungkan ke `v-model:row-selection`.

Checkbox seleksi memiliki nama yang dapat diakses secara default: "Select all rows" dan "Select row 1", "Select row 2", dan seterusnya. Nomor baris mengacu pada urutan data asli dan tetap melekat pada record mereka saat sorting atau filtering. Sesuaikan default ini dengan pesan [messages](/utilities/composables/use-messages) `selectAllRows` dan `selectRow(index)`. Untuk nama yang lebih deskriptif, berikan `get-row-selection-label`:

```vue-html
<STable
  :data="users"
  selectable
  :get-row-selection-label="user => `Select ${user.name}`"
>
  <SColumn field="name" header="Name" />
</STable>
```

Callback menerima objek baris asli dan mengembalikan nama yang dapat diakses penuh. Terjemahkan teks ini di aplikasi Anda saat dibutuhkan. Hasil callback kosong fallback ke nomor baris yang dilokalisasi.

Gunakan `select-on-row-click` bersama `selectable` untuk men toggle seleksi dengan mengklik di mana saja pada baris. Klik pada kontrol di dalam sel (seperti link, tombol, dan checkbox) mempertahankan perilaku normal mereka. `row-hover` menambahkan background tema-aware halus saat pointer berada di atas body row:

::component-example{name="table-row-click-selection"}
::

```vue-html
<STable
  v-model:row-selection="rowSelection"
  :data="users"
  :get-row-id="user => user.email"
  selectable
  select-on-row-click
  row-hover
>
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
</STable>
```

Seleksi dan expansion menggunakan positional row ids milik TanStack secara default. Untuk data yang dapat disortir, difilter, disegarkan, atau dipaginate oleh server, berikan `get-row-id` agar state terkontrol mengikuti record daripada posisi array saat ini:

```vue-html
<STable
  v-model:row-selection="rowSelection"
  :data="users"
  :get-row-id="getUserId"
  selectable
>
  <SColumn field="name" header="Name" />
</STable>
```

`STable` tidak merender input pencarian global sendiri - hubungkan sendiri dan bind ke `v-model:global-filter`, pendekatan komposisional yang sama seperti komponen lainnya.

### Grouped headers

Bungkus kolom dalam `<SColumnGroup>` untuk membuat multi-row header dengan `colspan`/`rowspan` yang benar - nest se dalam yang dibutuhkan:

::component-example{name="table-grouped"}
::

```vue-html
<STable :data="employees">
  <SColumn field="name" header="Name" />
  <SColumnGroup header="Details">
    <SColumn field="age" header="Age" />
    <SColumn field="city" header="City" />
    <SColumn field="department" header="Department" />
  </SColumnGroup>
</STable>
```

### Pagination

Pagination opt-in: setiap baris dirender pada satu halaman sampai Anda mengatur `page-size`. Setelah diatur, kontrol [Pagination](/components/navigation/pagination) (nomor halaman, Prev/Next, scaling dengan `size`) muncul otomatis setelah ada lebih dari satu halaman, dan bind ke `v-model:page-index` jika Anda perlu membaca atau mengontrol halaman saat ini sendiri. `virtualize` adalah pilihan yang lebih cocok untuk windowing dataset besar daripada pagination - lihat [Virtual scroll](#virtual-scroll) di bawah.

### Presort

`default-sorting` memberi seed sort awal tanpa perlu `v-model:sorting` - berguna saat Anda ingin tabel terbuka sudah tersortir tetapi tetap membiarkan pengguna mengubahnya bebas setelahnya:

```vue-html
<STable :data="users" :default-sorting="[{ id: 'name', desc: false }]">
  <SColumn field="name" header="Name" sortable />
</STable>
```

Tid seperti `sorting`, ini dibaca sekali sebagai nilai awal, bukan pada setiap render - pola uncontrolled-default yang sama seperti `defaultValue` pada `Accordion`/`Tabs`.

### Custom cell content

Berikan `<SColumn>` slot default untuk menyesuaikan bagaimana setiap sel dirender. Ia menerima `{ row, value }`, di mana `row` adalah objek baris penuh dan `value` adalah nilai field kolom itu sendiri:

```vue-html
<SColumn field="role" header="Role">
  <template #default="{ value }">
    <SBadge :label="value" />
  </template>
</SColumn>
```

### Custom header content

`<SColumn>`/`<SColumnGroup>` mendapat perlakuan yang sama untuk `header`/`footer` - named slot (scoped dengan `{ column }`, TanStack's own column API) yang menggantikan string prop biasa saat diberikan:

::component-example{name="table-custom-header"}
::

```vue-html
<SColumn field="role">
  <template #header>
    <span class="inline-flex items-center gap-1">
      Role
      <STooltip text="Admins can manage billing and members">
        <SIcon name="hugeicons:information-circle" class="size-3.5 text-[var(--selaras-resolved-text-muted)]" />
      </STooltip>
    </span>
  </template>
</SColumn>
```

### Row expansion

`expandable` menambahkan kolom toggle depan; berikan slot `expanded` untuk `STable` untuk konten detail, menerima `{ row }` (objek data asli baris):

::component-example{name="table-expandable"}
::

```vue-html
<STable :data="orders" expandable>
  <SColumn field="id" header="Order" />
  <SColumn field="customer" header="Customer" />
  <SColumn field="total" header="Total" />
  <template #expanded="{ row }">
    <strong>Items:</strong> {{ row.items.join(', ') }}
  </template>
</STable>
```

Expansion state secara default tidak terkontrol; bind `v-model:expanded` jika Anda perlu membaca atau menggerakkannya sendiri (misalnya untuk memperluas baris secara programatik).

### Tree data

Atur `tree` untuk merender baris hierarkis dari array `subRows` setiap baris. Baris parent mendapat kontrol expand inline di kolom data pertama yang terlihat, dan baris bersarang di-indent berdasarkan kedalaman. Untuk properti child lain, berikan `get-sub-rows`. Gunakan nilai `get-row-id` yang stabil saat tabel yang sama dapat expand, select, atau sort tree rows. Mode tree menggunakan `expanded` untuk visibilitas child, jadi tidak dapat dikombinasikan dengan slot detail `#expanded`.

::component-example{name="table-tree"}
::

```vue-html
<STable :data="teams" tree :get-row-id="team => team.name">
  <SColumn field="name" header="Team" />
  <SColumn field="lead" header="Lead" />
</STable>
```

Untuk field bersarang yang berbeda, kembalikan children setiap baris dengan `get-sub-rows="row => row.children"`.

### Row click

`@row-click`/`@row-contextmenu` terpicu dengan objek data asli baris dan native event - berguna untuk menavigasi ke halaman detail, misalnya. Baris hanya mendapat pointer cursor saat `@row-click` benar-benar memiliki listener yang terpasang, jadi tabel polos yang tidak interaktif tidak distyle secara menyesatkan sebagai clickable:

::component-example{name="table-row-click"}
::

```vue-html
<STable :data="users" @row-click="(row) => router.push(`/users/${row.id}`)">
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
  <SColumn field="role" header="Role" />
</STable>
```

### Per-row styling

`row-class`/`row-style` dipanggil dengan data setiap baris sendiri, memungkinkan Anda men-style baris secara kondisional - menyorot order yang overdue, misalnya:

::component-example{name="table-row-styling"}
::

```vue-html
<STable :data="orders" :row-class="(row) => row.overdue ? 'bg-[var(--selaras-resolved-color-danger-subtle)]' : undefined">
  <SColumn field="id" header="Order" />
  <SColumn field="customer" header="Customer" />
  <SColumn field="total" header="Total" />
</STable>
```

### Column visibility toggle

`column-toggle` merender tombol "Columns" di atas tabel yang membuka panel checkbox, satu per kolom, memungkinkan pengguna menyembunyikan/menampilkan kolom secara dinamis:

::component-example{name="table-column-toggle"}
::

```vue-html
<STable :data="users" column-toggle>
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
  <SColumn field="role" header="Role" />
</STable>
```

Bind `v-model:column-visibility` jika Anda perlu membaca atau mengontrol kolom mana yang ditampilkan sendiri (misalnya untuk mempertahankan pilihan).

### Frozen columns

Berikan kolom `pinned="left"` atau `pinned="right"` untuk menjaganya tetap terpasang pada tepi itu selama horizontal scroll - pasangkan dengan `scroll-height` (di bawah) dan cukup banyak kolom (atau override min-width `ui.table`) sehingga tabel benar-benar perlu scroll:

::component-example{name="table-pinned"}
::

```vue-html
<STable :data="employees" scroll-height="16rem" :ui="{ table: 'min-w-[960px]' }">
  <SColumn field="name" header="Name" pinned="left" />
  <SColumn field="department" header="Department" />
  <SColumn field="role" header="Role" />
  <SColumn field="email" header="Email" />
  <SColumn field="phone" header="Phone" />
  <SColumn field="city" header="City" />
  <SColumn field="startDate" header="Start date" />
  <SColumn field="actions" header="Actions" sortable="false" pinned="right">
    <template #default>
      <SButton variant="outline" size="sm">Edit</SButton>
    </template>
  </SColumn>
</STable>
```

Sticky offsets diukur dari lebar header yang sebenarnya setelah mount dan kapan pun daftar kolom atau visibilitas berubah - bukan pada setiap perubahan layout yang mungkin (web-font load, resize jendela), yang merupakan scope cut yang disengaja untuk pass ini.

### Virtual scroll

`scroll-height` membatasi tabel pada tinggi CSS tetap dengan header sticky dan scroll vertikal. Tambahkan `virtualize` untuk hanya merender baris yang saat ini terlihat, untuk dataset yang terlalu besar untuk dimasukkan semua ke DOM:

::component-example{name="table-virtualized"}
::

```vue-html
<STable :data="tenThousandRows" scroll-height="16rem" virtualize>
  <SColumn field="id" header="ID" />
  <SColumn field="name" header="Name" />
</STable>
```

Berikan objek sebagai gantinya dari `true` untuk menyesuaikan `estimateSize`/`overscan`:

```vue-html
<STable :data="rows" scroll-height="16rem" :virtualize="{ estimateSize: 48, overscan: 12 }" />
```

Hilangkan salah satu field (atau berikan `virtualize` sebagai `true`) dan default ke `estimateSize: 40, overscan: 8`.

Virtualizing menggantikan pagination sebagai strategi untuk dataset besar - sementara `virtualize` diatur, `page-size` tidak berpengaruh dan kontrol pagination tidak dirender.

### Ukuran, garis grid, dan striped rows

`size` (`sm` / `md` / `lg`) mengontrol padding sel dan ukuran teks. `gridlines` menambahkan border di sekitar setiap sel alih-alih hanya divider baris, dan `striped` mengganti background baris secara bergantian:

::component-example{name="table-styling"}
::

Tabel gridlines mempertahankan satu outer frame rounded di sekitar scroll viewport, dengan garis antar kolom dan baris. Frame yang sama tetap ada di empty dan loading states; tidak ada border tabel ekstra yang ditambahkan. Gunakan `ui.wrapper` untuk menyesuaikan frame dan `ui.th` / `ui.td` untuk garis sel.

```vue-html
<STable :data="users" gridlines striped size="sm">
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
  <SColumn field="role" header="Role" />
</STable>
```

### Loading

`loading` menumpangkan spinner di atas tabel sambil membiarkan baris yang ada tetap terlihat di bawahnya, daripada beralih ke empty state:

::component-example{name="table-loading"}
::

```vue-html
<STable :data="users" :loading="loading">
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
</STable>
```

### Export

`STable` mengekspos metode `exportCsv(filename?)` melalui template ref - mengunduh setiap baris yang cocok dengan filter/sort saat ini di semua halaman (bukan hanya halaman saat ini), melewatkan kolom seleksi/expand sintetis apa pun:

::component-example{name="table-export"}
::

```vue-html
<script setup lang="ts">
const tableRef = ref()
</script>

<template>
  <SButton @click="tableRef.exportCsv('users.csv')">
    Export CSV
  </SButton>
  <STable ref="tableRef" :data="users">
    <SColumn field="name" header="Name" />
    <SColumn field="email" header="Email" />
  </STable>
</template>
```

### Server-side / manual mode

Secara default, `STable` mensortir/menfilter/memaginate `data` sendiri, secara lokal, setiap waktu. Atur `manual-sorting`/`manual-filtering`/`manual-pagination` saat `data` sudah disortir/difilter/dipaginate server-side - masing-masing membuat concern tersebut tidak ikut dalam local row model (istilah TanStack untuk daftar baris aktual yang dihitung setelah menerapkan sorting/filtering/pagination), sehingga `STable` tidak secara redundan (dan salah) memproses ulang slice yang sudah ditangani server. `sorting`/`global-filter`/`page-index` tetap menggerakkan UI dan tetap memancarkan event `update:*` mereka secara normal; hanya local row model di belakangnya yang berubah.

`manual-pagination` juga menyembunyikan UI pagination bawaan sepenuhnya - tidak ada cara untuk mendapatkan page count nyata dari slice server-paginated dari `data`, dan menebaknya akan menyesatkan. Bawa [SPagination](/components/navigation/pagination) Anda sendiri sebagai gantinya, bound ke apa pun yang server Anda kembalikan, dengan cara yang sama seperti tabel ini mengharapkan Anda membawa search input sendiri untuk `global-filter` (lihat [Penggunaan](#penggunaan) di atas) daripada merender sendiri:

```vue-html
<script setup lang="ts">
const sorting = ref([])
const pageIndex = ref(0)
const total = ref(0)
const rows = ref([])

watch([sorting, pageIndex], async () => {
  const result = await fetchUsers({ sorting: sorting.value, page: pageIndex.value })
  rows.value = result.rows
  total.value = result.total
}, { immediate: true })
</script>

<template>
  <STable
    v-model:sorting="sorting"
    v-model:page-index="pageIndex"
    :data="rows"
    manual-sorting
    manual-pagination
  >
    <SColumn field="name" header="Name" sortable />
    <SColumn field="email" header="Email" sortable />
  </STable>
  <SPagination
    :page="pageIndex + 1"
    :total="total"
    :items-per-page="10"
    @update:page="(page) => pageIndex = page - 1"
  />
</template>
```

### Escape hatch: raw column defs

Untuk type inference TanStack penuh (atau fitur yang `<SColumn>` tidak ekspos), berikan prop `columns` sebagai gantinya dari anak `<SColumn>`. Definisi kolom raw juga dimulai sebagai non-sortable; atur `enableSorting: true` pada kolom yang harus disortir. `STable` menyimpulkan tipe barisnya dari `data`, dan `TableColumnDef<TData>` memeriksa accessor keys dan render contexts terhadap tipe yang sama. `createTableColumnHelper<TData>()` di-auto-import oleh modul Nuxt dan mengikat feature generic TanStack v9 ke feature set tetap yang digunakan oleh `STable`:

```vue
<script setup lang="ts">
interface User { id: string, name: string, age: number }

const column = createTableColumnHelper<User>()
const columns = column.columns([
  column.accessor('name', { header: 'Name', enableSorting: true }),
  column.accessor('age', {
    header: 'Age',
    enableSorting: true,
    cell: context => context.getValue().toFixed(0),
  }),
])
</script>

<template>
  <STable :data="users" :columns="columns" />
</template>
```

## Known limitation

Prop `field` milik `<SColumn>` tetap `string` biasa, bukan `keyof TData` - ini adalah keterbatasan Vue yang nyata (generic type parameter parent tidak berpropagasi ke komponen anak yang direferensikan dalam template-nya), bukan sesuatu yang unik untuk `STable` - setiap API tabel declarative-column-as-children di Vue memiliki gap yang sama. Sebagai safety net murah, `STable` memperingatkan di dev mode (bukan production) jika `field` kolom tidak ada sebagai key pada baris pertama `data` - menangkap typo tanpa tipu-tipu type-system. Untuk compile-time safety yang sebenarnya, gunakan escape hatch `columns` di atas sebagai gantinya.

Komponen tabel itu sendiri adalah generic. `columns`, `getRowId`, `rowClass`, `rowStyle`, row events, dan slot `expanded` semua berbagi tipe baris yang diinfer dari `data`.

### Aksesibilitas

Header yang dapat disortir dapat dioperasikan dengan keyboard (<kbd>Enter</kbd>/<kbd>Space</kbd> men toggle sort, sama seperti klik) dan mengekspos `aria-sort` yang mencerminkan state saat ini. Toggle row-expansion adalah `<button>` nyata dengan `aria-label` "Expand row"/"Collapse row" yang diperbarui sesuai state-nya. Setiap kolom yang dapat difilter memiliki tombol filter berlabel yang membuka filter teksnya dalam popover; aksi Clear-nya mereset filter kolom itu. Checkbox column-visibility adalah elemen `SCheckbox` standar, dan pagination adalah [SPagination](/components/navigation/pagination) bersarang, jadi keduanya mewarisi perilaku aksesibilitas komponen-komponen tersebut daripada mereimplementasinya di sini.

## Custom `:ui`

`<SColumn>`/`<SColumnGroup>` tidak merender DOM sendiri (lihat [Escape hatch: raw column defs](#escape-hatch-raw-column-defs) di atas) dan tidak memiliki file tema - setiap visual slot berada pada `STable` itu sendiri. Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot - berikut adalah file tema `Table` sendiri:

::theme-source{name="table"}
::

## Props

### STable

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `data` | `TData[]` | - |
| `columns` | `TableColumnDef<TData>[]` | - |
| `selectable` | `boolean` | `false` |
| `getRowSelectionLabel` | `(row: TData) => string` | Localized row number |
| `selectOnRowClick` | `boolean` | `false` |
| `rowHover` | `boolean` | `false` |
| `pageSize` | `number` | - (tidak ada pagination sampai diatur) |
| `loading` | `boolean` | `false` |
| `sorting` | `SortingState` | - |
| `defaultSorting` | `SortingState` | - |
| `rowSelection` | `TableRowSelectionState` | - |
| `globalFilter` | `string` | - |
| `pageIndex` | `number` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `gridlines` | `boolean` | `false` |
| `striped` | `boolean` | `false` |
| `expandable` | `boolean` | `false` |
| `tree` | `boolean` | `false` |
| `getSubRows` | `(row: TData, index: number) => readonly TData[] \| undefined` | `row => row.subRows` saat `tree` aktif |
| `expanded` | `TableExpandedState` | - |
| `columnVisibility` | `TableColumnVisibilityState` | - |
| `columnToggle` | `boolean` | `false` |
| `scrollHeight` | `string` | - |
| `virtualize` | `boolean \| { estimateSize?: number; overscan?: number }` | `false` |
| `manualSorting` | `boolean` | `false` |
| `manualFiltering` | `boolean` | `false` |
| `manualPagination` | `boolean` | `false` |
| `getRowId` | `(row: TData, index: number) => string` | row index |
| `rowClass` | `(row: TData) => string \| undefined` | - |
| `rowStyle` | `(row: TData) => Record<string, string> \| undefined` | - |
| `ui` | `Partial<Record<TableSlot, string \| object>>` | - |

## Emits

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:sorting` | `TableSortingState` | Backing `v-model:sorting` - terpicu saat state sort berubah (lihat [Presort](#presort)) |
| `update:rowSelection` | `TableRowSelectionState` | Backing `v-model:row-selection` - terpicu saat baris terpilih berubah |
| `update:globalFilter` | `string` | Backing `v-model:global-filter` - terpicu saat nilai global filter berubah |
| `update:pageIndex` | `number` | Backing `v-model:page-index` - terpicu saat halaman saat ini berubah (lihat [Pagination](#pagination)) |
| `update:expanded` | `TableExpandedState` | Backing `v-model:expanded` - terpicu saat state row expansion berubah (lihat [Row expansion](#row-expansion)) |
| `update:columnVisibility` | `TableColumnVisibilityState` | Backing `v-model:column-visibility` - terpicu saat visibilitas kolom berubah (lihat [Column visibility toggle](#column-visibility-toggle)) |
| `rowClick` | `(row: TData, event: MouseEvent)` | Terpicu saat body row diklik |
| `rowContextmenu` | `(row: TData, event: MouseEvent)` | Terpicu saat body row di-right-click |

### SColumn

| Prop | Tipe | Default |
| --- | --- | --- |
| `field` | `string` | - (required) |
| `header` | `string` | - |
| `footer` | `string` | - |
| `sortable` | `boolean` | `false` |
| `filterable` | `boolean` | `false` |
| `pinned` | `'left' \| 'right'` | - |

### SColumnGroup

| Prop | Tipe | Default |
| --- | --- | --- |
| `header` | `string` | - |
| `footer` | `string` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `empty` | - | Ditampilkan saat `data` kosong |
| `expanded` | `{ row }` | Konten detail untuk baris yang diperluas (membutuhkan `expandable`) |

Slot default milik `<SColumn>` menyesuaikan konten sel kolom itu - lihat [Custom cell content](#custom-cell-content) di atas. `<SColumn>`/`<SColumnGroup>` juga mengambil slot `header`/`footer` (scoped dengan `{ column }`) - lihat [Custom header content](#custom-header-content) di atas.

## Methods

Akses ini melalui template ref pada `STable`.

| Method | Deskripsi |
| --- | --- |
| `exportCsv(filename?: string)` | Mengunduh semua baris yang cocok (di seluruh halaman) sebagai file CSV |
