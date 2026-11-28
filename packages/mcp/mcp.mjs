#!/usr/bin/env node
import process from 'node:process'
import { parseArgs } from 'node:util'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
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
  const catalog = await loadCatalog(values.catalog ?? resolveCatalogPath(values.project))
  await serveStdio(() => createServer(catalog))
}

main().catch((error) => {
  console.error(`[selaras-mcp] ${error instanceof Error ? error.message : error}`)
  process.exitCode = 1
})
