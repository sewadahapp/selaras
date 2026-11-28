# @sewadah/selaras-mcp

A local, read-only [MCP](https://modelcontextprotocol.io) server that gives coding agents the [Selaras](https://github.com/sewadahapp/selaras) documentation and Vue examples. It runs over stdio, needs no hosted service or API key, and works offline.

The server reads the documentation catalog shipped inside your project's own `@sewadah/selaras` install, so its answers match the version your project uses. It requires `@sewadah/selaras` 1.0.0 or later. Companion component discovery requires 1.2.0 or later.

The stdio server supports the MCP `2026-07-28` protocol and clients using the `2025-11-25` handshake. The server version identifies `@sewadah/selaras-mcp`. Each structured tool result reports the installed UI package version as `selarasVersion`.

## Setup

Add it to your MCP client's configuration and launch it from your project directory:

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

If your client does not start servers in the project directory, pass it explicitly:

```json
{
  "mcpServers": {
    "selaras": {
      "command": "npx",
      "args": ["-y", "@sewadah/selaras-mcp", "--project", "/absolute/path/to/your-project"]
    }
  }
}
```

## Tools

Each tool declares an `outputSchema`. Read `structuredContent` when chaining calls from code. The response also includes text for clients that render `content`.

| Tool | Inputs | Structured result fields in addition to `selarasVersion` |
| --- | --- | --- |
| `list_components` | Optional `category` substring | `components`, one guide summary per component with a required `component` name |
| `search_documentation` | `query` and optional `limit` from 1 to 20 (default 10) | `matches`, ranked guide summaries |
| `get_documentation` | `path` (guide path, documentation URI, or component name), optional `section` with `sectionOccurrence`, or `outline: true` | Guide summary fields and `markdown`, plus `section` and `sectionOccurrence` when reading a section. Outline mode returns `headings` with `title`, `level`, and `occurrence`. |
| `get_example` | Example `name` from a guide summary | `name` and `source` containing the Vue file |

A guide summary includes `path`, `title`, `description`, `category`, `components`, `examples`, and `uri`. The optional `component` field identifies a primary component in a guide summary or the listed component in a `list_components` result. Use an outline heading's `title` as `section` and its `occurrence` as `sectionOccurrence` to read that heading and its subsections. `sectionOccurrence` defaults to 1, the first match. Unknown guides, headings, and examples return `isError: true` with a text message.

Clients with MCP resource support can read `selaras://catalog` for the index and `selaras://docs/...` for guide Markdown. The CLI invocation, tool names, documented inputs and result fields, and resource URI formats form the public API. Guide content, search ranking, and example availability can vary with the installed catalog.

See the [MCP guide](https://selarasui.my.id/overview/agent-support/mcp) for a scripted retrieval example.
