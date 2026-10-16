# Selaras homepage

Mode: Persuade. Redesign the documentation homepage while preserving the approved
Seirama identity, fonts, CSS token system, documentation navigation, and three
light/dark presets. Scope: own docs application, not the shared docs package.

Taste direction: Type and nothing else, seed 645531260. Retain brand palette and
typography. The opening uses Selaras's meaning, harmony, as its central statement.

FIRST VIEWPORT: “Interfaces,” on the left and “in harmony.” on the right at desktop
scale, both on the left on phones. A short Vue/Nuxt explanation anchors the lower
left, with Get started and Browse components on the right and a copyable
`npm install @sewadah/selaras` command beneath the two links. The user explicitly
requested the original HomeDotGrid from before the homepage redesign: retain its
initial reveal wave, pointer-driven colour and size activation, and existing
reduced-motion support. The canvas spans the full viewport width behind the
current centred hero content, with its original appearance.

The signature gesture aligns the two headline lines through short masked rises.
Other sections enter once; content is visible without script and under reduced
motion. No replacement logo, font, or unrelated photography.

The visitor's path is the typographic introduction, a real theme instrument,
working component ensemble, an interactive library gallery with navigation-derived
category links, installation
files, and a closing installation action. The instrument preserves the existing
hue customizer and adds musical presets, radius control, dark mode, and functional
form reset/save feedback. Its scoped theme also reaches the selection, navigation,
and overlay examples. The demo names and roles are sample interface content.

Content-driven blueprint corrections: use the working-controls showcase instead
of an editable headline, actual installation exchanges instead of fictional
stage durations, and a real installation link instead of an email signup.

Verification: desktop 1440px, tablet 768px, phone 390px, with additional Pelog dark,
Slendro light/dark and Degung light/dark captures. Evidence lives in
`docs/.impeccable/review/homepage/`; Taste measurements and contact sheets are in
`/tmp/selaras-home-final/` for this session. The Taste gate has no FAIL findings.
Narrow allowances retain approved violet, native NavigationMenu icon rows, and
ordinary sticky-header occlusion during arbitrary scrolling; section anchors have
clearance. Warnings about photos/video, native component size scales, and existing
shared-shell text are retained with explicit rationale: the product is the live
interface, not stock imagery, and the shared documentation shell is outside scope.

## Implemented record

Completed in `docs/pages/index.vue`, `docs/components/home/HomeThemeLab.vue`,
`docs/components/home/HomeComponentEnsemble.vue`,
`docs/components/home/HomeLibraryPreview.vue`, and
`docs/utils/home-theme-color.ts`. The shared shell, approved Seirama artwork,
Plus Jakarta Sans/JetBrains Mono families, resolved CSS variables and theme
presets remain the visual authority. This composition adds no global brand or
token change. The original `HomeDotGrid` supplies its reveal wave and
pointer-reactive colour and size activation. A full-width outer hero owns the
canvas; an inner container retains the current centred content at a maximum
width of 90rem.

`HomeThemeLab` scopes primary-colour and radius overrides around the form and
component ensemble. Choosing a preset resets those adjustments; radius initially
reflects the preset. Form reset restores the sample values, and save feedback
states that nothing was sent to a server. Selection, collapsible navigation and
the invitation modal are working examples; names and roles are synthetic and the
invitation confirmation explicitly sends nothing. The library gallery pairs
interactive native previews with category links derived from documentation
navigation, and the installation files and
closing actions lead to actual setup documentation. No stock or generated imagery
is used.

## Finish evidence and limitations

The implementation pass reported successful ESLint checks for the changed app
and repository (excluding ignored `.impeccable` scripts), `docs:types`, all 16
docs SEO/LLM unit tests, and `bun run docs:build` (exit 0, Build complete).
The production build emitted non-fatal 1500ms icon-prerender timeout warnings
for `vscode-icons` and the shared `bug-01` icon.
Seven browser contexts passed functional, horizontal-overflow and hydration
checks: Pelog light at 1440px and 390px, Pelog dark at 1440px, Slendro light at
768px, Slendro dark at 390px, Degung light at 1440px and Degung dark at 390px.
Production-preview smoke checks also passed for theme switching, radius reset,
dark mode, anchor clearance, pointer-reactive canvas and content without
JavaScript. No package or core changes were
made; packed-package checks were not rerun for this homepage-only work. This
documentation pass inspected source and saved reports; it did not rerun those
implementation checks.

