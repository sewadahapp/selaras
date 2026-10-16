# Editor blocks and shared toolbar

Mode: Operate within the samples; Read on their documentation pages.

Extend the established Selaras system. The user requested shared toolbar
components and copyable editor blocks for Tiptap, Lexical and Quill, without
separate integration packages or editor dependencies in the core library.

The live samples present a project note with actual formatting commands,
selection-derived active states, history, a link dialog, an explicit read-only
switch, reset and escaped HTML output. The toolbar uses 32px controls by default,
one roving focus sequence and separators. Mobile wraps the toolbar and header;
the document retains readable padding and line spacing. All colors and geometry
inherit the existing light/dark Pelog, Slendro and Degung tokens.

Each preview and copied implementation use one self-contained Vue source file.
The documented HTML model is a limited interchange format for these basic
features, not a promise that native editor schemas are interchangeable. Engine
initialization occurs in the browser and cleanup runs when unmounted.

Verification: unit tests cover toolbar state, theming, disabled inheritance,
types and composition. Browser tests cover horizontal/vertical/RTL navigation
with both CSS prefix modes; typing, formatting, keyboard shortcuts, links,
undo/redo, external content, read-only behavior and engine remounts. The visual
inspection covers desktop/mobile for all engines and all six theme/mode
combinations for the shared layout. Its identified fix removes Quill's implicit
focus during a state read. Final confirmation checks the generated docs preview,
copyable code, dependency commands and editor focus behavior.

No new visual identity, design assets or raster artwork are shipped.

## Completion

Disposition: SHIP. Final verification passed 1,477 tests across 118 files,
nine browser cases, library/docs types, lint excluding existing local review
artifacts, the module build, agent/MCP packaging and 543 generated routes.
The SEO check verified 125 pages and static sharing images. Packed consumer
stylesheets remain within their existing limits: 149,503 bytes / 20,038 gzip
with a class prefix, and 153,616 bytes / 21,419 gzip without one. All three
clipboard copies match their preview source exactly. Desktop/mobile captures
show no horizontal overflow; link dialogs return focus to each editor, and no
browser errors occurred. The generated documentation's preview and code views
were compared with the existing block pattern and confirmed in the final pass.
