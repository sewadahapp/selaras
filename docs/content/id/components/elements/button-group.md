---
title: ButtonGroup
description: Menggabungkan tombol berdampingan secara visual menjadi satu unit.
order: 10.5
---

## Penggunaan

`SButtonGroup` membuat sudut dalam setiap tombol menjadi persegi dan tumpang tindih ring 1px mereka sehingga tepi bersama tidak menjadi tebal ganda, menonjolkan tepi tombol yang di-hover/difokuskan di atas tetangganya:

::component-example{name="button-group-basic"}
::

```vue-html
<SButtonGroup>
  <SButton variant="outline">Day</SButton>
  <SButton variant="outline">Week</SButton>
  <SButton variant="outline">Month</SButton>
</SButtonGroup>
```

### Vertikal

`orientation="vertical"` menumpuk tombol secara vertikal, membuat sudut atas/bawah menjadi persegi:

::component-example{name="button-group-vertical"}
::

```vue-html
<SButtonGroup orientation="vertical">
  <SButton variant="outline">Submit</SButton>
  <SButton variant="outline">Cancel</SButton>
</SButtonGroup>
```

`SButtonGroup` tidak terbatas pada tombol - lihat [InputGroup](/components/forms/input-group) untuk mekanisme penggabungan yang sama diperluas ke Input/Select/Textarea, yang membawa ring/radius mereka sendiri satu tingkat lebih dalam daripada Button.

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `ButtonGroup` sendiri:

Global dan scoped theme recipes menggunakan `ui.buttonGroup`.

::theme-source{name="button-group"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `ui` | `Partial<Record<'root', string \| object>>` | - |
