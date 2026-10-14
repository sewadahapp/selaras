# Selaras — Seirama

Three distinct bands follow a shared rising curve. The repeated gesture connects the meaning of Selaras — harmony, alignment and tuning — with a family of coherent interface components.

## Files

- `logo.svg` / `selaras-symbol.svg`: transparent primary symbol.
- `logo-dark.svg`: light violet symbol for dark surfaces.
- `selaras-symbol-black.svg` and `selaras-symbol-white.svg`: one-colour artwork.
- `selaras-horizontal-*` / `selaras-stacked-*`: fixed lockups in colour, dark, black and white. All lettering is outlined.
- `selaras-wordmark.svg`: the name without the symbol.
- `favicon.svg`, `favicon.ico` and the 16/32/48 px PNGs: browser tab artwork.
- `selaras-app-icon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`: square app/touch artwork.
- `maskable-512.png`: an opaque icon with extra safe space for platform crops.
- `site.webmanifest` and `head-snippet.html`: optional integration examples; adapt the paths before use.
- PNG exports at 512/1024 px: transparent symbol artwork. The horizontal and stacked colour lockups also include vector PDF exports.
- `presentation.html`: a self-contained presentation with software contexts.
- `palette.json`: digital colour values.

## Geometry and spacing

The master canvas is 256 × 256 units. Artwork spans x=28–228 and y=34–216. Each band has a 30-unit horizontal thickness, with 24 units between adjacent horizontal terminals. The whole is slightly above geometric centre for optical balance.

Keep all three bands together. Leave at least one band thickness of clear space around the visible mark. Do not stretch, rotate, change the curve, alter the gaps, add outlines, or recolour individual bands. The supplied transparent files have some internal padding; allow more surrounding room when required by this clear-space rule.

Prefer a symbol size of at least 24 px. At 16 px use the supplied favicon or `selaras-symbol-small.svg`. This optical cut uses 26-unit bands to keep its gaps open during rasterization; the regular master retains the approved 30-unit bands. Prefer the horizontal lockup at 120 px wide or larger; use the symbol alone where the name becomes difficult to read.

## Colour

| Role | Digital value |
| --- | --- |
| Primary violet | `oklch(47.55% 0.2026 279.99)` / sRGB `#4e40c9` / RGB 78, 64, 201 |
| Light violet on dark surfaces | `#a99aff` |
| Wordmark ink | `#191919` |
| One-colour dark | `#111111` |
| Reversed | `#ffffff` |

Use the primary version on white or light neutral surfaces, the light violet version on dark surfaces, and white on a solid coloured background. In the documentation, all three bands take the active theme's primary colour together through the existing logo mask. The browser favicon remains white on violet for a consistent tab identity.

These are digital RGB masters. PDF exports preserve vector shapes; colour for physical printing should be proofed for the intended output process.

## Typography and licence

The lockups retain Plus Jakarta Sans at weight 600, matching the documentation. Letter spacing is tightened by 0.01 em, and the symbol and wordmark retain fixed relative positions. All letters are SVG paths, so recipients do not need an installed font.

Plus Jakarta Sans is licensed under SIL Open Font License 1.1; see `FONT-LICENSE.txt`. The artwork follows the repository's MIT licence.

## Validation

The approved silhouette is retained in the production documentation assets. The symbol has three filled paths and transparent gaps; it needs no fonts, masks, filters or raster dependencies. The favicon has an explicit violet tile. SVGs were audited and rendered; the documentation logo was inspected in light/dark modes and all three theme presets. Small-size, reversed and mobile previews were checked in a browser.
