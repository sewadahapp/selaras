---
title: Drawer
description: Panel drag-to-dismiss yang meluncur dari tepi, dibangun di atas primitif Drawer milik Reka UI.
order: 56
---

## Penggunaan

Visibilitas Drawer dikontrol dengan `v-model:open`, jadi ia membutuhkan ref dari halaman tempat ia digunakan. Berbeda dengan [Slideover](/components/overlays/slideover), yang dibangun di atas primitif Dialog milik Reka, Drawer dibangun di atas primitif Drawer milik Reka sendiri - drag-to-dismiss sungguhan dan (di bawah) snap point istirahat, bukan sekadar animasi luncur:

::component-example{name="drawer-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open drawer
  </SButton>

  <SDrawer v-model:open="open" title="Edit profile" description="Update your personal details.">
    <template #body>
      Drawer content goes here.
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Cancel
      </SButton>
      <SButton @click="open = false">
        Save
      </SButton>
    </template>
  </SDrawer>
</template>
```

Selalu berikan `title` (atau slot `header`/`content` yang berisi heading) - tanpanya, panel tidak memiliki nama yang dapat diakses untuk screen reader, dan mode dev memperingatkan tentang hal itu.

### Side

`side` memilih tepi mana panel meluncur masuk (dan arah ia di-swipe untuk menutupnya) - `top`, `right`, `bottom` (default), atau `left`. Berbeda dengan default `'right'` milik Slideover, drawer default ke `bottom` - bottom sheet mobile klasik:

::component-example{name="drawer-side"}
::

```vue-html
<SDrawer v-model:open="open" side="left" title="Filters" />
```

### Snap point

`snapPoints` memberi panel tinggi (atau lebar, untuk drawer `left`/`right`) istirahat untuk di-drag di antaranya sebelum sepenuhnya terbuka - fraksi (`0`-`1`), piksel (`> 1`), atau string panjang CSS (`'30rem'`). Pasangkan dengan `v-model:snap-point` untuk membaca atau mengontrol mana yang sedang aktif. `snapToSequentialPoints` (default `false`) membatasi dragging satu langkah setiap kali alih-alih melompat ke titik terdekat:

::component-example{name="drawer-snap-points"}
::

```vue-html
<SDrawer
  v-model:open="open"
  v-model:snap-point="snapPoint"
  :snap-points="[0.3, 0.6, 1]"
  title="Drag me"
/>
```

### Handle

Bilah grip kecil tampil di atas panel secara default, menandakan ia dapat di-drag - atur `handle="false"` untuk menghapusnya:

```vue-html
<SDrawer v-model:open="open" :handle="false" title="No handle" />
```

### Konten kustom

`content` menggantikan struktur header/title/description/body/footer sepenuhnya - berguna ketika panel sama sekali tidak cocok dengan bentuk header-plus-body. `close`/`handle` diabaikan setelah `content` diberikan, karena slot memiliki seluruh panel yang terlihat - tapi `title`/`description`, jika masih diatur, tetap terdaftar ke Reka sebagai nama/deskripsi panel yang dapat diakses, hanya disembunyikan secara visual alih-alih dirender sebagai header. Berikan mereka jika konten kustom Anda sendiri belum menyertakan heading yang bisa diasosiasikan Reka dengan panel:

::component-example{name="drawer-content"}
::

```vue-html
<SDrawer v-model:open="open">
  <template #content>
    <div class="flex flex-col items-center gap-4 p-8 text-center">
      ...
    </div>
  </template>
</SDrawer>
```

### Non-modal

`modal="false"` menghentikan panel memblokir interaksi dengan sisa halaman - tanpa focus trap, elemen luar tetap dapat dijangkau dan tidak disembunyikan dari teknologi asistif. `overlay` independen dari ini - panel non-modal masih bisa menampilkan (atau menyembunyikan) backdrop-nya sendiri:

```vue-html
<SDrawer v-model:open="open" :modal="false" title="Non-modal" />
```

### Mengintersep penutupan

`SDrawer` tidak mengoverride default Reka UI sendiri (Escape, klik di luar, dan swipe drag-to-dismiss semuanya menutupnya), tapi mengekspos event yang mendasarinya sehingga Anda bisa `preventDefault()` pada mereka - misalnya untuk konfirmasi sebelum menutup panel dengan perubahan yang belum disimpan. Swipe tidak memiliki event sendiri untuk diintersep sebelumnya (Reka hanya melaporkannya setelah terjadi), sehingga hanya bisa diblokir secara keseluruhan via `dismissible`, bukan kondisional per percobaan seperti Escape/klik-di-luar:

```vue-html
<SDrawer
  v-model:open="open"
  title="Edit profile"
  @escape-key-down="(e) => hasChanges && e.preventDefault()"
  @pointer-down-outside="(e) => hasChanges && e.preventDefault()"
/>
```

Untuk kasus yang lebih sederhana, all-or-nothing - panel yang tidak boleh ditutup oleh apa pun kecuali pilihan eksplisit - `dismissible="false"` menonaktifkan Escape, klik-di-luar, dan swipe-to-dismiss sekaligus, dan `close="false"` juga menghapus tombol tutup:

```vue-html
<SDrawer v-model:open="open" :dismissible="false" :close="false" title="Confirm your plan" />
```

## Penggunaan programatik

`useDrawer()` membuka panel dari mana saja - click handler, callback async - tanpa `v-model` milik Anda sendiri untuk dikelola. Ia berfungsi otomatis setelah `<SApp>` membungkus aplikasi Anda, persis seperti `useModal()`/`useSlideover()`; tidak ada yang perlu ditempatkan tambahan.

Komponen yang diberikan memiliki seluruh konten panel, sama seperti slot `content`. `open()` mengembalikan promise yang resolve dengan nilai apa pun yang dibawa event `close` milik komponen itu sendiri, sehingga aksi eksplisit bisa resolve dengan data nyata sementara penutupan via Escape, klik di luar, atau swipe resolve dengan `undefined`:

::component-example{name="drawer-use-drawer"}
::

```ts
import DrawerCartPanel from './DrawerCartPanel.vue'

const drawer = useDrawer()
const checkedOut = await drawer.open(DrawerCartPanel)
// true, false, atau undefined jika ditutup tanpa pilihan eksplisit
```

`open()` juga menerima opsi `title`/`description`/`side`/`handle`/`snapPoints`/`snapPoint`/`snapToSequentialPoints`/`dismissible`/`modal`/`overlay`/`transition` yang sama seperti props deklaratif.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema panel itu sendiri:

::theme-source{name="drawer"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `open` | `boolean` | tidak terkontrol (awalnya tertutup) |
| `defaultOpen` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `handle` | `boolean` | `true` |
| `snapPoints` | `(number \| string)[]` | - |
| `snapPoint` | `number \| string \| null` | - |
| `snapToSequentialPoints` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `close` | `boolean` | `true` |
| `modal` | `boolean \| 'trap-focus'` | `true` |
| `overlay` | `boolean` | `true` |
| `transition` | `boolean` | `true` |
| `ui` | `Partial<Record<DrawerSlot, string \| object>>` | - |


`class` yang diberikan ke `<SDrawer>` digabungkan ke panel drawer. Gunakan `ui.content` untuk panel yang sama, atau letakkan class langsung pada trigger default-slot untuk men-style trigger itu.

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:open` | `boolean` | State terbuka berubah |
| `update:snapPoint` | `number \| string \| null` | Snap point aktif berubah |
| `escapeKeyDown` | `KeyboardEvent` | Escape ditekan - `preventDefault()` untuk mencegahnya menutup |
| `pointerDownOutside` | `Event` | Pointer turun di luar panel - `preventDefault()` untuk mencegahnya menutup |
| `focusOutside` | `Event` | Elemen luar panel non-modal menerima fokus - `preventDefault()` untuk mencegahnya menutup |
| `afterLeave` | - | Transisi tutup telah selesai (atau langsung terpicu jika `transition` adalah `false`) |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Elemen trigger |
| `content` | Menggantikan header/body/footer yang terlihat sepenuhnya (title/description, jika diatur, tetap terdaftar untuk a11y) |
| `header` | Menggantikan blok title/description bawaan |
| `body` | Konten utama |
| `footer` | Biasanya tombol aksi |
| `close-icon` | Menggantikan ikon tombol tutup (default: `hugeicons:cancel-01`) |

### Visibilitas awal dan terkontrol

`defaultOpen` mengatur visibilitas awal ketika `open` dihilangkan. Gunakan `v-model:open` ketika parent memiliki visibilitas; `update:open` mengusulkan perubahan tanpa mengoverride nilai parent. Mengubah `defaultOpen` setelah mount tidak mengontrol overlay.
