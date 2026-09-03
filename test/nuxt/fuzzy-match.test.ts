import { describe, expect, it } from 'vitest'
import { fuzzyScore } from '../../src/runtime/utils/fuzzy-match'

describe('fuzzyScore', () => {
  it('matches a subsequence regardless of case', () => {
    expect(fuzzyScore('cf', 'Create File')).not.toBeNull()
    expect(fuzzyScore('CF', 'create file')).not.toBeNull()
  })

  it('rejects a non-subsequence', () => {
    expect(fuzzyScore('xyz', 'Create File')).toBeNull()
    expect(fuzzyScore('fc', 'Create File')).toBeNull()
  })

  it('an empty query matches everything with a neutral score', () => {
    expect(fuzzyScore('', 'Create File')).toBe(0)
  })

  it('scores a word-boundary match higher than a scattered mid-word one', () => {
    // "cf" as word-boundary hits (C of Create, F of File) vs. a target
    // where the only subsequence match for "cf" falls entirely mid-word.
    const boundary = fuzzyScore('cf', 'Create File')
    const midWord = fuzzyScore('cf', 'aacfbb')
    expect(boundary).not.toBeNull()
    expect(midWord).not.toBeNull()
    expect(boundary!).toBeGreaterThan(midWord!)
  })

  it('scores a fully contiguous match higher than a gapped one', () => {
    const contiguous = fuzzyScore('cat', 'concatenate')
    const gapped = fuzzyScore('cat', 'coalt')
    expect(contiguous).not.toBeNull()
    expect(gapped).not.toBeNull()
    expect(contiguous!).toBeGreaterThan(gapped!)
  })

  it('scores a camelCase word-boundary match higher than a mid-word one', () => {
    const boundary = fuzzyScore('nf', 'newFile')
    const midWord = fuzzyScore('nf', 'wontfix')
    expect(boundary).not.toBeNull()
    expect(midWord).not.toBeNull()
    expect(boundary!).toBeGreaterThan(midWord!)
  })
})
