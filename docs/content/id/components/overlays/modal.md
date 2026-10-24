---
title: Modal
description: Overlay dialog, dibangun di atas primitif Dialog milik Reka UI.
order: 50
---

## Penggunaan

Visibilitas Modal dikontrol dengan `v-model:open`, jadi ia membutuhkan ref dari halaman tempat ia digunakan.

::component-example{name="modal-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open modal
  </SButton>

  <SModal v-model:open="open" title="Delete item" description="This action cannot be undone.">
    <template #body>
      Are you sure you want to delete this item?
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Cancel
      </SButton>
      <SButton color="danger" @click="open = false">
        Delete
      </SButton>
    </template>
  </SModal>
</template>
```

Selalu berikan `title` (atau slot `header`/`content` yang berisi heading) - tanpanya, dialog tidak memiliki nama yang dapat diakses untuk screen reader, dan mode dev memperingatkan tentang hal itu.

### Mengontrolnya secara programatik

`open` adalah nilai terkontrol yang nyata, tidak terikat pada klik - mengaturnya dari mana saja (timeout, callback async, route watcher, komponen lain) membuka dialog secara identik. Tidak diperlukan elemen trigger, atau bahkan slot default:

::component-example{name="modal-programmatic"}
::

```vue-html
<SModal v-model:open="open" title="Opened by the timeout" />
```

```ts
function simulate() {
  setTimeout(() => {
    open.value = true
  }, 1000)
}
```

### Konten kustom

`content` menggantikan struktur header/title/description/body/footer sepenuhnya - berguna ketika dialog sama sekali tidak cocok dengan bentuk header-plus-body (layar sukses, layout formulir yang sepenuhnya kustom). `close`/`maximizable` diabaikan setelah `content` diberikan, karena slot memiliki seluruh dialog yang terlihat - tapi `title`/`description`, jika masih diatur, tetap terdaftar ke Reka sebagai nama/deskripsi dialog yang dapat diakses, hanya disembunyikan secara visual alih-alih dirender sebagai header. Berikan mereka jika konten kustom Anda sendiri belum menyertakan heading yang bisa diasosiasikan Reka dengan dialog:

::component-example{name="modal-content"}
::

```vue-html
<SModal v-model:open="open">
  <template #content>
    <div class="flex flex-col items-center gap-4 p-8 text-center">
      ...
    </div>
  </template>
</SModal>
```

### Fullscreen

`fullscreen` membuat dialog seluruh viewport alih-alih kartu terpusat bawaan - berguna untuk image viewer, formulir kompleks, atau apa pun yang diuntungkan ruang ekstra.

::component-example{name="modal-fullscreen"}
::

```vue-html
<SModal v-model:open="open" fullscreen title="Fullscreen" />
```

### Maximizable

`fullscreen` saja hanya mengatur layout awal yang tetap - `maximizable` menambahkan tombol header di samping close yang memungkinkan pengguna beralih antara layout bawaan dan full-viewport saat runtime, menyamai toggle maximize dialog milik referensi yang sebanding. `fullscreen` tetap mengatur mana yang menjadi awalnya; pasangkan dengan `v-model:fullscreen` jika Anda perlu membaca atau mengontrol state saat ini sendiri:

::component-example{name="modal-maximizable"}
::

```vue-html
<SModal v-model:open="open" maximizable title="Report" />
```

### Non-modal

`modal="false"` menghentikan dialog memblokir interaksi dengan sisa halaman - tanpa focus trap, elemen luar tetap dapat dijangkau dan tidak disembunyikan dari teknologi asistif. `overlay` independen dari ini - dialog non-modal masih bisa menampilkan (atau menyembunyikan) backdrop-nya sendiri:

::component-example{name="modal-non-modal"}
::

```vue-html
<SModal v-model:open="open" :modal="false" title="Non-modal" />
```

### Konten yang dapat di-scroll

Dialog dibatasi pada tinggi viewport - body yang lebih tinggi dari itu scroll secara internal sendiri, sementara header dan footer tetap terjepit di tempat.

::component-example{name="modal-scrollable"}
::

### Mengintersep penutupan

`SModal` tidak mengoverride default Reka UI sendiri (Escape dan klik di luar keduanya menutupnya), tapi mengekspos event yang mendasarinya sehingga Anda bisa `preventDefault()` pada mereka - misalnya untuk konfirmasi sebelum menutup dialog dengan perubahan yang belum disimpan:

```vue-html
<SModal
  v-model:open="open"
  title="Edit profile"
  @escape-key-down="(e) => hasChanges && e.preventDefault()"
  @pointer-down-outside="(e) => hasChanges && e.preventDefault()"
/>
```

Untuk kasus yang lebih sederhana, all-or-nothing - dialog yang tidak boleh ditutup oleh apa pun kecuali pilihan eksplisit - `dismissible="false"` menonaktifkan Escape dan klik-di-luar sekaligus, dan `close="false"` juga menghapus tombol tutup:

::component-example{name="modal-dismissible"}
::

```vue-html
<SModal v-model:open="open" :dismissible="false" :close="false" title="Confirm your plan" />
```

Kedua event mentah tetap terpicu bahkan dengan `dismissible="false"` - berguna misalnya untuk animasi shake yang menandakan dialog tidak akan menutup dengan cara itu.

### Mengkustomisasi tombol close/maximize

Kedua tombol header dirender sebagai `<SButton>` nyata, sehingga `:ui.close`/`:ui.maximize` sudah menjangkau mereka sepenuhnya - bukan sekadar class. Kunci non-`class` milik nilai `:ui` objek berlaku sebagai attrs/props mentah, sehingga `:ui="{ close: { color: 'danger' } }"` berfungsi hari ini tanpa prop khusus untuk itu:

```vue-html
<SModal v-model:open="open" title="Delete item" :ui="{ close: { color: 'danger' } }" />
```

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema dialog itu sendiri:

::theme-source{name="modal"}
::

## Penggunaan programatik

`useModal()` membuka dialog dari mana saja - click handler, callback async - tanpa `v-model` milik Anda sendiri untuk dikelola. Ia berfungsi otomatis setelah `<SApp>` membungkus aplikasi Anda, persis seperti setiap komponen lain di sini; tidak ada yang perlu ditempatkan tambahan, berbeda dengan `<SToast />`.

Komponen yang diberikan memiliki seluruh konten dialog, sama seperti slot `content` di atas - heading-nya sendiri, tombolnya sendiri. `open()` mengembalikan promise yang resolve dengan nilai apa pun yang dibawa event `close` milik komponen itu sendiri, sehingga aksi eksplisit bisa resolve dengan data nyata sementara penutupan via Escape atau klik di luar resolve dengan `undefined`:

::component-example{name="modal-use-modal"}
::

```vue-html
<!-- ModalConfirmDialog.vue - dialog yang mandiri -->
<template>
  <div class="p-8 text-center">
    <h2>Delete this item?</h2>
    <SButton variant="ghost" @click="$emit('close', false)">Cancel</SButton>
    <SButton color="danger" @click="$emit('close', true)">Delete</SButton>
  </div>
</template>
```

```ts
import ModalConfirmDialog from './ModalConfirmDialog.vue'

const modal = useModal()
const confirmed = await modal.open(ModalConfirmDialog)
// true, false, atau undefined jika ditutup tanpa pilihan eksplisit
```

`open()` juga menerima opsi `title`/`description`/`dismissible`/`modal`/`overlay`/`transition` yang sama seperti props deklaratif - `title`/`description` adalah satu-satunya cara memberi dialog yang dibuka programatik nama/deskripsi yang benar-benar dapat diakses, karena komponen yang dibuka selalu dirender melalui slot `content`:

```ts
await modal.open(ModalConfirmDialog, { dismissible: false })
```

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `open` | `boolean` | tidak terkontrol (awalnya tertutup) |
| `defaultOpen` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `fullscreen` | `boolean` | `false` |
| `maximizable` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `close` | `boolean` | `true` |
| `modal` | `boolean` | `true` |
| `overlay` | `boolean` | `true` |
| `transition` | `boolean` | `true` |
| `autoFocus` | `boolean` | `true` |
| `ui` | `Partial<Record<'overlay' \| 'content' \| 'header' \| 'headerActions' \| 'title' \| 'description' \| 'close' \| 'maximize' \| 'body' \| 'footer', string \| object>>` | - |


`class` yang diberikan ke `<SModal>` digabungkan ke panel dialog. Gunakan `ui.content` untuk panel yang sama, atau letakkan class langsung pada trigger default-slot untuk men-style trigger itu.

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:open` | `boolean` | State terbuka berubah |
| `update:fullscreen` | `boolean` | Terpicu ketika tombol toggle milik `maximizable` mengubah layout |
| `escapeKeyDown` | `KeyboardEvent` | Escape ditekan - `preventDefault()` untuk mencegahnya menutup |
| `pointerDownOutside` | `Event` | Pointer turun di luar dialog - `preventDefault()` untuk mencegahnya menutup |
| `focusOutside` | `Event` | Elemen luar dialog non-modal menerima fokus - `preventDefault()` untuk mencegahnya menutup |
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
| `maximize-icon` | Menggantikan ikon tombol maximize saat tidak fullscreen |
| `minimize-icon` | Menggantikan ikon tombol maximize saat fullscreen |

### Visibilitas awal dan terkontrol

`defaultOpen` mengatur visibilitas awal ketika `open` dihilangkan. Gunakan `v-model:open` ketika parent memiliki visibilitas; `update:open` mengusulkan perubahan tanpa mengoverride nilai parent. Mengubah `defaultOpen` setelah mount tidak mengontrol overlay.
