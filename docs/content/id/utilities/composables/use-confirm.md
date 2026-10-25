---
title: useConfirm
description: Meminta konfirmasi dari action handler.
order: 12
---

`useConfirm()` membuka `<SAlertDialog>` milik pustaka yang dapat diakses dan me-resolve boolean. Gunakan ketika aksi membutuhkan keputusan ya/tidak tetapi tidak seharusnya memiliki dialog dan state-nya sendiri di template.

## Penggunaan

```vue
<script setup lang="ts">
const { confirm } = useConfirm()

async function handleDelete() {
  const accepted = await confirm({
    title: 'Delete this project?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Delete project',
    confirmColor: 'danger',
    icon: 'hugeicons:delete-02',
  })

  if (!accepted)
    return

  await deleteProject()
}
</script>
```

Hanya konfirmasi eksplisit yang me-resolve `true`. Cancel, Escape, atau renderer yang di-unmount me-resolve `false`. Title default ke message `confirmation` yang terlokalisasi; label aksi dan cancel menggunakan message `continue` dan `cancel` yang sama seperti `<SAlertDialog>`.

## API

```ts
function useConfirm(): {
  confirm: (options?: UseConfirmOptions) => Promise<boolean>
}
```

### `UseConfirmOptions`

| Opsi | Tipe | Default |
| --- | --- | --- |
| `title` | `string` | "Confirm action" yang terlokalisasi |
| `description` | `string` | - |
| `confirmLabel` | `string` | message continue yang terlokalisasi |
| `cancelLabel` | `string` | message cancel yang terlokalisasi |
| `confirmColor` | `ColorRole` | default komponen |
| `icon` | `string` | - |

Composable ini khusus klien. Ia menggunakan markup dan tema `<SAlertDialog>` yang sama seperti dialog deklaratif, dan mengambil snapshot `<STheme>` aktif milik pemanggil selama terbuka. Seperti overlay programatik lainnya, ia membutuhkan `<SApp>` sekali di sekitar root aplikasi.

## Penyiapan

```vue-html
<SApp>
  <NuxtPage />
</SApp>
```
