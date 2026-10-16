import { existsSync } from 'node:fs'
import process from 'node:process'

async function main() {
  if (process.env.CI || process.env.NODE_ENV === 'production' || process.env.HUSKY === '0' || !existsSync('.git'))
    return

  const { default: install } = await import('husky')
  const error = install()
  if (error)
    throw new Error(error)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
