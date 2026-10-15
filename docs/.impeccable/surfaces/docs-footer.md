# Documentation footer

Mode: Read. Scope: the `/docs` footer override; the reusable docs layer remains unchanged.

Keep the Seirama mark, library name, existing description, Design kit destination, and right-aligned copyright. Bring the Design kit link and legal text into one compact metadata group instead of leaving a button on an otherwise empty row. Use the documentation's resolved tokens, typography, and existing footer surface.

Desktop composition: brand on the left, a quiet right-aligned text link above smaller copyright on the right, vertically balanced in one band. Below 48rem, stack the brand and metadata with deliberate spacing; allow legal copy to wrap. Links retain visible keyboard focus and a simple underline on hover. Preserve all three themes and both color modes.

Verify footer geometry, wrapping, focus, hover, and Design kit navigation in a browser at desktop and phone sizes. Capture all themes and both modes. Do not alter shared components, add destinations, or restore attribution content previously removed by the user.

Completed after alignment correction: the local footer uses 24px vertical padding, a plain-text Design kit link with an arrow above 12px copyright, and balanced legal wrapping. Unequal brand and metadata row heights caused the remaining visual imbalance. The title and Design kit rows now share a 20px height, the description and copyright share an 18px line height, and both groups use a 4px gap, producing matching 42px desktop stacks. Below 48rem the brand and metadata stack; the metadata stays right-aligned. The shared documentation layer is unchanged; the extension adds no identity or tokens.

Current evidence: a fresh independent reviewer inspected all 16 corrected footer crops and the earlier capture, returning SHIP with no material defect. The current captures and `results.json` are in `docs/.impeccable/review/docs-footer-alignment/`: Pelog light/dark at 1440, 768, 390 and 320px; Slendro and Degung light/dark at 1440 and 390px. Browser measurements confirmed equal row tops and heights across all eight desktop variants, no overflow at any captured size and no page errors. Keyboard focus, hover underline and Design kit navigation passed. ESLint for both footer Vue components, documentation `vue-tsc` and the diff check passed. No raster assets shipped; the PNGs are review captures only.

Historical evidence in `docs/.impeccable/review/docs-footer/` records the initial review and clear hook scans. Its balance assessment is superseded by the alignment correction and current review above.
