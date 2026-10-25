---
title: Calendar
description: Grid tanggal inline yang dapat diakses dengan slot untuk penanda hari, hari libur, dan konten rapat.
order: 29
---

## Penggunaan

`SCalendar` adalah grid tanggal inline. Nilainya adalah `@internationalized/date` `DateValue`, sama seperti `SDatePicker`. Tanggal yang dipilih dan bulan yang ditampilkan adalah terpisah: gunakan `v-model` untuk seleksi dan `v-model:placeholder` saat Anda perlu mengontrol bulan yang ditampilkan.

::component-example{name="calendar-basic"}
::

```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const selected = shallowRef<DateValue>(new CalendarDate(2026, 9, 24))
</script>

<template>
  <SCalendar v-model="selected" />
</template>
```

Gunakan `default-value` dan `default-placeholder` untuk state awal yang tidak terkontrol. `min-value`, `max-value`, `is-date-disabled`, dan `is-date-unavailable` mengontrol tanggal mana yang dapat dipilih. Hari libur dapat ditampilkan tanpa menandai tanggalnya unavailable.

### Konten rapat

`#day` menggantikan konten *di dalam* tombol tanggal; menerima tanggal, label hari yang dilokalisasi, dan state selected/today/disabled/unavailable. Gunakan untuk penanda kompak. `#day-details` merender di samping tombol itu dalam sel hari, jadi link rapat atau tombol tidak menjadi kontrol bersarang. Selaras mengasosiasikan area detail itu dengan tombol tanggal untuk teknologi asistif. Calendar tidak memiliki data format event Anda sendiri.

::component-example{name="calendar-meetings"}
::

```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const meetings: Record<string, string[]> = {
  '2026-09-08': ['Planning'],
  '2026-09-16': ['Design review', 'Team sync'],
  '2026-09-24': ['Release check'],
}
</script>

<template>
  <div class="max-w-full overflow-x-auto">
    <SCalendar
      :default-placeholder="new CalendarDate(2026, 9, 1)"
      calendar-label="September meetings"
      class="w-full"
      style="min-width: 42rem"
      :ui="{
        grids: 'block',
        grid: { class: 'w-full', style: { tableLayout: 'fixed' } },
        headCell: { style: { width: '14.285714%' } },
        cell: { class: 'border border-[var(--selaras-resolved-border-default)] p-1 text-start', style: { height: '8rem' } },
        dayDetails: { class: 'space-y-1 overflow-hidden pt-1 text-xs', style: { overflowWrap: 'anywhere', maxHeight: '5rem' } },
      }"
    >
      <template #day-details="{ date }">
        <div v-for="meeting in meetings[date.toString()] ?? []" :key="meeting" class="rounded bg-[var(--selaras-resolved-surface-elevated)] px-1 py-0.5">
          {{ meeting }}
        </div>
      </template>
    </SCalendar>
  </div>
</template>
```

Grid bulan penuh membutuhkan ruang di layar sempit. Konsumen dapat menggulir container-nya, memperpendek preview dalam sel, atau menempatkan daftar rapat lengkap di bawah kalender. Jika rapat memiliki aksi sendiri, render link atau tombol nyata di `#day-details` dan berikan nama yang dapat diakses untuk setiap aksi.

### Komposisi jadwal

Slot yang sama dapat mendukung jadwal yang lebih besar: tanggal duduk di pojok kanan atas setiap sel hari, acara timed menggunakan status dot `SBadge`, acara sepanjang hari menggunakan soft badge, dan acara multi-hari dibagi menjadi segmen visual di batas minggu. Seluruh sel memilih tanggal, sementara setiap acara membuka popover dengan detail dan avatar peserta. Tata letak ini adalah contoh override `ui` tingkat contoh; kalender kompak membuat tanggal tetap berada di tengah secara default.

::component-example{name="calendar-schedule"}
::

