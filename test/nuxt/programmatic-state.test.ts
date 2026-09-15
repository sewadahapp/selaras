import { describe, expect, it } from 'vitest'
import { createAppScopedState } from '../../src/runtime/utils/app-scoped-state'

describe('programmatic app state', () => {
  it('shares state within one app owner and isolates separate app owners', () => {
    const useState = createAppScopedState(() => ({ items: [] as string[] }))
    const appA = {}
    const appB = {}

    useState(appA).items.push('only-a')

    expect(useState(appA).items).toEqual(['only-a'])
    expect(useState(appB).items).toEqual([])
    expect(useState(appA)).not.toBe(useState(appB))
  })
})
