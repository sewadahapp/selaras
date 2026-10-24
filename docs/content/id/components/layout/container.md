---
title: Container
description: Wrapper max-width dengan padding horizontal untuk tata letak halaman.
order: 60
---

## Penggunaan

::component-example{name="container-basic"}
::

```vue-html
<SContainer size="sm">
  <p>This content is centered and constrained to a max width.</p>
</SContainer>
```

## Custom `:ui`

Global dan scoped recipe overrides menggunakan `ui.container`.

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan ukuran - berikut adalah file tema `Container` sendiri:

::theme-source{name="container"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` |
| `ui` | `Partial<Record<ContainerSlot, string \| object>>` | - |
