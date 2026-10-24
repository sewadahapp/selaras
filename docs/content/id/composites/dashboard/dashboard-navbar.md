---
title: DashboardNavbar
description: Bar atas untuk area konten utama milik DashboardPanel sendiri.
order: 50
---

## Penggunaan

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardNavbar title="Overview">
  <template #leading>
    <SDashboardSidebarToggle />
  </template>
  <SButton size="sm" icon="hugeicons:plus-sign">New</SButton>
</SDashboardNavbar>
```

Berbeda dari [Header](/components/layout/header) seluruh situs - yang ini berada *di dalam* [DashboardPanel](/composites/dashboard/dashboard-panel), di-scope hanya ke area konten utama.

Tidak ada yang dirender di slot leading secara default - menyamai setiap bagian lain keluarga ini (tombol [DashboardResizeHandle](/composites/dashboard/dashboard-resize-handle) tidak disisipkan otomatis antara sidebar dan panel), tombol sidebar-toggle adalah sesuatu yang Anda compose eksplisit alih-alih sesuatu yang diasumsikan `SDashboardNavbar` Anda inginkan. Lihat [DashboardSidebarToggle](/composites/dashboard/dashboard-sidebar-toggle) untuk apa yang dilakukannya dan cara mengkustomisasinya - ia collapse/expand [DashboardSidebar](/composites/dashboard/dashboard-sidebar) (atau membuka/menutupnya di mobile, lihat bagian "Mobile" milik [DashboardGroup](/composites/dashboard/dashboard-group) sendiri), dan tidak merender apa pun sendiri sampai ada sidebar aktual dalam [DashboardGroup](/composites/dashboard/dashboard-group) yang sama untuk dikontrol.

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `DashboardNavbar` itu sendiri:

::theme-source{name="dashboard-navbar"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `ui` | `Partial<Record<DashboardNavbarSlot, string \| object>>` | - |

## Slots

| Slot | Deskripsi |
| --- | --- |
| `leading` | Kosong secara default - biasanya tombol sidebar-toggle |
| `title` | Konten title kustom, mengoverride prop `title` |
| default | Konten trailing - aksi, trigger pencarian, apa pun yang dibutuhkan halaman |
