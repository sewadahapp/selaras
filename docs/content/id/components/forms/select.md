---
title: Select
description: Select yang dibatasi oleh opsinya - single atau multiple, opsional dapat dicari dan divirtualisasi, dibangun di atas primitif Combobox milik Reka UI.
order: 22
---

## Penggunaan

`items` menerima array string/number primitif atau objek opsi. Primitif adalah label yang ditampilkan sekaligus nilai model; angka harus finite, dan `1` numerik serta `"1"` string tetap berbeda. Opsi objek menampilkan `label` secara default. Jika objek memiliki field `value`, field tersebut adalah nilai modelnya; jika tidak, seluruh objek adalah nilai modelnya. Atur `labelKey` atau `valueKey` untuk menggunakan field yang berbeda.

```vue
<script setup lang="ts">
const role = ref('admin')
const count = ref(0)
const roles = ['admin', 'editor', 'viewer']
const counts = [0, 1, 2]
</script>

<template>
  <SSelect v-model="role" :items="roles" />
  <SSelect v-model="count" :items="counts" />
</template>
```

Gunakan `modelValue` untuk seleksi yang dikontrol parent atau `defaultValue` untuk seleksi awal yang tidak terkontrol. Form reset mengembalikan `defaultValue` (atau seleksi kosong) dan memancarkan update; parent yang terkontrol memutuskan apakah menerimanya. Berikan `name` untuk submit satu field per nilai terpilih. Nilai primitif disubmit sebagai string dan nilai objek sebagai JSON. Seleksi kosong tidak mensubmit field apa pun; kontrol disabled tidak mensubmit apa pun. Gunakan `form` untuk mengasosiasikan kontrol dengan ID form eksternal.

::component-example{name="select-basic"}
::

Seleksi baru berasal dari `items`; untuk teks bebas dengan saran, gunakan [Autocomplete](/components/forms/autocomplete) sebagai gantinya. Seleksi async atau parent-controlled dapat sementara menamai identitas yang opsinya belum dimuat; Select mempertahankan identitas itu dan menggunakan teks sebagai fallback.

```vue
<script setup lang="ts">
const fruit = ref('apple')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]
</script>

<template>
  <SSelect v-model="fruit" placeholder="Pick a fruit" :items="fruitItems" />
</template>
```

Opsi terpilih selalu menunjukkan tanda centang di daftar, melalui `ComboboxItemIndicator` milik Reka UI - ini aktif secara default sebagai alternatif opt-in untuk baris yang disorot.

### Filtering

Klik di mana saja pada trigger membukanya - bukan hanya ikon. Saat `searchable` diatur, input filter berada di dalam popover, bukan di trigger itu sendiri.

::component-example{name="select-searchable"}
::

```vue-html
<SSelect v-model="fruit" searchable placeholder="Pick a fruit" :items="fruitItems" />
```

### Multiple selection

`multiple` mengubah `modelValue` menjadi array identitas opsi, mempertahankan nilai string dan numerik. `displayMode` mengontrol bagaimana nilai terpilih dirender di trigger - `comma` (default) menggabungkan label sebagai teks, `chip` merender pil yang dapat dihapus. Kedua mode terpotong di `maxChips` (default 3) dan menunjukkan ringkasan "+N more" - hover di atasnya menampilkan sisanya di tooltip, dan mengkliknya masih membuka popover seperti bagian trigger lainnya.

::component-example{name="select-multiple-comma"}
::

```vue-html
<SSelect v-model="fruits" multiple :max-chips="2" :items="fruitItems" />
```

::component-example{name="select-multiple-chip"}
::

```vue-html
<SSelect v-model="fruits" multiple display-mode="chip" :max-chips="2" :items="fruitItems" />
```

### Mengubah mode seleksi

Untuk Select yang tidak terkontrol, mengubah `multiple` mengkonversi seleksi lokalnya sekali: nilai tunggal `value` menjadi `[value]`, `undefined` menjadi `[]`, seleksi multiple menjadi nilai pertamanya, dan array kosong menjadi `undefined`. Beralih ke mode single menghilangkan seleksi aktif selanjutnya. Konversi itu memancarkan satu event `update:modelValue`.

