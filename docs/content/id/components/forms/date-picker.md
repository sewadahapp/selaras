---
title: DatePicker
description: Input tanggal dengan popover kalender, dibangun di atas primitif DatePicker milik Reka UI.
order: 23.5
---

## Penggunaan

`v-model` adalah `@internationalized/date` `DateValue` (biasanya `CalendarDate` untuk granularitas date-only komponen ini), bukan native `Date` - segmented field, grid kalender, `minValue`/`maxValue`, dan `isDateUnavailable` semua berbagi tipe yang sama, jadi tidak ada konversi lossy di boundary. Ia sudah memiliki `.toString()` ISO (`2024-06-15`) dan konstruktor `parseDate()` yang cocok jika Anda perlu berinteroperasi dengan string polos, dan `@internationalized/date`'s own `today()`/`getLocalTimeZone()` mencakup kasus umum "relative to now":

::component-example{name="date-picker-basic"}
::

```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

// shallowRef, bukan ref - instance DateValue membawa private class fields nyata
// yang tipe plain ref akan strip, merusak assignability kembali ke v-model.
// Nilai selalu diganti secara utuh, tidak dimutasi di tempat.
const date = shallowRef<DateValue>()
</script>

<template>
  <SDatePicker v-model="date" />
</template>
```

Klik ikon kalender untuk membuka popover, atau ketik langsung ke segmen day/month/year - keduanya tetap sinkron dengan nilai yang sama.

### Min/max range

`min-value`/`max-value` menonaktifkan setiap hari di luar rentang (dan memblokir memilih satu, bukan hanya menstyle-nya):

::component-example{name="date-picker-min-max"}
::

```vue-html
<SDatePicker v-model="date" :min-value="today(getLocalTimeZone())" :max-value="..." />
```

### Unavailable dates

`is-date-unavailable` menerima predicate `(date: DateValue) => boolean`. Berbeda dengan `minValue`/`maxValue`, hari yang unavailable masih dapat dipilih - ia ditandai (coretan, redup) daripada diblokir, cocok untuk constraint yang ingin Anda tandai daripada di-hard-enforce (misalnya "no weekend deliveries" di mana konsumen memutuskan apa yang terjadi selanjutnya):

::component-example{name="date-picker-unavailable"}
::

```vue-html
<SDatePicker v-model="date" :is-date-unavailable="(d) => isWeekend(d)" />
```

### Range selection

`range` beralih untuk memilih start dan end date bersamaan - `v-model` menjadi `{ start?: DateValue, end?: DateValue }` sebagai gantinya dari satu `DateValue`. Klik hari pertama untuk mengatur start (popover tetap terbuka - seleksi belum selesai), lalu klik hari kedua untuk menyelesaikan rentang dan menutupnya. Default menampilkan dua bulan berdampingan (`number-of-months="2"`) daripada satu, karena itulah yang membuat memilih rentang multi-minggu nyaman - berikan `:number-of-months="1"` untuk memindahkan satu bulan sebagai gantinya:

::component-example{name="date-picker-range"}
::

```vue
<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import { shallowRef } from 'vue'

const range = shallowRef<DateRange>()
</script>

<template>
  <SDatePicker v-model="range" range />
</template>
```

`allow-non-contiguous-ranges`, `fixed-date` (`'start' | 'end'`, mengunci satu ujung di tempat sambil memilih ulang ujung lainnya), `maximum-days` (membatasi seberapa jauh start/end dapat terpisah), dan `is-date-highlightable` semuanya adalah passthrough range-only ke primitif yang mendasarinya.

`trigger-mode="button"` juga dapat dikombinasikan dengan `range` - teks tombol menggunakan `DateFormatter.formatRange()` (misalnya "Jun 15 – Jun 20, 2024") alih-alih tanggal format tunggal:

::component-example{name="date-picker-range-button-mode"}
::

```vue-html
<SDatePicker v-model="range" range trigger-mode="button" />
```

### Button trigger

`trigger-mode="button"` mengganti segmen yang dapat diketik dengan satu tombol yang menunjukkan tanggal yang diformat (atau pesan placeholder saat kosong) - trigger "klik untuk membuka" yang lebih polos saat segmented field inline typing tidak dibutuhkan. `format` (objek `Intl.DateTimeFormatOptions` - bentuk yang sama yang digunakan setiap API pemformatan tanggal JS lainnya, default `{ dateStyle: 'medium' }`) mengontrol bagaimana teks tombol itu dibaca:

