import { describe, expect, it } from 'vitest'
import { docsContentPath } from '../packages/docs/app/utils/content-path'

describe('documentation content paths', () => {
  it.each([
    ['/', '/'],
    ['/guide/start', '/guide/start'],
    ['/guide/start/', '/guide/start'],
    ['/guide/start///', '/guide/start'],
    ['/café/a.b/', '/café/a.b'],
  ])('maps %s to %s', (path, expected) => {
    expect(docsContentPath(path)).toBe(expected)
  })
})
