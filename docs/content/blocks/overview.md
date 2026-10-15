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
is needed. Blocks use your app's theme; documentation showcase presets are not
installed by copying their source.

Replace simulated requests with your services and enforce validation and
permissions on the server. The source comments mark integration points.
Block source is also available through [llms.txt](/llms.txt),
[llms-full.txt](/llms-full.txt), raw Markdown and the MCP catalog.
