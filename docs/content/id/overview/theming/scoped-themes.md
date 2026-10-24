---
title: Tema scoped
description: Terapkan konfigurasi komponen dan mode warna ke subtree.
order: 60
---

### Konfigurasi komponen scoped

Gunakan `STheme` untuk menerapkan `ui` dan default props yang didukung ke subtree:

```vue-html
<STheme :ui="{ button: { slots: { base: 'font-mono' } } }">
  <SButton>Scoped</SButton>
</STheme>
```

Gunakan batas DOM saat Anda juga membutuhkan override runtime token:

```vue-html
<STheme
  as="section"
  :tokens="{
    light: {
      colors: {
        primary: {
          fill: '#fd5e53',
        },
      },
    },
  }"
>
  <SButton color="primary">Scoped color</SButton>
</STheme>
```

Runtime token berguna untuk tema dinamis atau scoped. Mereka tidak menggantikan jalur tema global CSS-first normal.

Supported overlay portals membawa nilai tema Selaras yang dikelola ke scope portal. Properti kustom CSS eksternal tetap mengikuti pewarisan DOM normal.