::component-example{name="date-picker-button-mode"}
::

```vue-html
<SDatePicker v-model="date" trigger-mode="button" />
<SDatePicker v-model="date" trigger-mode="button" :format="{ year: 'numeric', month: '2-digit', day: '2-digit' }" />
```

Kedua mode trigger berbagi slot UI `field`. Atur `app.config.selaras.ui.datePicker.slots.field` secara global, atau `:ui="{ field: '...' }"` pada instance, untuk menyesuaikan permukaan, border, dan interaction states mereka bersama. Ini juga berlaku untuk range dan time-only pickers. Fokus field menggunakan `active-color`; field invalid menggunakan warna danger.

### Month/year view

Klik heading kalender untuk menelusuri dari day grid ke month grid, lalu year grid - memilih bulan atau tahun melompatkan day grid langsung ke sana daripada memindahkan satu bulan pada satu waktu. `view` mengatur grid mana yang terbuka pertama (`'date'` secara default); memberikan `'year'` memulai picker gaya tanggal lahir langsung di year grid:

::component-example{name="date-picker-month-year-view"}
::

```vue-html
<SDatePicker v-model="date" view="year" />
```

Hanya mode single-date - heading dan navigasi `range` sendiri tidak terpengaruh oleh `view`.

### Month/year granularity

`view` hanya mengubah grid mana yang popover *mulai* - memilih bulan di sana masih menelusuri ke hari. `granularity` berbeda: ia mengubah apa yang *nilai itu sendiri* wakili. Atur ke `'month'` atau `'year'` untuk picker yang nilainya berhenti pada presisi itu - day grid tidak pernah dirender, dan memilih bulan atau tahun adalah aksi terakhir yang menutup popover (tergantung `closeOnSelect`) daripada menelusuri lebih jauh:

::component-example{name="date-picker-month-granularity"}
::

```vue-html
<SDatePicker v-model="month" granularity="month" />
<SDatePicker v-model="year" granularity="year" />
```

Library date yang mendasarinya tidak memiliki tipe nilai month-only atau year-only, jadi `modelValue` tetap `DateValue` yang sama bagaimanapun - `granularity="month"` memperbaiki hari ke `1`, dan `granularity="year"` memperbaiki bulan dan hari ke `1`. Mode segmented field hanya menunjukkan segmen yang penting (month+year, atau hanya year), dan teks button-mode/format default juga disesuaikan (`"June 2024"` / `"2024"`) - keduanya masih dapat dioverride melalui `format`. Heading masih dapat menelusuri *up* (misalnya, picker month-granularity melompat ke year view untuk mencapai tahun jauh dengan cepat) - hanya arah terminal, "memilih ini adalah jawabannya" yang berubah. Hanya mode single-date.

### Custom month/year disabling

`is-month-disabled`/`is-year-disabled` (`view="month"`/`"year"` saja) menonaktifkan bulan/tahun tertentu di atas apa yang sudah dinonaktifkan oleh `min-value`/`max-value` - berguna untuk memblokir bulan tertentu karena penutupan yang diketahui, terlepas dari rentang yang diizinkan secara keseluruhan:

::component-example{name="date-picker-month-year-disabled"}
::

```vue-html
<SDatePicker v-model="date" view="month" :is-month-disabled="(d) => d.month === 7" />
```

### Date-time selection

`granularity="hour"`/`"minute"` menambahkan bagian waktu di bawah day grid alih-alih menggantikannya - memilih hari dan mengatur waktu adalah dua hal independen, jadi day grid tetap sepenuhnya dapat digunakan. `modelValue` menjadi `CalendarDateTime` yang mendukung waktu (masih hanya `DateValue`, tipe prop yang sama seperti biasa). Karena tidak ada aksi tunggal yang berarti "selesai" di sini, `close-on-select` tidak lagi menutup popover saat klik hari saat granularity waktu diatur - tombol **Done** muncul sebagai gantinya (disembunyikan sepenuhnya jika Anda berikan `close-on-select="false"`, karena itu sudah berarti "never auto-close"):

::component-example{name="date-picker-date-time"}
::

```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<DateValue>()
</script>

<template>
  <SDatePicker v-model="value" granularity="minute" />
</template>
```

