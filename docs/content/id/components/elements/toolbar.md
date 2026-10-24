---
title: Toolbar
components: [SToolbarButton, SToolbarSeparator, SToolbarToggleGroup]
description: Grup keyboard-navigable untuk aksi, toggle, dan kontrol kustom.
order: 12.95
---

## Penggunaan

Gunakan Toolbar untuk aksi terkait. ToolbarButton, ToolbarToggleGroup, dan ToolbarSeparator berbagi ukuran, warna, dan state disabled toolbar. Kontrol menggunakan satu tab stop; tombol panah bergerak antara kontrol yang diaktifkan, termasuk di seluruh toggle group. Berikan label yang dapat diakses untuk setiap toolbar dan aksi ikon-saja.

::component-example{name="toolbar-basic"}
::

```vue-html
<SToolbar aria-label="Document actions">
  <SToolbarButton icon="hugeicons:floppy-disk" @click="save">Save</SToolbarButton>
  <SToolbarSeparator />
  <SToolbarButton icon="hugeicons:undo" aria-label="Undo" :disabled="!canUndo" @click="undo" />
</SToolbar>
```

### Formatting state

ToolbarButton menerima `pressed` untuk state yang dimiliki sistem lain, seperti seleksi editor saat ini. Ia memancarkan event click normal; ia tidak memelihara salinan kedua dari state formatting. ToolbarToggleGroup mendukung konvensi `items` string/object dan seleksi single/multiple yang sama seperti ToggleGroup, dengan satu urutan fokus toolbar yang sama. `icon-only` menjaga label setiap item sebagai nama yang dapat diakses.

```vue-html
<SToolbar aria-label="Text formatting">
  <SToolbarButton icon="hugeicons:text-bold" aria-label="Bold" :pressed="boldActive" @click="toggleBold" />
</SToolbar>
```

Toolbar tidak mengubah konten editor sendiri. Lihat blok siap-salin [Tiptap](/blocks/editors/tiptap), [Lexical](/blocks/editors/lexical), dan [Quill](/blocks/editors/quill) untuk formatting dan penanganan seleksi.

### Custom triggers

Gunakan `as-child` pada ToolbarButton untuk menyertakan trigger kustom dalam navigasi keyboard toolbar. Slot harus memiliki satu root interaktif yang meneruskan atributnya. Untuk perintah editor, pertahankan seleksi editor sebelum memindahkan fokus ke popover atau dialog, lalu pulihkan saat menerapkan perintah. Pointer-only `@mousedown.prevent` dapat menjaga seleksi untuk aksi formatting sederhana; itu tidak boleh mencegah fokus keyboard atau entri teks ke kontrol lain.

### Orientasi dan tampilan

`orientation="vertical"` mengubah tata letak dan navigasi keyboard. `dir="rtl"` membalikkan navigasi horizontal. Navigasi melingkar secara default; gunakan `:loop="false"` untuk berhenti di kedua ujung. Separator mengikuti orientasi berlawanan kecuali secara eksplisit ditimpa. Ukuran default adalah `sm`; `md` dan `lg` cocok dengan Button.

Gunakan `ui.root`, `ui.base`, atau slot item untuk styling lokal. Resep bersama adalah `toolbar`, `toolbarButton`, `toolbarToggleGroup`, dan `toolbarSeparator` di `app.config.selaras.ui` atau `STheme`. Ukuran/warna toolbar default dapat diatur di `selaras.defaults.toolbar`.

## Props

| Komponen | Props |
| --- | --- |
| `SToolbar` | `orientation` (`horizontal` secara default), `size` (`sm`), `color` (`primary`), `disabled`, `loop` (`true`), `dir`, `ui.root` |
| `SToolbarButton` | Button props, `pressed?: boolean`, `asChild`, `ui.base`, `ui.leadingIcon`, `ui.trailingIcon` |
| `SToolbarToggleGroup` | `items`, `type` (`single`), `modelValue`, `defaultValue`, `iconOnly`, `disabled`, `size`, `color`, `ui.root`, `ui.item`, `ui.icon` |
| `SToolbarSeparator` | `orientation`, `decorative` (`true`), `ui.root` |

## Slots dan events

Toolbar dan ToolbarButton mengekspos slot default. ToolbarToggleGroup mengekspos `#item="{ item }"` dan memancarkan `update:modelValue` dengan string atau array string. ToolbarButton meneruskan event tombol, termasuk `click`. Tombol menggunakan `type="button"` secara default, jadi toolbar di dalam form tidak mensubmit form.
