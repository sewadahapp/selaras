---
title: Konfigurasi global
description: Atur kelas komponen bersama, default, dan runtime token.
order: 55
---

## Override global

Gunakan `app.config.ts` saat Anda ingin perubahan kelas komponen global atau default komponen yang didukung.

Konfigurasi ini tidak diperlukan untuk kustomisasi tema CSS normal.

### Kelas komponen global

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    ui: {
      button: {
        slots: {
          base: 'font-mono',
        },
      },
    },
  },
})
```

Selaras memperluas resep `tailwind-variants` komponen dengan kelas ini.

### Default komponen global

Hanya komponen yang mendukung tema default yang membaca konfigurasi ini.

Contohnya:

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    defaults: {
      button: {
        size: 'lg',
      },
    },
  },
})
```

Prop komponen eksplisit memiliki prioritas lebih tinggi daripada default yang dikonfigurasi.

### Runtime token global

`app.config.selaras.tokens` juga dapat menyediakan override runtime token.

Gunakan ini hanya saat Anda membutuhkan nilai yang dikelola runtime. Lebih suka CSS untuk tema desain global statis.

Semua pengaturan runtime Selaras aplikasi menggunakan namespace `app.config.selaras`.
