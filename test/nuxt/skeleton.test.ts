import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Skeleton from '../../src/runtime/components/Skeleton.vue'

describe('skeleton', () => {
  it('defaults to the pulse animation', async () => {
    const wrapper = await mountSuspended(Skeleton)

    expect(wrapper.classes()).toContain('animate-pulse')
  })

  it('applies the shimmer animation instead of pulse when set', async () => {
    const wrapper = await mountSuspended(Skeleton, { props: { animation: 'shimmer' } })

    expect(wrapper.classes()).not.toContain('animate-pulse')
    expect(wrapper.classes().some(c => c.includes('selaras-skeleton-shimmer'))).toBe(true)
  })

  it('is always hidden from assistive tech', async () => {
    const wrapper = await mountSuspended(Skeleton)

    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('merges a fallthrough class attr with the theme base classes instead of dropping it', async () => {
    const wrapper = await mountSuspended(Skeleton, { attrs: { class: 'h-4 w-32' } })

    expect(wrapper.classes()).toContain('h-4')
    expect(wrapper.classes()).toContain('w-32')
    // still carries its own theme classes - the fallthrough class merges in,
    // it doesn't replace them.
    expect(wrapper.classes()).toContain('animate-pulse')
  })

  it('merges a string :ui.base override with the theme base classes', async () => {
    const wrapper = await mountSuspended(Skeleton, { props: { ui: { base: 'custom-class' } } })

    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.classes()).toContain('animate-pulse')
  })
})
