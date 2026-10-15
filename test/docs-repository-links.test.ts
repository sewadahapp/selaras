import { describe, expect, it } from 'vitest'
import { getDocsRepositoryLinks } from '../packages/docs/app/utils/repository-links'

describe('documentation repository links', () => {
  it('builds edit and contextual issue links for a configured repository', () => {
    const links = getDocsRepositoryLinks({ url: 'https://github.com/example/project/', branch: 'master', contentDirectory: 'docs/content' }, '/guide/setup', 'Setup & usage')
    expect(links.edit).toBe('https://github.com/example/project/edit/master/docs/content/guide/setup.md')
    const issue = new URL(links.issue!)
    expect(issue.origin + issue.pathname).toBe('https://github.com/example/project/issues/new')
    expect(issue.searchParams.get('title')).toBe('Documentation: Setup & usage')
    expect(issue.searchParams.get('body')).toBe('Documentation page: /guide/setup\n\n')
  })

  it('uses index.md and the default branch and content directory for the homepage', () => {
    expect(getDocsRepositoryLinks({ url: 'https://github.com/example/project' }, '/').edit)
      .toBe('https://github.com/example/project/edit/main/content/index.md')
  })

  it('uses the repository host’s edit and issue query formats', () => {
    const links = getDocsRepositoryLinks({ url: 'https://gitlab.com/example/project' }, '/guide/setup')
    expect(links.edit).toBe('https://gitlab.com/example/project/-/edit/main/content/guide/setup.md')
    const issue = new URL(links.issue!)
    expect(issue.pathname).toBe('/example/project/-/issues/new')
    expect(issue.searchParams.get('issue[title]')).toBe('Documentation: /guide/setup')
    expect(issue.searchParams.get('issue[description]')).toBe('Documentation page: /guide/setup\n\n')
  })

  it('allows editing and reporting to be disabled independently', () => {
    const url = 'https://github.com/example/project'
    expect(getDocsRepositoryLinks({ url, editLinks: false }, '/')).toEqual({ issue: expect.any(String) })
    expect(getDocsRepositoryLinks({ url, issueLinks: false }, '/')).toEqual({ edit: expect.any(String) })
    expect(getDocsRepositoryLinks({ url, editLinks: false, issueLinks: false }, '/')).toEqual({})
  })

  it('preserves a custom issue tracker URL without adding query parameters', () => {
    const issueUrl = 'https://support.example.com/new?category=documentation'
    expect(getDocsRepositoryLinks({ issueUrl }, '/guide')).toEqual({ issue: issueUrl })
    expect(getDocsRepositoryLinks({ issueUrl, issueLinks: false }, '/guide')).toEqual({})
  })

  it('omits unavailable links instead of guessing an unsupported destination', () => {
    expect(getDocsRepositoryLinks(undefined, '/')).toEqual({})
    expect(getDocsRepositoryLinks({ url: 'https://code.example.com/team/project' }, '/')).toEqual({})
  })
})
