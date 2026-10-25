---
title: DashboardResizeHandle
description: Divider yang dapat di-drag antara DashboardSidebar dan DashboardPanel.
order: 40
---

## Penggunaan

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardGroup>
  <SDashboardSidebar>...</SDashboardSidebar>
  <SDashboardResizeHandle />
  <SDashboardPanel>...</SDashboardPanel>
</SDashboardGroup>
```

Ditempatkan antara [DashboardSidebar](/composites/dashboard/dashboard-sidebar) dan [DashboardPanel](/composites/dashboard/dashboard-panel), keduanya children langsung dari [DashboardGroup](/composites/dashboard/dashboard-group) - pembungkus tipis di sekitar [SplitterResizeHandle](/components/layout/splitter) (`direction="horizontal"` tetap, karena shell dasbor hanya pernah split kiri/kanan). Area hit transparan 8px-nya tumpang tindih dengan batas tanpa memakan ruang layout atau mengasumsikan background salah satu panel. Border tipis terlihat secara default, dengan warna aksen saat hover, saat dragging, atau saat fokus keyboard. Ia juga menambahkan pemeriksaan mobile: tidak merender apa pun di bawah `mobileBreakpoint` - tidak ada yang bisa di-drag setelah sidebar sama sekali bukan bagian dari layout split, lihat bagian "Mobile" milik [DashboardGroup](/composites/dashboard/dashboard-group).

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `DashboardResizeHandle` itu sendiri:

::theme-source{name="dashboard-resize-handle"}
::

Slot `root` mengontrol area hit; `line` mengontrol divider yang terlihat. Misalnya, sembunyikan divider saat diam dan ungkapkan selama interaksi:

```vue-html
<SDashboardResizeHandle :ui="{ line: 'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[state=drag]:opacity-100' }" />
```

DashboardPanel tetap transparan, sehingga background halaman atau panel Anda terus terlihat. SplitterResizeHandle mandiri mempertahankan default-nya sendiri.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<SplitterResizeHandleSlot, string \| object>>` | - |
