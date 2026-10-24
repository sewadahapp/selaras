---
title: CodeTree
description: File tree yang dipasangkan dengan code viewer - klik file, lihat isinya.
order: 76
---

## Penggunaan

::component-example{name="code-tree-basic"}
::

```vue-html
<SCodeTree :items="[
  { name: 'src', children: [{ name: 'index.ts', code: 'export default 1' }] },
  { name: 'package.json', code: '{}' },
]" />
```

Dibangun di atas [FileTree](/components/typography/file-tree) untuk panel kiri - `code` milik node di-syntax-highlight sesuai filename-nya setelah dipilih. Atur `language` pada file untuk mengoverride bahasa yang disimpulkan dari ekstensinya. File pertama yang ditemukan (depth-first) dipilih secara default, sehingga panel tidak pernah kosong saat dimuat. Mengganti `items` dengan array baru memilih default baru; memutasi array yang ada membiarkan seleksi saat ini apa adanya.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema `CodeTree` itu sendiri:

::theme-source{name="code-tree"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `items` | `CodeTreeFile[]` | - (required) |
| `defaultExpanded` | `boolean` | `true` |
| `ui` | `Partial<Record<CodeTreeSlot, string \| object>>` | - |

### `CodeTreeFile`

Memperluas [`FileTreeNode`](/components/typography/file-tree) dengan satu field tambahan:

| Field | Tipe | Deskripsi |
| --- | --- | --- |
| `name` | `string` | Label tampilan file/direktori |
| `children` | `CodeTreeFile[]` | Ada pada node direktori, tidak ada pada file |
| `icon` | `string` | Menggantikan ikon file/folder default |
| `code` | `string` | Isi file, ditampilkan dengan syntax highlighting setelah dipilih - diabaikan pada direktori |
| `language` | `string` | Override bahasa sintaks; jika tidak, disimpulkan dari filename |
