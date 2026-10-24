---
title: Button
description: Elemen aksi yang dapat diklik dengan opsi warna, varian, dan ukuran.
order: 10
---

## Penggunaan

::component-example{name="button-basic"}
::

### Variants

`subtle` menggabungkan background bertint dari `soft` dengan border. `link` menggunakan
transisi warna teks yang sama seperti `text` dan menambahkan underline saat hover.

::component-example{name="button-variants"}
::

### Warna

Setiap warna di setiap varian, jadi mudah untuk membandingkan baik dalam satu
warna (apakah soft/outline/ghost dapat dibaca?) maupun di berbagai warna (apakah tetap dapat dibedakan dengan sekilas?).

::component-example{name="button-colors"}
::

### Ikon

`icon` dan `trailingIcon` menambahkan ikon sebelum atau setelah label - nama ikon yang didaftarkan apa pun berfungsi, tidak hanya `hugeicons:*`.

::component-example{name="button-icons"}
::

```vue-html
<SButton icon="hugeicons:download-01">Download</SButton>
<SButton trailing-icon="hugeicons:arrow-right-01">Continue</SButton>
```

### Ikon saja

Tidak ada prop `iconOnly` terpisar - berikan `icon` tanpa konten slot default dan bentuknya otomatis menjadi persegi (mencocokkan `size`-nya sendiri), daripada memerlukan flag eksplisit yang mungkin terlupakan. Selalu tambahkan `aria-label` sendiri ketika tidak ada teks yang terlihat - ia diteruskan ke root element seperti atribut lainnya (lihat [Aksesibilitas](#aksesibilitas) di bawah).

::component-example{name="button-icon-only"}
::

```vue-html
<SButton icon="hugeicons:settings-01" variant="outline" aria-label="Settings" />
```

### Square

Tombol ikon-saja sudah otomatis berbentuk persegi (lihat di atas) - `square` digunakan ketika kontennya bukan ikon tetapi tetap harus mendapatkan perlakuan lebar/tinggi yang sama, seperti nomor halaman atau tanggal kalender. Tanpanya, setiap tombol menyesuaikan lebar teksnya sendiri dan sebaris tombol (pagination bar, grid kalender) tidak akan sejajar:

::component-example{name="button-square"}
::

```vue-html
<SButton square>1</SButton>
<SButton square>31</SButton>
```

### Text

`text` tidak pernah menggambar background, di state apa pun; hanya warna label/ikon yang berubah saat hover. Gunakan untuk aksi yang membutuhkan bobot visual minimal. Kontrol clear field bawaan menggunakan tombol `ghost` netral untuk respons hover yang lebih terlihat. Lihat [kontrol clear field](/overview/theming/component-styling#kontrol-clear-field).

Border dalam perbandingan ini milik field ilustrasi, bukan salah satu tombol.

::component-example{name="button-text"}
::

```vue-html
<div class="flex items-center rounded-[var(--selaras-resolved-radius-md)] ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
  <span>Example field</span>
  <SButton icon="hugeicons:cancel-01" variant="text" aria-label="Clear" />
</div>
```

`link` adalah varian teks aksi yang digarisbawahi. Gunakan untuk aksi yang menavigasi; `text` adalah aksi teks tanpa hiasan.

### Loading

`loading` menukar ikon depan dengan spinner. Ini tidak menyiratkan `disabled` - gabungkan keduanya jika tombol yang sibuk tidak boleh diklik, split yang sama yang digunakan [Select](/components/forms/select#states) dan [Autocomplete](/components/forms/autocomplete#sizes-and-states) untuk prop `loading` mereka sendiri.

::component-example{name="button-loading"}
::

```vue-html
<SButton icon="hugeicons:floppy-disk" :loading="saving" :disabled="saving" @click="save">
  {{ saving ? 'Saving...' : 'Save' }}
</SButton>
```

### Sebagai link

`to` merender NuxtLink untuk navigasi klien. Gunakan `as="a"` dengan `href` untuk link eksternal, atau atur `as` secara eksplisit untuk mengganti routing otomatis. Tombol routed yang disabled mengekspos `aria-disabled`, tetap berada di tab order, dan mengabaikan klik.

::component-example{name="button-link"}
::

```vue-html
<SButton as="a" href="https://github.com" target="_blank" rel="noopener" trailing-icon="hugeicons:square-arrow-up-right">
  Open a link
</SButton>
<SButton to="/account">Account</SButton>
<SButton variant="link" to="/forgot-password">Forgot password?</SButton>
```

Untuk kasus route internal yang umum, `to` menangani NuxtLink secara otomatis. Jika Anda membutuhkan komponen routing lain, teruskan referensi komponen yang sudah di-resolve di `as` - `Primitive` merender komponen eksplisit melalui `h()`:

```vue
<script setup lang="ts">
const NuxtLinkComponent = resolveComponent('NuxtLink')
</script>

<template>
  <SButton :as="NuxtLinkComponent" to="/components/elements/button">
    Browse components
  </SButton>
</template>
```

### Raised

`raised` menambahkan `--selaras-resolved-shadow-md`, independen dari `variant` - berguna untuk tombol solid yang perlu menonjol dari background yang ramai, atau bahkan tombol `soft`/`ghost` yang ingin memiliki elevasi tanpa beralih ke `solid`.

::component-example{name="button-raised"}
::

```vue-html
<SButton raised>Raised solid</SButton>
<SButton raised variant="soft">Raised soft</SButton>
```

### Badge

Tidak ada badge slot bawaan - overlay Badge yang sebenarnya [Badge](/components/elements/badge) pada tombol ikon-saja dengan pasangan `relative`/`absolute`:

::component-example{name="button-badge"}
::

```vue-html
<div class="relative inline-flex">
  <SButton variant="outline" icon="hugeicons:notification-01" aria-label="Notifications" />
  <SBadge label="3" color="danger" size="sm" class="absolute -top-1.5 -right-1.5" />
</div>
```

### Button group

Tombol berdampingan yang bergabung secara visual menjadi satu unit adalah komponen tersendiri - lihat [ButtonGroup](/components/elements/button-group).

### Ukuran dan state

`size` menerima `sm` / `md` / `lg`, `disabled` mencegah interaksi dan meredupkan tombol - lihat tabel [Props](#props) di bawah.

### Custom `:ui`

Setiap slot dapat ditimpa tanpa melawan default - override di-tailwind-merge'd, jadi utilitas yang bertentangan resolve daripada keduanya diterapkan.

```vue-html
<SButton :ui="{ base: 'rounded-full' }">Pill button</SButton>
```

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `Button` sendiri:

::theme-source{name="button"}
::

### Aksesibilitas

Default `as="button"` mendapatkan semantik tombol native (dapat diaktifkan dengan keyboard menggunakan <kbd>Enter</kbd>/<kbd>Space</kbd>, diekspos sebagai `role="button"`) secara gratis - tidak ada yang perlu dikonfigurasi. Merender `as="a"` sebagai gantinya mengekspos semantik dan perilaku link, yang persis mengapa [Sebagai link](#sebagai-link) ada daripada menstyle `<a>` agar hanya terlihat seperti tombol. Tombol ikon-saja tidak memiliki nama yang dapat diakses sendiri - selalu berikan `aria-label` dalam kasus itu, seperti ditunjukkan di atas.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `as` | `string \| Component` | `'button'` |
| `color` | `ColorRole` (role bawaan dan terdaftar) | `primary` |
| `to` | `string` | - |
| `variant` | `'solid' \| 'soft' \| 'subtle' \| 'outline' \| 'ghost' \| 'text' \| 'link'` | `solid` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `block` | `boolean` | `false` |
| `raised` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `square` | `boolean` | - |
| `ui` | `Partial<Record<'base' \| 'leadingIcon' \| 'trailingIcon', string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `icon` | `{ class }` | Menggantikan ikon depan sepenuhnya; class scoped membawa kelas ukuran yang diresolve dari ikon |
| `trailing-icon` | `{ class }` | Menggantikan ikon trailing sepenuhnya; class scoped membawa kelas ukuran yang diresolve dari ikon |
