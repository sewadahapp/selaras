import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Icon from '../../src/runtime/components/Icon.vue'

describe('icon', () => {
  it('renders the named icon', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star' } })
    expect(wrapper.find('.iconify').classes()).toContain('i-lucide:star')
  })

  // No size prop by design - every internal consumer (Badge, Button, Chip,
  // Input, ...) needs its own precise size that doesn't map onto a shared
  // enum, so sizing is just whatever class a caller passes, merged in like
  // any other fallthrough class (see Badge's equivalent test).
  it('has no built-in size - a passed-in class applies directly', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star' }, attrs: { class: 'size-6' } })
    expect(wrapper.find('.iconify').classes()).toContain('size-6')
  })

  it('does not force a color by default, so it inherits currentColor', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star' } })
    const classes = wrapper.find('.iconify').classes()
    expect(classes.some(c => c.startsWith('text-'))).toBe(false)
  })

  it('applies a semantic color when given', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star', color: 'danger' } })
    expect(wrapper.find('.iconify').classes()).toContain('text-[var(--ui-danger)]')
  })

  it('lets a passed-in class override the color prop, same tailwind-merge as everywhere else', async () => {
    const wrapper = await mountSuspended(Icon, {
      props: { name: 'lucide:star', color: 'danger' },
      attrs: { class: 'text-[var(--ui-success)]' },
    })
    const classes = wrapper.find('.iconify').classes()
    expect(classes).toContain('text-[var(--ui-success)]')
    expect(classes).not.toContain('text-[var(--ui-danger)]')
  })
})
