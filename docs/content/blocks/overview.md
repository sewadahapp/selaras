---
title: Blocks
description: Complete interface examples. Preview, copy and adapt them to your app.
order: 10
toc: true
editLink: false
prevNext: false
---

| Block | Includes |
| --- | --- |
| [Sign in](/blocks/sign-in) | Sign-in and password-reset forms, password visibility and pending states. |
| [Dashboard overview](/blocks/dashboard-overview) | Responsive workspace sidebar, projects, activity and project details. |
| [Profile settings](/blocks/profile-settings) | Profile fields, email preferences, save and reset. |
| [Data management](/blocks/data-management) | Search, role filters, sorting, pagination and a member editor. |
| [Tiptap editor](/blocks/editors/tiptap) | Rich text, headings, lists, links, undo/redo and HTML binding. |
| [Lexical editor](/blocks/editors/lexical) | The same toolbar controls connected to a node-based editor. |
| [Quill editor](/blocks/editors/quill) | A compact editor with formatting, history and HTML binding. |

Each block has an interactive preview, device controls and copyable source.
Previews follow the selected documentation theme. All data is illustrative;
changes stay in memory and requests are simulated.

## Setup

Follow [Installation](/overview/getting-started/installation) in a Nuxt app,
then copy a block into `app/pages/`. **Code** includes the module, stylesheet
and `SApp` setup; **Copy Vue** copies the page. Examples use the default `S`
component prefix and Nuxt auto-imports.

For local icons, install `@iconify-json/hugeicons` as a development dependency;
see [Icons](/overview/getting-started/icons). No additional form or chart package
is needed for the interface blocks. Editor blocks show their additional engine
dependencies above the preview. Blocks use your app's theme; documentation showcase presets are not
installed by copying their source.

Replace simulated requests with your services and enforce validation and
permissions on the server. The source comments mark integration points.
Block source is also available through [llms.txt](/llms.txt),
[llms-full.txt](/llms-full.txt), raw Markdown and the MCP catalog.

## Editor blocks

Choose one editor engine and install the command shown on its page. These
dependencies belong to your app; installing Selaras does not install an editor.
Each block is a complete Vue file that uses the shared
[Toolbar](/components/elements/toolbar) and exposes an HTML `v-model`, plus
`readonly`, `disabled`, and `placeholder` props. The local Read only switch,
Reset content action and HTML disclosure help you exercise the example; remove
them when adapting it to your interface.

The engines have different document schemas and native JSON formats. HTML is
convenient for these basic examples, but does not preserve every custom node or
extension. For advanced documents, use the chosen engine's native persistence
format. Validate and sanitize stored rich text before rendering it elsewhere.
These blocks initialize browser editors after mount and dispose their listeners
when unmounted. They provide client-side editing, rather than server-rendered
document previews.
