---
title: ContentNavigation
description: Tree nav bersarang yang dapat di-collapse - beri hasil queryCollectionNavigation() langsung.
order: 30
---

## Penggunaan

::component-example{name="content-navigation-basic"}
::

```vue-html
<SContentNavigation :navigation="navigation" />
```

`navigation` adalah array polos berbentuk `{ title, path, children? }[]` - bentuk yang sama dengan yang dikembalikan `queryCollectionNavigation()` milik `@nuxt/content`, sehingga Anda bisa meneruskan hasilnya langsung tanpa adapter. Pustaka ini tidak memiliki dependensi keras pada `@nuxt/content` - bangun array sendiri jika Anda tidak menggunakannya.

Path exact route saat ini disorot. Grup dengan children dirender sebagai item [Accordion](/components/navigation/accordion) secara internal (`type="multiple"`, sehingga beberapa bagian bisa tetap terbuka sekaligus, dan setiap grup mulai terbuka secara default) alih-alih toggle rakitan tangan.

Sidebar kiri situs docs ini sendiri persis komponen ini, diberi `queryCollectionNavigation('docs').order('order', 'ASC')`. Ia biasanya dibungkus [PageAside](/composites/documentation/page-aside) alih-alih digunakan telanjang, yang memasok positioning sticky dan chrome rail yang dapat di-scroll - lihat bagian "Merakit layout halaman penuh" milik [PageHeader](/composites/documentation/page-header) untuk bagaimana ia dan [ContentToc](/composites/documentation/content-toc) cocok dengan sisa halaman.

`path` yang dimulai dengan `http://`/`https://` dirender sebagai link eksternal nyata secara otomatis - itu perilaku default milik `NuxtLink` sendiri, tidak ada yang perlu di-opt-in.

### Ikon

Beri link (atau grup) `icon` dan ia dirender sebelum title secara otomatis:

::component-example{name="content-navigation-icons"}
::

```vue-html
<SContentNavigation
  :navigation="[
    { title: 'Getting Started', path: '/', icon: 'hugeicons:rocket-01' },
    { title: 'Forms', path: '/components/forms', icon: 'hugeicons:folder-01', children: [...] },
  ]"
/>
```

### Konten link kustom

Slot `link` menggantikan konten title milik link (atau header grup) - di-scope dengan `link` dan `active` (selalu `false` untuk header grup, karena itu hanya pernah mendeskripsikan path exact milik leaf link):

::component-example{name="content-navigation-custom-link"}
::

```vue-html
<SContentNavigation :navigation="navigation">
  <template #link="{ link }">
    <span class="flex flex-1 items-center justify-between gap-2">
      {{ link.title }}
      <SBadge v-if="link.path === '/components/forms/textarea'" label="New" color="primary" size="sm" />
    </span>
  </template>
</SContentNavigation>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default saat ini untuk setiap slot - berikut adalah file tema `ContentNavigation` itu sendiri:

Recipe tema global dan scoped menggunakan `ui.contentNavigation`. Slot grup-nya mengadaptasi layout Accordion bersarang sementara `ui.accordion` dan `ui.icon` tetap recipe primitif independen.

::theme-source{name="content-navigation"}
::

### Aksesibilitas

Link aktif mendapat `aria-current="page"` otomatis - perilaku default milik `NuxtLink` sendiri untuk link mana pun yang cocok dengan route saat ini, bukan sesuatu yang ditetapkan komponen ini sendiri. Perilaku keyboard expand/collapse untuk grup berasal dari primitif [Accordion](/components/navigation/accordion) yang sama yang digunakan secara internal - lihat bagian Aksesibilitas miliknya untuk detail.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `color` | [ColorRole](/overview/theming/color-roles) | `primary` |
| `collapsed` | `boolean` | `false` |
| `navigation` | `{ title: string, path: string, icon?: string, children?: [...] }[]` | - (required) |
| `ui` | `Partial<Record<ContentNavigationSlot, string \| object>>` | - |

## Slots

| Slot | Props | Deskripsi |
| --- | --- | --- |
| `link` | `{ link, active }` | Menggantikan konten title milik link (atau header grup) |

`collapsed` awalnya menutup grup kecuali metadata `collapse` milik item mengoverride-nya. Ia mengonfigurasi ekspansi grup, bukan layout sidebar ringkas.
