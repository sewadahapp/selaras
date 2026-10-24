---
title: DashboardSidebar
description: Sidebar yang dapat di-resize dan di-collapse yang menjadi drawer di layar kecil.
order: 20
---

## Penggunaan

::component-example{name="dashboard-basic"}
::

```vue-html
<SDashboardSidebar :default-size="260" :min-size="200" :max-size="400">
  <template #header="{ isCollapsed }">
    {{ isCollapsed ? 'A' : 'Acme Inc' }}
  </template>
  <template #default="{ isCollapsed }">
    <nav>
      <a href="/">
        <Icon name="..." />
        <span v-if="!isCollapsed">Dashboard</span>
      </a>
    </nav>
  </template>
  <template #footer>...</template>
</SDashboardSidebar>
```

Harus menjadi child langsung dari [DashboardGroup](/composites/dashboard/dashboard-group) - lihat halamannya sendiri untuk perilaku resize/collapse/persistence/mobile-drawer, semuanya dibagi lintas seluruh shell alih-alih dimiliki sidebar saja. `header`/default/`footer` mencerminkan bentuk slot milik [PageAside](/composites/documentation/page-aside) - konten default scroll (via [ScrollArea](/components/layout/scroll-area)) independen dari header/footer yang tetap.

Di desktop, [SplitterPanel](/components/layout/splitter) bertema (collapsible, `minSize`/`maxSize`/`defaultSize` diteruskan langsung); di bawah `mobileBreakpoint`, konten yang sama dirender di dalam [Drawer](/components/overlays/drawer). Ukuran dalam piksel secara default (`sizeUnit="px"`) alih-alih default persentase milik `SplitterPanel` sendiri - lebar sidebar terbaca lebih alami dalam piksel daripada sebagai fraksi lebar halaman.

## Mengontrol collapse dari luar

Bind `v-model:collapsed` untuk mengatur state rail desktop dan menerima update dari resizing atau `DashboardSidebarToggle`. Nilai eksplisit lebih diutamakan daripada state collapse yang tersimpan. Hilangkan untuk menjaga sizing dan persistensi yang ada tanpa kontrol.

::component-example{name="dashboard-controlled"}
::

```vue-html
<SDashboardSidebar v-model:collapsed="collapsed" />
```

Ref komponen juga mengekspos `collapse()`, `expand()`, `toggle()`, dan `isCollapsed`. `collapse()` dan `expand()` beroperasi pada panel desktop dan memulihkan lebar expanded sebelumnya. Mereka tidak melakukan apa pun di mobile atau ketika `collapsible` adalah `false`. `toggle()` mempertahankan perilaku drawer mobile yang normal. Model `collapsed` tidak mengontrol drawer mobile; nilainya diterapkan saat kembali ke desktop. Gunakan model untuk menangkap pilihan pengguna saat ini sebelum collapse sementara untuk sebuah halaman, lalu pulihkan pilihan itu saat pergi.

## Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `DashboardSidebar` itu sendiri:

::theme-source{name="dashboard-sidebar"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `collapsed` | `boolean` | - |
| `defaultSize` | `number` | `260` |
| `minSize` | `number` | `200` |
| `maxSize` | `number` | `400` |
| `collapsedSize` | `number` | `64` |
| `collapsible` | `boolean` | `true` |
| `sizeUnit` | `'px' \| '%'` | `'px'` |
| `ui` | `Partial<Record<DashboardSidebarSlot, string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `header` | `{ isCollapsed }` | Konten tetap di atas body yang dapat di-scroll (logo, nama brand) |
| default | `{ isCollapsed }` | Konten body yang dapat di-scroll (biasanya tree nav) |
| `footer` | `{ isCollapsed }` | Konten tetap di bawah body yang dapat di-scroll (menu pengguna) |

`isCollapsed` selalu `false` di mobile, yang tidak memiliki state antara - hanya drawer terbuka atau tertutup. Gunakan untuk menukar logo header ke mark yang lebih sempit, atau menyembunyikan teks label item nav, setelah sidebar collapse ke icon rail - contoh live di atas melakukan keduanya, sekaligus menyembunyikan nama footer di samping avatar.

## Events

| Event | Payload | Deskripsi |
| --- | --- | --- |
| `update:collapsed` | `boolean` | State collapse desktop berubah melalui resizing, toggle, atau method komponen. |
