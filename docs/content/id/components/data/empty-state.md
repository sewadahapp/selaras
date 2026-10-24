---
title: EmptyState
description: Jelaskan koleksi kosong atau pencarian yang tidak cocok dan tawarkan langkah selanjutnya.
order: 28
---

## Penggunaan

Gunakan `SEmptyState` saat koleksi tidak memiliki item atau pencarian tidak memiliki kecocokan. Berikan title, description, ikon opsional, dan aksi Anda sendiri.

::component-example{name="empty-state-basic"}
::

```vue-html
<SEmptyState title="No projects yet" description="Create your first project." />
```

Komponen tidak memiliki border atau background secara default, jadi cocok di dalam table, list, card, atau page. Tambahkan `SCard` di sekelilingnya atau timpa `ui.root` untuk frame.

### Table

Tempatkan di slot `empty` milik Table. Aksi dapat memperbarui data source yang sama yang digunakan tabel; empty state menghilang saat baris tersedia.

::component-example{name="empty-state-table"}
::

### Search results

Gunakan `empty-filter` untuk pencarian yang tidak cocok dan `empty` untuk koleksi kosong di Listbox, Select, Autocomplete, atau TransferList. Slot mereka yang ada tetap mengontrol kapan state ditampilkan.

::component-example{name="empty-state-search"}
::

Di listbox dan popup list, tempatkan aksi interaktif di footer atau toolbar eksternal. Jaga daftar opsi tetap didedikasikan untuk seleksi; contoh menggunakan slot `footer` milik Listbox untuk aksi clear-nya.

### Icons and custom content

`icon` menerima nama Nuxt Icon. Slot `icon` menggantikannya dengan ilustrasi dekoratif. Sesuaikan dimensinya melalui `ui.icon`.

Slot title dan description menggantikan props yang sesuai. Slot default menambahkan konten di bawah description; `actions` menempatkan kontrol di bawahnya.

::component-example{name="empty-state-custom"}
::

### Kustomisasi

Ubah satu instance dengan `:ui`:

```vue-html
<SEmptyState title="No results" :ui="{ root: 'py-6', title: 'text-sm' }" />
```

Bagikan gaya melalui `app.config.ts` atau scope dengan `STheme`:

```ts
export default defineAppConfig({
  selaras: {
    ui: {
      emptyState: { slots: { root: 'py-8', title: 'font-medium' } },
    },
  },
})
```

## Aksesibilitas

Komponen tidak mengatur heading level atau peran live-region. Pilih heading yang cocok halaman sekitarnya melalui slot `title`. Ikon dan ilustrasi bersifat dekoratif dan disembunyikan dari teknologi asistif; sertakan maknanya dalam title atau description.

Untuk hasil yang berubah secara async, pertahankan pesan `role="status"` singkat yang dimount di sebelah koleksi dan perbarui teksnya. Ini mengumumkan perubahan tanpa memindahkan fokus atau mengumumkan kontrol aksi empty state berulang kali.

Gunakan label deskriptif untuk aksi. Jika sebuah aksi menghapus empty state dan tombol fokusnya, pindahkan fokus ke kontrol yang sesuai dalam tampilan yang baru ditampilkan.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `description` | `string` | - |
| `icon` | `string` | - |
| `ui` | `Partial<Record<EmptyStateSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| `icon` | Ikon dekoratif atau ilustrasi; menggantikan `icon` |
| `title` | Menggantikan title; mendukung heading markup |
| `description` | Menggantikan description |
| `default` | Konten tambahan di bawah description |
| `actions` | Tombol, link, atau aksi lainnya |

`ui` slot yang tersedia adalah `root`, `icon`, `content`, `title`, `description`, dan `actions`. Atribut dan listener native diteruskan ke root element.
