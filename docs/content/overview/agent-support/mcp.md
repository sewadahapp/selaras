---
title: MCP
description: Retrieve versioned component documentation and examples through a local MCP server.
order: 40
---

Selaras includes a local, read-only MCP server named `selaras-mcp`. Your agent client launches it as a subprocess and communicates over standard input and output (`stdio`). No hosted server, account, API key, or authentication service is needed.

The catalog is bundled with the package and generated from the same documentation and Vue examples as the website. After installation, the server works without fetching documentation from the network. Its catalog version matches the installed package.

## Configure your client

Install a Selaras release containing the MCP server in your application. Add this entry to your client's MCP configuration:

```json
{
  "mcpServers": {
    "selaras": {
      "command": "node",
      "args": [
        "/absolute/path/to/your-project/node_modules/@sewadah/selaras/agent/mcp.mjs"
      ]
    }
  }
}
```

Replace the absolute path with your application's location. The example uses a common JSON configuration shape; your client may use a different file or format. Use the Node.js version supported by Selaras and restart or reconnect the client after changing its configuration.

The package also exposes the `selaras-mcp` executable. Clients that launch commands from your project directory can use `npx --no-install selaras-mcp`, so the server uses your existing installation rather than downloading a potentially different version.

For development in this repository, run `bun run agent:build` first, then point your client at the repository's `agent/mcp.mjs`. The npm command becomes available after a package release containing this implementation.

## Tools

| Tool | Arguments | Result |
| --- | --- | --- |
| `list_components` | Optional `category`, such as `forms` or `overlays` | Component names, descriptions, guide paths, and example names. |
| `search_documentation` | `query`; optional `limit` from 1 to 20 | Ranked guide matches across components, composables, setup, and theming. |
| `get_documentation` | `path` or component name; optional `section` heading | Markdown API guidance with complete Vue example source. |
| `get_example` | Example `name` from the catalog | The exact Vue source of that example. |

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
