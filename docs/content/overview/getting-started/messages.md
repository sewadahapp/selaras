---
title: Messages and localization
description: Customize internal text, accessible labels, and formatting locales.
order: 60
---

Internal labels and messages come from a shared English registry. Override only the keys your application needs; the remaining keys keep their defaults.

## Global messages

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    locale: 'id-ID',
    messages: {
      close: 'Tutup',
      clear: 'Hapus',
      search: 'Cari...',
      noOptions: 'Tidak ada pilihan',
      paginationInfo: (page: number, total: number) => `Halaman ${page} dari ${total}`,
    },
  },
})
```

Messages include accessible labels as well as visible text. Function-valued messages must remain functions with the documented arguments. See [useMessages](/utilities/composables/use-messages) for every key and its default.

## Local content

```vue-html
<SInput placeholder="Search customers..." />
<SButton>Save changes</SButton>
```

Text you supply through props, item labels, and slots stays under your control. Use each component's documented props or slots to customize individual instances. There is no generic per-component `messages` prop or scoped message registry on `STheme`.

## Formatting locale

`selaras.locale` sets the BCP 47 locale used by locale-aware formatting and date controls. It does not translate the message registry. Configure both when localizing an application. Selaras does not ship additional translation packs.

Use [useLocale](/utilities/composables/use-locale) and [useMessages](/utilities/composables/use-messages) in your own components to share the application's configuration.
