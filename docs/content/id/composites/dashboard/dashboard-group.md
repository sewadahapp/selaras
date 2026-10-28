---
title: DashboardGroup
description: Akar dari shell dasbor yang dapat di-resize dan di-collapse - sidebar, resize handle, dan panel konten utama.
order: 10
---

## Penggunaan

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardGroup>
  <SDashboardSidebar>
    <template #header>Acme Inc</template>
    <nav>...</nav>
  </SDashboardSidebar>
  <SDashboardResizeHandle />
  <SDashboardPanel>
    <SDashboardNavbar title="Overview" />
    <main>...</main>
  </SDashboardPanel>
</SDashboardGroup>
```

`SDashboardGroup` mengoordinasikan seluruh shell - letakkan [DashboardSidebar](/composites/dashboard/dashboard-sidebar), [DashboardResizeHandle](/composites/dashboard/dashboard-resize-handle), dan [DashboardPanel](/composites/dashboard/dashboard-panel) di dalamnya secara langsung (tidak dibungkus apa pun - ia perlu melihat ketiganya sebagai children-nya sendiri). Ia pembungkus bertema di sekitar [Splitter](/components/layout/splitter) - `SDashboardSidebar`/`SDashboardPanel` membungkus `SSplitterPanel` dengan cara yang sama, sehingga perilaku resize/collapse/remember-the-width semuanya berasal dari primitif general-purpose yang sama, bukan logika khusus shell dasbor.

### Persistensi

Secara default, lebar dan status collapse sidebar disimpan dalam cookie sesi dengan kunci `autoSaveId`. Berikan objek `storage` dengan metode `getItem` dan `setItem` untuk menggunakan backend lain, seperti `localStorage`; jika tidak diberikan, penyimpanan cookie tetap digunakan. Beri halaman yang perlu mengingat layout terpisah nilai `autoSaveId` yang berbeda.

Layout yang tersimpan dipulihkan setelah mounting, ketika panel splitter terdaftar dan container dapat diukur. Layout tidak dibaca selama server rendering, sehingga pengunjung yang kembali pertama melihat lebar default yang dikonfigurasi, lalu layout yang tersimpan.

### Mobile

Di bawah `mobileBreakpoint` (768px secara default), tidak ada panel resizable sama sekali - `SDashboardSidebar` beralih merender kontennya di dalam overlay [Drawer](/components/overlays/drawer), dan `SDashboardResizeHandle` tidak merender apa pun (tidak ada yang bisa di-drag setelah sidebar bukan bagian dari layout split). Coba resize jendela browser halaman ini sendiri lebih sempit dari ponsel untuk melihatnya beralih live.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `DashboardGroup` itu sendiri:

::theme-source{name="dashboard-group"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `autoSaveId` | `string` | `'selaras-dashboard'` |
| `mobileBreakpoint` | `number` | `768` |
| `storage` | `{ getItem(name): string \| null; setItem(name, value): void }` | Penyimpanan cookie |
| `ui` | `Partial<Record<'root', string \| object>>` | - |
