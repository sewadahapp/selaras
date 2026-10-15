# Editable

Mode: Operate for the component, Read for its documentation.

Extend the existing Selaras form controls. Preserve tokens, typography, radii,
button variants, and all three documentation presets. Default presentation is
saved text beside a small edit action; editing replaces that text with a native
field and Save/Cancel controls. No separate panel, new identity, or illustration.

The primary example is a project name. The external-controls example must show
activationMode none, controls false, v-model:editing, submitMode none, and working
Rename/Save/Cancel actions. Draft text only becomes the model on save.

Verify keyboard focus, cancellation, validation, multiline input, narrow screens,
and light/dark preset rendering. Existing docs navigation and example wrappers
are outside this addition's design scope.

Completed: `SEditable` presents saved text with an edit action, then a native
input or textarea with Save/Cancel controls. The draft stays separate from the
saved model until a valid save; cancellation restores the saved value. It reuses
existing form tokens, button variants, messages, icons and theme registration;
Degung applies its incumbent field treatment to the input slot. Documentation
includes project-name, multiline, validation/state and custom-control examples.
The external toolbar uses `v-model:editing`, `activationMode="none"`,
`:controls="false"` and `submitMode="none"`; Rename opens editing and Save/Cancel
use the exposed methods. This prevents toolbar focus changes from saving a draft.

Visual review complete — SHIP, with no material fixes. The independent reviewer
performed read-only source and image review, without running a browser itself.
It inspected six theme/viewport screenshots and 18 matching basic, editing and
external-control captures in `docs/.impeccable/review/editable/`: Pelog light at
1280 and 390px, Slendro light at 1280px/dark at 390px, and Degung light at
1280px/dark at 390px. `checks.json` records the expected theme classes, no
overflow and no issues for those six configurations.

Implementation validation passed: 116 test files containing 1,425 unit and
regression tests, six production browser tests, library/documentation type
checks, and repository lint excluding pre-existing ignored review-artifact
scripts. The full installed-tarball compatibility command exited successfully,
covering prefixed/unprefixed core and docs-layer consumers plus published
contracts, MCP and skill checks. Core CSS remains within unchanged budgets:
149,243 bytes / 19,989 gzip prefixed and 153,386 bytes / 21,375 gzip unprefixed.
The incumbent design system, identity and tokens are preserved; no global design
document, sidecar, CPU configuration or shipped raster asset is part of this
documentation handoff.
