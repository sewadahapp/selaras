---
title: Timeline
description: Timeline terurut untuk activity feeds, project milestones, dan event history, dengan orientasi fleksibel dan item slots.
order: 31
---

## Penggunaan

`STimeline` merender urutan event secara berurutan. Ini hanya untuk tampilan; gunakan [Stepper](/components/navigation/stepper) saat pengguna perlu menavigasi atau maju melalui workflow.

::component-example{name="timeline-basic"}
::

```vue
<script setup lang="ts">
const items = [
  { id: 'created', date: '9:15 AM', title: 'Request created', description: 'A new request was submitted.' },
  { id: 'approved', date: '10:30 AM', title: 'Approved', color: 'success' },
]
</script>

<template>
  <STimeline :items="items" />
</template>
```

Setiap item dapat menyediakan `id` yang stabil, `date` tampilan, `datetime` ISO, `title`, `description`, `icon`, `color` semantik, dan nama `slot` kustom. Urutan caller dipertahankan. Tanggal ditampilkan sebagaimana diberikan sehingga komponen tidak mengasumsikan locale atau zona waktu.

Atur `icon` ke nama ikon terdaftar apa pun untuk menggantikan titik solid dengan marker outlined yang lebih besar. `color` per-item mengubah accent marker itu:

::component-example{name="timeline-icons"}
::

```vue-html
<STimeline :items="[
  { date: '9:15 AM', title: 'Request submitted', icon: 'hugeicons:file-01' },
  { date: '10:30 AM', title: 'Review completed', icon: 'hugeicons:checkmark-circle-01', color: 'success' },
]" />
```

### Orientasi dan alignment

Default adalah vertical feed yang disejajarkan ke start. `align` menerima `start`, `end`, atau `alternate`; pilihan yang sama menempatkan konten horizontal di bawah, di atas, atau secara bergantian di sekitar garis marker.

::component-example{name="timeline-horizontal"}
::

```vue-html
<STimeline :items="milestones" orientation="horizontal" align="alternate" />
```

### Konten kustom

Gunakan `#marker`, `#date`, `#title`, dan `#description` untuk menggantikan bagian individual, atau `#content` untuk membangun body setiap event. Slot `#item` menggantikan semua konten default untuk setiap event. Field `slot` item dapat memilih named slot untuk event itu saja. Slot scoped menerima `{ item, index }`, termasuk field kustom apa pun yang diberikan dalam data item.

::component-example{name="timeline-activity"}
::

```vue-html
<STimeline :items="activity" align="alternate">
  <template #marker="{ item }">
    <SAvatar :name="item.actor" :text="item.initials" size="sm" />
  </template>
  <template #content="{ item }">
    <strong>{{ item.title }}</strong>
    <SBadge :label="item.action" :color="item.color" variant="soft" />
  </template>
</STimeline>
```

Marker dan connector tetap dekoratif; tempatkan link dan tombol di content slots sehingga mereka mempertahankan interaksi dan aksesibilitas native.

### Styling

`size` menerima `sm`, `md`, atau `lg`; `color` mengatur warna marker default dan setiap item dapat mengoverride-nya. `ui` dapat mengoverride `root`, `item`, `track`, `marker`, `icon`, `connector`, `content`, `date`, `title`, dan `description`. Item juga dapat menyediakan `class` dan partial `ui` overrides-nya sendiri. Tema dapat dikonfigurasi secara global di bawah `ui.timeline`.

::theme-source{name="timeline"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `items` | `TimelineItem[]` | required |
| `orientation` | `'vertical' \| 'horizontal'` | `vertical` |
| `align` | `'start' \| 'end' \| 'alternate'` | `start` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `ui` | `Partial<Record<TimelineThemeSlot, string \| object>>` | - |

`TimelineItem` mendukung `id`, `date`, `datetime`, `title`, `description`, `icon`, `color`, `slot`, `class`, `ui` per-item, dan data aplikasi kustom.

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `marker` | `{ item, index }` | Menggantikan konten marker; default ke ikon item atau titik |
| `connector` | `{ item, index }` | Konten di dalam connector dekoratif antar item |
| `date` | `{ item, index }` | Menggantikan tanggal yang ditampilkan |
| `title` | `{ item, index }` | Menggantikan teks title |
| `description` | `{ item, index }` | Menggantikan teks description |
| `content` | `{ item, index }` | Menggantikan seluruh default event body |
| `item` | `{ item, index }` | Menggantikan seluruh default event body, termasuk date/title/description |
| Named item slot | `{ item, index }` | Properti `slot` item dapat memilih named slot untuk item itu |
