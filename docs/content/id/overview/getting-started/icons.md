---
title: Ikon
description: Konfigurasikan ikon internal secara global dan sediakan ikon secara lokal.
order: 50
---

Selaras menggunakan [Nuxt Icon](https://nuxt.com/modules/icon) di balik layar dan menginstal modulnya secara otomatis. `SIcon` membungkus komponen `Icon`-nya, jadi konfigurasi Nuxt Icon, provider, alias, dan koleksi kustom juga berlaku untuk ikon Selaras. Nama ikon menggunakan format `collection:name`; ikon komponen internal secara default menggunakan Hugeicons.

## Ikon lokal

```vue-html
<SButton icon="hugeicons:search-01">Search</SButton>
<SButton icon="hugeicons:cancel-01" square aria-label="Close" />
<SIcon name="hugeicons:calendar-01" class="size-6" aria-hidden="true" />
```

Komponen mengekspos `icon`, `trailingIcon`, atau slot ikon yang didukung di halaman referensi mereka. Nama ikon eksplisit tidak berubah ketika Anda mengganti registry internal. Berikan label yang dapat diakses untuk tindakan ikon-saja; ikon dekoratif dapat disembunyikan dari teknologi asistif.

## Ikon internal global

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    icons: {
      close: 'hugeicons:cancel-01',
      loading: 'hugeicons:loading-02',
    },
  },
})
```

Setiap key menggambarkan tujuan daripada komponen. Mengganti `close` mengubah komponen yang membaca key registry tersebut. Key yang tidak ditentukan mempertahankan defaultnya. Lihat [useIcons](/utilities/composables/use-icons) untuk registry lengkap dan cara komponen kustom dapat menggunakan kembali.

## Konfigurasi dan loading

Konfigurasikan Nuxt Icon melalui key top-level `icon` di `nuxt.config.ts`, di samping `selaras`. Anda tidak perlu mendaftarkan `@nuxt/icon` lagi.

Nuxt Icon dapat mengambil ikon dari API [Iconify](https://iconify.design/) ketika tidak tersedia secara lokal. Ini nyaman untuk mencoba koleksi, tetapi request runtime dapat menunda kemunculan ikon. Instal koleksi yang Anda gunakan secara lokal:

```bash
bun add -d @iconify-json/hugeicons @iconify-json/lucide
```

`devDependencies` cocok untuk build bundling normal: data ikon dikonsumsi saat build. Lingkungan build harus menginstal dev dependencies. Jika Anda secara eksplisit mengeksternalisasi icon JSON untuk resolusi runtime, pertahankan paket sebagai dependensi produksi sebagai gantinya.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  icon: {
    serverBundle: {
      collections: ['hugeicons', 'lucide'],
    },
    clientBundle: {
      scan: true,
      icons: ['lucide:search', 'lucide:x'],
    },
  },
})
```

Menginstal koleksi menghindari ketergantungan pada API publik; itu sendiri tidak menjamin rendering langsung. Client bundle membuat ikon yang diketahui tersedia tanpa request ikon. Scanning menemukan nama literal; tambahkan nama yang dipilih secara dinamis secara eksplisit ke `clientBundle.icons`. Ini sangat berguna untuk situs statis tanpa endpoint server Nuxt.

## Penyesuaian runtime

Pengaturan runtime Nuxt Icon ada di bawah `icon` di `app.config.ts`. Registry tujuan internal Selaras tetap di bawah `selaras.icons`:

```ts [app.config.ts]
export default defineAppConfig({
  icon: {
    mode: 'svg',
    aliases: {
      'app-search': 'lucide:search',
    },
  },
  selaras: {
    icons: {
      search: 'app-search',
    },
  },
})
```

Nuxt Icon juga mendukung penyesuaian SVG global melalui `icon.customize`. Komponen Selaras menetapkan kelas ukuran ikon sendiri, jadi lebih suka slot `ui` mereka untuk mengatur ukuran bagian komponen individual. Lihat [referensi konfigurasi Nuxt Icon](https://github.com/nuxt/icon#icon-customization) untuk API upstream lengkap.

## Koleksi SVG kustom

Tempatkan file SVG di `app/assets/icons`, lalu daftarkan koleksi:

```ts [nuxt.config.ts]
import { createResolver } from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  icon: {
    customCollections: [
      { prefix: 'app', dir: resolve('./app/assets/icons') },
    ],
    clientBundle: {
      includeCustomCollections: true,
    },
  },
})
```

File bernama `brand.svg` menjadi `app:brand`. Menyertakan koleksi kustom di client bundle juga membuatnya tersedia di hosting statis.

```vue-html
<SIcon name="app:brand" class="size-6" />
<SButton icon="app:brand">Workspace</SButton>
```

## Vue components as icons

Nuxt Icon dapat me-resolve komponen Vue yang didaftarkan secara global berdasarkan nama. Misalnya, buat `app/components/global/BrandIcon.vue`:

```vue
<template>
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12L12 4L20 12L12 20Z" fill="currentColor" />
  </svg>
</template>
```

Lalu gunakan nama komponen tersebut melalui Selaras:

```vue-html
<SIcon name="BrandIcon" class="size-6" />
<SButton icon="BrandIcon">Workspace</SButton>
```

Komponen harus didaftarkan secara global; impor lokal biasa tidak cukup untuk resolusi berbasis nama. Nuxt Icon merender komponen secara langsung dan mengabaikan pengaturan mode CSS/SVG untuk ikon itu. Lihat [dukungan komponen Nuxt Icon](https://github.com/nuxt/icon#vue-component).
