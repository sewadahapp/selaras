---
title: Theme
description: Scope theme overrides ke subtree alih-alih seluruh aplikasi.
order: 69
---

## Penggunaan

`STheme` menerapkan override `ui`/`defaults` ke komponen descendant. Secara default headless. Atur `as` untuk memberi boundary DOM eksplisit pada runtime token overrides.

::component-example{name="theme-basic"}
::

```vue-html
<SButton>Default</SButton>
<STheme :ui="{ button: { slots: { base: 'rounded-full' } } }">
  <SButton>Rounded, scoped</SButton>
</STheme>
```

Ini adalah bentuk override yang sama seperti [`app.config.selaras.ui`](/overview/theming/global-configuration) - `{ <componentKey>: { slots: { <slotName>: '...' } } }`, digabung ke tema dasar komponen dengan cara yang sama (`tv()`'s own `extend`) - hanya scoped ke subtree ini alih-alih seluruh aplikasi. Lihat [Theming](/overview/theming/overview) untuk urutan prioritas lengkap dan bagaimana `:ui`/`app.config.selaras.ui`/`STheme` semuanya cocok bersama.

### Prop defaults

`defaults` mengatur nilai default untuk prop pada setiap descendant yang cocok, daripada class override:

```vue-html
<STheme :defaults="{ button: { size: 'lg' } }">
  <SButton>No own size - renders lg</SButton>
  <SButton size="sm">Explicit size - still sm</SButton>
</STheme>
```

Prop eksplisit pada komponen itu sendiri selalu menang - `STheme` hanya mengisi saat prop tidak diatur. Default yang didukung adalah `size` dan `color` untuk `Button`, `Badge`, `Avatar`, `Chip`, `Input`, `Editable`, dan `Toolbar`. Komponen lain menjaga prop default mereka sendiri; override `ui` mereka masih berlaku. Behavioral props seperti open state, seleksi, dan disabled state milik komponen itu sendiri.

### Nesting

`STheme` inner menang untuk pengaturan spesifik yang ia atur, sambil tetap mewarisi apa pun yang diatur outer dan tidak ia sentuh:

```vue-html
<STheme :ui="{ button: { slots: { base: 'rounded-full' } } }" :defaults="{ button: { color: 'neutral' } }">
  <STheme :defaults="{ button: { color: 'danger' } }">
    <SButton>Rounded (from the outer Theme) + danger (from the inner one)</SButton>
  </STheme>
</STheme>
```

### Scoped tokens dan portals

Gunakan `as` untuk membuat boundary DOM untuk semantic token overrides:

```vue-html
<STheme as="section" :tokens="{ light: { colors: { premium: { fill: '#5134a8' } } } }">
  <!-- nested token scopes inherit untouched mode, roles and leaves -->
</STheme>
```

Contoh ini mengasumsikan role `premium` yang terdaftar. Override terkelola dibawa ke portal overlay yang didukung. Scope internal dapat mengoverride satu leaf dan mempertahankan nilai lain dari scope luarnya, termasuk setelah reactive update. `STheme` headless meneruskan token scope yang ada melalui; `tokens` sendiri membutuhkan root `as` eksplisit.

CSS variables eksternal masih mengikuti DOM inheritance. Jika token mereferensi variable yang dideklarasikan pada ancestor lokal, gunakan portal target dalam ancestor itu; theme marker tidak menyalin CSS variables sewenang-wenang.

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `ui` | `ThemeUiOverrides` | - |
| `defaults` | `ThemeDefaults` | - |
| `tokens` | `RuntimeTokenOverrides` | - |
| `as` | `string \| Component` | - |
| `mode` | `'inherit' \| 'light' \| 'dark'` | inherited mode |

`ThemeUiOverrides` dan `ThemeDefaults` diekspor dari `@sewadah/selaras/types`. Gunakan `as` saat mengatur `tokens` atau mode `light`/`dark` eksplisit; jika tidak Theme melempar karena tidak ada DOM boundary untuk scope. Mode eksplisit berlaku untuk subtree dan portal overlay yang didukung tanpa mengubah mode seluruh aplikasi.

```vue-html
<STheme as="section" mode="dark">
  <SButton>A locally dark section</SButton>
</STheme>
```
