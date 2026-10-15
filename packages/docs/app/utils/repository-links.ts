import type { SelarasDocsAppConfig } from '../../types'

export function getDocsRepositoryLinks(repository: SelarasDocsAppConfig['repository'], path: string, title?: string) {
  const links: { edit?: string, issue?: string } = {}
  const base = repository?.url?.replace(/\/$/, '')
  const github = base?.startsWith('https://github.com/')
  const gitlab = base?.startsWith('https://gitlab.com/')

  if (base && (github || gitlab) && repository?.editLinks !== false) {
    const relativePath = path === '/' ? 'index.md' : `${path.replace(/^\//, '')}.md`
    const contentPath = [repository?.contentDirectory ?? 'content', relativePath].join('/')
    const branch = repository?.branch ?? 'main'
    links.edit = `${base}/${gitlab ? '-/edit' : 'edit'}/${branch}/${contentPath}`
  }

  if (repository?.issueLinks !== false) {
    if (repository?.issueUrl) {
      links.issue = repository.issueUrl
    }
    else if (base && (github || gitlab)) {
      const url = new URL(`${base}/${gitlab ? '-/issues/new' : 'issues/new'}`)
      url.searchParams.set(gitlab ? 'issue[title]' : 'title', `Documentation: ${title ?? path}`)
      url.searchParams.set(gitlab ? 'issue[description]' : 'body', `Documentation page: ${path}\n\n`)
      links.issue = url.href
    }
  }

  return links
}
