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

Use the [Selaras skill](/overview/agent-support/skills) to guide component selection, API discovery, and customization. Connect the [local MCP server](/overview/agent-support/mcp) for structured search and access to documentation bundled with your installed package version.

The skill can work with public documentation alone. MCP is optional and does not need hosting or authentication. These integrations become available from the repository when pushed and from npm in a release containing them.
