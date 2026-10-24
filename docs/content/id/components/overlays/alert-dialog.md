---
title: AlertDialog
description: Dialog konfirmasi yang tidak bisa ditutup dengan klik di luar, dibangun di atas primitif AlertDialog milik Reka UI.
order: 50.5
---

## Penggunaan

AlertDialog adalah versi Modal yang lebih ketat untuk konfirmasi "are you sure?" - klik di luar tidak pernah menutupnya (Reka memblokirnya tanpa syarat), dan ia sudah menyertakan tombol Cancel/Continue bawaan, jadi kasus umum tidak membutuhkan slot `footer` sama sekali:

::component-example{name="alert-dialog-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
const { add } = useToast()

function onConfirm() {
  add({ title: 'Account deleted', color: 'success' })
}
</script>

<template>
  <SButton color="danger" variant="soft" @click="open = true">
    Delete account
  </SButton>

  <SAlertDialog
    v-model:open="open"
    title="Delete account"
    description="This will permanently delete your account. This action cannot be undone."
    action-color="danger"
    action-label="Delete account"
    @confirm="onConfirm"
  />
</template>
```

Selalu berikan `title` (atau slot `header` yang berisi heading) - tanpanya, dialog tidak memiliki nama yang dapat diakses untuk screen reader, dan mode dev memperingatkan tentang hal itu.

Tombol action sudah menutup dialog saat diklik (sama seperti Cancel) - `confirm`/`cancel` terpicu bersamanya, bukan sebagai gantinya, jadi `@confirm` hanya perlu menjalankan side effect yang sebenarnya.

### Footer kustom

Slot `footer` menggantikan pasangan tombol Cancel/Continue bawaan sepenuhnya - berguna untuk lebih dari dua pilihan:

::component-example{name="alert-dialog-custom-footer"}
::

```vue-html
<SAlertDialog v-model:open="open" title="Unsaved changes" description="You have unsaved changes. What would you like to do?">
  <template #footer>
    <SButton variant="ghost" @click="open = false">Cancel</SButton>
    <SButton color="danger" variant="soft" @click="discard">Discard</SButton>
    <SButton color="primary" @click="save">Save changes</SButton>
  </template>
</SAlertDialog>
```

Footer kustom memiliki tombol dan click handler sendiri sepenuhnya - ia tidak meng-emit `confirm`/`cancel` (itu khusus untuk footer bawaan), dan tidak ada yang menutup dialog secara otomatis, sama seperti slot `footer` milik Modal.

### Mengapa bukan sekadar Modal?

`SModal` sudah mendukung `dismissible="false"` untuk dialog yang tidak bisa ditutup dengan Escape atau klik di luar - tapi itu opt-in per instance, dan tetap memungkinkan consumer memasangnya kembali dengan salah. `SAlertDialog` menanamkan pemblokiran klik-di-luar ke primitif Reka sendiri, jadi ini bukan pengaturan yang harus benar atau salah - kedua komponen ada untuk maksud yang benar-benar berbeda:

```vue-html
<!-- Escape dan klik di luar keduanya berfungsi secara default -->
<SModal v-model:open="open" title="Edit profile" />

<!-- Klik di luar tidak pernah bisa menutupnya - Escape masih bisa (dismissible="false" memblokir itu juga) -->
<SAlertDialog v-model:open="open" title="Delete account" description="..." />
```

Escape masih menutup `SAlertDialog` secara default, sama seperti `SModal` - `dismissible="false"` memblokir itu juga, untuk dialog yang harus dijawab melalui salah satu tombol footer:

```vue-html
<SAlertDialog v-model:open="open" :dismissible="false" title="Confirm your plan" description="..." />
```

Event `escapeKeyDown`/`pointerDownOutside` tetap terpicu - berguna misalnya untuk animasi shake yang menandakan dialog tidak akan menutup dengan cara itu.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema dialog itu sendiri:

::theme-source{name="alert-dialog"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `open` | `boolean` | - |
| `defaultOpen` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `icon` | `string` | - |
| `cancelLabel` | `string` | `'Cancel'` |
| `actionLabel` | `string` | `'Continue'` |
| `actionColor` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | - |
| `dismissible` | `boolean` | `true` |
| `overlay` | `boolean` | `true` |
| `transition` | `boolean` | `true` |
| `ui` | `Partial<Record<'overlay' \| 'content' \| 'header' \| 'title' \| 'description' \| 'body' \| 'footer', string \| object>>` | - |


`class` yang diberikan ke `<SAlertDialog>` digabungkan ke panel dialog alert. Gunakan `ui.content` untuk panel yang sama, atau letakkan class langsung pada trigger default-slot untuk men-style trigger itu.

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:open` | `boolean` | State terbuka berubah |
| `cancel` | - | Tombol Cancel bawaan diklik |
| `confirm` | - | Tombol action bawaan diklik |
| `escapeKeyDown` | `KeyboardEvent` | Escape ditekan - `preventDefault()` untuk mencegahnya menutup |
| `pointerDownOutside` | `Event` | Pointer turun di luar dialog - sebenarnya tidak pernah bisa menutupnya, tapi tetap berguna misalnya untuk animasi shake |
| `afterLeave` | - | Transisi tutup telah selesai (atau langsung terpicu jika `transition` adalah `false`) |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Elemen trigger |
| `header` | Menggantikan blok title/description bawaan |
| `body` | Konten tambahan opsional antara header dan footer |
| `footer` | Menggantikan tombol Cancel/Continue bawaan |