`granularity="hour"` hanya menunjukkan hour stepper; `"minute"` menambahkan stepper kedua di sampingnya. Keduanya dibangun dari [InputNumber](/components/forms/input-number) - ketik nilai langsung atau gunakan tombol ±/tombol panah. `minute-step` (default `1`) hanya memengaruhi increment click/arrow-key stepper menit; typing masih meng-commit menit apa pun secara tepat - berikan `5`/`15`/etc untuk langkah "pick an appointment time" yang lebih kasar. Memilih hari mempertahankan waktu apa pun yang sudah diatur, dan menyesuaikan waktu meng-commit nilai menggunakan tanggal hari ini jika belum ada yang dipilih - salah satu dapat disentuh pertama. Hanya mode single-date.

Hour stepper mengikuti siklus jam yang sama seperti field yang diketik sendiri - keduanya default ke apa pun yang `locale` resolve (12-hour dengan toggle AM/PM untuk `en-US`, 24-hour untuk kebanyakan yang lain), jadi kedua permukaan selalu setuju daripada satu menunjukkan "14" dan yang lain "2:00 PM" untuk momen yang sama. Berikan `hour-cycle="12"` atau `hour-cycle="24"` untuk memaksa satu apa pun locale-nya:

```vue-html
<SDatePicker v-model="value" granularity="minute" hour-cycle="24" />
```

### Time only

`time-only` menghilangkan date sepenuhnya - `modelValue` menjadi `Time` mentah (dari `@internationalized/date`, tanpa komponen date sama sekali, bukan `DateValue`). Semua yang spesifik grid tanggal (`min-value`/`max-value`, `view`, `number-of-months`, dan sebagainya) tidak berlaku - popover hanyalah stepper jam/menit, sama seperti yang sudah digunakan `granularity="hour"`/`"minute"`:

::component-example{name="date-picker-time-only"}
::

```vue
<script setup lang="ts">
import type { Time } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<Time>()
</script>

<template>
  <SDatePicker v-model="value" time-only />
</template>
```

`granularity`, `hour-cycle`, `minute-step`, `trigger-mode`, `clearable`, dan `close-on-select` semuanya dibawa tanpa perubahan dari kasus date-time di atas - `granularity` default ke `'minute'` di sini (jam mentah kurang berguna sebagai default untuk time picker *dedicated* daripada sebagai add-on ke date). Hanya mode single-date - `range` dan `time-only` tidak dapat dikombinasikan.

### Ukuran

`size` menerima `sm` / `md` / `lg`, menyesuaikan field, segmen, dan tombol calendar-day bersamaan.