Contoh menggunakan tanggal September 2026 tetap sebagai sampel "today" yang disorot agar SSR dan output statisnya tetap deterministik. Dalam aplikasi, turunkan tanggal itu dari state time-zone aware Anda sendiri. Records acara, perhitungan week-segment, dan gaya layout scoped semuanya ada di [source contoh lengkap](https://github.com/sewadahapp/selaras/blob/master/docs/components/content/examples/calendar/CalendarSchedule.vue).

### Styling

`ui` menargetkan `root`, `header`, `heading`, `grids`, `grid`, `gridHead`, `headCell`, `cell`, `dayButton`, `dayDetails`, dan `footer`. `color` men-style tombol hari/navigasi yang tidak dipilih; `active-color` men-style hari yang dipilih. Slot `#footer` menambahkan konten di bawah grid. Setiap bulan kompak secara default; gunakan `class="w-full"` dengan `:ui="{ grid: 'w-full' }"` untuk kalender yang memenuhi container-nya.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `modelValue` / `defaultValue` | `DateValue` | no selection |
| `placeholder` / `defaultPlaceholder` | `DateValue` | selected date atau today |
| `minValue` / `maxValue` | `DateValue` | - |
| `isDateDisabled` / `isDateUnavailable` | `(date: DateValue) => boolean` | - |
| `locale` | BCP-47 locale string | inherited configuration |
| `numberOfMonths` | `number` | `1` |
| `pagedNavigation` | `boolean` | `false` |
| `weekStartsOn` | `0`–`6` (Sunday–Saturday) | locale default |
| `weekdayFormat` | `'narrow' \| 'short' \| 'long'` | `'narrow'` |
| `fixedWeeks` | `boolean` | `false` |
| `disableDaysOutsideCurrentView` | `boolean` | `false` |
| `preventDeselect` | `boolean` | `false` |
| `disabled` / `readonly` | `boolean` | `false` |
| `initialFocus` | `boolean` | `false` |
| `calendarLabel` | `string` | generated calendar label |
| `color` / `activeColor` | `ColorRole`, termasuk registered roles | `'neutral'` / `'primary'` |
| `ui` | `CalendarProps['ui']` | - |

`placeholder` adalah tanggal yang mengidentifikasi bulan yang terlihat, terpisah dari seleksi. Gunakan `v-model:placeholder` untuk mengontrolnya, atau `defaultPlaceholder` untuk menginisialisasinya. `preventDeselect` membuat tanggal yang dipilih tetap terpilih saat diaktifkan lagi. `disableDaysOutsideCurrentView` mencegah memilih tanggal bulan sebelumnya/berikutnya yang ditampilkan dalam grid saat ini. `readonly` membuat navigasi tetap tersedia sambil mencegah seleksi; `disabled` menonaktifkan interaksi. `initialFocus` meminta fokus saat mount.

Calendar memilih satu tanggal. Gunakan [DatePicker](/components/forms/date-picker#range-selection) untuk rentang tanggal. Calendar tidak memiliki kontrak submission `name`/`form` native; bind nilainya ke state form Anda atau gunakan DatePicker untuk field dengan submission native.

## Events

| Event | Payload | Tujuan |
| --- | --- | --- |
| `update:modelValue` | `DateValue \| undefined` | Proposal seleksi atau deseleksi |
| `update:placeholder` | `DateValue` | Bulan yang terlihat berubah melalui navigasi |

## Slots

| Slot | Props | Tujuan |
| --- | --- | --- |
| `day` | `CalendarDaySlotProps` | Konten tombol tanggal; jaga aksi independen di luar slot ini |
| `day-details` | `{ date: DateValue, month: DateValue }` | Konten di samping tombol tanggal, cocok untuk link/tombol event |
| `footer` | - | Konten di bawah grid |

`CalendarDaySlotProps` berisi `date`, `month`, `dayValue` yang dilokalisasi, dan boolean `selected`, `today`, `disabled`, `unavailable`, `outsideView`, dan `outsideVisibleView`. `CalendarProps`, `CalendarEmits`, dan `CalendarDaySlotProps` diekspor dari `@sewadah/selaras/types`.
