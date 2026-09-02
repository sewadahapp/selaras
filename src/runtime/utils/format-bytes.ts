const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/** Formats a byte count as a human-readable size (`"1.5 MB"`) - used for a file's own size label and for a maxSize validation message. */
export function formatBytes(bytes: number): string {
  if (bytes <= 0)
    return '0 B'
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1)
  const value = bytes / 1024 ** exponent
  return `${exponent === 0 ? value : value.toFixed(1)} ${UNITS[exponent]}`
}
