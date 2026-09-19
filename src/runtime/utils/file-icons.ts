// Maps a code fence's `language` (or a filename's extension) to a
// `vscode-icons` file-type glyph, e.g. `vue` -> `vscode-icons:file-type-vue`.
// Keys are normalized (lowercase, no leading dot) and deliberately
// many-to-one: every alias Shiki/consumers might hand us points at the same
// glyph, so the mapping stays a flat lookup rather than a resolver.
//
// Kept separate from the semantic IconRegistry (utils/icons.ts): that
// registry holds a fixed, one-name-per-purpose set of UI glyphs overridable
// via app.config.selaras.icons, while these names are inherently
// language-driven and open-ended.
export const defaultFileIcons: Record<string, string> = {
  'vue': 'vscode-icons:file-type-vue',
  'ts': 'vscode-icons:file-type-typescript',
  'typescript': 'vscode-icons:file-type-typescript',
  'mts': 'vscode-icons:file-type-typescript',
  'cts': 'vscode-icons:file-type-typescript',
  'tsx': 'vscode-icons:file-type-reactts',
  'js': 'vscode-icons:file-type-js',
  'javascript': 'vscode-icons:file-type-js',
  'mjs': 'vscode-icons:file-type-js',
  'cjs': 'vscode-icons:file-type-js',
  'jsx': 'vscode-icons:file-type-reactjs',
  'html': 'vscode-icons:file-type-html',
  'htm': 'vscode-icons:file-type-html',
  'css': 'vscode-icons:file-type-css',
  'scss': 'vscode-icons:file-type-scss',
  'sass': 'vscode-icons:file-type-sass',
  'less': 'vscode-icons:file-type-less',
  'json': 'vscode-icons:file-type-json',
  'jsonc': 'vscode-icons:file-type-json',
  'json5': 'vscode-icons:file-type-json',
  'md': 'vscode-icons:file-type-markdown',
  'markdown': 'vscode-icons:file-type-markdown',
  'mdx': 'vscode-icons:file-type-markdown',
  'bash': 'vscode-icons:file-type-shell',
  'sh': 'vscode-icons:file-type-shell',
  'shell': 'vscode-icons:file-type-shell',
  'zsh': 'vscode-icons:file-type-shell',
  'console': 'vscode-icons:file-type-shell',
  'terminal': 'vscode-icons:file-type-shell',
  'python': 'vscode-icons:file-type-python',
  'py': 'vscode-icons:file-type-python',
  'yaml': 'vscode-icons:file-type-yaml',
  'yml': 'vscode-icons:file-type-yaml',
  'toml': 'vscode-icons:file-type-toml',
  'ini': 'vscode-icons:file-type-ini',
  'cfg': 'vscode-icons:file-type-config',
  'conf': 'vscode-icons:file-type-config',
  'config': 'vscode-icons:file-type-config',
  'env': 'vscode-icons:file-type-dotenv',
  'dotenv': 'vscode-icons:file-type-dotenv',
  'go': 'vscode-icons:file-type-go',
  'rust': 'vscode-icons:file-type-rust',
  'rs': 'vscode-icons:file-type-rust',
  'php': 'vscode-icons:file-type-php',
  'ruby': 'vscode-icons:file-type-ruby',
  'rb': 'vscode-icons:file-type-ruby',
  'sql': 'vscode-icons:file-type-sql',
  'docker': 'vscode-icons:file-type-docker',
  'dockerfile': 'vscode-icons:file-type-docker',
  'svelte': 'vscode-icons:file-type-svelte',
  'astro': 'vscode-icons:file-type-astro',
  'xml': 'vscode-icons:file-type-xml',
  'svg': 'vscode-icons:file-type-svg',
  'java': 'vscode-icons:file-type-java',
  'kotlin': 'vscode-icons:file-type-kotlin',
  'kt': 'vscode-icons:file-type-kotlin',
  'swift': 'vscode-icons:file-type-swift',
  'csharp': 'vscode-icons:file-type-csharp',
  'cs': 'vscode-icons:file-type-csharp',
  'cpp': 'vscode-icons:file-type-cpp',
  'c++': 'vscode-icons:file-type-cpp',
  'c': 'vscode-icons:file-type-c',
  'vim': 'vscode-icons:file-type-vim',
  'lua': 'vscode-icons:file-type-lua',
  'nginx': 'vscode-icons:file-type-nginx',
  'graphql': 'vscode-icons:file-type-graphql',
  'gql': 'vscode-icons:file-type-graphql',
  'prisma': 'vscode-icons:file-type-prisma',
  'powershell': 'vscode-icons:file-type-powershell',
  'ps1': 'vscode-icons:file-type-powershell',
  'r': 'vscode-icons:file-type-r',
  'elixir': 'vscode-icons:file-type-elixir',
  'ex': 'vscode-icons:file-type-elixir',
  'exs': 'vscode-icons:file-type-elixir',
  'erlang': 'vscode-icons:file-type-erlang',
  'erl': 'vscode-icons:file-type-erlang',
  'haskell': 'vscode-icons:file-type-haskell',
  'hs': 'vscode-icons:file-type-haskell',
  'scala': 'vscode-icons:file-type-scala',
  'julia': 'vscode-icons:file-type-julia',
  'jl': 'vscode-icons:file-type-julia',
  'zig': 'vscode-icons:file-type-zig',
  'nim': 'vscode-icons:file-type-nim',
  'crystal': 'vscode-icons:file-type-crystal',
  'solidity': 'vscode-icons:file-type-solidity',
  'sol': 'vscode-icons:file-type-solidity',
  'terraform': 'vscode-icons:file-type-terraform',
  'tf': 'vscode-icons:file-type-terraform',
  'cmake': 'vscode-icons:file-type-cmake',
  'wasm': 'vscode-icons:file-type-wasm',
  'text': 'vscode-icons:file-type-text',
  'txt': 'vscode-icons:file-type-text',
  'plaintext': 'vscode-icons:file-type-text',
  'plain': 'vscode-icons:file-type-text',
  'output': 'vscode-icons:file-type-text',
  'ansi': 'vscode-icons:file-type-text',
  'diff': 'vscode-icons:file-type-diff',
  'patch': 'vscode-icons:file-type-diff',
  'log': 'vscode-icons:file-type-log',
  'image': 'vscode-icons:file-type-image',
  'audio': 'vscode-icons:file-type-audio',
  'video': 'vscode-icons:file-type-video',
  'font': 'vscode-icons:file-type-font',
  'zip': 'vscode-icons:file-type-zip',
  'git': 'vscode-icons:file-type-git',
  'gitignore': 'vscode-icons:file-type-git',
  'npm': 'vscode-icons:file-type-npm',
  'nuxt': 'vscode-icons:file-type-nuxt',
  'ansible': 'vscode-icons:file-type-ansible',
  'bicep': 'vscode-icons:file-type-bicep',
}

function normalizeFileIconKey(value: string | undefined): string | undefined {
  const key = value?.trim().toLowerCase().replace(/^\./, '')
  return key || undefined
}

// The basename's extension, or the whole basename for an extensionless file
// (`Dockerfile`) or a dotfile (`.env`) - so both resolve like a language key.
function extensionOf(filename: string | undefined): string | undefined {
  if (!filename)
    return undefined
  const base = filename.split(/[\\/]/).pop() ?? filename
  const dot = base.lastIndexOf('.')
  return dot > 0 ? base.slice(dot + 1) : base.replace(/^\./, '')
}

/**
 * Resolves a file-type icon for a code block, preferring a filename's own
 * extension (the more specific signal) over the fence's `language`. Returns
 * undefined when neither maps to a known type, so callers can render no icon
 * rather than a misleading fallback.
 */
export function resolveFileIcon(language?: string, filename?: string): string | undefined {
  for (const candidate of [extensionOf(filename), language]) {
    const key = normalizeFileIconKey(candidate)
    if (key && defaultFileIcons[key])
      return defaultFileIcons[key]
  }
  return undefined
}
