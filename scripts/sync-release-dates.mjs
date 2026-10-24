import { mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { releaseDatesFromMetadata } from '../docs/utils/changelog.ts'

// Optional publication metadata. Notes always come from the local package changelogs.
const target = new URL('../docs/.cache/release-dates.json', import.meta.url)
try {
  const response = await fetch('https://api.github.com/repos/sewadahapp/selaras/releases?per_page=100', {
    headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'selaras-docs' },
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok)
    throw new Error(`GitHub returned HTTP ${response.status}`)
  const releases = await response.json()
  if (!Array.isArray(releases))
    throw new Error('Unexpected GitHub release response')
  const dates = releaseDatesFromMetadata(releases)
  mkdirSync(new URL('.', target), { recursive: true })
  const temporary = `${fileURLToPath(target)}.tmp`
  writeFileSync(temporary, `${JSON.stringify(dates, null, 2)}\n`)
  renameSync(temporary, target)
  console.log(`[changelog] Refreshed ${Object.keys(dates).length} verified release dates`)
}
catch (error) {
  console.warn(`[changelog] Could not refresh publication dates; keeping cached dates if available: ${error.message}`)
}
