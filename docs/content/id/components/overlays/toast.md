---
title: Toast
description: Notifikasi bertumpuk, dipicu secara imperatif via useToast().
order: 53
---

## Penggunaan

Bungkus `app.vue` root Anda di `<SApp>` sekali (sudah dilakukan oleh shell situs docs ini), dan letakkan `<SToast />` di dalamnya, dibungkus `<ClientOnly>`. Lalu dorong toast dari mana saja dengan `useToast()`:

```vue-html
<!-- app.vue -->
<SApp>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <SToast />
  </ClientOnly>
</SApp>
```

`SApp` membangun `ToastProvider` milik Reka UI di sekitar seluruh aplikasi Anda - ia harus di-mount tepat sekali, di app root yang sebenarnya, bukan per-layout atau per-halaman. Me-mount-nya lebih dari sekali akan mendaftarkan beberapa provider untuk state toast yang sama, menyebabkan setiap toast dirender sekali per instance.

`SToast` adalah bagian yang benar-benar merender toast - ia melakukan pengukuran DOM nyata dan animasi berbasis CSS, sehingga membutuhkan `<ClientOnly>` di sekitarnya. `SApp` sendiri tidak: ia hanya membangun konteks, sehingga dirender di server seperti komponen lainnya.

::component-example{name="toast-basic"}
::

```vue
<script setup lang="ts">
const { add } = useToast()

function save() {
  add({ title: 'Saved', description: 'Your changes have been saved.' })
}
</script>

<template>
  <SButton @click="save">
    Show toast
  </SButton>
</template>
```

### Warna

`color` menerima role semantik terdaftar apa pun dan menerapkan background soft-nya, menyamai perlakuan warna yang digunakan `SAlert`. Intent bawaan `success`, `danger`, `warning`, dan `info` memilih ikon default yang cocok. Role lain tidak menebak ikon; atur `icon` secara eksplisit bila diperlukan. Tanpa warna, toast menjaga permukaan netral dan ikon eksplisit menggunakan warna netral:

::component-example{name="toast-colors"}
::

```vue-html
<SButton @click="add({ color: 'success', title: 'Saved' })">
  Show success toast
</SButton>
```

### Posisi dan stacking

Atur `position` pada satu renderer `<SToast />` untuk memilih sudut layar atau tepi tengah mana pun. Default-nya `bottom-right`. Beberapa toast berlapis menjadi tumpukan ringkas: setiap toast baru meluncur masuk di depan dan mendorong yang lebih lama ke belakang, dengan hingga tiga kartu terlihat. Tumpukan mengembang saat pointer atau fokus keyboard ada di dalamnya; atur `expand` untuk menampilkan setiap toast terpisah sebagai gantinya. Klik sebuah posisi beberapa kali untuk melihat tumpukan terbangun, lalu hover:

::component-example{name="toast-positions"}
::

```vue-html
<ClientOnly>
  <SToast position="top-center" expand />
</ClientOnly>
```

### Timing dan jumlah

`duration` mengatur waktu default dalam milidetik setiap toast tetap terlihat; `duration` yang diberikan ke `add()` mengoverride-nya untuk toast itu. `max` membatasi berapa banyak yang terlihat sekaligus. Ketika batas tercapai, toast tertua dihapus sehingga notifikasi yang lebih baru bisa muncul tanpa membangun backlog tersembunyi.

```vue-html
<ClientOnly>
  <SToast :duration="8000" :max="3" />
</ClientOnly>
```

### Aksesibilitas

Toast merender primitif Toast milik Reka UI, sehingga semantik aksesibilitas berasal dari sana alih-alih diimplementasikan ulang di sini: setiap toast mengumumkan dirinya via `aria-live` tanpa mencuri fokus dari apa pun yang sedang dilakukan pengguna, hover atau fokus di dalamnya menjeda timer tutupnya sendiri (berlanjut setelah ditinggalkan), dan di perangkat sentuh ia bisa di-swipe pergi.

## `useToast()`

| Method | Deskripsi |
| --- | --- |
| `add(toast)` | Mendorong toast (`{ title?, description?, duration?, color?, icon? }`), mengembalikan id-nya |
| `remove(id)` | Menutup toast berdasarkan id |

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema toast itu sendiri:

::theme-source{name="toast"}
::

## Props (`SToast`)

| Prop | Tipe | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<'viewport' \| 'root' \| 'title' \| 'description' \| 'icon' \| 'close', string \| object>>` | - |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` |
| `expand` | `boolean` | `false` |
| `duration` | `number` | `5000` |
| `max` | `number` | `5` |
