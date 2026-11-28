---
title: MCP
description: Retrieve versioned component documentation and examples through a local MCP server.
order: 40
---

Selaras provides a local, read-only MCP server in the separate `@sewadah/selaras-mcp` package. Your agent client launches it as a subprocess and communicates over standard input and output (`stdio`). No hosted server, account, API key, or authentication service is needed.

The documentation catalog ships inside `@sewadah/selaras` itself, generated from the same documentation and Vue examples as the website. The server reads the catalog from your project's own Selaras installation, so its answers match the version you use, and it works without fetching documentation from the network. It requires `@sewadah/selaras` 1.0.0 or later.

Starting with `@sewadah/selaras-mcp` 1.0.0, the stdio server supports the MCP `2026-07-28` protocol and clients using the `2025-11-25` handshake. The MCP server reports its own package version during discovery and the installed UI package version as `selarasVersion` in tool results.

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
| `get_documentation` | `path` (guide path, documentation URI, or component name), optional `section` with `sectionOccurrence`, or `outline: true` | Guide Markdown, a single section, or a heading outline. |
| `get_example` | Example `name` from the catalog | The exact Vue source of that example. |

Companion components such as `SColumn`, `SToolbarButton`, and `SProsePre` are
listed individually and resolve to their shared Table, Toolbar, or Prose guide.
Guide summaries include `components`, the names covered by that guide. This
requires Selaras 1.2.0 or later. Older catalogs expose their original primary component names.

The server also exposes `selaras://catalog` and documentation resources under `selaras://docs/...` for clients that support MCP resources.

## Example workflow

```text
Use Selaras for this settings page. Discover components with list_components,
then read the Select, FormField, and Modal documentation and relevant examples.
Use the project's existing theme and enable adaptive presentation where useful.
```

### Retrieving documentation from code

In a client that supports programmatic MCP calls, read `structuredContent`. The tools also provide text for clients that render `content`. This example uses a connected MCP TypeScript SDK client and passes references returned by one call into the next.

```js
async function lookupSelect(client) {
  async function call(name, args) {
    const result = await client.callTool({ name, arguments: args })
    if (result.isError || !result.structuredContent)
      throw new Error(result.content[0]?.text ?? `No structured result for ${name}`)
    return result.structuredContent
  }

  const { matches } = await call('search_documentation', { query: 'SSelect', limit: 1 })
  const [match] = matches
  if (!match)
    return

  const { headings, examples, uri } = await call('get_documentation', {
    path: match.uri,
    outline: true,
  })
  const heading = headings.find(heading => heading.title === 'Props')
  const [guide, example] = await Promise.all([
    heading && call('get_documentation', {
      path: uri,
      section: heading.title,
      sectionOccurrence: heading.occurrence,
    }),
    examples[0] && call('get_example', { name: examples[0] }),
  ])
  return { markdown: guide?.markdown, source: example?.source }
}
```

## MCP versus a skill

The [skill](/overview/agent-support/skills) provides guidance about how to build with Selaras. MCP provides structured access to the installed version's documentation. Either can be used independently; combining them gives the agent both guidance and retrieval tools.

Public documentation does not require MCP. [llms.txt and Markdown exports](/overview/agent-support/documentation) remain available for clients that can read URLs. A hosted HTTP MCP service would be another distribution option, but Selaras currently supplies the local stdio server only.
