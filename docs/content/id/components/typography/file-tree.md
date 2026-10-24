---
title: FileTree
description: Browser file/direktori yang dapat di-collapse.
order: 75
---

## Penggunaan

::component-example{name="file-tree-basic"}
::

```vue-html
<SFileTree :items="[
  { name: 'src', children: [{ name: 'index.ts' }] },
  { name: 'package.json' },
]" />
```

Node dengan `children` dirender sebagai direktori (klik untuk expand/collapse), yang tanpanya dirender sebagai file (klik untuk memilihnya, meng-emit `update:selected` dengan node itu). Berikan `selected` kembali untuk menyorot baris aktif - pola terkontrol, bentuk yang sama dengan yang dibangun [CodeTree](/components/typography/code-tree) untuk pasangan file-ke-kontennya sendiri. Baris file menggunakan ikon VS Code yang cocok ketika filename dikenali; `icon` selalu mengoverride-nya.

### Seleksi terkontrol

`selected`/`update:selected` mengikuti shorthand `v-model:selected` milik Vue - mengklik file meng-emit node kembali keluar, dan memberikannya kembali sebagai `selected` menyorot baris itu:

::component-example{name="file-tree-selection"}
::

```vue-html
<SFileTree v-model:selected="selected" :items="items" />
<p>Selected: {{ selected?.name ?? 'none' }}</p>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema `FileTree` itu sendiri:

::theme-source{name="file-tree"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `items` | `FileTreeNode[]` | - (required) |
| `selected` | `FileTreeNode` | - |
| `defaultExpanded` | `boolean` | `true` |
| `ui` | `Partial<Record<FileTreeSlot, string \| object>>` | - |

Setiap node menerima `name`, `children` opsional, `icon` opsional, dan `language` opsional. `language` digunakan sebagai petunjuk fallback ketika filename tidak mengidentifikasi ikon file VS Code.

## Emits

| Event | Payload |
| --- | --- |
| `update:selected` | `FileTreeNode` |
