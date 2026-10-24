---
title: Token CSS
description: Sesuaikan token semantik dan palet fondasi di CSS.
order: 20
---

### Mulai dari CSS

Untuk sebagian besar perubahan tema, edit CSS saja.

Selaras memiliki variabel input publik. Kelompok utama adalah:

| Input | Tujuan |
| --- | --- |
| `--selaras-surface-*` | Warna halaman dan permukaan |
| `--selaras-text-*` | Warna teks umum |
| `--selaras-border-*` | Warna border umum |
| `--selaras-color-<role>-<leaf>` | Role warna komponen, seperti `primary` atau `warning` |
| `--selaras-radius-*` | Radius sudut |
| `--selaras-shadow-*` | Nilai bayangan |
| `--selaras-z-*` | Penumpukan overlay |
| `--selaras-scrim` | Backdrop overlay |

Selaras juga memiliki variabel `--selaras-resolved-*`. Ini adalah nilai efektif yang dibaca. Jangan gunakan sebagai input tema.

### Perubahan CSS kecil

Anda dapat mengubah satu nilai:

```css
:root {
  --selaras-radius-base: 0.375rem;
}
```

Atau Anda dapat mengubah permukaan dan teks umum:

Canvas terang berwarna putih secara default. Dashboard yang banyak kartunya dapat menggunakan canvas halus seperti `#f9f9f9` sambil mempertahankan permukaan komponen putih:

```css
:root {
  --selaras-surface-canvas: #f9f9f9;
  --selaras-surface-default: #ffffff;
  --selaras-surface-elevated: #fafafa;

  --selaras-text-default: #18181b;
  --selaras-text-muted: #71717a;

  --selaras-border-default: #e4e4e7;
  --selaras-border-hover: #d4d4d8;
}
```

Untuk dark mode, timpa input yang sama di bawah `:root.dark`:

```css
:root.dark {
  --selaras-surface-canvas: #0c0c0d;
  --selaras-surface-default: #09090b;
  --selaras-surface-elevated: #18181b;

  --selaras-text-default: #fafafa;
  --selaras-text-muted: #a1a1aa;

  --selaras-border-default: #27272a;
  --selaras-border-hover: #3f3f46;
}
```

Selaras mengikuti kelas `.dark` pada `<html>` untuk tema dokumen.

### Periksa border terhadap permukaannya

`--selaras-surface-*` dan `--selaras-border-*` adalah input independen. Tema komponen memilih mana yang dipasangkan. Misalnya,
[DashboardSidebar](/composites/dashboard/dashboard-sidebar) mengecat background-nya
dengan `surface-elevated` dan menggambar pembatas footer-nya dengan `border-default`.
Jika keduanya diresolve ke warna yang sama, pembatas menyatu dengan background tersebut.

Ketika border harus terlihat, berikan kontras yang cukup terhadap permukaan yang disentuhnya. Periksa komponen aktual dalam mode terang dan gelap, termasuk hover dan fokus, setelah mengubah token atau palet fondasinya. Nama token atau langkah skala yang berbeda saja tidak menjamin batas yang terlihat. Border yang sengaja menyatu juga merupakan pilihan desain yang valid; setiap border tidak perlu berbeda dari setiap permukaan dalam tema Anda.

Selaras tidak secara otomatis menyesuaikan warna border atau memvalidasi kontrasnya
saat Anda menimpa variabel CSS. Untuk komponen transparan, periksa background aktual yang menonjol, yang mungkin adalah canvas aplikasi Anda.

### Ubah palet fondasi lengkap

Fondasi default adalah variabel tema Tailwind v4.

Misalnya, role warning default menggunakan palet kuning Selaras. Anda
dapat mengganti fondasi tersebut dan tetap mempertahankan resep warning bawaan:

```css
@theme {
  --color-selaras-yellow-50: var(--color-orange-50);
  --color-selaras-yellow-100: var(--color-orange-100);
  --color-selaras-yellow-200: var(--color-orange-200);
  --color-selaras-yellow-300: var(--color-orange-300);
  --color-selaras-yellow-400: var(--color-orange-400);
  --color-selaras-yellow-500: var(--color-orange-500);
  --color-selaras-yellow-600: var(--color-orange-600);
  --color-selaras-yellow-700: var(--color-orange-700);
  --color-selaras-yellow-800: var(--color-orange-800);
  --color-selaras-yellow-900: var(--color-orange-900);
  --color-selaras-yellow-950: var(--color-orange-950);
}
```

Role warning sekarang menggunakan pengganti fondasi Anda melalui resep yang sudah ada.

Aturan yang sama berlaku untuk:

- `blue` untuk role `info` default
- `red` untuk role `danger` default
- `gray` untuk role `neutral` default
- `green` untuk role `success` default
- `yellow` untuk role `warning` default
- `indigo` untuk role `primary` default
- `plum` untuk role `secondary` default

