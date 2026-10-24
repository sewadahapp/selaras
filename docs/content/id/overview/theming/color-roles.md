---
title: Role warna
description: Konfigurasikan warna semantik bawaan dan kustom.
order: 30
---

### Role warna komponen bawaan

Selaras menyediakan role ini:

- `primary`
- `secondary`
- `success`
- `info`
- `warning`
- `danger`
- `neutral`

Tema default memetakan role ini ke palet fondasi:

| Role | Fondasi default |
| --- | --- |
| `primary` | `indigo` |
| `secondary` | `plum` |
| `success` | `green` |
| `info` | `blue` |
| `warning` | `yellow` |
| `danger` | `red` |
| `neutral` | `gray` |

Nama role adalah maknanya. Nama fondasi adalah keluarga rona.

Misalnya, resep `warning` default membaca palet kuning Selaras.
Resep `danger` default membaca palet merah Selaras.

### Ubah satu nilai role secara tepat

Anda dapat menimpa input publik role secara langsung:

```css
:root {
  --selaras-color-warning-fill: #ffff00;
  --selaras-color-warning-on-fill: #000000;
}
```

Selaras menggunakan nilai CSS persis seperti yang Anda berikan. Selaras tidak mengubahnya.

Contoh ini mengubah hanya dua leaf. Leaf warning lainnya tetap menggunakan defaultnya. Jika Anda ingin tema warning kustom yang konsisten, definisikan resep lengkap.

### Bangun satu role dari satu warna CSS

Anda tidak memerlukan helper TypeScript saat ingin memulai dari satu warna CSS.

Anda dapat mempertahankan warna dasar persis dan menurunkan nilai lainnya dengan CSS:

```css
:root {
  --brand: #fd5e53;

  --selaras-color-primary-fill:
    var(--brand);

  --selaras-color-primary-fill-hover:
    color-mix(in oklch, var(--brand), black 8%);

  --selaras-color-primary-fill-pressed:
    color-mix(in oklch, var(--brand), black 15%);

  --selaras-color-primary-on-fill:
    white;

  --selaras-color-primary-indicator:
    color-mix(in oklch, var(--brand), black 18%);

  --selaras-color-primary-subtle:
    color-mix(in oklch, var(--brand) 12%, transparent);

  --selaras-color-primary-subtle-hover:
    color-mix(in oklch, var(--brand) 18%, transparent);

  --selaras-color-primary-subtle-pressed:
    color-mix(in oklch, var(--brand) 24%, transparent);

  --selaras-color-primary-on-subtle:
    color-mix(in oklch, var(--brand), black 35%);

  --selaras-color-primary-text:
    color-mix(in oklch, var(--brand), black 20%);

  --selaras-color-primary-text-hover:
    color-mix(in oklch, var(--brand), black 28%);

  --selaras-color-primary-text-pressed:
    color-mix(in oklch, var(--brand), black 35%);

  --selaras-color-primary-border:
    var(--brand);

  --selaras-color-primary-focus:
    var(--brand);
}
```

Ini hanya salah satu resep yang mungkin. Anda memiliki kepemilikan pilihan warna.

Uji hasilnya dalam komponen dan konteks yang digunakan aplikasi Anda.
Selaras tidak mengubah nilai CSS yang Anda tulis.

### Resep role lengkap

Sebuah role warna memiliki input publik berikut:

```text
fill
fill-hover
fill-pressed
on-fill
indicator

subtle
subtle-hover
subtle-pressed
on-subtle

text
text-hover
text-pressed

border
focus
```

Untuk `warning`, nama CSS lengkapnya adalah:

```css
:root {
  --selaras-color-warning-fill: ...;
  --selaras-color-warning-fill-hover: ...;
  --selaras-color-warning-fill-pressed: ...;
  --selaras-color-warning-on-fill: ...;
  --selaras-color-warning-indicator: ...;

  --selaras-color-warning-subtle: ...;
  --selaras-color-warning-subtle-hover: ...;
  --selaras-color-warning-subtle-pressed: ...;
  --selaras-color-warning-on-subtle: ...;

  --selaras-color-warning-text: ...;
  --selaras-color-warning-text-hover: ...;
  --selaras-color-warning-text-pressed: ...;

  --selaras-color-warning-border: ...;
  --selaras-color-warning-focus: ...;
}
```

Ganti `warning` dengan nama role apa pun yang didaftarkan.

Varian komponen memilih leaf yang dibutuhkannya. Misalnya, Button solid menggunakan `fill`, `on-fill`, `fill-hover`, dan `fill-pressed`. Button soft menggunakan leaf `subtle`. Grafik yang tidak berpasangan, seperti progress dan radio indicator, menggunakan `indicator`. Jika dihilangkan, ia mengikuti `border`.

Anda juga dapat menyediakan nilai berbeda untuk dark mode:

```css
:root {
  --selaras-color-warning-fill: #ffff00;
  --selaras-color-warning-on-fill: #000000;
}

:root.dark {
  --selaras-color-warning-fill: #eaea00;
  --selaras-color-warning-on-fill: #000000;
}
```

## Konfigurasi Nuxt dan helper tema

Gunakan CSS terlebih dahulu.

Gunakan `nuxt.config.ts` saat Selaras membutuhkan informasi waktu build. Kasus warna yang paling umum adalah nama role baru.

