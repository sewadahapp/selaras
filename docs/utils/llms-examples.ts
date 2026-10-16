import { documentationBlocks } from './blocks.ts'

/** Expands documentation example embeds into code that agents can read. */
export function expandLlmsExamples(markdown: string, examples: Record<string, string>): string {
  function replaceExample(_original: string, name: string) {
    const source = examples[name]
    if (source === undefined)
      throw new Error(`Missing documentation example: ${name}`)
    const longestFence = Math.max(2, ...[...source.matchAll(/`+/g)].map(match => match[0].length))
    const fence = '`'.repeat(longestFence + 1)
    const install = documentationBlocks.find(block => block.name === name)?.install
    const setup = install ? `\n\`\`\`sh\n${install}\n\`\`\`\n` : ''
    return `${setup}\n${fence}vue\n${source.trim()}\n${fence}\n`
  }

  return markdown
    .replace(/::(?:component-example|block-preview)\{name=["']([^"']+)["']\}\s*\n::/g, replaceExample)
    .replace(/^:(?:component-example|block-preview)\{name=["']([^"']+)["']\}[ \t]*$/gm, replaceExample)
    .replace(/<(?:component-example|block-preview)\s[^>]*\bname=["']([^"']+)["'][^>]*>(?:\s*<\/(?:component-example|block-preview)>)?/g, replaceExample)
}
