---
title: Slideover
description: Panel yang meluncur masuk dari tepi layar, dibangun di atas primitif Dialog milik Reka UI.
order: 54
---

## Penggunaan

Visibilitas Slideover dikontrol dengan `v-model:open`, jadi ia membutuhkan ref dari halaman tempat ia digunakan.

::component-example{name="slideover-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">
    Open slideover
  </SButton>

  <SSlideover v-model:open="open" title="Edit profile" description="Update your personal details.">
    <template #body>
      Slideover content goes here.
    </template>
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Cancel
      </SButton>
      <SButton @click="open = false">
        Save
      </SButton>
    </template>
  </SSlideover>
</template>
```

Selalu berikan `title` (atau slot `header`/`content` yang berisi heading) - tanpanya, panel tidak memiliki nama yang dapat diakses untuk screen reader, dan mode dev memperingatkan tentang hal itu.

### Side

`side` memilih tepi mana panel meluncur masuk - `top`, `right` (default), `bottom`, atau `left`:

::component-example{name="slideover-side"}
::

```vue-html
<SSlideover v-model:open="open" side="left" title="Filters" />
```

### Inset

`inset` mengambangkan panel dengan margin dan sudut membulat alih-alih duduk rapat di tepi:

::component-example{name="slideover-inset"}
::

```vue-html
<SSlideover v-model:open="open" inset title="Notifications" />
```

### Konten kustom

`content` menggantikan struktur header/title/description/body/footer sepenuhnya - berguna ketika panel sama sekali tidak cocok dengan bentuk header-plus-body. `close` diabaikan setelah `content` diberikan, karena slot memiliki seluruh panel yang terlihat - tapi `title`/`description`, jika masih diatur, tetap terdaftar ke Reka sebagai nama/deskripsi panel yang dapat diakses, hanya disembunyikan secara visual alih-alih dirender sebagai header. Berikan mereka jika konten kustom Anda sendiri belum menyertakan heading yang bisa diasosiasikan Reka dengan panel:

::component-example{name="slideover-content"}
::

```vue-html
<SSlideover v-model:open="open">
  <template #content>
    <div class="flex flex-col items-center gap-4 p-8 text-center">
      ...
    </div>
  </template>
</SSlideover>
```

### Non-modal

`modal="false"` menghentikan panel memblokir interaksi dengan sisa halaman - tanpa focus trap, elemen luar tetap dapat dijangkau dan tidak disembunyikan dari teknologi asistif. `overlay` independen dari ini - panel non-modal masih bisa menampilkan (atau menyembunyikan) backdrop-nya sendiri:

::component-example{name="slideover-non-modal"}
::

```vue-html
<SSlideover v-model:open="open" :modal="false" title="Non-modal" />
```

### Konten yang dapat di-scroll

Panel dibatasi pada viewport - body yang lebih tinggi dari itu scroll secara internal sendiri, sementara header dan footer tetap terjepit di tempat.

::component-example{name="slideover-scrollable"}
::

### Mengintersep penutupan

`SSlideover` tidak mengoverride default Reka UI sendiri (Escape dan klik di luar keduanya menutupnya), tapi mengekspos event yang mendasarinya sehingga Anda bisa `preventDefault()` pada mereka - misalnya untuk konfirmasi sebelum menutup panel dengan perubahan yang belum disimpan:

```vue-html
<SSlideover
  v-model:open="open"
  title="Edit profile"
  @escape-key-down="(e) => hasChanges && e.preventDefault()"
  @pointer-down-outside="(e) => hasChanges && e.preventDefault()"
/>
```

Untuk kasus yang lebih sederhana, all-or-nothing - panel yang tidak boleh ditutup oleh apa pun kecuali pilihan eksplisit - `dismissible="false"` menonaktifkan Escape dan klik-di-luar sekaligus, dan `close="false"` juga menghapus tombol tutup:

```vue-html
<SSlideover v-model:open="open" :dismissible="false" :close="false" title="Confirm your plan" />
```

Kedua event mentah tetap terpicu bahkan dengan `dismissible="false"` - berguna misalnya untuk animasi shake yang menandakan panel tidak akan menutup dengan cara itu.

### Mengkustomisasi tombol tutup

Tombol tutup dirender sebagai `<SButton>` nyata, sehingga `:ui.close` sudah menjangkaunya sepenuhnya - bukan sekadar class. Kunci non-`class` milik nilai `:ui` objek berlaku sebagai attrs/props mentah, sehingga `:ui="{ close: { color: 'danger' } }"` berfungsi hari ini tanpa prop khusus untuk itu:

```vue-html
<SSlideover v-model:open="open" title="Delete item" :ui="{ close: { color: 'danger' } }" />
```

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema panel itu sendiri:

::theme-source{name="slideover"}
::

## Penggunaan programatik

`useSlideover()` membuka panel dari mana saja - click handler, callback async - tanpa `v-model` milik Anda sendiri untuk dikelola. Ia berfungsi otomatis setelah `<SApp>` membungkus aplikasi Anda, persis seperti `useModal()`; tidak ada yang perlu ditempatkan tambahan.

Komponen yang diberikan memiliki seluruh konten panel, sama seperti slot `content` di atas - heading-nya sendiri, tombolnya sendiri. `open()` mengembalikan promise yang resolve dengan nilai apa pun yang dibawa event `close` milik komponen itu sendiri, sehingga aksi eksplisit bisa resolve dengan data nyata sementara penutupan via Escape atau klik di luar resolve dengan `undefined`:

::component-example{name="slideover-use-slideover"}
::

```vue-html
<!-- SlideoverFilterPanel.vue - panel yang mandiri -->
<template>
  <div class="flex h-full flex-col">
    <h2>Filters</h2>
    <SCheckbox label="In stock only" />
    <SButton variant="ghost" @click="$emit('close', false)">Cancel</SButton>
    <SButton @click="$emit('close', true)">Apply</SButton>
  </div>
</template>
```

```ts
import SlideoverFilterPanel from './SlideoverFilterPanel.vue'

const slideover = useSlideover()
const applied = await slideover.open(SlideoverFilterPanel)
// true, false, atau undefined jika ditutup tanpa pilihan eksplisit
```

`open()` juga menerima opsi `title`/`description`/`side`/`inset`/`dismissible`/`modal`/`overlay`/`transition` yang sama seperti props deklaratif:

```ts
await slideover.open(SlideoverFilterPanel, { side: 'left' })
```

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `open` | `boolean` | tidak terkontrol (awalnya tertutup) |
| `defaultOpen` | `boolean` | `false` |
| `title` | `string` | - |
| `description` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `inset` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `close` | `boolean` | `true` |
| `modal` | `boolean` | `true` |
| `overlay` | `boolean` | `true` |
| `transition` | `boolean` | `true` |
| `ui` | `Partial<Record<'overlay' \| 'content' \| 'header' \| 'title' \| 'description' \| 'close' \| 'body' \| 'footer', string \| object>>` | - |


`class` yang diberikan ke `<SSlideover>` digabungkan ke panel slideover. Gunakan `ui.content` untuk panel yang sama, atau letakkan class langsung pada trigger default-slot untuk men-style trigger itu.

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:open` | `boolean` | State terbuka berubah |
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
