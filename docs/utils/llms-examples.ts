/** Expands documentation example embeds into code that agents can read. */
export function expandLlmsExamples(markdown: string, examples: Record<string, string>): string {
  function replaceExample(_original: string, name: string) {
    const source = examples[name]
    if (source === undefined)
      throw new Error(`Missing documentation example: ${name}`)
    const longestFence = Math.max(2, ...[...source.matchAll(/`+/g)].map(match => match[0].length))
    const fence = '`'.repeat(longestFence + 1)
    return `\n${fence}vue\n${source.trim()}\n${fence}\n`
  }

  return markdown
    .replace(/::component-example\{name=["']([^"']+)["']\}\s*\n::/g, replaceExample)
    .replace(/^:component-example\{name=["']([^"']+)["']\}[ \t]*$/gm, replaceExample)
    .replace(/<component-example\s[^>]*\bname=["']([^"']+)["'][^>]*>(?:\s*<\/component-example>)?/g, replaceExample)
}
