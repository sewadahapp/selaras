import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

const [version, source] = process.argv.slice(2)

if (!version || !source) {
  throw new Error('Usage: annotate-release-notes.mjs <version> <summary-file>')
}

const changelogPath = resolve('CHANGELOG.md')
const heading = `## v${version}\n`
const changelog = await readFile(changelogPath, 'utf8')
const summary = (await readFile(resolve(source), 'utf8')).trim()
const headingIndex = changelog.indexOf(heading)

if (headingIndex === -1) {
  throw new Error(`Could not find ${heading.trim()} in CHANGELOG.md`)
}

if (changelog.includes('<!-- selaras-release-summary -->')) {
  throw new Error('CHANGELOG.md already has a Selaras release summary')
}

const insertionIndex = headingIndex + heading.length
await writeFile(
  changelogPath,
  `${changelog.slice(0, insertionIndex)}\n${summary}\n\n${changelog.slice(insertionIndex)}`,
)