`defaultValue` ditangkap saat mount dan tidak ditarget ulang oleh perubahan prop kemudian. Reset native memproyeksikan default yang ditangkap ke mode saat ini: dengan `defaultValue: [0, 1]`, reset dalam mode single menghasilkan `0`; setelah kembali ke mode multiple, reset menghasilkan `[0, 1]` lagi.

Parent yang terkontrol harus mengubah `modelValue` dan `multiple` dalam render yang sama: array saat `multiple` true, dan skalar atau `undefined` saat false. `undefined` diperbolehkan sebagai nilai multiple kosong. Nilai skalar dalam mode multiple, atau array apa pun dalam mode single, melempar error deskriptif. Select juga mengharuskan setiap nilai dalam `modelValue` atau `defaultValue` multiple array unik. Ini termasuk identitas async yang belum diresolve; angka `1` dan string `'1'` adalah nilai yang berbeda.

### Checkbox selection

Tidak ada prop "checkbox mode" terpisah - slot `item` sudah memberi Anda opsi untuk merender apa pun per baris, termasuk [Checkbox](/components/forms/checkbox) yang murni visual yang mencerminkan state terpilih baris tersebut:

::component-example{name="select-checkbox-selection"}
::

```vue-html
<SSelect v-model="fruits" multiple :items="fruitItems">
  <template #item="{ item }">
    <SCheckbox :model-value="fruits.includes(item.value)" class="pointer-events-none" tabindex="-1" />
    {{ item.label }}
  </template>
</SSelect>
```

Checkbox bersifat dekoratif (`pointer-events-none`, `tabindex="-1"`) - mengklik baris masih yang menggerakkan seleksi, sama seperti opsi lainnya.

### Clear

`clearable` menambahkan tombol yang mereset seleksi - `undefined` untuk single select, array kosong untuk `multiple`. Ia hanya merender setelah ada sesuatu untuk dihapus, dan mengkliknya tidak pernah membuka popover.

