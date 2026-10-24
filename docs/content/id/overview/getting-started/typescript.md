---
title: TypeScript
description: Mengimpor tipe Props, Emits, dan Slots dari komponen.
order: 80
---

Setiap komponen mengekspor interface `Props`/`Emits`/`Slots` bernama yang didokumentasikan (`ButtonProps`, `ModalEmits`, `PopoverSlots`, ...) - berguna saat Anda membungkus komponen, meneruskan props dari komponen Anda sendiri, atau hanya ingin autocomplete pada objek yang sedang Anda bangun sebelum meneruskannya.

## Dari barrel `@sewadah/selaras/types`

Jalur paling sederhana - satu impor untuk tipe setiap komponen:

```ts
import type { ModalEmits, ModalProps, PopoverSlots } from '@sewadah/selaras/types'
```

## Dari komponen tertentu

File `.vue` setiap komponen juga merupakan jalur impor type-only yang valid, jika Anda hanya membutuhkan satu komponen dan tidak ingin yang lain masuk ke scope:

```ts
import type { PopoverProps } from '@sewadah/selaras/components/Popover.vue'
```

## Opsi modul

Tipe konfigurasi modul itu sendiri (bentuk key `selaras` di `nuxt.config.ts`, lihat [Instalasi](/overview/getting-started/installation)) diekspor dari root paket:

```ts
import type { ModuleOptions } from '@sewadah/selaras'
```
