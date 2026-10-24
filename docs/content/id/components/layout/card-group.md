---
title: CardGroup
description: Wrapper grid responsif untuk meletakkan beberapa Cards berdampingan.
order: 67
---

## Penggunaan

::component-example{name="card-group-basic"}
::

```vue-html
<SCardGroup>
  <SCard>...</SCard>
  <SCard>...</SCard>
</SCardGroup>
```

Single column di bawah breakpoint `sm`, kolom `cols` pada `sm` dan lebih besar - default `2`, cocok untuk kasus penggunaan paling umum (perbandingan [Card](/components/layout/card) sendiri). `SCardGroup` tidak memiliki opini tentang apa yang ada di dalamnya - anak apa pun berfungsi, tidak hanya [Card](/components/layout/card).

## Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.cardGroup`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot - berikut adalah file tema `CardGroup` sendiri:

::theme-source{name="card-group"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `cols` | `2 \| 3 \| 4` | `2` |
| `ui` | `Partial<Record<CardGroupSlot, string \| object>>` | - |
