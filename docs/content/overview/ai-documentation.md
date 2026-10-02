---
navigation: false
title: AI documentation
description: Readable documentation and Vue examples for coding assistants.
order: 90
---

This guide has moved to [the updated documentation](/overview/agent-support/documentation). Existing examples and anchors remain available below.

## Documentation exports

Selaras publishes documentation as plain text and Markdown for coding assistants:

- [llms.txt](/llms.txt) is a compact index with links to individual documentation pages.
- [llms-full.txt](/llms-full.txt) contains the complete documentation in one file.
- Individual pages are available under `/raw/`, for example
  [Button Markdown](/raw/components/elements/button.md).

The full export and individual pages include the Vue source of live examples,
alongside component props, slots, and usage guidance. These files are regenerated
with the documentation site, so they follow the published documentation version.

## Using an assistant

Give your assistant the documentation index URL and ask it to read the relevant
component pages before writing code. Prefer existing Selaras components and
customize them through props, slots, `ui` overrides, and theme configuration.

For example:

```text
Use Selaras for this settings page. Read its llms.txt index and the relevant
form, layout, and overlay documentation first. Reuse existing components and
check their documented props and slots before implementing custom UI.
```
