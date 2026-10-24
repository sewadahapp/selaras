---
title: Autocomplete
description: Input teks bebas dengan saran - nilai yang diketik tidak harus cocok dengan opsi, dibangun di atas fondasi Combobox yang sama seperti Select.
order: 23
---

## Penggunaan

Saran menerima array string/number atau objek opsi. Primitif adalah label dan nilai sekaligus. Objek menampilkan `label` secara default; field `value` digunakan saat ada, dan objek tanpanya adalah nilai model. Atur `labelKey` atau `valueKey` untuk memilih field lain. Saran yang ada mempertahankan perbedaan `1` numerik dan `"1"` string. Teks bebas yang baru dibuat selalu berupa string; saran numerik tidak menyebabkan teks yang diketik di-coerce. Gunakan `forceSelection` untuk melarang membuat nilai.

Autocomplete menyimpulkan model dan event update dari field identitas sarannya. Saran numerik mengizinkan `number | string | undefined` dalam mode single dan `(number | string)[]` dalam mode multiple. Literal `forceSelection` mempersempit tipe tersebut ke identitas saran; boolean dinamis mempertahankan string union. Array opsi/grup readonly dan field `valueKey`/`labelKey` tingkat atas kustom didukung. Setiap identitas saran harus unik di seluruh daftar, termasuk saran yang disabled dan saran dalam grup berbeda; duplikat melempar saat Autocomplete membaca opsi. `1` numerik dan `'1'` string tetap berbeda. Deklarasikan tipe item untuk array async yang awalnya kosong.

Tipe yang diekspor menggunakan tipe entri opsi: `AutocompleteProps<number>` menggambarkan item primitif numerik, sementara `AutocompleteProps<{ value: number, label: string }>` menggambarkan records opsi. Parameter adalah entri, identity key, mode multiple, dan mode forced.

Author saran sebagai readonly `Row[]`, atau sebagai `readonly (Row | SelectGroup<Row>)[]` saat mencampur saran dan grup; tidak ada alias authoring `SelectItems`, `SelectOption`, atau `SelectOptionGroup` terpisah. Wrapper yang membutuhkan tipe items yang tervalidasi persis dapat menggunakan `AutocompleteProps<Row, 'id'>['items']`. Misalnya, `AutocompleteProps<Row, 'id', true, true>` menggambarkan forced multiple selection. `AutocompleteEmits` menggunakan parameter yang sama. Fungsi render dapat mengkhususkan `Autocomplete<Row, 'id', true, true>` secara langsung; template biasanya menyimpulkannya. Impor helpers publik dari `@sewadah/selaras/types`; turunkan tipe slot melalui `AutocompleteSlots`.

`forceSelection` memblokir teks baru yang tidak cocok. Ia tidak menghapus nilai yang ada saat di-toggle secara dinamis atau mengharuskan identitas async yang dipilih sudah berada di opsi saat ini. Reset native mengembalikan default yang ditangkap, termasuk string yang dibuat sebelum perubahan dinamis. Input idle menyegarkan label terpilih saat opsi dimuat; query aktif dan `searchTerm` yang dikontrol parent mempertahankan teksnya.

`defaultValue` menginisialisasi seleksi yang tidak terkontrol dan adalah target reset formulir native. `modelValue` tetap parent-controlled. Dengan `name`, setiap nilai terpilih disubmit sebagai field; primitif adalah string dan objek adalah JSON. Seleksi kosong atau disabled tidak mensubmit apa pun. `form` dapat mereferensi ID form eksternal.

Tid seperti [Select](/components/forms/select), apa pun yang pengguna ketik dapat menjadi nilai bahkan jika tidak cocok dengan saran - memilih saran adalah shortcut, bukan persyaratan.

::component-example{name="autocomplete-basic"}
::

```vue
<script setup lang="ts">
const value = ref('')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]
</script>

<template>
  <SAutocomplete v-model="value" placeholder="Type anything" :items="fruitItems" />
</template>
```

Input itu sendiri selalu menjadi trigger - mengetik langsung berfungsi, tanpa langkah "buka" terpisah, karena tidak ada mode `searchable: false` seperti Select di sini.

### Dropdown

