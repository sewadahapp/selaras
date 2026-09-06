import { mountSuspended } from '@nuxt/test-utils/runtime'
import { tv } from 'tailwind-variants'
import { describe, expect, it } from 'vitest'
import Accordion from '../../src/runtime/components/Accordion.vue'
import { applyClassPrefix, stripClassPrefix } from '../../src/runtime/utils/ui'

describe('applyClassPrefix', () => {
  it('returns the class string unchanged when no prefix is given', () => {
    expect(applyClassPrefix('flex items-center', undefined)).toBe('flex items-center')
  })

  it('passes an undefined class straight through instead of crashing - a tv() slot with no base classes and no active override resolves to undefined, not \'\'', () => {
    expect(applyClassPrefix(undefined as unknown as string, 'tw')).toBeUndefined()
  })

  it('prepends the prefix to every space-separated token', () => {
    expect(applyClassPrefix('flex items-center', 'tw')).toBe('tw:flex tw:items-center')
  })

  it('prefixes a variant chain at its outermost segment only, never between the variant and the utility', () => {
    expect(applyClassPrefix('hover:bg-red-500', 'tw')).toBe('tw:hover:bg-red-500')
  })

  it('never prefixes a hand-authored selaras-* literal selector class', () => {
    expect(applyClassPrefix('selaras-nav-elbow flex', 'tw')).toBe('selaras-nav-elbow tw:flex')
  })

  it('leaves an already-prefixed class alone instead of double-prefixing it - a consumer\'s own :ui override or custom component has to write the prefix themselves (Selaras\'s build-time safelist can only cover its own shipped classes), so re-prefixing that would produce tw:tw:...', () => {
    expect(applyClassPrefix('tw:bg-purple-700 flex', 'tw')).toBe('tw:bg-purple-700 tw:flex')
  })
})

describe('stripClassPrefix', () => {
  it('returns the class string unchanged when no prefix is given', () => {
    expect(stripClassPrefix('tw:flex tw:items-center', undefined)).toBe('tw:flex tw:items-center')
  })

  it('strips a matching leading prefix from each token', () => {
    expect(stripClassPrefix('tw:bg-red-500 tw:w-40', 'tw')).toBe('bg-red-500 w-40')
  })

  it('leaves a token alone that doesn\'t carry the prefix', () => {
    expect(stripClassPrefix('bg-red-500 tw:w-40', 'tw')).toBe('bg-red-500 w-40')
  })

  it('passes undefined through untouched', () => {
    expect(stripClassPrefix(undefined, 'tw')).toBeUndefined()
  })
})

describe('resolveSlot normalizes a prefixed override before merging (real bug: tailwind-merge has no concept of tw:-style prefixes, so a mixed unprefixed-base/prefixed-override merge never dedupes on its own)', () => {
  it('strip -> tv() merge -> re-prefix correctly dedupes a conflicting override, matching what resolveSlot does internally', () => {
    const theme = tv({ base: 'bg-[var(--ui-primary)] rounded-md' })
    // Exactly resolveSlot's own sequence: strip the override's prefix before
    // merging, then applyClassPrefix the whole merged result afterward.
    const stripped = stripClassPrefix('tw:bg-purple-700', 'tw')
    const merged = theme({ class: stripped })
    const result = applyClassPrefix(merged, 'tw')
    expect(result).toBe('tw:rounded-md tw:bg-purple-700')
    // Without the strip step, tailwind-merge fails to recognize the prefixed
    // override as conflicting with the base class at all - both survive.
    const mergedWithoutStrip = theme({ class: 'tw:bg-purple-700' })
    expect(mergedWithoutStrip).toBe('bg-[var(--ui-primary)] rounded-md tw:bg-purple-700')
  })
})

// The real classPrefix->rendered-output pipeline (module option -> build-time
// virtual module -> resolveSlot's default) only exists inside a real Nuxt
// build with the module option actually set - exercised end-to-end by
// test/prefix.test.ts's own fixture, not here (this fixture never sets
// `classPrefix`, so `applyClassPrefix`'s default always resolves to unset).
describe('resolveSlot with an empty-string theme slot', () => {
  it('renders a component with empty-string slots (no base classes, no override) without crashing - a tv() slot like Accordion\'s header/label resolves to undefined, not \'\', which applyClassPrefix has to tolerate even absent any prefix', async () => {
    const wrapper = await mountSuspended(Accordion, { props: { items: [{ value: 'a', label: 'A' }] } })
    expect(wrapper.exists()).toBe(true)
  })
})
