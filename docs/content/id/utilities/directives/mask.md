---
title: v-mask
description: Memformat teks saat pengguna mengetik ke dalam input.
order: 20
---

`v-mask` memformat teks saat dimasukkan. Input menampilkan teks yang diformat, sementara `v-model` menerima nilai mentah tanpa karakter literal milik mask. Ia berfungsi pada input native dan komponen single-input seperti `SInput`.

## Penggunaan

Di Nuxt, direktif di-auto-import. Berikan pola mask sebagai string - ia expression JavaScript, sehingga membutuhkan kutipnya sendiri:

```vue-html
<input v-model="phone" v-mask="'(###) ###-####'" inputmode="tel">
```

Mengetik `5551234567` menampilkan `(555) 123-4567`, dan `phone` adalah `5551234567`. Mengatur `phone` dari kode memformatnya dengan cara yang sama.

Ia berfungsi sama pada `SInput`:

::component-example{name="input-masked"}
::

```vue-html
<SInput v-model="phone" v-mask="'(###) ###-####'" inputmode="tel" />
```

## Token

| Token | Cocok dengan |
| --- | --- |
| `#` | Digit |
| `@` | Huruf |
| `*` | Huruf atau digit |

Karakter lain apa pun dalam mask adalah literal, disisipkan otomatis saat pengguna mengetik. Karakter yang tidak cocok dengan token berikutnya dilewati.

Mask berbentuk tanggal seperti `##/##/####` hanya memformat teks; ia tidak memeriksa bahwa tanggalnya adalah tanggal kalender yang nyata:

```vue-html
<SInput v-model="date" v-mask="'##/##/####'" placeholder="dd/mm/yyyy" />
```

Prefiks literal juga berfungsi. Dengan `+62####`, mengetik `8123` menampilkan `+628123`, dan nilai mentah tetap `8123`.

## Opsi

Berikan objek untuk token kustom atau untuk membaca nilai yang diformat juga:

| Opsi | Tipe | Deskripsi |
| --- | --- | --- |
| `mask` | `string` | Pola mask. |
| `tokens` | `Record<string, { pattern: RegExp, transform?: (char: string) => string }>` | Token tambahan, digabung di atas default. |
| `onMask` | `(detail: MaskDetail) => void` | Dipanggil dengan `{ value, maskedValue, completed }` setiap kali teks yang diformat berubah. |

Token kustom dapat mentransformasi apa yang diterimanya - di sini, kode hex yang ditampilkan huruf besar:

```vue-html
<SInput
  v-model="color"
  v-mask="{
    mask: 'HHHHHH',
    tokens: { H: { pattern: /[\da-f]/i, transform: char => char.toUpperCase() } },
  }"
/>
```

Gunakan `onMask` ketika Anda membutuhkan teks yang diformat atau ingin tahu apakah setiap posisi terisi. `value` cocok dengan `v-model`, `maskedValue` adalah yang ditampilkan input, dan `completed` adalah `true` setelah setiap token terisi:

```vue-html
<SInput
  v-model="phone"
  v-mask="{ mask: '(###) ###-####', onMask: ({ maskedValue }) => formatted = maskedValue }"
/>
```

Detail yang sama juga di-dispatch sebagai event native `mask` yang bubbling pada input.
