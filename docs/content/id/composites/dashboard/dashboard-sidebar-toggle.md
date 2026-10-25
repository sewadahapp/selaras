---
title: DashboardSidebarToggle
description: Tombol bertema yang collapse/expand (atau membuka/menutup, di mobile) DashboardSidebar sibling.
order: 60
---

## Penggunaan

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardNavbar title="Overview">
  <template #leading>
    <SDashboardSidebarToggle />
  </template>
</SDashboardNavbar>
```

Tidak ada yang merendernya untuk Anda - letakkan di slot `leading` milik [DashboardNavbar](/composites/dashboard/dashboard-navbar) (kasus umum, ditunjukkan di atas), atau di mana pun dalam [DashboardGroup](/composites/dashboard/dashboard-group) yang sama yang masuk akal untuk layout tertentu - di dalam header milik [DashboardSidebar](/composites/dashboard/dashboard-sidebar) sendiri alih-alih navbar, misalnya, atau toolbar kustom.

Tidak merender apa pun sampai ada [DashboardSidebar](/composites/dashboard/dashboard-sidebar) sibling yang aktual dalam [DashboardGroup](/composites/dashboard/dashboard-group) yang sama untuk dikontrol.

### Menggantikan tombol sepenuhnya

Slot default menyerahkan trigger yang sepenuhnya kustom fungsi `toggle` dan state `isCollapsed` yang sama dengan yang digunakan Button bawaan secara internal, alih-alih hanya menukar props padanya:

```vue-html
<SDashboardSidebarToggle v-slot="{ toggle, isCollapsed, attrs }">
  <button v-bind="attrs" type="button" @click="toggle">
    {{ isCollapsed ? 'Show' : 'Hide' }} sidebar
  </button>
</SDashboardSidebarToggle>
```

### Mengkustomisasi ikon atau tombol

Pembungkus tipis di sekitar [Button](/components/elements/button) - `icon` menukar glyph, dan apa pun yang diterima Button (`color`, `variant`, `size`, `ui`, ...) diteruskan langsung:

```vue-html
<SDashboardSidebarToggle icon="lucide:menu" color="primary" variant="soft" />
```

Ikon default (`hugeicons:sidebar-left-01`) mencerminkan horizontal setelah sidebar collapse, alih-alih bertukar ke ikon kedua - `icon` kustom mendapat perlakuan yang sama, jadi pilih yang tetap terbaca benar saat dibalik.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `icon` | `string` | ikon `sidebarCollapse` |

## Slots

| Slot | Deskripsi |
| --- | --- |
| default | Menggantikan Button bertema sepenuhnya - di-scope ke `{ toggle, isCollapsed, attrs }`; bind `attrs` untuk meneruskan atribut pemanggil |
