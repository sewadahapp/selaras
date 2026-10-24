---
title: DashboardPanel
description: Pasangan konten-utama untuk DashboardSidebar - mengisi lebar berapa pun yang tidak diambil sidebar.
order: 30
---

## Penggunaan

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardPanel>
  <SDashboardNavbar title="Overview" />
  <main>...</main>
</SDashboardPanel>
```

Harus menjadi child langsung dari [DashboardGroup](/composites/dashboard/dashboard-group), berdampingan dengan [DashboardSidebar](/composites/dashboard/dashboard-sidebar) - [SplitterPanel](/components/layout/splitter) polos (non-collapsible) di desktop, karena matematika layout panel-group milik Reka membutuhkan setiap child langsung menjadi panel nyata, sehingga ini ada meskipun ia tidak independen dapat di-resize atau di-collapse sendiri, hanya mengisi ruang berapa pun yang tidak diambil sidebar. Biasanya berisi [DashboardNavbar](/composites/dashboard/dashboard-navbar) plus `<main>` yang dapat di-scroll untuk konten halaman aktual - tidak ada yang diwajibkan, `SDashboardPanel` tidak memiliki pendapat tentang apa yang ada di dalamnya.

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `DashboardPanel` itu sendiri:

::theme-source{name="dashboard-panel"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `minSize` | `number` | `30` |
| `ui` | `Partial<Record<'root', string \| object>>` | - |