Secara default tidak ada tombol "browse everything" bawaan - mengetik adalah seluruh interaksi. `dropdown` menambahkannya tetap: chevron trailing yang membuka popover dan menghapus apa pun yang diketik, jadi selalu menunjukkan daftar lengkap daripada tetap scoped ke filter saat ini.

::component-example{name="autocomplete-dropdown"}
::

```vue-html
<SAutocomplete v-model="value" dropdown placeholder="Type or browse" :items="fruitItems" />
```

### Multiple values

`multiple` menggunakan tampilan comma-separated secara default, dengan query yang dapat diedit di samping label terpilih. `displayMode="chip"` menunjukkan chip yang dapat dihapus sebagai gantinya. Kedua mode menawarkan opsi Create untuk teks yang belum ada di `items`. Tekan Enter untuk menambahkannya, atau pindah ke saran yang ada terlebih dahulu. Setelah query terhapus, daftar terbuka menunjukkan semua opsi yang tersedia lagi. Memilih opsi yang sudah dipilih membiarkan seleksi tetap ada; mode chip juga menawarkan tombol hapus di setiap nilai terpilih. Dalam mode comma, tekan Backspace dengan query kosong untuk menghapus nilai terakhir.

::component-example{name="autocomplete-multiple-comma"}
::

```vue-html
<SAutocomplete v-model="fruits" multiple :items="fruitItems" />
```

::component-example{name="autocomplete-multiple"}
::

```vue-html
<SAutocomplete v-model="tags" multiple display-mode="chip" :items="fruitItems" />
```

### Mengubah mode seleksi

Untuk Autocomplete yang tidak terkontrol, mengubah `multiple` mengkonversi seleksi lokalnya sekali: nilai tunggal `value` menjadi `[value]`, `undefined` menjadi `[]`, seleksi multiple menjadi nilai pertamanya, dan array kosong menjadi `undefined`. Beralih ke mode single menghilangkan seleksi aktif selanjutnya. Konversi itu memancarkan satu event `update:modelValue`. `defaultValue` yang ditangkap tidak berubah setelah mount; reset memproyeksikannya ke mode saat ini. Misalnya, `defaultValue: [0, 1]` reset ke `0` dalam mode single dan `[0, 1]` setelah kembali ke mode multiple.

Parent terkontrol harus mengubah `modelValue` dan `multiple` dalam render yang sama: array saat `multiple` true, dan skalar atau `undefined` saat false. `undefined` diperbolehkan sebagai nilai multiple kosong. Nilai skalar dalam mode multiple, atau array apa pun dalam mode single, melempar error deskriptif. Setiap nilai dalam `modelValue` atau `defaultValue` multiple array juga harus unik, termasuk identitas async yang dibuat atau belum diresolve. `1` numerik dan `'1'` string adalah nilai yang berbeda. Autocomplete tidak mengkonversi nilai terkontrol atau memancarkan update hanya karena mode berubah. Mengubah mode juga mempertahankan query aktif, popover terbuka, dan fokus saat input sedang difokuskan. Ia tidak mengambil fokus dari tombol mode atau kontrol lain. `searchTerm` yang dikontrol parent mempertahankan teksnya; label input idle mengikuti `resetSearchTermOnSelect`. Mengubah mode saat komposisi IME membatalkan pengeditan dan meminta query serta popup dihapus. Selesaikan komposisi sebelum mengubah mode untuk mempertahankan query.

### Clear

`clearable` mereset seleksi dan draft query. Ia muncul saat salah satunya berisi konten, termasuk teks yang diketik sebelum saran apa pun dipilih. Ia tersembunyi saat kosong, `disabled`, atau `readonly`; loading dan konten `trailing` kustom tidak menyembunyikannya. Klik clear tidak meng-commit draft sebagai nilai baru, dan mengembalikan fokus ke editor.

