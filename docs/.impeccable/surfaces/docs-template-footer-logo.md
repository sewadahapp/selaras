# Docs template footer attribution

Mode: Read. A small extension of the existing shared footer, without changing layout or copy.

The user requested only a small Selaras logo beside Powered by Selaras. Reuse the approved 16px optical-cut symbol from `docs/public/brand/selaras-symbol-small.svg`, with all bands colored together through the active primary token. Keep the symbol decorative because the adjacent link text supplies its accessible name. Bundle the geometry inline so no documentation-site asset or network request is needed. An explicitly configured link icon retains precedence. The own-site footer override remains unchanged.

Verify desktop and phone sizes in light/dark mode, link alignment, keyboard focus, link destination, no overflow and preservation of the own-site footer. No new identity or tokens.

Completed: the shared footer renders the approved optical-cut symbol inline beside the default Powered by Selaras link to `https://selarasui.my.id`, using the active primary token. Custom link icons retain precedence. This matches the incumbent small-size artwork and theme behavior; no additional visual guidance, identity, tokens or shipped raster assets are needed. The own-site footer is unchanged.

Evidence: the independent reviewer returned SHIP with no findings after reviewing four captures in `docs/.impeccable/review/docs-template-footer-logo/`, covering light/dark modes at 1440 and 390px. `results.json` confirms a 16px symbol, 6px gap, zero centerline offset, no overflow, no page errors and an unchanged own-site footer. Keyboard focus and the link destination passed. Footer component ESLint and documentation `vue-tsc` passed; hook scans were clear. The raster files are review captures only.
