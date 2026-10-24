---
title: Callout
description: Kotak admonition note/tip/warning/danger untuk konten long-form.
order: 72
---

## Penggunaan

::component-example{name="callout-basic"}
::

```vue-html
<SCallout type="tip" title="Tip">
  Pass <code>icon="false"</code> to drop the leading icon entirely.
</SCallout>
```

`type` memilih warna aksen sekaligus ikon default - `note` (default), `tip`, `warning`, dan `danger`, menyamai empat level admonition yang dipakai kebanyakan situs docs. Ia berbagi surface soft dan perlakuan warna semantik milik Alert. Menghover-nya, atau memfokus konten di dalamnya, mengungkapkan border bergaris 2px dalam warna itu. Berbeda dengan [Alert](/components/elements/alert), callout tidak memiliki `variant`/`closable` - ia dimaksudkan duduk inline dalam prose dan tidak memiliki perilaku dismiss.

## Dalam markdown

Setiap komponen Selaras sudah terdaftar secara global di bawah nama berawalan `S` (panggilan `addComponentsDir` milik modul ini sendiri, `src/module.ts`) - berbeda dengan dua komponen enhanced milik [Prose](/components/typography/prose), tidak ada lagi yang perlu dihubungkan agar `@nuxt/content` me-resolve blok `::s-component-name{...}` polos langsung ke sana. Prop masuk ke attrs `{...}` milik blok sendiri; named slot (`title` di sini) adalah baris `#slot-name` di dalam blok, konvensi `@nuxtjs/mdc` sendiri (`MDCSlot`) - dan body blok sendiri menjadi slot default:

```text
::s-callout{type="warning"}
#title
Heads up
This changes how the export command behaves - check the migration notes first.
::
```

<!-- eslint-disable markdown/no-missing-atx-heading-space -- sintaks block-slot `#slot-name` milik MDC sendiri, bukan heading -->
::s-callout{type="warning"}
#title
Heads up

This changes how the export command behaves - check the migration notes first.
::
<!-- eslint-enable markdown/no-missing-atx-heading-space -->

Pola yang sama berfungsi untuk komponen apa pun yang sudah dikirim, props dan named slot termasuk - bukan hanya dua yang terbukti di sini. [Alert](/components/elements/alert), misalnya, berfungsi identik:

```text
::s-alert{color="info"}
#title
Heads up
#description
This changes how the export command behaves - check the migration notes first.
::
```

<!-- eslint-disable markdown/no-missing-atx-heading-space -- sintaks block-slot `#slot-name` milik MDC sendiri, bukan heading -->
::s-alert{color="info"}
#title
Heads up
#description
This changes how the export command behaves - check the migration notes first.
::
<!-- eslint-enable markdown/no-missing-atx-heading-space -->

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema `Callout` itu sendiri:

::theme-source{name="callout"}
::

Recipe tema global dan scoped menggunakan `ui.callout`.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `type` | `'note' \| 'tip' \| 'warning' \| 'danger'` | `'note'` |
| `title` | `string` | - |
| `icon` | `string \| false` | - |
| `ui` | `Partial<Record<CalloutSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| `title` | Konten title kustom, mengoverride prop `title` |
| default | Body callout |
