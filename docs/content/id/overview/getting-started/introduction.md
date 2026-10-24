---

title: Pengenalan
description: Pelajari apa itu Selaras, apa yang disediakannya, dan cara menyesuaikannya.
order: 10
---

Selaras adalah pustaka komponen UI untuk Nuxt.

Selaras menggunakan [Reka UI](https://reka-ui.com) untuk primitif UI yang dapat diakses. Selaras menggunakan Tailwind CSS v4 untuk styling dan [tailwind-variants](https://www.tailwind-variants.org) untuk varian komponen.

Selaras menyediakan komponen siap pakai untuk formulir, navigasi, tampilan data, overlay, konten, dan tata letak aplikasi.

## Tujuan desain

### Tema CSS-first

Selaras menggunakan properti kustom CSS untuk nilai desain.

Anda dapat mengubah warna, permukaan, teks, border, radius, bayangan, dan nilai tema lainnya dengan CSS.

Contohnya:

```css
:root {
  --selaras-color-primary-fill: #6d4aff;
  --selaras-surface-canvas: #f9f9f9;
  --selaras-surface-default: #ffffff;
  --selaras-radius-base: 0.5rem;
}
```

Anda tidak memerlukan JavaScript atau konfigurasi Nuxt untuk perubahan tema normal.

Gunakan konfigurasi Nuxt hanya ketika Selaras membutuhkan informasi pada waktu build. Misalnya, gunakan ketika Anda menambahkan role warna baru seperti `tertiary`.

Lihat [Tema](/overview/theming/overview) untuk semua opsi tema.

### Penyesuaian komponen yang dapat diprediksi

Setiap komponen memiliki satu prop `:ui` untuk penyesuaian tingkat instance.

Gunakan `:ui` ketika Anda ingin mengubah kelas atau atribut dari satu komponen.

```vue-html
<SButton :ui="{ base: 'font-mono' }">
  Save
</SButton>
```

Gunakan token tema CSS ketika Anda ingin mengubah nilai desain di banyak komponen.

Gunakan `app.config.ts` atau `STheme` ketika Anda ingin mengubah konfigurasi komponen di seluruh aplikasi atau subtree.

### Primitif yang dapat diakses

Selaras menggunakan Reka UI untuk banyak primitif interaktif.

Reka UI menyediakan interaksi keyboard, manajemen fokus, perilaku ARIA, dan fitur aksesibilitas lainnya untuk primitif ini.

Selaras menambahkan komponen dan styling sendiri di atas fondasi ini.

### Antarmuka adaptif

Beberapa komponen Selaras dapat menggunakan presentasi yang berbeda ketika ruang layar yang tersedia berubah.

Misalnya, sebuah komponen dapat menggunakan popover di layar yang lebih besar dan modal atau drawer di layar yang lebih kecil.

Komponen menjaga satu API publik sementara Selaras mengubah presentasinya.

### Gerakan berbasis CSS

Selaras menggunakan CSS untuk transisi komponen dan state interaksi.

Selaras tidak memerlukan library animasi JavaScript untuk gerakan standarnya.

Selaras juga menghormati preferensi reduced-motion pengguna.

## Apa yang Anda dapatkan

Saat Anda menginstal Selaras, Nuxt secara otomatis mengimpor komponen dengan awalan `S`.

Contohnya:

```vue-html
<SButton />
<SInput />
<SSelect />
<SModal />
<STable />
```

Selaras juga menyediakan composable untuk UI tingkat aplikasi:

```ts
useModal()
useDrawer()
useSlideover()
useToast()
useCommandPalette()
```

Selaras juga dapat menyediakan perilaku DOM kecil melalui direktif, seperti:

```vue-html
<SButton v-ripple>
  Save
</SButton>

<SInput v-mask="'(###) ###-####'" inputmode="tel" />
```

## Mulai dari mana

Mulai dari [Instalasi](/overview/getting-started/installation).

Lalu baca [Tema](/overview/theming/overview) untuk mempelajari cara menyesuaikan Selaras dengan CSS.

Gunakan dokumentasi komponen ketika Anda membutuhkan props, slot, event, varian, dan opsi `:ui` untuk komponen tertentu.

Baca [changelog](/changelog) untuk fitur baru, perbaikan, dan panduan upgrade.

## Penghargaan

Selaras menggunakan [Reka UI](https://reka-ui.com) sebagai fondasi primitifnya.

Kami menghargai proyek-proyek berikut atas kontribusi mereka terhadap ekosistem Vue dan inspirasi yang mereka berikan untuk desain komponen yang bijaksana:

* [Nuxt UI](https://ui.nuxt.com)
* [PrimeVue](https://primevue.org)
* [shadcn-vue](https://www.shadcn-vue.com)
* [UI Thing](https://ui-thing.behonbaker.com)
* [Quasar](https://quasar.dev)

Pekerjaan mereka telah membentuk pemikiran kami tentang kegunaan, penyesuaian, dan pengalaman developer saat kami mengembangkan Selaras.
