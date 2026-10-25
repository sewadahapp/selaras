---
title: useLocale
description: Menetapkan default locale seluruh aplikasi yang menjadi fallback formatting tanggal/waktu.
order: 50
---

`DatePicker`, `InputNumber`, dan `TimeStepper` (bagian time internal milik DatePicker sendiri) masing-masing menerima prop `locale` untuk formatting nyata berbasis `Intl`/`@internationalized/date` mereka - kode BCP-47 seperti `de-DE` atau `ar-EG`. Tanpa default global, setiap instance di seluruh aplikasi membutuhkan prop itu diulang eksplisit, dan satu yang terlupa diam-diam fallback ke `en-US`.

## Penggunaan

Tetapkan default sekali di `app.config.ts`:

```ts
export default defineAppConfig({
  selaras: {
    locale: 'de-DE',
  },
})
```

Setiap instance `DatePicker`/`InputNumber` yang tidak mengatur prop `locale`-nya sendiri kini memformat terhadap `de-DE` alih-alih `en-US` - prop `locale` eksplisit per instance tetap mengoverride ini, persis seperti sebelumnya.

Ini sengaja hanya locale *formatting tanggal/waktu*, bukan sakelar "bahasa aplikasi" gabungan - ia sumbu terpisah dari [`useMessages`](/utilities/composables/use-messages) (teks yang dirender setiap komponen) dan dari prop `dir` milik `SApp` sendiri (layout RTL/LTR). Formatting angka (`formatOptions` milik `InputNumber`, formatting sel milik `Table`) juga membaca dari locale yang sama, tapi per instance komponen - data grid yang sah menampilkan angka dalam lebih dari satu locale berdampingan tidak perlu melawan satu pengaturan global.

`SApp` sendiri membaca ini untuk menetapkan `<html lang>` di samping atribut `dir` yang sudah ada - tanpa wiring tambahan yang diperlukan.

## API

```ts
function useLocale(): ComputedRef<string>
```

Mengembalikan override `app.config.selaras.locale` Anda, atau `'en-US'` jika tidak diatur - gunakan ini jika Anda membangun komponen sendiri dan ingin formatting-nya sendiri menghormati default seluruh aplikasi yang sama yang sudah dilakukan DatePicker/InputNumber:

```vue
<script setup lang="ts">
const locale = useLocale()
const formatter = computed(() => new Intl.NumberFormat(locale.value))
</script>
```
