/**
 * Returns `null` when `query` isn't a subsequence of `target` (every
 * character of `query`, in order, somewhere in `target`) - that `null` is
 * the actual filter signal, used to drop the item entirely. When it *is* a
 * subsequence, returns a score where higher is better: a word-boundary
 * match (start of string, right after a space/`-`/`_`, or a lower-to-upper
 * camelCase transition) scores more than a mid-word one, and a run of
 * consecutive matched characters scores progressively more than the same
 * characters found scattered apart - so "cf" ranks "Create File" above a
 * coincidental scattered match elsewhere.
 */
export function fuzzyScore(query: string, target: string): number | null {
  if (!query)
    return 0

  const q = query.toLowerCase()
  const t = target.toLowerCase()

  let queryIndex = 0
  let score = 0
  let streak = 0
  // The target index of the previous match - a gap since then (this
  // match's index isn't immediately after it) resets the streak.
  let lastMatchIndex = -1

  for (let targetIndex = 0; targetIndex < t.length && queryIndex < q.length; targetIndex++) {
    if (t[targetIndex] !== q[queryIndex])
      continue

    const previousChar = target[targetIndex - 1]
    const isWordBoundary = targetIndex === 0
      || previousChar === ' '
      || previousChar === '-'
      || previousChar === '_'
      || (/[a-z]/.test(previousChar ?? '') && /[A-Z]/.test(target[targetIndex]!))

    streak = lastMatchIndex === targetIndex - 1 ? streak + 1 : 1
    score += 1 + (isWordBoundary ? 8 : 0) + streak * 2
    lastMatchIndex = targetIndex
    queryIndex += 1
  }

  return queryIndex === q.length ? score : null
}
