import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Badge from '../../src/runtime/components/Badge.vue'

describe('badge', () => {
  it('renders the label prop by default', async () => {
    const wrapper = await mountSuspended(Badge, { props: { label: 'New' } })
    expect(wrapper.text()).toBe('New')
  })

  it('renders default slot content, overriding the label prop', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: { label: 'New' },
      slots: { default: () => 'Beta' },
    })
    expect(wrapper.text()).toBe('Beta')
  })

  it('merges a fallthrough class attr with the theme base classes instead of dropping it', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: { label: 'New' },
      attrs: { class: 'mt-4' },
    })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('mt-4')
    // still carries its own theme classes - the fallthrough class merges in,
    // it doesn't replace them (the exact mechanism behind an earlier real bug
    // where Vue's raw class-string concatenation silently lost against a
    // component's own w-full-style base class).
    expect(span.classes().length).toBeGreaterThan(1)
  })

  it('merges a string :ui.base override with the theme base classes', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: { label: 'New', ui: { base: 'custom-class' } },
    })
    expect(wrapper.find('span').classes()).toContain('custom-class')
  })

  it('applies non-class attrs from an object :ui.base override without tailwind-merging them', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: { label: 'New', ui: { base: { 'class': 'custom-class', 'data-testid': 'my-badge' } } },
    })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('custom-class')
    expect(span.attributes('data-testid')).toBe('my-badge')
  })

  it('renders a leading icon when given', async () => {
    const wrapper = await mountSuspended(Badge, { props: { label: 'New', icon: 'lucide:sparkles' } })
    expect(wrapper.find('.iconify').classes()).toContain('i-lucide:sparkles')
  })

  it('renders a trailing icon when given', async () => {
    const wrapper = await mountSuspended(Badge, { props: { label: 'New', trailingIcon: 'lucide:chevron-right' } })
    expect(wrapper.find('.iconify').classes()).toContain('i-lucide:chevron-right')
  })

  it('orders a leading and trailing icon around the label', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: { label: 'New', icon: 'lucide:sparkles', trailingIcon: 'lucide:chevron-right' },
    })
    const icons = wrapper.findAll('.iconify').map(el => el.classes().find(c => c.startsWith('i-')))
    expect(icons).toEqual(['i-lucide:sparkles', 'i-lucide:chevron-right'])
  })
})
