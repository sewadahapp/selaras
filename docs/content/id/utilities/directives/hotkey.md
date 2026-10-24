---
title: v-hotkey
description: Mengikat shortcut keyboard ke elemen atau handler.
order: 15
---

`v-hotkey` mendengarkan shortcut keyboard selama elemen yang diikatnya ter-mount. Ia auto-import di aplikasi Nuxt dan juga tersedia dari `@sewadah/selaras/directives`.

## Penggunaan

Ikat shortcut ke perilaku klik reguler milik elemen:

```vue-html
<SButton v-hotkey="'mod+k'" @click="openSearch">
  Search
</SButton>
```

Atau berikan handler langsung:

```vue-html
<SButton v-hotkey="{ keys: 'mod+s', handler: save }">
  Save
</SButton>
```

`mod` me-resolve ke Command di macOS dan Control di platform lain. Modifier lain mencakup `ctrl`, `meta`, `alt`, dan `shift`; tombol umum mencakup `enter`, `escape`, `space`, dan nama-nama panah.

## Opsi

| Opsi | Tipe | Default | Deskripsi |
| --- | --- | --- | --- |
| `keys` | `string` | - | Chord tombol yang dipisahkan `+`, seperti `mod+k`. |
| `handler` | `(event: KeyboardEvent) => void` | klik elemen yang diikat | Berjalan alih-alih mengklik elemen yang diikat. |
| `when` | `boolean \| (element, event) => boolean` | `true` | Mengaktifkan shortcut hanya selama kondisi benar. |
| `allowInEditable` | `boolean` | `false` | Mengizinkan shortcut saat fokus ada di input, textarea, select, atau region yang dapat diedit. |

Shortcut satu tombol yang dapat dicetak hanya berjalan saat elemen yang diikat (atau salah satu turunannya) memiliki fokus. Shortcut modifier bersifat global selama ter-mount; gunakan `when` untuk membatasinya pada state seperti menu yang terbuka. Kontrol yang dapat diedit diabaikan secara default.

## Shortcut item menu

Item Dropdown, ContextMenu, NavigationMenu, dan CommandPalette menerima `shortcut` untuk menampilkan petunjuk [`Kbd`](/components/elements/kbd). Tambahkan `hotkey: true` untuk mengaktifkannya juga. Shortcut menu hanya berjalan saat menunya aktif; shortcut NavigationMenu berjalan saat item itu difokuskan. Shortcut mengikuti jalur aktivasi normal milik item, sehingga memanggil `onSelect` atau mengikuti tujuan link milik item. Petunjuk terlihat saja tidak mendaftarkan shortcut.

```ts
const item = { label: 'Save', shortcut: 'mod+s', hotkey: true, onSelect: save }
```
