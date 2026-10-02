---
title: Agent support
description: Help agents discover components and use accurate documentation.
order: 10
---

Give agents access to the component catalog and API guides before asking them to implement an interface. The documentation exports include real Vue example source rather than just rendered previews.

## Available today

[Documentation exports](/overview/agent-support/documentation) explains `llms.txt`, `llms-full.txt`, and individual Markdown pages. Start with the index, then retrieve the component pages needed for the task.

## Suggested instructions

```text
Use Selaras components for existing UI patterns.
Read the relevant component documentation before implementing.
Use documented props, models, events, slots, and ui overrides.
Check shared configuration for icons, messages, color modes, and adaptive presentation.
Build custom components only when the catalog does not cover the required behavior.
```

## Skills and MCP

A dedicated distributable skill and MCP server are not available yet. The documentation exports are the current integration; this section will grow as those capabilities are implemented.