The required Taste screenshot set is
`/tmp/selaras-home-final/{desktop-fold,desktop-page-01,desktop-page-02,tablet-fold,tablet-page-01,mobile-fold,mobile-page-01}.jpg`.
Supplementary theme/mode captures and `checks.json` are in
`docs/.impeccable/review/homepage/`. Temporary screenshot paths are session-local.
Font-metric measurements are not a pixel-exact account of wrapping; corrected
screenshots were visually reviewed.

The Taste gate recorded 0 FAIL and 4 WARN findings: native component font-size
scales, existing shared-shell small text, no photography and no video. These
allowances retain real product interface demonstrations and the existing shell.
The source gate recorded 0 FAIL and one false-positive warning for a numeric
literal in the RGB-to-hex conversion. Self-critique scored 7.9 overall (design 8,
usability 8, creativity 7.3, content 8). A fresh independent finish reviewer gave
the disposition **ship**, with no material findings within homepage scope.

The existing `docs/DESIGN.md` remains a descriptive system record with minimal
frontmatter. No `docs/.impeccable/design.json` sidecar was present during this
pass; that pre-existing documentation gap was preserved rather than expanded
into a global token extraction or sidecar regeneration.


## Full-width dot-grid restoration

At the user's request, `docs/components/HomeDotGrid.vue` is restored to the
original implementation from before the homepage redesign. Its source is
byte-identical to the repository's existing version: 22px spacing, 1.1px base
radius, 2.6px active radius, 170px pointer influence, an initial reveal wave,
theme-colour activation and existing reduced-motion handling.

In `docs/pages/index.vue`, the outer full-width hero owns the canvas while the
inner content container retains the current heading, copy and actions at a
maximum width of 90rem. The homepage-specific canvas opacity override is removed,
preserving the original grid appearance. The docs package manifest and lockfile
match their repository versions; no additional dependency or licence notice is
part of this restoration.

The restoration implementation pass reported passing frozen install, ESLint for
`HomeDotGrid.vue` and `index.vue`, and `docs:types`. Browser checks on the user's
existing application on port 3000 passed at 1600px light, 768px light and 390px
dark, with no overflow, browser errors or hydration warnings. The saved report
at `docs/.impeccable/review/grid-restored/checks.json` confirms the canvas starts
at x=0 and matches each viewport width; at 1600px, the inner content remains
1440px wide and centred at x=80. Original pointer activation and reduced motion
passed in all three contexts. Three visually reviewed screenshots accompany the
report. This documentation pass inspected the source and report; it did not
rerun those checks.

No new preview was created. The port 4185 preview was stopped and verified closed.
No full production build was run for the restoration. Earlier homepage
verification above is retained as evidence of the preceding homepage
implementation. A fresh independent finish reviewer gave disposition **ship**
with no material issues after a read-only review of the source,
three captures and geometry checks. That approval is limited to the restoration;
the reviewer did not review a current production build.

## Hero actions restoration

At the user's request, the hero provides Get started, Browse components and the
copyable `npm install @sewadah/selaras` command. In `docs/pages/index.vue`, the
primary Get started action leads to the installation guide and the neutral
outlined Browse components action leads to the button component documentation.
The two links sit side by side on desktop and stack on mobile; the command sits
below them and stays on one line at 320px. The current headline and original
full-width dot grid are retained.

The command uses `SButton`, the existing docs clipboard helper and global
copy/check icons. Updated accessible labels and a live status announce copying;
the helper supplies the HTTP clipboard fallback.

