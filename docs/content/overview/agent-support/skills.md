---
title: Skills
description: Guide coding agents toward the right Selaras components and customization APIs.
order: 30
---

The `selaras` skill teaches an agent how to discover components, read their contracts, and customize them through props, slots, themes, icons, and messages. It works with public Markdown documentation and can also use the [local MCP server](/overview/agent-support/mcp).

## Install

Use the [Skills CLI](https://github.com/vercel-labs/skills) from your application directory:

```bash
npx skills add sewadahapp/selaras --skill selaras
```

Choose your agent and installation scope when prompted. The repository stores the skill at `skills/selaras/SKILL.md`; you can also copy that folder into your agent's supported skill directory.

The npm package includes the skill as well. To install the copy matching your dependency version:

```bash
npx skills add ./node_modules/@sewadah/selaras/skills/selaras
```

Repository installation becomes available when these changes are pushed; package installation requires a release containing the skill. The repository copy follows its current branch, while the package copy follows your installed version.

## Use it

Ask your agent to use the Selaras skill for a concrete interface:

```text
Use the Selaras skill to build a customer management page with a searchable
Table, an edit Modal, and a confirmation dialog. Read the relevant component
contracts and examples first, and use the project's existing theme.
```

Clients with automatic skill discovery may select it when working on a Selaras project. Explicit invocation syntax depends on your client.

## What it provides

The skill helps agents look beyond basic buttons and inputs, find components and composables for the requested interaction, and check the actual API before implementing. It also distinguishes global configuration from local props and slots.

A skill provides instructions rather than executable component recommendations. The agent still chooses components and validates its implementation. Without MCP, it reads the documentation exports directly; with MCP, it can retrieve the installed version's catalog and examples through tools.
