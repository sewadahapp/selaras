---
title: MCP
description: Retrieve versioned component documentation and examples through a local MCP server.
order: 40
---

Selaras provides a local, read-only MCP server in the separate `@sewadah/selaras-mcp` package. Your agent client launches it as a subprocess and communicates over standard input and output (`stdio`). No hosted server, account, API key, or authentication service is needed.

The documentation catalog ships inside `@sewadah/selaras` itself, generated from the same documentation and Vue examples as the website. The server reads the catalog from your project's own Selaras installation, so its answers always match the version you use, and it works without fetching documentation from the network. It requires `@sewadah/selaras` 0.11.0 or later.

Keeping the server in its own package means applications that only use the components never install it or its dependencies.

## Configure your client

Add this entry to your client's MCP configuration:

```json
{
  "mcpServers": {
    "selaras": {
      "command": "npx",
      "args": ["-y", "@sewadah/selaras-mcp"]
    }
  }
}
```

The server looks for Selaras in the directory it starts in, which is your project for clients that launch local servers there. If your client starts servers elsewhere, add `"--project", "/absolute/path/to/your-project"` to `args`.

The example uses a common JSON configuration shape; your client may use a different file or format. Use the Node.js version supported by Selaras and restart or reconnect the client after changing its configuration.

To pin the server version with your project instead of fetching the latest, install it as a development dependency (`bun add -d @sewadah/selaras-mcp`) and use `npx --no-install selaras-mcp` as the command.

For development in this repository, run `bun run agent:build` first, then point your client at the repository's `packages/mcp/mcp.mjs`, passing `--project` with the repository path.

## Tools

| Tool | Arguments | Result |
| --- | --- | --- |
| `list_components` | Optional `category`, such as `forms` or `overlays` | Component names, descriptions, guide paths, and example names. |
| `search_documentation` | `query`; optional `limit` from 1 to 20 | Ranked guide matches across components, composables, setup, and theming. |
| `get_documentation` | `path` or component name; optional `section` heading | Markdown API guidance with complete Vue example source. |
| `get_example` | Example `name` from the catalog | The exact Vue source of that example. |

Companion components such as `SColumn`, `SToolbarButton`, and `SProsePre` are
listed individually and resolve to their shared Table, Toolbar, or Prose guide.
Guide summaries include `components`, the names covered by that guide. This
requires a catalog generated with companion metadata; older installed catalogs
still expose their original primary component names.

The server also exposes `selaras://catalog` and documentation resources under `selaras://docs/...` for clients that support MCP resources.

## Example workflow

```text
Use Selaras for this settings page. Discover components with list_components,
then read the Select, FormField, and Modal documentation and relevant examples.
Use the project's existing theme and enable adaptive presentation where useful.
```

The tools retrieve information; the agent makes component recommendations based on your requirements. They do not modify your project or generate files.

## MCP versus a skill

The [skill](/overview/agent-support/skills) provides guidance about how to build with Selaras. MCP provides structured access to the installed version's documentation. Either can be used independently; combining them gives the agent both guidance and retrieval tools.

Public documentation does not require MCP. [llms.txt and Markdown exports](/overview/agent-support/documentation) remain available for clients that can read URLs. A hosted HTTP MCP service would be another distribution option, but Selaras currently supplies the local stdio server only.