Aksi tetap terlihat selama loading dan di samping konten `trailing` kustom. Kontrol kosong dan disabled menyembunyikannya. Clear mengembalikan fokus ke trigger. Target `ghost` netral inset menggunakan ikon yang disesuaikan dengan ukuran chevron. Sesuaikan dengan `ui.clear` atau `#clear-icon`; lihat [shared clear styling](/overview/theming/component-styling#kontrol-clear-field).

::component-example{name="select-clear"}
::

```vue-html
<SSelect v-model="fruit" clearable placeholder="Pick a fruit" :items="fruitItems" />
```

### Custom option rendering

Slot `item` menggantikan konten opsi di daftar (dan berfungsi ganda sebagai konten chip dalam `displayMode="chip"`); slot `value` menggantikan tampilan trigger sendiri untuk single select. Bersama-sama mereka memungkinkan select membawa lebih dari teks polos dari ujung ke ujung:

::component-example{name="select-custom-option"}
::

```vue-html
<SSelect v-model="status" :items="statusItems">
  <template #item="{ item }">
    <span class="size-2 rounded-full" :class="item.color" />
    {{ item.label }}
  </template>
  <template #value="{ selected }">
    <span v-if="selected" class="inline-flex items-center gap-2">
      <span class="size-2 rounded-full" :class="selected.raw?.color" />
      {{ selected.label }}
    </span>
  </template>
</SSelect>
```

### Custom objects

Select menyimpulkan model dan event update-nya dari field identitas opsi. Atur `valueKey` untuk menggunakan field tertentu; tanpanya, `value` digunakan jika ada, dan seluruh objek digunakan jika tidak ada. `labelKey` default ke `label`. Seleksi single memancarkan identitas terpilih atau objek, `multiple` memancarkan array, dan boolean dinamis menerima salah satu bentuk. Array readonly dan grup didukung. Setiap identitas harus unik di seluruh daftar, termasuk opsi disabled dan opsi dalam grup yang berbeda; duplikat melempar saat Select membaca opsi. Angka `1` dan string `'1'` adalah identitas yang berbeda.

Records dengan string `label` dan array `items` merepresentasikan grup; hindari kombinasi reserved itu pada opsi individu.

Untuk opsi async, deklarasikan tipe item bahkan saat array dimulai kosong. Nilai terpilih yang hilang tetap utuh sampai opsi dimuat. Slot `value` menerima `selected.raw` sebagai `undefined` selama waktu itu; gunakan optional chaining saat membaca metadata. Slot `item` menerima opsi lengkap, dan seleksi objek yang belum diresolve masih dapat menampilkan field label yang dikonfigurasi.

Tipe yang diekspor mengambil tipe entri opsi: `SelectProps<number>` menggambarkan item primitif numerik, sementara `SelectProps<{ value: number, label: string }>` menggambarkan records opsi. Tulis item objek sebagai array readonly `Row[]`, atau `readonly (Row | SelectGroup<Row>)[]` saat mencampur opsi dan grup; tidak ada alias authoring `SelectItems`, `SelectOption`, atau `SelectOptionGroup` terpisah. Wrapper yang membutuhkan tipe items yang tervalidasi persis dapat menggunakan `SelectProps<Row, 'id'>['items']`. Kunci kustom dan mode multiple dapat dideklarasikan sebagai `SelectProps<Row, 'id', true>`; `SelectEmits` menggunakan parameter yang sama. Fungsi render dapat mengkhususkan komponen secara langsung dengan `h(Select<Row, 'id', true>, props)`. Konsumen template biasanya tidak membutuhkan parameter generic eksplisit.

Impor helpers publik dari `@sewadah/selaras/types`. `SelectEntryItem`, `SelectEntryGroup`, dan `SelectIdentityKeys` adalah mekanik internal yang dihapus; turunkan tipe slot melalui `SelectSlots` (atau `AutocompleteSlots`). Fungsi normalisasi internal `useComboboxSelect`, `flattenItems`, dan `isOptionGroup` tidak lagi diimpor secara otomatis.

`items` tidak harus `{ label, value }` - arahkan `labelKey`/`valueKey` ke field apa pun yang sudah dimiliki data Anda:

::component-example{name="select-custom-objects"}
::

```vue-html
<SSelect
  v-model="userId"
  :items="users"
  label-key="fullName"
  value-key="id"
/>
```

### Grouped options

Sarangkan string, angka, atau objek opsi di bawah entri `{ label, items }`:

::component-example{name="select-grouped"}
::

```js
const items = [
  { label: 'Fruits', items: ['Apple', 'Banana'] },
  { label: 'Vegetables', items: [{ label: 'Carrot', value: 'carrot' }] },
]
```

Header grup adalah teks polos secara default, tetapi slot `group` dapat menggantikannya sepenuhnya - ia menerima seluruh entri `{ label, items }`:

::component-example{name="select-group-custom-header"}
::

```vue-html
<SSelect :items="items">
  <template #group="{ group }">
    <span class="flex items-center justify-between">
      <span>{{ group.label }}</span>
      <span class="text-[var(--selaras-resolved-text-muted)]">{{ group.items.length }}</span>
    </span>
  </template>
</SSelect>
```

### Virtualisasi

Untuk daftar opsi besar, `virtualize` hanya merender baris yang terlihat (didukung oleh `@tanstack/vue-virtual` melalui Reka UI `ComboboxVirtualizer`). Berikan `true` untuk default, atau objek untuk menyesuaikan `estimateSize`/`overscan`.

::component-example{name="select-virtualize"}
::

```vue-html
<SSelect v-model="value" searchable virtualize :items="fiveThousandItems" />
```

Satu caveat: memvirtualisasi daftar `items` yang dikelompokkan meratakan grup (keterbatasan Reka UI) - header grup tidak merender saat divirtualisasi.

Ini hanya menjendela apa yang sudah ada di `items` - tidak mengambil lebih banyak data saat Anda scroll. Tidak ada lazy-loading halaman tambahan bawaan; fetch atau halaman ke `items` sendiri jika set lengkap tidak dapat tinggal di memori.

### Search text

Field pencarian popover adalah filter murni, bukan tampilan seleksi saat ini - ia selalu reset ke kosong saat Anda memilih opsi atau menutup popover. Bind `v-model:search-term` jika Anda perlu membaca atau mengontrol teks yang diketik sendiri (misalnya untuk mendorong pencarian jarak jauh):

```vue-html
<SSelect v-model="fruit" v-model:search-term="query" searchable :items="fruitItems" />
```

`resetSearchTermOnBlur`/`resetSearchTermOnSelect` (keduanya default `true`, diteruskan dari Reka UI `ComboboxRoot`) mengontrol apakah ia reset sama sekali - atur salah satu ke `false` jika Anda mengendalikan field sendiri dan tidak ingin ia dihapus dari bawah Anda.

### Ukuran

`size` menerima `sm` / `md` / `lg`, dengan tinggi single-line default 32 / 40 / 44px pada root font-size 16px. Ini cocok dengan Button dan Input, termasuk saat `clearable` atau `loading` diaktifkan. Seleksi wrapping dapat tumbuh melebihi minimum itu. Lihat [Ukuran kontrol](/overview/theming/component-styling#ukuran-kontrol).

### States

`loading` menukar chevron trailing dengan spinner (trigger tetap dapat diklik - tidak menonaktifkan select), `disabled` mencegah membukanya sepenuhnya, dan `invalid` mengubah ring ke warna fokus role danger. Ketiganya menyatu dengan semua yang ada di atas halaman ini - lihat [Props](#props).

### Warna

`color` mengatur warna focus-ring - ring resting (tidak difokuskan) tetap `--selaras-resolved-border-default` terlepas dari apapun, dan `invalid` selalu menang atas `color` kustom:

::component-example{name="select-colors"}
::

```vue-html
<SSelect v-model="primary" color="primary" :items="items" />
<SSelect v-model="success" color="success" :items="items" />
<SSelect v-model="danger" color="danger" :items="items" />
```

### Arrow

`arrow` menunjukkan segitiga penunjuk kecil yang menghubungkan panel ke trigger-nya. Objek mengatur lebar, tinggi, ujung rounded, atau clearance sudut (`padding`):

::component-example{name="select-arrow"}
::

```vue-html
<SSelect v-model="fruit" arrow :items="items" />
<SSelect v-model="fruit" :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }" :items="items" />
```

### Adaptive presentation

`adaptive` mengubah popover menjadi [Modal](/components/overlays/modal) yang dipusatkan di bawah breakpoint adaptif yang dikonfigurasi. Ini opt-in (default `false`), memilih presentasi saat membuka, dan mempertahankannya sampai tutup:

::component-example{name="select-adaptive"}
::

### Panel positioning dan portal

Gunakan `positioning` untuk sisi anchored list, alignment, offsets, dan perilaku collision. `portal` default ke document body; atur ke `false` untuk merender inline, atau ke CSS selector atau `HTMLElement` untuk memilih target teleport. Opsi ini memengaruhi anchored list; adaptive Select modal memiliki presentasi sendiri. Gunakan `ui.content` untuk styling visual.

```vue-html
<SSelect :items="fruitItems" :positioning="{ side: 'top', align: 'end', sideOffset: 8 }" portal="#overlay-root" />
```

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` dan `size` keduanya fallback ke state FormField sendiri saat tidak diatur langsung pada select.

### Aksesibilitas

Trigger mengekspos `combobox` yang dilabeli dengan expanded state dan relasi ke daftar opsi popup. `SFormField` menyediakan label yang terlihat; instance standalone dapat menggunakan `aria-label` atau `aria-labelledby`. Input pencarian dan aksi footer berada di luar hierarki opsi listbox. Adaptive modal menyediakan semantik dialog dan mengembalikan fokus ke trigger saat ditutup.

Tombol panah menggerakkan opsi yang disorot, <kbd>Enter</kbd> memilihnya, <kbd>Escape</kbd> menutup popover, dan mengetik saat tertutup (atau saat `searchable`) memfilter daftar, mengikuti [pola ARIA combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Select` sendiri:

Global dan scoped overrides menggunakan `ui.select`; Autocomplete sengaja membaca key yang sama karena kedua komponen menggunakan resep ini.

::theme-source{name="select"}
::

### Konten leading dan trailing kustom

Gunakan `#leading` dan `#trailing` untuk teks, ikon, atau tombol di dalam bingkai field. Slot menerima `{ disabled, size, buttonSize }`; `buttonSize` cocok untuk Button di dalam ukuran field saat ini. Berikan kontrol interaktif dengan label yang dapat diakses, gunakan `type="button"`, dan teruskan `disabled` untuk mencocokkan state field.

Konten kustom tetap terlihat di samping tombol clear bawaan, indikator loading, dan kontrol dropdown. Field menyediakan ruang untuk konten yang dirender, termasuk suffix yang lebarnya berubah. Gunakan `ui.leading` dan `ui.trailing` untuk menyesuaikan wrapper-nya.

::component-example{name="select-addons"}
::

Kontrol kustom merender di luar tombol trigger, jadi mereka dapat menerima fokus keyboard tanpa membuat tombol bersarang atau membuka daftar opsi saat diklik. Dengan `adaptive`, slot ini menyesuaikan field asli; modal mempertahankan pencarian dan kontrol seleksi khususnya sendiri.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` / `form` | `string` | - |
| `open` | `boolean` | uncontrolled |
| `defaultOpen` | `boolean` | `false` |
| `items` | `readonly Entry[]` | required |
| `valueKey` / `labelKey` | `string` | `'value'` saat ada, jika tidak objek opsi / `'label'` |
| `modelValue` | identity, identity array, atau `undefined` | - |
| `defaultValue` | sama dengan `modelValue` | mount-captured initial/reset value |
| `multiple` | `boolean` | `false` |
| `searchable` | `boolean` | `false` |
| `searchTerm` | `string` | - |
| `resetSearchTermOnBlur` | `boolean` | `true` |
| `resetSearchTermOnSelect` | `boolean` | `true` |
| `virtualize` | `boolean \| { estimateSize?: number; overscan?: number }` | `false` |
| `displayMode` | `'comma' \| 'chip'` | `'comma'` |
| `maxChips` | `number` | `3` |
| `clearable` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `placeholder` | `string` | - |
| `disabled` / `required` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `invalid` | `boolean` | `false` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `arrow` | `boolean \| RoundedArrowConfig` | `false` |
| `positioning` | `OverlayPositioning` | anchored list defaults |
| `portal` | `boolean \| string \| HTMLElement` | `true` (document body) |
| `adaptive` | `boolean` | `false` |
| `ui` | `Partial<Record<SelectSlot, string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `leading` / `trailing` | `{ disabled, size, buttonSize }` | Konten field kustom di samping kontrol bawaan |
| `item` | `{ item }` | Rendering opsi kustom (juga digunakan untuk chip) |
| `value` | `{ selected }` | Tampilan trigger kustom (single-select saja) |
| `group` | `{ group }` | Header grup kustom (menggantikan teks label polos) |
| `empty` | - | Ditampilkan saat `items` kosong |
| `empty-filter` | - | Ditampilkan saat pencarian tidak menghasilkan kecocokan |
| `header` / `footer` | - | Konten di atas/bawah daftar opsi |
| `clear-icon` | - | Menggantikan ikon tombol clear (default: `hugeicons:cancel-01`) |
| `dropdown-icon` | - | Menggantikan chevron trigger (default: `hugeicons:arrow-down-01`) |
| `loading-icon` | - | Menggantikan spinner yang ditampilkan saat `loading` (default: `hugeicons:loading-02`) |
| `filter-icon` | - | Menggantikan ikon field pencarian popover (default: `hugeicons:search-01`) |

## Events

| Event | Payload | Tujuan |
| --- | --- | --- |
| `update:modelValue` | identity, identity array, atau `undefined` | Mengusulkan nilai seleksi atau clear/reset |
| `update:open` | `boolean` | Meminta membuka atau menutup anchored panel atau adaptive modal |
| `update:searchTerm` | `string` | Memperbarui teks filter, termasuk reset yang dikonfigurasi |

Gunakan `v-model:open` untuk mengontrol presentasi. Tanpanya, `defaultOpen` menyediakan visibility awal. Nilai `open` eksplisit tetap otoritatif, jadi parent dapat menolak permintaan membuka atau menutup.
