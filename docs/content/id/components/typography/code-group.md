---
title: CodeGroup
description: Blok kode bertab - misalnya perintah install npm/pnpm/yarn.
order: 71
---

## Penggunaan

::component-example{name="code-group-basic"}
::

```vue-html
<SCodeGroup>
  <SProsePre filename="npm" language="bash" code="npm install @sewadah/selaras">
npm install @sewadah/selaras
  </SProsePre>
  <SProsePre filename="pnpm" language="bash" code="pnpm add @sewadah/selaras">
pnpm add @sewadah/selaras
  </SProsePre>
</SCodeGroup>
```

`SCodeGroup` membaca children slot default-nya sendiri secara langsung (berfungsi dengan children apa pun, bukan hanya [Prose](/components/typography/prose)) dan merender masing-masing sebagai tab via [Tabs](/components/navigation/tabs) - label berasal dari prop `filename` masing-masing child, fallback ke `language`, fallback ke `Tab 1`/`Tab 2`/... (berdasarkan posisi) untuk child yang tidak memiliki keduanya. Ikon filename/language yang dikenal muncul di tab juga. Ketika child adalah `SProsePre`, baris header-nya disembunyikan sehingga label tidak diulang di atas panel; ini juga menyembunyikan tombol copy baris itu. Konten child lain dirender apa adanya.

### Dalam markdown

Setelah dihubungkan ke `@nuxt/content` via adapter `CodeGroup.vue` (resep yang sama seperti [Prose](/components/typography/prose)), blok kode fenced yang bersebelahan polos di bawah `::code-group` menjadi tab secara otomatis - `[label]` setelah bahasa menjadi title masing-masing tab:

````md
::code-group

```bash [npm]
npm install @sewadah/selaras
```

```bash [pnpm]
pnpm add @sewadah/selaras
```

::
````

## Props

`SCodeGroup` tidak menerima props - ia menurunkan semuanya dari children-nya.
