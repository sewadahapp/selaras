export interface ChangelogRelease {
  version: string
  tag: string
  date?: string
  body: string
}

export interface ChangelogPackage {
  id: string
  name: string
  label: string
  description: string
  path: string
  source: string
  releases: ChangelogRelease[]
}

/** Split version sections without treating headings inside code examples as releases. */
export function parseChangelog(markdown: string, tagPrefix: string, dates: Record<string, string> = {}): ChangelogRelease[] {
  const releases: ChangelogRelease[] = []
  let current: ChangelogRelease | undefined
  let lines: string[] = []
  let fence: { character: string, length: number } | undefined

  function finish() {
    if (current) {
      current.body = lines.join('\n').trim()
      releases.push(current)
    }
    lines = []
  }

  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1]
    if (marker) {
      if (!fence)
        fence = { character: marker[0]!, length: marker.length }
      else if (marker[0] === fence.character && marker.length >= fence.length && line.trim() === marker)
        fence = undefined
      lines.push(line)
      continue
    }

    const heading = fence ? null : /^##[\t ]+\[?v?(\d+\.\d+\.\d+(?:-[\w.-]+)?)(?:\]|\s|$)/.exec(line)
    if (heading) {
      finish()
      const version = heading[1]!
      const tag = `${tagPrefix}${version}`
      const date = dates[tag] ?? line.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0]
      current = { version, tag, body: '' }
      const timestamp = date ? Date.parse(date) : Number.NaN
      if (date && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === date)
        current.date = date
      continue
    }
    if (current)
      lines.push(line)
  }
  finish()
  return releases
}

/** Keep section links unique when several releases contain headings such as "Fixes". */
export function scopeReleaseHeadings(body: any, prefix: string): any {
  if (!body || typeof body !== 'object')
    return body
  const heading = /^h[1-6]$/.test(body.tag ?? '')
  const props = { ...body.props }
  if (heading && props.id)
    props.id = `${prefix}-${props.id}`
  if (body.tag === 'a' && typeof props.href === 'string' && props.href.startsWith('#') && props.href.length > 1)
    props.href = `#${prefix}-${props.href.slice(1)}`
  return {
    ...body,
    ...(body.props ? { props } : {}),
    ...(Array.isArray(body.children)
      ? { children: body.children.map((child: any, index: number) => heading && index === 0 && child.type === 'text'
          ? { ...child, value: child.value.replace(/^[^\p{L}\p{N}]+/u, '') }
          : scopeReleaseHeadings(child, prefix)) }
      : {}),
  }
}

/** Publication dates are used only for recognized package tags and published releases. */
export function releaseDatesFromMetadata(releases: unknown[]): Record<string, string> {
  const dates: Record<string, string> = {}
  for (const release of releases) {
    if (!release || typeof release !== 'object' || !('tag_name' in release) || typeof release.tag_name !== 'string')
      continue
    if (('draft' in release && release.draft) || !/^(?:selaras-docs-|selaras-mcp-)?v\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(release.tag_name))
      continue
    const timestamp = 'published_at' in release && typeof release.published_at === 'string' ? Date.parse(release.published_at) : Number.NaN
    if (Number.isFinite(timestamp))
      dates[release.tag_name] = new Date(timestamp).toISOString().slice(0, 10)
  }
  return dates
}
