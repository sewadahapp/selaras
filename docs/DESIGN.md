---
name: Selaras documentation
description: The implemented documentation shell and Seirama design-kit surface.
---

# Design System: Selaras documentation

## Overview

The documentation uses the local Selaras components and shared documentation layer. Its header contains Overview, Components, Composites, Blocks and Utilities, with search, colour-mode and theme controls. The footer exposes the Design kit. The home layout supplies the header, footer and skip link around the page content.

The `/design-kit` page extends this system with approved Seirama artwork: three bands following a shared curve. Its sequence is the asset-kit download, symbols and logos, colour palette, typography, then usage guidance. This document records the built surface; its direction contract is `.impeccable/surfaces/docs-pages-design-kit-vue.md`.

## Colors

Documentation surfaces, text, borders, focus colours and control states use the resolved `--selaras-resolved-*` tokens. Pelog, Slendro and Degung presets support light and dark modes. Slendro replaces foundation colour stops; Degung also supplies glossy control finishes and themed surfaces. The shell logo takes the active theme colour.

Brand artwork and copyable swatches retain fixed identity colours: violet (`#4E40C9`), light violet (`#A99AFF`), ink (`#191919`) and white (`#FFFFFF`). Gallery previews use white or near-black (`#111214`) backgrounds independently of the documentation theme. The decorative hero and clear-space diagram switch between violet and light violet with colour mode. Download and typeface actions use neutral component colours.

## Typography

The self-hosted Fontsource variable packages provide Plus Jakarta Sans Variable for interface text and JetBrains Mono Variable for code and technical values. Their CSS family variables are `--font-sans` and `--font-mono`. The supplied logo lettering is outlined Plus Jakarta Sans at weight 600, so downloaded SVGs require no font installation.

The design-kit title scales from 2.75rem to 4rem at weight 650, with a 1.1 line height and −0.035em tracking. Section headings are 1.75rem at weight 600. Introductory copy is 1.125rem with a 1.7 line height; captions are 0.8125rem. Typography specimens show both alphabets and numerals; hexadecimal values use the mono family.

## Layout

The shared documentation shell is centred at a maximum width of 90rem. The design-kit content is centred at 76rem with 1.5rem horizontal padding. Its desktop hero pairs introductory copy with a 16rem mark. A wrapping section-anchor row precedes the galleries.

Desktop symbols occupy three columns; logos and typography use two; palette swatches use four. Below 64rem, symbols become one column, the palette becomes two columns and the hero mark becomes 12rem. Below 40rem, logos, typography and usage become single-column; the decorative hero mark is hidden, page padding becomes 1.25rem and section spacing reduces. Header action spacing also tightens on small screens; below 24rem the header brand text is hidden. Footer links remain discoverable beside the brand, with copyright below on smaller screens.

Individual block pages preserve the documentation sidebar and expand the main article into the space normally used by the right-hand table of contents. The Blocks overview retains its table of contents. A short description leads directly into the interactive preview or source. Preview controls offer desktop (1024px), tablet (768px) and mobile (390px) widths; narrow pages wrap the controls and stack the source file tree above the code.

## Elevation & Depth

The design-kit galleries and specimens use token-coloured borders and surface changes for separation. Gallery previews keep their fixed artwork backgrounds while captions inherit the documentation surface. Degung contributes the existing preset's glossy gradients and inset or offset shadows to shared controls; the page does not add a separate shadow system.

## Shapes

Asset galleries and typography specimens use the resolved large radius; the layout selector uses the medium radius. Palette buttons retain the resolved large radius across presets. Artwork uses `object-fit: contain` to preserve its proportions inside the preview area.

## Components

The page reuses `SButton`, `SButtonGroup`, `SIcon`, shared icons and toast feedback. `BrandAsset` pairs each labelled preview with SVG and PNG downloads and a copy-SVG action. PNGs provide the gallery previews; SVGs remain the vector download and clipboard source. The Horizontal/Stacked selector changes the preview, SVG and PNG paths together, and exposes its selection through `aria-pressed`.

`BlockPreview` extends the existing example system with `DocsViewportPreview`, `SCodeTree`, Preview/Code selection, Copy Vue and Open preview actions. Sign-in, dashboard overview, profile settings and data management use native Selaras components and resolved tokens, inheriting Pelog, Slendro and Degung in light and dark modes. Each preview and its copyable page source come from the same Vue file; the code tree also exposes the Nuxt, stylesheet and `SApp` setup. The extension's direction and verification record is `.impeccable/surfaces/docs-blocks.md`.

Section landmarks have labelled headings; anchor links have visible keyboard focus and a scroll offset. Preview images have descriptive alternative text. Copy actions expose success through a check icon, updated accessible labels and status announcements. SVG copying disables its control while loading. The clipboard helper tries the secure Clipboard API, then a temporary text-field fallback that restores focus; failures show a toast with a manual-copy or download recovery. Successful copy feedback clears after 1.8 seconds. Public asset paths pass through `useDocsAssetUrl` for deployments under a base URL.

The approved SVG masters and usage guidance live in `public/brand/`. Transparent PNGs are rasterized through librsvg and FFmpeg: symbols are 1024px square, and lockups are 1200px wide with preserved aspect ratios. The archive includes the artwork, additional icon sizes, vector PDFs, usage guidance and the lettering licence. `public/brand/ASSETS.md` records raster provenance; no generated imagery or stock assets are used.
