---
title: AvatarGroup
description: Menumpuk beberapa avatar dengan ring yang tumpang tindih dan hitungan overflow opsional.
order: 11.5
---

## Penggunaan

Bungkus beberapa komponen `SAvatar` di dalam `SAvatarGroup` untuk menumpuknya dengan ring yang tumpang tindih. Grup meneruskan `size` ke setiap avatar anak secara otomatis - avatar individu yang mengatur `size` mereka sendiri tetap mengambil prioritas.

::component-example{name="avatar-group-basic"}
::

```vue-html
<SAvatarGroup>
  <SAvatar text="AB" color="primary" />
  <SAvatar text="CD" color="success" />
  <SAvatar text="EF" color="info" />
</SAvatarGroup>
```

### Max

`max` membatasi berapa avatar yang terlihat. Avatar tambahan menciut menjadi indikator hitungan `+N`. Anak statis, `v-for`, dan daftar `<template v-for>` menggunakan batas dan styling tumpang tindih yang sama. Spasi kosong dan placeholder kondisional tidak dihitung.

::component-example{name="avatar-group-max"}
::

```vue
<script setup lang="ts">
const people = ['AB', 'CD', 'EF', 'GH']
</script>

<template>
  <SAvatarGroup :max="2">
    <SAvatar v-for="person in people" :key="person" :text="person" />
  </SAvatarGroup>
</template>
```

### Ukuran

`size` mengontrol ketebalan ring dan jarak tumpang tindih, serta meneruskan ke setiap avatar anak yang tidak mengatur size sendiri.

::component-example{name="avatar-group-sizes"}
::

```vue-html
<SAvatarGroup size="sm">
  <SAvatar text="AB" color="primary" />
  <SAvatar text="CD" color="success" />
</SAvatarGroup>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `AvatarGroup` sendiri:

Global dan scoped theme recipes menggunakan `ui.avatarGroup`; avatar anak tetap mempertahankan resep `ui.avatar` mereka sendiri.

::theme-source{name="avatar-group"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `max` | `number` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<'root' \| 'item' \| 'count', string \| object>>` | - |
