---
version: 1
slug: "docs-pages-design-kit-vue"
primary_target: "docs/pages/design-kit.vue"
related_targets: []
---

# Design kit

Scope: `/design-kit` in the repository documentation; an extension of the existing documentation world. Mode: Read, with direct download and copy actions. Audience: people using the Selaras identity. The user selected Seirama and requested a design-kit page with a supplied public reference.

## Direction contract

THESIS: A working brand reference, led by real artwork. Downloads and copy controls sit beside the asset they act on.

OWN-WORLD: Keep Plus Jakarta Sans, the existing CSS token palette and Selaras controls. Asset previews use intentional fixed light/dark surfaces, so colour variants remain accurate when the documentation theme changes.

STORY: Understand the three-band mark, choose a symbol or lockup, copy or download the right file, then consult colours, typography and usage rules.

FIRST VIEWPORT: A spacious left-aligned Design kit heading and short explanation, one prominent asset-kit download, and a large Seirama mark on the right. A quiet anchor row leads to the first symbol gallery.

FORM: Reference-specified brand gallery inside the existing home shell. No concept lottery; this is an explicitly structured extension. Signature interaction: the logo layout selector changes real previews and downloads together.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Constraints: preserve the four existing primary navigation entries; add a footer entry. Use actual approved artwork and existing font packages. Individual SVG and PNG downloads must work under a deployment prefix. Copy controls must give success/failure feedback, including on the user's HTTP development host.

## Completion

Finish review: ship; no remaining material findings. Documented in `docs/DESIGN.md`. Raster provenance is recorded in `docs/public/brand/ASSETS.md`.

Validation: targeted ESLint and docs typecheck passed. Browser checks cover downloads, layout selection, secure clipboard and HTTP fallback, failure feedback, keyboard anchors, 320/390/768/1440px layouts, light/dark modes and all presets. Final gallery captures confirm complete horizontal/stacked artwork. Production static generation passed with `NUXT_APP_BASE_URL=/selaras/` (355 routes); generated-site checks passed for hydration, downloads, copy controls and footer navigation.