Fondasi abu-abu Selaras juga menyediakan permukaan umum, teks,
dan border default. Perubahan pada fondasi abu-abu karena itu dapat mengubah lebih dari role komponen `neutral`.

### Petakan sistem desain yang ada

Anda tidak harus mengubah nama token desain Anda.

Misalnya, sistem desain Anda dapat menggunakan skala `10` sampai `100`:

```css
:root {
  --company-brand-10: ...;
  --company-brand-20: ...;
  --company-brand-30: ...;
  --company-brand-40: ...;
  --company-brand-50: ...;
  --company-brand-60: ...;
  --company-brand-70: ...;
  --company-brand-80: ...;
  --company-brand-90: ...;
  --company-brand-100: ...;

  --selaras-color-primary-fill: var(--company-brand-60);
  --selaras-color-primary-fill-hover: var(--company-brand-70);
  --selaras-color-primary-fill-pressed: var(--company-brand-80);
  --selaras-color-primary-on-fill: var(--company-brand-10);

  --selaras-color-primary-subtle: var(--company-brand-10);
  --selaras-color-primary-subtle-hover: var(--company-brand-20);
  --selaras-color-primary-subtle-pressed: var(--company-brand-30);
  --selaras-color-primary-on-subtle: var(--company-brand-90);

  --selaras-color-primary-text: var(--company-brand-70);
  --selaras-color-primary-text-hover: var(--company-brand-80);
  --selaras-color-primary-text-pressed: var(--company-brand-90);

  --selaras-color-primary-border: var(--company-brand-50);
  --selaras-color-primary-focus: var(--company-brand-60);
}
```

Petakan juga fondasi neutral serta role warna komponen. Misalnya,
jika sistem yang ada mengekspos token permukaan dan pembatas ini:

```css
:root {
  --selaras-surface-canvas: var(--company-canvas-light);
  --selaras-surface-default: var(--company-panel-light);
  --selaras-surface-elevated: var(--company-sidebar-light);

  --selaras-border-default: var(--company-divider-light);
  --selaras-border-muted: var(--company-divider-subtle-light);
  --selaras-border-hover: var(--company-divider-hover-light);
}

:root.dark {
  --selaras-surface-canvas: var(--company-canvas-dark);
  --selaras-surface-default: var(--company-panel-dark);
  --selaras-surface-elevated: var(--company-sidebar-dark);

  --selaras-border-default: var(--company-divider-dark);
  --selaras-border-muted: var(--company-divider-subtle-dark);
  --selaras-border-hover: var(--company-divider-hover-dark);
}
```

Definisikan variabel `--company-*` di sistem Anda sendiri. Pilih nilai divider
yang tetap terlihat di panel dan sidebar tempat Anda membutuhkan batas; jangan secara otomatis memetakan border ke skala yang sama seperti background-nya.
Lihat [Periksa border terhadap permukaannya](#periksa-border-terhadap-permukaannya).

Sistem desain Anda tetap menjadi sumber kebenaran. Variabel `--selaras-*` adalah lapisan pemetaan.

### Gunakan tema lengkap Anda sendiri

Sebagian besar aplikasi harus mengimpor tema default:

```css
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

Sistem desain matang dapat menghilangkan warna fondasi yang dimiliki Selaras:

```css
@import "tailwindcss";
@import "@sewadah/selaras/structural.css";
@import "#selaras/tailwind.css";
```

Lalu sediakan semua nilai semantik yang digunakan aplikasi Anda.

`structural.css` tetap menyediakan:

- Selaras source discovery untuk Tailwind
- variants
- animasi
- CSS struktural
- binding semantik

Ini tidak menyediakan palet fondasi default Selaras.

Mode ini untuk tema eksternal yang lengkap. Ini bukan fallback tanpa tema otomatis.

### Radius, bayangan, penumpukan, dan token Tailwind

Radius secara default menggunakan satu input dasar:

```css
:root {
  --selaras-radius-base: 0.25rem;
}
```

Selaras menurunkan nilai radius small, medium, dan large default dari dasar ini. Anda dapat menimpa setiap input radius secara terpisah jika diperlukan.

Anda juga dapat mengatur nilai bayangan dan penumpukan:

```css
:root {
  --selaras-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.06);
  --selaras-shadow-md: 0 4px 16px -2px rgb(0 0 0 / 0.12);
  --selaras-shadow-lg: 0 12px 32px -4px rgb(0 0 0 / 0.16);

  --selaras-z-modal-overlay: 40;
  --selaras-z-modal: 50;
  --selaras-z-dropdown: 60;
  --selaras-z-tooltip: 70;
  --selaras-z-toast: 80;
}
```

Spacing dan breakpoint Tailwind normal adalah token Tailwind, bukan token tema Selaras:

```css
@theme {
  --breakpoint-3xl: 1920px;
  --spacing: 0.2rem;
}
```

Presentasi adaptif Selaras menggunakan nama breakpoint Tailwind yang dipilih oleh
`selaras.adaptive.breakpoint`. Nama default adalah `md`.