Trigger luarnya mengikuti skala tinggi default 32 / 40 / 44px [control height scale](/overview/theming/component-styling#control-sizes) baik dalam `trigger-mode="field"` maupun `trigger-mode="button"`. Tinggi yang sama berlaku untuk mode single-date, range, dan time-only, termasuk saat `clearable` aktif.

::component-example{name="date-picker-sizes"}
::

```vue-html
<SDatePicker v-model="date" size="sm" />
<SDatePicker v-model="date" size="md" />
<SDatePicker v-model="date" size="lg" />
```

### Warna

`color` mengatur chrome color - tombol trigger dan nav prev/next month; `active-color` mengatur warna apa pun yang sedang "aktif" - sel day/month/year yang dipilih dan tombol Done:

::component-example{name="date-picker-colors"}
::

```vue-html
<SDatePicker v-model="date" color="primary" active-color="danger" />
```

### Arrow

`arrow` menunjukkan segitiga penunjuk kecil yang menghubungkan panel ke trigger-nya di seluruh mode single-date, range, dan time-only. Berikan objek untuk mengonfigurasi lebar, tinggi, ujung rounded, atau corner clearance (`padding`):

::component-example{name="date-picker-arrow"}
::

```vue-html
<SDatePicker v-model="value" arrow />
<SDatePicker v-model="value" :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }" />
```

`positioning` mengontrol sisi, alignment, offsets, dan perilaku collision dari kalender anchored. Untuk kalender single-date, arrow secara default menengahkan panel agar tetap terlihat; `positioning.align` eksplisit mengoverride pilihan itu. `portal` default ke document body; atur ke `false` untuk inline rendering atau berikan CSS selector atau `HTMLElement` sebagai target teleport. Props ini memengaruhi kalender anchored dalam mode single, range, dan time-only. Modal adaptive memiliki presentasi sendiri.

```vue-html
<SDatePicker v-model="value" :positioning="{ side: 'top', align: 'start' }" portal="#overlay-root" />
```

### Clearable & disabled

`clearable` menambahkan tombol `ghost` netral inset setelah nilai diatur, termasuk rentang yang terisi sebagian. Picker kosong, `disabled`, dan `readonly` menyembunyikannya. Trigger kalender/jam tetap tersedia di samping clear dalam kedua mode trigger. Clear mengembalikan fokus ke segmen editable pertama atau tombol trigger. `disabled` menonaktifkan seluruh kontrol:

::component-example{name="date-picker-clearable"}
::

```vue-html
<SDatePicker v-model="date" clearable />
<SDatePicker v-model="date" disabled />
```

Sesuaikan aksi clear dengan `ui.clear` atau `#clear-icon`. `ui.buttonClear` mengontrol posisinya dalam button trigger mode; `ui.triggerIcon` men-style field-mode calendar/clock glyph. Lihat [shared clear styling](/overview/theming/component-styling#field-clear-controls).

### Read-only

`readonly` menunjukkan nilai dan memblokir pengeditan tanpa menonaktifkan kontrol - berbeda dengan `disabled`, ia tetap dapat difokuskan/dibaca, hanya tidak dapat diubah. Tidak berlaku untuk `time-only` (tidak ada konsep readonly untuk field waktu mentah):

::component-example{name="date-picker-readonly"}
::

```vue-html
<SDatePicker v-model="date" readonly />
```

### Mencegah deselection

`prevent-deselect` menghentikan klik pada satu-satunya hari yang dipilih agar tidak menghapusnya sepenuhnya - berguna saat kontrol harus selalu mendarat pada *suatu* nilai daripada mengizinkan state kosong. Tidak berlaku untuk `time-only`:

::component-example{name="date-picker-prevent-deselect"}
::

```vue-html
<SDatePicker v-model="date" prevent-deselect />
```

### Konten day kustom

Slot `day` menggantikan konten sel hari (dalam grid single-date dan range) - sel itu sendiri, termasuk perilaku seleksi/keyboard, tidak terpengaruh. Scoped dengan `date`, `dayValue`, `selected`, `disabled`, dan (hanya range mode) `selectionStart`/`selectionEnd`/`highlighted`:

::component-example{name="date-picker-custom-day"}
::

```vue-html
<SDatePicker v-model="date">
  <template #day="{ date: cellDate, dayValue }">
    <span class="relative flex flex-col items-center">
      {{ dayValue }}
      <span v-if="hasEvent(cellDate)" class="absolute -bottom-1.5 size-1 rounded-full bg-[var(--selaras-resolved-color-primary-fill)]" />
    </span>
  </template>
</SDatePicker>
```

### Adaptive presentation

`adaptive` mengalihkan kalender ke [Modal](/components/overlays/modal) yang dipusatkan di bawah breakpoint adaptif yang dikonfigurasi. Ini opt-in (default `false`), memilih presentasi saat membuka, dan bekerja di seluruh mode single-date, range, dan time-only:

::component-example{name="date-picker-adaptive"}
::

### Integrasi formulir

Bungkus dalam [FormField](/components/forms/form-field) untuk mendapatkan `id`/`name`/`invalid` dan `aria-describedby` terhubung secara otomatis - `invalid` dan `size` keduanya fallback ke state FormField sendiri saat tidak diatur langsung.

### Aksesibilitas

DatePicker merender primitif DatePicker milik Reka UI, jadi semantik aksesibilitas berasal dari sana daripada direimplementasi di sini: setiap segmen date adalah elemen `contenteditable` nyata yang dapat Anda ketik langsung (tombol panah/digit menggeser nilai segmen dan auto-advance ke berikutnya), grid kalender dapat dinavigasi dengan keyboard (tombol panah bergerak antar hari, paging melewati tepi grid memajukan bulan), dan state current/selected/unavailable/disabled setiap hari diekspos melalui `aria-selected`/`aria-disabled` selain styling visual.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `DatePicker` sendiri:

::theme-source{name="date-picker"}
::

### Time section styling

`ui.timeSection` men-style kontrol waktu di bawah kalender, termasuk divider-nya. `ui.timeSectionStandalone` men-style kontrol time-only tanpa menambahkan divider atau spacing untuk kalender yang tidak ada. Kedua slot juga mendukung global theme overrides.

```vue-html
<SDatePicker time-only :ui="{ timeSectionStandalone: 'gap-3' }" />
```

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `form` | `string` | - |
| `open` | `boolean` | - |
| `defaultOpen` | `boolean` | `false` |
| `modelValue` | `DateValue \| DateRange \| Time` (`DateRange` saat `range`, `Time` saat `timeOnly`) | - |
| `defaultValue` | `DateValue \| DateRange \| Time` | - |
| `range` | `boolean` | `false` |
| `timeOnly` | `boolean` | `false` |
| `minValue` | `DateValue` | - |
| `maxValue` | `DateValue` | - |
| `isDateUnavailable` | `(date: DateValue) => boolean` | - |
| `isDateDisabled` | `(date: DateValue) => boolean` | - |
| `isDateHighlightable` | `(date: DateValue) => boolean` (hanya range) | - |
| `locale` | `string` | - |
| `numberOfMonths` | `number` | `1`, atau `2` saat `range` |
| `pagedNavigation` | `boolean` | `false` |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | - |
| `weekdayFormat` | `'narrow' \| 'short' \| 'long'` | `narrow` |
| `fixedWeeks` | `boolean` | `false` |
| `closeOnSelect` | `boolean` | `true` |
| `triggerMode` | `'field' \| 'button'` | `field` |
| `view` | `'date' \| 'month' \| 'year'` (hanya single-date) | `date` |
| `isMonthDisabled` | `(date: DateValue) => boolean` (`view="month"` saja) | - |
| `isYearDisabled` | `(year: number) => boolean` (`view="year"` saja) | - |
| `granularity` | `'year' \| 'month' \| 'day' \| 'hour' \| 'minute'` (hanya single-date) | `day` |
| `minuteStep` | `number` (hanya hour/minute granularity) | `1` |
| `hourCycle` | `12 \| 24` (hanya hour/minute granularity) | locale default |
| `format` | `Intl.DateTimeFormatOptions` | `{ dateStyle: 'medium' }` |
| `allowNonContiguousRanges` | `boolean` (hanya range) | `false` |
| `fixedDate` | `'start' \| 'end'` (hanya range) | - |
| `maximumDays` | `number` (hanya range) | - |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` (bukan `timeOnly`) | `false` |
| `preventDeselect` | `boolean` (bukan `timeOnly`) | `false` |
| `invalid` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `color` | [ColorRole](/overview/theming/color-roles) | `'neutral'` |
| `activeColor` | sama seperti `color` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `arrow` | `boolean \| RoundedArrowConfig` | `false` |
| `positioning` | `OverlayPositioning` | anchored calendar defaults |
| `portal` | `boolean \| string \| HTMLElement` | `true` (document body) |
| `adaptive` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'field' \| 'segment' \| 'separator' \| 'clear' \| 'buttonClear' \| 'triggerIcon' \| 'content' \| 'mobileContent' \| 'header' \| 'heading' \| 'grids' \| 'grid' \| 'gridHead' \| 'headCell' \| 'cell' \| 'viewGrid' \| 'timeSectionStandalone' \| 'timeSection' \| 'arrow', string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `day` | `{ date, dayValue, selected, disabled }` (range mode menambahkan `selectionStart`, `selectionEnd`, `highlighted`) | Konten kustom di dalam tombol sel hari (grid single-date dan range) |
| `clear-icon` | - | Menggantikan ikon tombol clear (default: `hugeicons:cancel-01`) |
| `trigger-icon` | - | Menggantikan ikon tombol trigger dalam kedua mode trigger (default: `hugeicons:calendar-01`/`hugeicons:clock-01`) |
| `footer` | - | Konten yang ditambahkan di bawah konten kalender/waktu, di atas tombol Done |

## Emits

| Emit | Payload | Deskripsi |
| --- | --- | --- |
| `update:open` | `boolean` | Terpicu saat picker meminta membuka atau menutup |
| `update:modelValue` | `DateValue \| DateRange \| Time \| undefined` | Mengusulkan nilai yang dipilih, diketik, atau dihapus; `Time` dalam mode time-only |
| `update:view` | `'date' \| 'month' \| 'year'` | Terpicu saat heading atau sel month/year menelusuri popover ke view berbeda |
