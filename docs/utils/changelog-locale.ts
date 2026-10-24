/** Localize editorial prose while keeping generated commit summaries in their publication language. */
export function localizeChangelogBody(body: string, tag: string, locale: string): string {
  if (locale !== 'id')
    return body

  let localized = body

  if (tag === 'v1.0.0') {
    localized = localized.replace(
      /<!-- selaras-release-summary -->\n\n[\s\S]*?(?=\n\n\[compare changes\])/,
      `Selaras 1.0 menetapkan kontrak komponen, tema, dan paket berbasis Nuxt yang dikembangkan sebelum rilis stabil.

### Sorotan upgrade

- Peran warna semantik didaftarkan saat build Nuxt dan digunakan oleh komponen yang relevan.
- Penyesuaian tema menggunakan input publik \`--selaras-*\` dan nilai efektif \`--selaras-resolved-*\`; alias lama \`--ui-*\` tidak lagi digunakan.
- Select, Autocomplete, DatePicker, dan ColorPicker menggunakan prop opt-in \`adaptive\` untuk tampilan layar kecil.
- Kontrol mengikuti konvensi kepemilikan \`v-model\`/\`defaultValue\` dan \`v-model:open\`/\`defaultOpen\`.

Baca panduan [Migrasi ke 1.0](https://selarasui.my.id/overview/migrating-to-1/) sebelum melakukan upgrade. Daftar perubahan otomatis di bawah ini tetap menjadi catatan historis yang terperinci.`,
    )
  }

  if (tag === 'selaras-docs-v1.0.0') {
    localized = localized
      .replace(
        'First tagged release of the documentation layer, published against `@sewadah/selaras` ^0.3.0.',
        'Rilis bertag pertama untuk layer dokumentasi, kompatibel dengan `@sewadah/selaras` versi ^0.3.0.',
      )
      .replace(
        'The itemized history leading up to this release lives in the [core changelog](https://github.com/sewadahapp/selaras/blob/main/CHANGELOG.md) - every `docs:` and `docs-layer:` change shipped through the core release stream until the layer gained its own version.',
        'Riwayat terperinci sebelum rilis ini tersedia di [changelog inti](https://github.com/sewadahapp/selaras/blob/main/CHANGELOG.md). Setiap perubahan `docs:` dan `docs-layer:` dirilis melalui rangkaian rilis inti hingga layer ini memiliki versinya sendiri.',
      )
  }

  if (tag.startsWith('selaras-docs-v')) {
    localized = localized.replace(
      /Published against (`[^`]+`) (\^\S+)\./g,
      'Kompatibel dengan $1 versi $2.',
    )
  }

  return localized
}
