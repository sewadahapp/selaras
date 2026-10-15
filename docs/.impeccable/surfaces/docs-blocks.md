# Documentation blocks

Mode: Read for documentation; Operate inside the live samples. Extend the existing documentation world.

THESIS: A developer can preview a complete interface, exercise it at device widths and copy a working Vue starting point.

OWN-WORLD: Inherit Selaras components, resolved tokens, typography, icons and the Pelog/Slendro/Degung presets. No separate block identity or external artwork.

STORY: Blocks sits between Composites and Utilities. The overview explains the distinction, links four samples and states installation requirements. Each sample leads with an interactive preview, exposes source and setup files, with only a short page description. Setup guidance stays on the overview page. The user explicitly requested preview/source-led pages with no right-hand table of contents; the main column takes that space.

FIRST VIEWPORT: The existing documentation header, sidebar and page heading lead into a viewport toolbar and a real iframe. Preview/Code controls and copy/open actions sit together. Each sample starts with useful content: a sign-in form, a workspace overview, a profile form or a searchable member table.

FORM: Code-led extension of the documentation example system. The user approved four initial blocks, responsive controls, complete source and theme inheritance in the preceding proposal. No new visual-world selection applies. The dashboard uses actual sample project progress; the forms and member table use in-memory state. All demo data and simulated operations are identified.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Required behavior

Keep the approved Seirama assets, theme preferences and local test worker settings. Do not change the core library or shared docs package to implement this docs feature. Reuse DocsViewportPreview, SCodeTree, SButton, field controls, table and dashboard composites. App-specific source files must not depend on docs-only helpers. No dead navigation or actions in samples. Source and preview must come from the same Vue files. Expose the block source through raw Markdown, llms-full and the offline MCP catalog.

Verify four blocks on desktop/mobile, source view, viewport selection, iframe themes and light/dark presets. Test sign-in/reset feedback, profile save/reset, table filters/pagination/edit/add/empty state and dashboard navigation/details/mobile sidebar. Validate docs generation, SEO and agent artifacts. No raster artwork is needed.

## Completion and verification

Disposition: **SHIP**. The independent finish review inspected all 30 captures in `../review/blocks/` and found no material fixes. `results.json` records the four interaction groups and no browser errors. Desktop and mobile evidence covers all four blocks in Pelog light/dark, with additional sign-in captures in Slendro and Degung light/dark. Documentation captures cover the overview, preview and source at 1440px and 390px. Browser checks passed for copying source, viewport selection, the expanded article without a right-hand table of contents, and the sample interactions listed above.

Implementation and representative documentation captures were compared with the incumbent system: the header and left navigation remain in use; preview and source reuse `DocsViewportPreview` and `SCodeTree`; controls, fields, tables and dashboard use Selaras components and resolved theme tokens. No new identity, token system or raster artwork was introduced. Review PNGs are verification captures, not shipping artwork.

Validation passed: 1,399 tests across 114 files, final lint and library/docs type checks, and packaged agent/MCP contracts. Production generation completed with 517 prerendered routes. Raw Markdown, llms-full and the offline agent catalog expose the block source. `docs/DESIGN.md` records the navigation and Blocks extension; its existing identity and token documentation were preserved.

## Overview navigation adjustment

The user subsequently requested the table of contents on `/blocks/overview`
only. Its frontmatter enables `toc`; individual block pages retain `toc: false`
and the wide preview/source layout. This reuses the existing page-grid and
navigation behavior without changing the block controls or examples.

## Dashboard menu width adjustment

The user supplied a dashboard screenshot showing a label-sized active highlight
and requested full available sidebar width. The block applies `w-full text-start`
to NavigationMenu's `link` slot while expanded. It omits this override while
collapsed so the icon rail retains its square items. This is a block-local UI
override; shared NavigationMenu defaults are unchanged.

Disposition: **SHIP** after a fresh independent finish review of eight captures
in `../review/blocks-sidebar-width/`, with no material fixes. Its `results.json`
shows all three expanded menu buttons matching their row widths at desktop
1024px, 1680px and 3360px and mobile 390px; light and dark checks cover desktop
1024px and mobile 390px. Collapsed items remain 40px square in both modes.
Navigation and closing the mobile drawer after selection passed, with no page
errors. Existing drawer-title warnings remain outside that error result.

The changed source passed ESLint and the agent catalog was refreshed. The earlier
1,399-test baseline remains the full-suite result; the full suite was not rerun
for this local width override. No design-token or identity documentation changed.
