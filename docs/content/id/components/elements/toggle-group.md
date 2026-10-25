---
title: Toggle Group
description: Set toggle terkait yang berbagi satu seleksi - single atau multiple - dibangun di atas primitif ToggleGroup milik Reka UI.
order: 12.94
---

## Penggunaan

Digabung menjadi satu segmented control, teknik visual yang sama seperti [ButtonGroup](/components/elements/button-group). `type="single"` (default) berperilaku seperti radio group tersegmented - memilih satu item membatalkan pilihan yang lain:

::component-example{name="toggle-group-basic"}
::

```vue-html
<SToggleGroup :items="['List', 'Grid', 'Kanban']" default-value="List" />
```

### Multiple selection

`type="multiple"` memungkinkan sejumlah item tetap ditekan secara bersamaan - `modelValue`/`defaultValue` menjadi array daripada nilai tunggal:

::component-example{name="toggle-group-multiple"}
::

```vue-html
<SToggleGroup type="multiple" :items="items" :default-value="['bold']" />
```

### Ikon saja

Slot `item` menggantikan konten ikon+label default item sepenuhnya - pasangkan dengan label visually-hidden sehingga item tetap memiliki nama yang dapat diakses:

::component-example{name="toggle-group-icon-only"}
::

```vue-html
<SToggleGroup :items="items" default-value="list">
  <template #item="{ item }">
    <SIcon :name="item.icon" class="size-4.5" />
    <span class="sr-only">{{ item.label }}</span>
  </template>
</SToggleGroup>
```

### Orientasi

::component-example{name="toggle-group-orientation"}
::

```vue-html
<SToggleGroup orientation="vertical" :items="['List', 'Grid', 'Kanban']" />
```

### Disabled

`disabled` pada grup memblokir setiap item; `disabled` pada satu item memblokir hanya item itu:

::component-example{name="toggle-group-disabled"}
::

```vue-html
<SToggleGroup :items="[
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid', disabled: true },
]" />
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `ToggleGroup` sendiri:

::theme-source{name="toggle-group"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `items` | `(string \| ToggleGroupItem)[]` | - |
| `type` | `'single' \| 'multiple'` | `'single'` |
| `modelValue` | `string \| string[]` | - |
| `defaultValue` | `string \| string[]` | - |
| `disabled` | `boolean` | - |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `color` | [ColorRole](/overview/theming/color-roles) | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<ToggleGroupSlot, string \| object>>` | - |

`ToggleGroupItem` adalah `{ label: string, value: string, icon?: string, disabled?: boolean }`.

## Emits

| Event | Payload |
| --- | --- |
| `update:modelValue` | `string \| string[]` |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `item` | `{ item, pressed }` | Menggantikan konten ikon+label default item |