The implementation pass reported passing targeted ESLint and `docs:types`
before the final CSS-only padding adjustment, plus a passing diff check.
Browser checks on the user's existing port 3000 application passed at 1440px
light, 768px light, 390px dark and 320px light. They verified action destinations
and actual clipboard reads through both the secure API and forced HTTP fallback,
full-width canvas geometry, no horizontal overflow, and zero runtime errors or
hydration issues. Evidence is in `docs/.impeccable/review/hero-actions/`, including
`checks.json` and screenshots. This documentation pass inspected the source and
saved report; it did not rerun those checks.

No current production rebuild was run, and port 4185 remains stopped. A fresh
independent reviewer gave disposition **ship**, with no material findings after
reviewing the source and all four captures; the command and icon fit at 320px.
The review used saved evidence and was limited to the hero actions, without
independent runtime checks, a build or a broader homepage audit.

## Interactive library gallery

The library section uses `HomeLibraryPreview.vue` to demonstrate Components,
Composites, Blocks and Utilities with native, interactive Selaras interfaces.
The desktop gallery alternates 7/5 and 5/7 column proportions; below 64rem it uses
equal columns and below 48rem it stacks. Category headings are 32px on desktop
with decorative inline grid, layers, layout and code icons, arrow links,
descriptions and the existing navigation-derived sublinks.
Preview stages are 336px tall on desktop and tablet and 352px on phones to keep
the controls visible at narrow widths. A note identifies the sample content.

The Components tray contains badges, avatars, an editable input, a compact-spacing
switch and a button click count. Composites uses `SDashboardGroup`,
`SDashboardSidebar`, `SDashboardPanel` and `SDashboardNavbar` with working sidebar
collapse and navigation, plus labelled sample progress. Blocks provides a compact
profile form with an editable name, corresponding initials and local save
feedback. Utilities pairs a
syntax-coloured `useToast` snippet with Run example, which creates a real success
toast. Surfaces, radii and syntax colours follow resolved theme tokens and preset
variants. The gallery adds no imagery assets or dependencies.

The implementation pass reported passing targeted ESLint and `docs:types` before
the final CSS-only height adjustment. Browser checks on the existing port 3000
application passed in five contexts: 1440px Pelog light, 768px Pelog light, 390px
Pelog dark, 320px Slendro light and 1440px Degung dark. Checks covered button
clicks, the spacing switch, sidebar controls, profile editing and saving, a real
toast, preview and page overflow, and category routes. No runtime errors or
hydration issues were reported. `docs/.impeccable/review/library-previews/`
contains the captures and `checks.json`; the report records matching preview
client and scroll dimensions in every context. This documentation pass inspected
source and the saved report; it did not rerun those checks.

The hero, original full-width grid, hero actions and other sections retain their
current composition. No current production build or packed-package checks were
rerun, and port 4185 stays stopped. A fresh independent reviewer gave disposition
**ship**, with no material fixes after a read-only source review and inspection
of all five captures. The approval covers this library section's composition,
native previews, sample/local-save wording and category navigation. Interaction
results rely on the implementation pass's browser assertions; the reviewer did
not independently measure contrast, test keyboard behaviour or run a build.


## Landing-page heading icons

`docs/pages/index.vue` uses four 26px decorative Hugeicons inline with library
headings (grid, layers, layout and code) and four 20px icons with setup headings
(package, plug, brush and browser). Existing `SIcon` and the local Hugeicons
collection provide them without a new dependency or layout change. All eight
use the resolved primary-text colour and `aria-hidden="true"`, preserving the
category link and setup heading names.

The implementation pass reported passing targeted ESLint, `docs:types` and diff
checks. Browser checks on the existing port 3000 application passed at 1440px
light, 390px dark and 320px light: all eight masks rendered with positive
dimensions, accessible names were preserved, and no document overflow, runtime
errors, hydration issues or icon warnings were reported. Six captures and
`checks.json` are in `docs/.impeccable/review/home-icons/`. This documentation
pass inspected source and the saved report; it did not rerun those checks.
No full build or packed-package checks were rerun for the static icons, and port
4185 was not restarted. A fresh independent reviewer gave disposition **ship**
with no material findings after a read-only source review and inspection of all
six captures. Approval covers heading alignment, rendered icons and decorative
semantics within this icon scope; runtime checks rely on the saved evidence.
