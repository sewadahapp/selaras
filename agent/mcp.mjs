#!/usr/bin/env node
import process from 'node:process'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { loadCatalog } from './catalog.mjs'
import { createServer } from './server.mjs'

async function main() {
  const server = createServer(await loadCatalog())
  await server.connect(new StdioServerTransport())
}

main().catch((error) => {
  console.error(`[selaras-mcp] ${error instanceof Error ? error.message : error}`)
  process.exitCode = 1
})
