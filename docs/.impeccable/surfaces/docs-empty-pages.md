# Empty documentation pages

Mode: Read. Extend the existing documentation shell and recovery illustration style.

The user wants empty Markdown files to render safely, preferably as an empty view with a vector illustration. Use ContentRenderer's empty slot rather than classifying existing documents as missing pages or failed requests. Retain navigation, header, configured contribution links and Previous/Next. Use a calm No content yet heading, an existing themed document illustration and a link back to documentation. Missing files remain 404s; loading failures keep their recovery state.

Provide the fallback in the shared docs route and own-site override. The own-site fallback uses an h2 under its existing page title; the shared route uses an h1. Allow empty-state text and the component to be customized, reuse the configured recovery home destination, and keep public asset/base-URL handling independent of the own site.

Verify zero-byte, whitespace-only and frontmatter-only pages through production SSR and client navigation in installed consumers. Verify ordinary content replaces the fallback, navigation remains usable, and desktop/mobile light/dark rendering has no overflow. Reuse existing SVG geometry; no new visual identity, tokens or raster assets.

Completed: both routes use the renderer's empty slot and shared `DocsEmptyState`. Its centred 32rem region reuses the existing `DocsErrorIllustration` missing variant at up to 18rem, configurable No content yet copy and an outlined home action. The shared heading is an h1; the own-site heading is an h2 below its page header. `selarasDocs.empty.title` and `.description` customize the copy; `errors.homeTo` and `.homeLabel` configure the base-URL-aware home link. The shell, configured page actions and Previous/Next remain available. No identity, tokens or raster assets were added.

Review complete — SHIP: the independent reviewer found no visual fixes across four light/dark captures at 1440 and 390px in `docs/.impeccable/review/docs-empty-pages/`. Its production-verification condition is satisfied: installed prefixed default, prefixed override and minimal unprefixed consumers passed production builds, generated type checks and browser checks. Zero-byte, whitespace-only and frontmatter-only documents returned HTTP 200 with the fallback; client navigation into and out of empty pages passed; adding body content and rebuilding rendered ordinary content. Existing 404 and 500 recovery checks remained passing.

Preserved evidence beside the captures includes `local-check.mjs`, its successful `local-check.log`, `results.json`, `verification.json`, `packed-prefixed.log` and `packed-normal.log`. Local checks passed keyboard focus, the configured home destination and navigation, with no overflow or browser/component-resolution errors. Lint and library/documentation type checks passed. The PNGs are review captures only.
