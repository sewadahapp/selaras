---
title: Tree
description: Hirarki yang dapat diperluas dan dipilih - file browsers, nested settings, org structures - dibangun di atas primitif Tree milik Reka UI.
order: 41.75
---

## Penggunaan

`items` adalah array bersarang - node dengan `children` merender sebagai baris yang dapat diperluas, node tanpanya merender sebagai leaf. Klik baris untuk memperluasnya (dan memilihnya, jika ia adalah leaf):

::component-example{name="tree-basic"}
::

```vue
<script setup lang="ts">
const items = [
  {
    label: 'Documents',
    value: 'documents',
    children: [
      { label: 'Resume.pdf', value: 'resume' },
      { label: 'Cover Letter.docx', value: 'cover-letter' },
    ],
  },
  { label: 'Notes.txt', value: 'notes' },
]
</script>

<template>
  <STree :items="items" />
</template>
```

### Multiple selection

`multiple` membuat `v-model` menjadi array daripada satu node. `default-expanded` (array keys) membuka cabang segera, tanpa perlu klik:

::component-example{name="tree-multiple"}
::

```vue-html
<STree v-model="selected" :items="items" multiple :default-expanded="['frontend', 'backend']" />
```

### Checkbox mode

`checkbox` menunjukkan checkbox tri-state per baris (menggunakan model checked/unchecked/indeterminate milik `SCheckbox` sendiri) dan mengaktifkan `multiple` bersama propagasi parent↔child: memilih parent mencentang setiap descendant, dan mencentang semua child node mencentang parent juga (mencentang sebagian menandainya indeterminate sebagai gantinya):

::component-example{name="tree-checkbox"}
::

```vue-html
<STree v-model="selected" :items="items" checkbox :default-expanded="['permissions']" />
```

### Konten item kustom

Slot `item` menggantikan konten ikon+label default baris, di-scope dengan node itu sendiri plus state `expanded`/`selected`/`indeterminate` live:

::component-example{name="tree-custom-item"}
::

```vue-html
<STree :items="items">
  <template #item="{ item }">
    <span class="flex flex-1 items-center justify-between">
      <span>{{ item.label }}</span>
      <SBadge v-if="item.badge" :label="item.badge" size="sm" variant="soft" />
    </span>
  </template>
</STree>
```

### Disabled items

`disabled: true` pada node memblokir hanya baris itu - siblings tetap interaktif:

::component-example{name="tree-disabled"}
::

```vue-html
<STree :items="items" />
```

```ts
const items = [
  { label: 'Members', value: 'members' },
  { label: 'Billing', value: 'billing', disabled: true },
]
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Tree` sendiri:

::theme-source{name="tree"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `items` | `TreeItemType[]` | - (required) |
| `modelValue` | `TreeItemType \| TreeItemType[]` | - |
| `defaultValue` | `TreeItemType \| TreeItemType[]` | - |
| `expanded` | `string[]` | - |
| `defaultExpanded` | `string[]` | - |
| `multiple` | `boolean` | `false` |
| `checkbox` | `boolean` | `false` |
| `propagateSelect` | `boolean` | `false` |
| `bubbleSelect` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `getKey` | `(item: TreeItemType) => string` | `item => item.value ?? item.label` |
| `getChildren` | `(item: TreeItemType) => TreeItemType[] \| undefined` | `item => item.children` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `ui` | `Partial<Record<TreeSlot, string \| object>>` | - |

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:modelValue` | `TreeItemType \| TreeItemType[]` | Terpicu saat seleksi |
| `update:expanded` | `string[]` | Terpicu saat baris diperluas atau diciutkan |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `item` | `{ item, level, expanded, selected, indeterminate }` | Menggantikan konten ikon+label default baris |
