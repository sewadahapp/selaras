import { describe, expect, it } from 'vitest'
import { getBrandAssetCopy } from '../docs/utils/brand-asset-copy'

describe('design-kit brand asset labels', () => {
  it('localizes Indonesian asset actions and feedback while preserving the logo name', () => {
    expect(getBrandAssetCopy('id', 'Ungu', 'symbol')).toEqual({
      imageAlt: 'Simbol Ungu',
      downloadSvg: 'Unduh simbol Ungu sebagai SVG',
      downloadPng: 'Unduh simbol Ungu sebagai PNG',
      copy: 'Salin simbol Ungu sebagai SVG',
      copied: 'SVG simbol Ungu disalin',
      copyTitle: 'Salin SVG',
      copiedTitle: 'SVG disalin',
      announcement: 'SVG simbol Ungu disalin',
      errorTitle: 'Tidak dapat memuat SVG ini',
      errorDescription: 'Silakan gunakan tautan unduhan.',
    })
    expect(getBrandAssetCopy('id', 'Ungu dan tinta', 'horizontal').copy).toBe('Salin logo Ungu dan tinta horizontal sebagai SVG')
    expect(getBrandAssetCopy('id', 'Ungu dan tinta', 'horizontal').imageAlt).toBe('Logo Ungu dan tinta horizontal')
  })

  it('keeps English labels as the default locale', () => {
    expect(getBrandAssetCopy('en', 'Violet', 'symbol').downloadSvg).toBe('Download Violet symbol as SVG')
    expect(getBrandAssetCopy('en', 'Violet', 'symbol').copyTitle).toBe('Copy SVG')
    expect(getBrandAssetCopy('en', 'Violet', 'horizontal').imageAlt).toBe('Violet horizontal logo')
  })
})
