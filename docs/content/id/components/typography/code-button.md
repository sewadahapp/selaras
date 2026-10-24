---
title: CodeButton
description: Tombol copy-to-clipboard mandiri untuk perintah atau snippet yang dirujuk inline dalam prose.
order: 73
---

## Penggunaan

::component-example{name="code-button-basic"}
::

```vue-html
<SCodeButton code="npm install @sewadah/selaras" />
```

Berbeda dengan [ProsePre](/components/typography/prose) (blok kode penuh) atau [CodeGroup](/components/typography/code-group) (beberapa di antaranya, dalam tab), `SCodeButton` dimaksudkan duduk inline dalam kalimat - merujuk satu perintah tanpa memecah alur baca menjadi blok. `code` adalah yang ditampilkan sekaligus yang benar-benar disalin; override hanya teks yang ditampilkan dengan slot default ketika keduanya harus berbeda:

```vue-html
<SCodeButton code="npm install @sewadah/selaras">
  Copy install command
</SCodeButton>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema `CodeButton` itu sendiri:

::theme-source{name="code-button"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `code` | `string` | - (required) |
| `ui` | `Partial<Record<CodeButtonSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Menggantikan teks yang ditampilkan - `code` tetap mengatur yang disalin |