Sama seperti [Select](/components/forms/select#clear), ia menggunakan target `ghost` netral inset dengan glyph yang cocok dengan ikon field lainnya. Sesuaikan dengan `ui.clear` atau `#clear-icon`; lihat [shared clear styling](/overview/theming/component-styling#field-clear-controls).

::component-example{name="autocomplete-clear"}
::

```vue-html
<SAutocomplete v-model="value" clearable placeholder="Type anything" :items="fruitItems" />
```

### Force selection

Ini adalah satu perbedaan perilaku nyata dari Select, bukan hanya prop yang dibagi: `forceSelection` mengembalikan teks yang tidak cocok dengan opsi mana pun menjadi kosong saat blur atau Enter, alih-alih menerimanya sebagai nilai baru. Ia ada untuk konsumen yang menginginkan UX Autocomplete (input-as-trigger, inline filtering) tanpa benar-benar mengizinkan nilai sewenang - jika itu tujuannya dari awal, [Select](/components/forms/select) melakukan pekerjaan yang sama secara lebih langsung.

Dalam mode multiple, mengetik `bana` menunjukkan **Create "bana"** sebelum saran **Banana** yang cocok. <kbd>Enter</kbd> memilih opsi aktif, jadi Anda dapat langsung membuat `bana` atau tekan <kbd>ArrowDown</kbd> lalu <kbd>Enter</kbd> untuk memilih `Banana`. Mengklik salah satu opsi juga berfungsi. Dalam mode single, daftar menunjukkan saran yang cocok tanpa baris Create: Enter memilih saran aktif, sementara teks yang tidak cocok diterima sebagai teks bebas saat Enter atau blur. Ketika tidak ada saran yang cocok dalam mode single, popup disembunyikan. <kbd>Tab</kbd> memindahkan fokus secara normal. `forceSelection` menyembunyikan opsi Create dan menolak teks yang tidak cocok. <kbd>Enter</kbd> idle tidak menghapus chip yang ada dan dapat mensubmit form parent secara normal.

::component-example{name="autocomplete-force-selection"}
::

```vue-html
<SAutocomplete v-model="value" force-selection :items="fruitItems" />
```

### Arrow

`arrow` bekerja sama seperti [Select](/components/forms/select#arrow): gunakan `true` untuk penunjuk default atau objek untuk mengonfigurasi ukuran, ujung rounded, dan corner clearance.

::component-example{name="autocomplete-arrow"}
::

```vue-html
<SAutocomplete v-model="value" arrow :items="fruitItems" />
<SAutocomplete v-model="value" :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }" :items="fruitItems" />
```

### Custom option rendering, objects, dan groups

Slot `item`/`group` dan pemetaan `labelKey`/`valueKey` semua bekerja identik dengan Select - lihat [Custom option rendering](/components/forms/select#custom-option-rendering), [Custom objects](/components/forms/select#custom-objects), dan [Grouped options](/components/forms/select#grouped-options).

Teks yang dibuat dan seleksi async dapat tidak ada di `items`. Chip mereka menggunakan teks terpilih sampai opsi lengkap tersedia; slot `item` hanya menerima records opsi nyata. Tampilan seleksi Autocomplete adalah input yang dapat diedit; ia tidak memiliki slot `value`.

### Virtualisasi

Juga identik dengan [Select](/components/forms/select#virtualization) - `virtualize` hanya merender baris yang terlihat, `items` yang dikelompokkan diratakan saat divirtualisasi, dan ia menjendela apa yang sudah ada di `items` daripada lazy-loading lebih banyak.

### Search text

Karena input di sini ADALAH trigger, teksnya berfungsi ganda sebagai filter dan tampilan nilai saat ini: single-select menunjukkan label opsi yang dipilih setelah Anda memilihnya, multi-select membersihkan setelah setiap commit (chip menunjukkan seleksi sebagai gantinya). `v-model:search-term` dan `resetSearchTermOnBlur`/`resetSearchTermOnSelect` yang sama seperti [Select](/components/forms/select#search-text) juga berlaku di sini.

### Sizes and states

`size`, `loading`, `disabled`, `invalid`, dan `color` semua berperilaku sama seperti [Select](/components/forms/select#sizes) - lihat tabel [Props](#props) di bawah.

Input luarnya menggunakan skala tinggi default 32 / 40 / 44px yang sama seperti Input, Select, dan Button, termasuk dengan dropdown, tombol clear, atau indikator loading. Seleksi multiple dapat tumbuh saat konten mereka wrap. Lihat [Control sizes](/overview/theming/component-styling#control-sizes).

### Adaptive presentation

`adaptive` menggunakan breakpoint dan open-time latch yang sama seperti [Select](/components/forms/select#adaptive-presentation). Di layar kecil, field membuka modal yang berisi input dan saran. Seleksi single menutup modal; seleksi multiple dan entri teks bebas juga menyediakan tombol Done. Modal berbagi query dan seleksi field, dan mengembalikan fokus saat ditutup:

::component-example{name="autocomplete-adaptive"}
::

### Integrasi formulir

Juga sama seperti [Select](/components/forms/select#forms-integration) - bungkus dalam [FormField](/components/forms/form-field) untuk `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis.

### Aksesibilitas

Autocomplete merender primitif Reka UI Combobox yang sama seperti [Select](/components/forms/select#accessibility), jadi semantik ARIA combobox yang sama berlaku - `role="combobox"` dengan `aria-expanded`/`aria-controls` pada input, `role="option"` per saran, tombol panah untuk memindahkan highlight, <kbd>Enter</kbd> untuk memilih. Satu-satunya tambahan di sini adalah `aria-autocomplete="list"`, karena (tidak seperti Select) trigger adalah field teks yang dapat diedit dengan saran live saat Anda mengetik.

### Custom `:ui`

Autocomplete merender base combobox internal yang sama seperti [Select](/components/forms/select#custom-ui), jadi keduanya berbagi satu file tema:

Global dan scoped overrides menggunakan key `ui.select` untuk kedua komponen.

::theme-source{name="select"}
::

### Konten leading dan trailing kustom

Gunakan `#leading` dan `#trailing` untuk teks, ikon, atau tombol di dalam bingkai field. Slot menerima `{ disabled, size, buttonSize }`; `buttonSize` cocok untuk Button di dalam ukuran field saat ini. Berikan kontrol interaktif dengan label yang dapat diakses, gunakan `type="button"`, dan teruskan `disabled` untuk mencocokkan state field.

Konten kustom tetap terlihat di samping tombol clear bawaan, indikator loading, dan kontrol dropdown. Field menyediakan ruang untuk konten yang dirender, termasuk suffix yang lebarnya berubah. Gunakan `ui.leading` dan `ui.trailing` untuk menyesuaikan wrapper-nya.

::component-example{name="autocomplete-addons"}
::

Kontrol kustom merender di luar tombol trigger, jadi mereka dapat menerima fokus keyboard tanpa membuat tombol bersarang atau membuka daftar opsi saat diklik. Dengan `adaptive`, slot ini menyesuaikan field asli; modal mempertahankan pencarian dan kontrol seleksi khususnya sendiri.

## Props

Sama seperti [Select](/components/forms/select#props), minus `searchable` (selalu aktif), plus tambahan Autocomplete-only berikut:

`positioning` dan `portal` mengikuti kontrak panel anchored [Select](/components/forms/select#panel-positioning-and-portal).

| Prop | Tipe | Default |
| --- | --- | --- |
| `modelValue` / `defaultValue` | suggestion identity atau created string; array dalam mode multiple | - |
| `dropdown` | `boolean` | `false` |
| `forceSelection` | `boolean` | `false` |

## Slots

Autocomplete mendukung `leading`, `trailing`, `item`, `group`, `header`, `footer`, `empty`, `empty-filter`, `clear-icon`, `loading-icon`, dan `dropdown-icon`. Inputnya menampilkan label terpilih secara langsung. Slot `value` dan `filter-icon` milik Select spesifik untuk trigger display dan field filter terpisah milik Select.

`leading` dan `trailing` menerima `{ disabled, size, buttonSize }`, seperti dijelaskan di atas.

## Events

| Event | Payload | Tujuan |
| --- | --- | --- |
| `update:modelValue` | suggestion identity atau created string, array dalam mode multiple, atau `undefined` | Mengusulkan nilai yang dipilih, dibuat, dihapus, atau direset |
| `update:open` | `boolean` | Meminta membuka atau menutup suggestion panel atau adaptive modal |
| `update:searchTerm` | `string` | Memperbarui teks pencarian yang dapat diedit |

Saat `forceSelection` aktif, update seleksi berisi identitas saran daripada string baru yang dibuat. Kontrol state terbuka dan `defaultOpen` mengikuti [Select](/components/forms/select#events).
