---
title: Collapsible
description: Panel tunggal show/hide, dibangun di atas primitif Collapsible milik Reka UI.
order: 41.5
---

## Penggunaan

Tertutup secara default - slot `trigger` adalah konten tombol sendiri, slot default adalah panel:

::component-example{name="collapsible-basic"}
::

```vue-html
<SCollapsible>
  <template #trigger>
    What's included in the free plan?
  </template>
  Everything you need to get started: unlimited projects, community
  support, and access to every core feature.
</SCollapsible>
```

### Terkontrol

`v-model:open` mengontrolnya dari parent daripada mengelola state sendiri:

::component-example{name="collapsible-controlled"}
::

```vue-html
<SCollapsible v-model:open="open">
  <template #trigger>
    Toggle me
  </template>
  Content controlled by the parent.
</SCollapsible>
```

### Disabled

`disabled` memblokir trigger agar tidak dapat toggle sama sekali:

::component-example{name="collapsible-disabled"}
::

```vue-html
<SCollapsible disabled default-open>
  <template #trigger>
    This can't be collapsed
  </template>
  Locked open.
</SCollapsible>
```

### Arah

`direction="up"` mengungkap konten di atas trigger alih-alih di bawahnya - rotasi chevron saat rest/open dibalik untuk mencocokkan, tetap menunjuk ke mana konten akan muncul:

::component-example{name="collapsible-direction"}
::

```vue-html
<SCollapsible direction="up">
  <template #trigger>
    What's included in the free plan?
  </template>
  Everything you need to get started: unlimited projects, community
  support, and access to every core feature.
</SCollapsible>
```

### Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.collapsible`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Collapsible` sendiri:

::theme-source{name="collapsible"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `open` | `boolean` | - |
| `defaultOpen` | `boolean` | `false` |
| `disabled` | `boolean` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `direction` | `'down' \| 'up'` | `'down'` |
| `ui` | `Partial<Record<CollapsibleSlot, string \| object>>` | - |

## Emits

| Event | Payload |
| --- | --- |
| `update:open` | `boolean` |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `trigger` | `{ open }` | Konten tombol trigger sendiri |
| `default` | `{ open }` | Konten panel collapsible |
| `chevron-icon` | `{ open }` | Menggantikan chevron default |
