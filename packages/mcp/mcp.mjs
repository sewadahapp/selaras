#!/usr/bin/env node
import process from 'node:process'
import { parseArgs } from 'node:util'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { loadCatalog, resolveCatalogPath } from './catalog.mjs'
import { createServer } from './server.mjs'

async function main() {
  const { values } = parseArgs({
    options: {
      // The project whose Selaras install to read. Defaults to the working
      // directory, which is where most clients launch local servers.
      project: { type: 'string' },
      // An explicit catalog file, for developing Selaras itself.
      catalog: { type: 'string' },
    },
  })
  const server = createServer(await loadCatalog(values.catalog ?? resolveCatalogPath(values.project)))
  await server.connect(new StdioServerTransport())
}

main().catch((error) => {
  console.error(`[selaras-mcp] ${error instanceof Error ? error.message : error}`)
  process.exitCode = 1
})
