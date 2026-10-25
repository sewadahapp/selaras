---
title: Accordion
description: Daftar collapsible yang didorong oleh items, dibangun di atas primitif Accordion milik Reka UI.
order: 41
---

## Penggunaan

::component-example{name="accordion-basic"}
::

```vue-html
<SAccordion :items="[{ value: 'a', label: 'Question one' }]">
  <template #a>
    Answer one.
  </template>
</SAccordion>
```

Konten setiap item berasal dari named slot yang cocok dengan `value`-nya. `type` default ke `'multiple'` (item independen dapat masing-masing terbuka sekaligus) - [ContentNavigation](/composites/documentation/content-navigation) menggunakan ini secara internal untuk grup nav yang dapat di-collapse.

### Konten label kustom

Slot `label` menggantikan label teks polos item dengan apa pun - di-scope dengan `item`, jadi satu template dapat bervariasi per item:

::component-example{name="accordion-custom-label"}
::

```vue-html
<SAccordion :items="items">
  <template #label="{ item }">
    <span class="flex items-center gap-2">
      {{ item.label }}
      <SBadge v-if="item.value === 'a'" label="New" color="primary" size="sm" />
    </span>
  </template>
  ...
</SAccordion>
```

`chevron-icon` menggantikan expand/collapse chevron dengan cara yang sama seperti slot icon-swap lainnya di pustaka ini (default: `hugeicons:arrow-down-01`).

### Ikon di label

Ikon di samping label hanyalah konten slot `label` yang lebih banyak - ia independen dari chevron di ujung lain trigger:

::component-example{name="accordion-icon"}
::

```vue-html
<SAccordion :items="items">
  <template #label="{ item }">
    <span class="flex items-center gap-2">
      <SIcon :name="item.icon" class="size-4 text-[var(--selaras-resolved-text-muted)]" />
      {{ item.label }}
    </span>
  </template>
  ...
</SAccordion>
```

### Chevron kustom

`chevron-icon` tidak terbatas pada satu ikon yang ditukar - di sini dua ikon di-cross-fade melalui `group-data-[state=open]:` daripada rotasi ikon default, untuk toggle plus/minus daripada panah:

::component-example{name="accordion-custom-chevron"}
::

```vue-html
<SAccordion :items="items">
  <template #chevron-icon>
    <span class="relative size-4 shrink-0 text-[var(--selaras-resolved-text-muted)]">
      <SIcon name="hugeicons:plus-sign" class="absolute inset-0 transition-opacity group-data-[state=open]:opacity-0" />
      <SIcon name="hugeicons:minus-sign" class="absolute inset-0 opacity-0 transition-opacity group-data-[state=open]:opacity-100" />
    </span>
  </template>
  ...
</SAccordion>
```

### Mode single

`type="single"` hanya mengizinkan satu item terbuka pada satu waktu - membuka satu menutup yang sebelumnya terbuka. `collapsible` (default `true`) secara tambahan memungkinkan mengklik trigger item yang terbuka menutupnya, daripada meninggalkan setidaknya satu item secara permanen terbuka:

::component-example{name="accordion-single"}
::

```vue-html
<SAccordion type="single" :items="items" default-value="a">
  <template #a>...</template>
  <template #b>...</template>
</SAccordion>
```

### Ukuran

`size` menerima `sm` / `md` / `lg`, menyesuaikan padding/text trigger dan text konten bersamaan:

::component-example{name="accordion-sizes"}
::

```vue-html
<SAccordion size="sm" :items="items">...</SAccordion>
<SAccordion size="md" :items="items">...</SAccordion>
<SAccordion size="lg" :items="items">...</SAccordion>
```

### Variant

`list` (default) adalah daftar datar dengan divider bersama antar item. `pill` memberi setiap item card berborder dan rounded sendiri dengan gap di antara mereka - bahasa visual yang sama seperti varian `outline` milik [Card](/components/layout/card):

::component-example{name="accordion-variant"}
::

```vue-html
<SAccordion variant="list" :items="items">...</SAccordion>
<SAccordion variant="pill" :items="items">...</SAccordion>
```

### Posisi chevron

`chevronPosition` memindahkan chevron ke awal trigger daripada akhir - label tetap rata di sampingnya daripada didorong ke sisi berlawanan, karena `justify-between` hanya berlaku pada posisi `end` (default):

::component-example{name="accordion-chevron-position"}
::

```vue-html
<SAccordion chevron-position="start" :items="items">...</SAccordion>
```

### Disabled

`disabled: true` pada item sendiri memblokir hanya item itu; prop `disabled` pada accordion sendiri memblokir setiap item sekaligus:

::component-example{name="accordion-disabled"}
::

```vue-html
<SAccordion :items="[{ value: 'a', label: '...' }, { value: 'b', label: '...', disabled: true }]">
  ...
</SAccordion>
<SAccordion disabled :items="items">
  ...
</SAccordion>
```

### Aksesibilitas

Accordion merender primitif Accordion milik Reka UI, jadi semantik aksesibilitas berasal dari sana daripada direimplementasi di sini: setiap trigger adalah `<button>` nyata (dapat diaktifkan dengan keyboard menggunakan <kbd>Enter</kbd>/<kbd>Space</kbd>), <kbd>↑</kbd>/<kbd>↓</kbd> memindahkan fokus antar trigger, dan setiap panel diekspos sebagai `role="region"` dengan `aria-labelledby` yang menunjuk kembali ke trigger-nya sendiri - screen reader selalu tahu pertanyaan mana yang dimiliki jawaban tertentu, bahkan jika urutan DOM berubah.

## Dalam markdown

Setiap komponen Selaras sudah terdaftar secara global di bawah nama berawalan `S` - blok `::s-accordion{...}` kosan berfungsi tanpa wiring tambahan (lihat bagian "In markdown" di [Callout](/components/typography/callout) untuk cara kerja pola secara umum). `items` adalah array prop, bukan string - bind dengan leading `:` agar `@nuxtjs/mdc` memparse atribut sebagai expression daripada teks literal. Konten setiap item adalah baris `#slot-name` yang cocok dengan `value` item itu:

```text
::s-accordion{:items='[{"label":"First","value":"a"},{"label":"Second","value":"b"}]'}
#a
Content for the first item.
#b
Content for the second item.
::
```

### Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.accordion`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Accordion` sendiri:

::theme-source{name="accordion"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `items` | `{ value: string, label: string, disabled?: boolean, icon?: string }[]` | - |
| `type` | `'single' \| 'multiple'` | `'multiple'` |
| `defaultValue` | `string \| string[]` | - |
| `modelValue` | `string \| string[]` | - |
| `collapsible` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `variant` | `'list' \| 'pill'` | `list` |
| `chevronPosition` | `'start' \| 'end'` | `end` |
| `ui` | `Partial<Record<AccordionSlot, string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `string \| string[]` | Terpicu saat item terbuka berubah |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `[item.value]` | - | Konten untuk item itu, satu named slot per item |
| `label` | `{ item }` | Menggantikan konten label item |
| `chevron-icon` | - | Menggantikan expand/collapse chevron (default: `hugeicons:arrow-down-01`) |
