# Documentation error recovery

Mode: Read. Extend the existing documentation design system.

## Direction contract

THESIS: A failed document or demo should leave a clear route back to reading.
Use one illustration and a short recovery message, without a separate marketing
composition or a new visual identity.

OWN-WORLD: Inherit the documentation's typography, resolved theme colours,
button components and responsive radii. The generic template draws a document
and interrupted path; Selaras overrides it with a missing musical note.

STORY: The reader sees whether the page is missing or failed, then chooses a
specific recovery action. Small failures stay local and leave navigation usable.

FIRST VIEWPORT: A simple brand link sits at the top. The standalone error state
centres a 22rem vector, a 1.75–2.5rem heading, a short explanation and primary
recovery action. On mobile the composition stacks without horizontal overflow.

FORM: A code-led extension of the established Read surface; no new identity
selection. The user explicitly chose generic artwork for the layer and musical
artwork for Selaras.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Scope and verification

The user wants the docs template to supply reusable recovery behavior and a
restrained document-and-path illustration, while Selaras uses a musical
illustration. Both illustrations are original geometric SVGs that inherit theme
tokens. The existing Seirama logo and documentation shell remain unchanged.

Fatal errors and missing pages get a standalone recovery screen with a simple
brand link, clear heading, explanation and explicit recovery action. Avoid
Content queries, search and navigation data on this screen. Recoverable page
errors retain the surrounding layout; example errors replace only the example.
Never expose raw exceptions or stack traces in the public copy.

Retry remounts failed components; changing routes or example identity clears the
boundary. Content query failures offer a retry and retain HTTP 500 on SSR; an
absent document remains a 404. The docs app and layer use the same recovery
components, with the application overriding the illustration and preset wrapper.

Verify light/dark and Pelog/Slendro/Degung, mobile and desktop, HTTP status codes,
recovery controls, keyboard access and base-URL-aware links. Validate the
published layer with installed-tarball consumers as well as the docs site.

## Completion record

Finish disposition: **ship**. The finish review covered 24 desktop and mobile
captures, including light/dark, Pelog/Slendro/Degung on Selaras, and the generic
template's missing-page and fatal states. No material fixes remained. Local
review captures and passing capture manifests live under
`docs/.impeccable/review/error-recovery/`; that directory is ignored and is not
part of the shipped artwork.

The implementation matches the incumbent Read system: inherited interface
typography, resolved surface/text/primary/border tokens, existing `SButton`
controls, responsive radii and the 90rem shell width. `DocsErrorState` supplies
the shared copy and actions, `DocsErrorBoundary` isolates page and example
failures, and `DocsErrorPage` supplies the independent fatal/404 composition.
Selaras overrides the illustration and restores its theme provider in
`docs/error.vue`. Both illustrations are inline geometric SVG; no raster is
shipped by this work, so raster provenance is not applicable.

Public behavior and customization are documented in
`packages/docs/README.md` under **Error recovery**, with the matching `errors`
configuration in `packages/docs/types.d.ts`. The documentation pass checked
those files, the shared recovery components, both app/error wrappers, both
Content catchall pages, both example wrappers, the error-boundary tests and the
packed-layer verification script against this contract. It also inspected the
capture manifests and representative template light desktop and Selaras Degung
dark mobile captures.

The completed implementation verification reported 1,395 passing tests,
lint/type checks, installed-tarball docs consumers with and without a class
prefix, core packed-package/CSS checks, production generation, and SEO checks
for 115 pages and their images. Browser checks covered status preservation,
safe public copy, retry/remount, navigation reset, keyboard access and links
under a base URL. These are the implementation/reviewer results; the
documentation pass did not repeat the test suite.

This is an ordinary extension of the existing system, with no approved durable
visual-system change. `docs/DESIGN.md` remains the incumbent authority. Existing
documentation drift is recorded without repair: its frontmatter contains only
name/description rather than extracted design tokens, and no `design.json`
sidecar is present. Neither issue was introduced by the recovery surface.
