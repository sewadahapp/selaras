---
title: Popover
description: Kontainer konten mengambang generik, dibangun di atas primitif Popover milik Reka UI.
order: 55
---

## Penggunaan

Slot `content` milik Popover dapat menampung apa saja - berbeda dengan [Dropdown](/components/overlays/dropdown) (item menu) atau [Tooltip](/components/overlays/tooltip) (teks hover saja), ia adalah panel interaktif kosong untuk hal seperti formulir quick-edit atau daftar filter:

::component-example{name="popover-basic"}
::

```vue
<script setup lang="ts">
const open = ref(false)
const name = ref('')
</script>

<template>
  <SPopover v-model:open="open">
    <SButton variant="outline">
      Edit name
    </SButton>
    <template #content>
      <div class="flex w-64 flex-col gap-3">
        <p class="text-sm font-medium text-[var(--selaras-resolved-text-default)]">
          Display name
        </p>
        <SInput v-model="name" placeholder="Jane Doe" />
        <SButton size="sm" @click="open = false">
          Save
        </SButton>
      </div>
    </template>
  </SPopover>
</template>
```

`v-model:open` opsional - hilangkan dan popover mengelola state terbukanya sendiri secara internal, di-toggle dengan mengklik trigger.

### Side dan align

`side` memilih tepi trigger mana panel terbuka (`top`, `right`, `left`, default `bottom`); `align` mengontrol bagaimana ia sejajar sepanjang tepi itu (`start`, default `center`, `end`):

::component-example{name="popover-side"}
::

```vue-html
<SPopover side="right" align="start">...</SPopover>
```

### Arrow

`arrow` menampilkan segitiga pointer kecil yang menghubungkan panel ke trigger-nya. Berikan objek untuk mengatur lebar, tinggi, ujung membulat, atau clearance minimum dari sudut panel (`padding`):

::component-example{name="popover-arrow"}
::

```vue-html
<SPopover arrow>...</SPopover>
<SPopover :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }">...</SPopover>
```

### Modal

Popover non-modal secara default - sisa halaman tetap dapat dijangkau, dan tidak disembunyikan dari teknologi asistif. `modal="true"` menjebak fokus dan memblokir interaksi luar sebagai gantinya, lebih dekat dengan perilaku Modal/Slideover:

```vue-html
<SPopover modal>...</SPopover>
```

### Mengintersep penutupan

Popover tidak mengoverride default Reka UI sendiri (Escape dan klik di luar keduanya menutupnya), tapi mengekspos event yang mendasarinya sehingga Anda bisa `preventDefault()` pada mereka:

```vue-html
<SPopover
  @escape-key-down="(e) => hasChanges && e.preventDefault()"
  @pointer-down-outside="(e) => hasChanges && e.preventDefault()"
>
  ...
</SPopover>
```

Untuk kasus yang lebih sederhana, all-or-nothing, `dismissible="false"` menonaktifkan Escape dan klik-di-luar (dan, untuk popover non-modal, elemen luar yang sekadar menerima fokus) sekaligus - event mentah tetap terpicu, sehingga consumer tetap bisa bereaksi, tapi tidak ada yang menutupnya sendiri:

```vue-html
<SPopover :dismissible="false">...</SPopover>
```

### Kembalikan fokus saat tutup

Reka mengembalikan fokus keyboard ke trigger setiap kali popover menutup, terlepas dari *mengapa* ia menutup - termasuk perubahan `open` yang murni programatik. Itu penting untuk popover yang bisa terbuka saat hover alih-alih klik/keypress yang disengaja: fokus yang mendarat kembali pada trigger yang tidak pernah dimaksudkan untuk difokuskan bisa dihitung sebagai fokus yang bergerak "di luar" popover *lain* apa pun yang telah dipindahkan pointer sejak itu, menutup yang itu juga. `returnFocusOnClose="false"` menonaktifkan perilaku untuk kasus seperti itu:

```vue-html
<SPopover :return-focus-on-close="false">...</SPopover>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot dan varian - berikut adalah file tema popover itu sendiri:

::theme-source{name="popover"}
::

### Positioning dan portal

`positioning` mengonfigurasi side, alignment, offset, dan perilaku collision panel. Ia mengoverride prop `side` dan `align` top-level yang lebih lama ketika keduanya diberikan. `portal` default ke body dokumen; atur ke `false` untuk merender inline, atau berikan selector CSS atau `HTMLElement` sebagai target teleport. Gunakan `ui.content` untuk styling panel dan `#content` untuk isinya.

```vue-html
<SPopover :positioning="{ side: 'top', align: 'end', sideOffset: 8 }" portal="#overlay-root">...</SPopover>
```

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `open` | `boolean` | tidak terkontrol (awalnya tertutup) |
| `defaultOpen` | `boolean` | `false` |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` |
| `positioning` | `OverlayPositioning` | default panel |
| `portal` | `boolean \| string \| HTMLElement` | `true` (body dokumen) |
| `modal` | `boolean` | `false` |
| `dismissible` | `boolean` | `true` |
| `returnFocusOnClose` | `boolean` | `true` |
| `arrow` | `boolean \| RoundedArrowConfig` | `false` |
| `ui` | `Partial<Record<'content' \| 'arrow', string \| object>>` | - |


`class` yang diberikan ke `<SPopover>` digabungkan ke elemen trigger default-slot-nya. Gunakan `ui.content` untuk men-style panel mengambang.

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:open` | `boolean` | State terbuka berubah |
| `escapeKeyDown` | `KeyboardEvent` | Escape ditekan - `preventDefault()` untuk mencegahnya menutup |
| `pointerDownOutside` | `Event` | Pointer turun di luar popover - `preventDefault()` untuk mencegahnya menutup |
| `focusOutside` | `Event` | Elemen luar popover non-modal menerima fokus - `preventDefault()` untuk mencegahnya menutup |
| `openAutoFocus` | `Event` | Terpicu tepat sebelum fokus berpindah ke dalam popover saat terbuka - `preventDefault()` untuk melewati autofocus pada pembukaan itu (misalnya pembukaan yang dipicu hover yang tidak boleh mencuri fokus, sementara yang dipicu keyboard tetap boleh) |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Elemen trigger |
| `content` | Konten popover itu sendiri |

### Visibilitas awal dan terkontrol

`defaultOpen` mengatur visibilitas awal ketika `open` dihilangkan. Gunakan `v-model:open` ketika parent memiliki visibilitas; `update:open` mengusulkan perubahan tanpa mengoverride nilai parent. Mengubah `defaultOpen` setelah mount tidak mengontrol overlay.
