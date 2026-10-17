# @sewadah/selaras-mcp

A local, read-only [MCP](https://modelcontextprotocol.io) server that gives coding agents the [Selaras](https://github.com/sewadahapp/selaras) documentation and Vue examples. It runs over stdio, needs no hosted service or API key, and works offline.

The server reads the documentation catalog shipped inside your project's own `@sewadah/selaras` install, so its answers always match the version your project uses. It requires `@sewadah/selaras` 0.11.0 or later.

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

| Tool | Purpose |
| --- | --- |
| `list_components` | Discover components, their guide paths, and example names. |
| `search_documentation` | Search guides by keyword. |
| `get_documentation` | Read a guide, or one section of it, with complete example source. |
| `get_example` | Read the Vue source of a named example. |

See the [MCP guide](https://selarasui.my.id/overview/agent-support/mcp) for details.
