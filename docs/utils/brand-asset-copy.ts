export type BrandAssetLayout = 'symbol' | 'horizontal' | 'stacked'

export function getBrandAssetCopy(locale: string, label: string, layout: BrandAssetLayout = 'symbol') {
  if (locale !== 'id') {
    return {
      downloadSvg: `Download ${label} ${layout} as SVG`,
      downloadPng: `Download ${label} ${layout} as PNG`,
      copy: `Copy ${label} ${layout} SVG`,
      copied: `Copied ${label} SVG`,
      copyTitle: 'Copy SVG',
      copiedTitle: 'Copied SVG',
      announcement: `${label} SVG copied`,
      errorTitle: 'Could not load this SVG',
      errorDescription: 'Try the download link instead.',
    }
  }

  const asset = layout === 'symbol'
    ? `simbol ${label}`
    : `logo ${label} ${layout === 'horizontal' ? 'horizontal' : 'bertumpuk'}`

  return {
    downloadSvg: `Unduh ${asset} sebagai SVG`,
    downloadPng: `Unduh ${asset} sebagai PNG`,
    copy: `Salin ${asset} sebagai SVG`,
    copied: `SVG ${asset} disalin`,
    copyTitle: 'Salin SVG',
    copiedTitle: 'SVG disalin',
    announcement: `SVG ${asset} disalin`,
    errorTitle: 'Tidak dapat memuat SVG ini',
    errorDescription: 'Silakan gunakan tautan unduhan.',
  }
}