### Tambahkan role baru

Nama role bawaan sudah berfungsi tanpa konfigurasi tema.

Role baru seperti `tertiary` atau `premium` harus didaftarkan pada waktu build agar Selaras dapat:

- menghasilkan binding role-nya
- menambahkannya ke `ColorRole`
- membuat `color="tertiary"` type-safe

API Nuxt saat ini membutuhkan resep terang dan gelap:

```ts [nuxt.config.ts]
import { defineColor } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],

  selaras: {
    theme: {
      colors: {
        tertiary: defineColor({
          light: {
            fill: 'var(--company-tertiary-fill)',
            onFill: 'var(--company-tertiary-on-fill)',
            subtle: 'var(--company-tertiary-subtle)',
            onSubtle: 'var(--company-tertiary-on-subtle)',
            text: 'var(--company-tertiary-text)',
            border: 'var(--company-tertiary-border)',
          },
          dark: {
            fill: 'var(--company-tertiary-fill-dark)',
            onFill: 'var(--company-tertiary-on-fill-dark)',
            subtle: 'var(--company-tertiary-subtle-dark)',
            onSubtle: 'var(--company-tertiary-on-subtle-dark)',
            text: 'var(--company-tertiary-text-dark)',
            border: 'var(--company-tertiary-border-dark)',
          },
        }),
      },
    },
  },
})
```

Setelah pendaftaran, Anda dapat menggunakan:

```vue-html
<SButton color="tertiary">
  Tertiary
</SButton>
```

Anda masih dapat menimpa role yang didaftarkan dari CSS:

```css
:root {
  --selaras-color-tertiary-fill: #8b5cf6;
}
```

Konfigurasi Nuxt mendaftarkan role. CSS masih dapat memiliki nilai visualnya.

### Timpa resep bawaan di konfigurasi Nuxt

Anda juga dapat mengganti resep bawaan:

```ts [nuxt.config.ts]
import { defineColor } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  selaras: {
    theme: {
      colors: {
        warning: defineColor({
          light: {
            fill: '#ffff00',
            onFill: '#000000',
            subtle: '#fffbd1',
            onSubtle: '#3d3d00',
            text: '#6b6b00',
            border: '#a3a300',
          },
          dark: {
            fill: '#eaea00',
            onFill: '#000000',
            subtle: '#2a2a00',
            onSubtle: '#ffff99',
            text: '#ffff66',
            border: '#baba00',
          },
        }),
      },
    },
  },
})
```

`defineColor()` memvalidasi bentuk resep yang diperlukan. Ia tidak mengubah nilai yang Anda berikan.

Leaf yang diperlukan di setiap mode adalah:

- `fill`
- `onFill`
- `subtle`
- `onSubtle`
- `text`
- `border`

Leaf opsional:

- `fillHover`
- `fillPressed`
- `indicator` (default ke `border`)
- `subtleHover`
- `subtlePressed`
- `textHover`
- `textPressed`
- `focus`

Jika leaf interaksi opsional hilang, Selaras mengaitkannya ke state terdekat yang didefinisikan. Ia tidak menghitung rona baru untuk `defineColor()`.

### Helper opsional: `defineColorFromSeed()`

`defineColorFromSeed()` bukan jalur tema CSS-first.

Gunakan saat Anda ingin Selaras mempertahankan satu warna sRGB opaque sebagai solid fill resting dan menurunkan sisa resep di sekitarnya.

```ts [nuxt.config.ts]
import { defineColorFromSeed } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  selaras: {
    theme: {
      colors: {
        coral: defineColorFromSeed('#FD5E53'),
      },
    },
  },
})
```

Nilai `fill` resting terang dan gelap tetap persis seperti warna enam digit yang Anda berikan. Selaras memilih `onFill` hitam atau putih, menurunkan state interaksi yang berbeda, dan menurunkan warna teks, border, fokus, dan indikator terhadap permukaan yang diberikan. Jika keluarga pendukung tidak dapat diteruskan dengan aman, helper menolak input dan mengarahkan Anda ke `defineColor()`.

Gunakan CSS atau `defineColor()` saat Anda membutuhkan kontrol tepat atas setiap state.

Helper saat ini hanya menerima nilai hex sRGB opaque enam digit. Ia tidak dapat mengevaluasi variabel CSS, warna transparan, atau ekspresi CSS arbitrer.

Jika Anda menggunakan permukaan kustom, Anda dapat memberikan warna permukaan yang diresolve ke helper:

```ts
defineColorFromSeed('#FD5E53', {
  surfaces: {
    light: '#f4f0e8',
    dark: '#20242a',
  },
})
```

### Helper opsional: warna DTCG yang diresolve

Jika pipeline design-token Anda menggunakan DTCG, resolve alias dan mode di pipeline itu terlebih dahulu.

`dtcgColorToCss()` mengonversi nilai warna DTCG yang sudah diresolve menjadi CSS. Ia tidak mem-pars dokumen token. Ia tidak me-resolve alias. Ia tidak memilih mode.

```ts
import { dtcgColorToCss } from '@sewadah/selaras/theme'

const fill = dtcgColorToCss(tokens.brand.fill.$value, {
  path: 'semantic.brand.fill.$value',
})
```

Anda kemudian dapat menggunakan hasilnya di `defineColor()` atau di CSS Anda sendiri.
