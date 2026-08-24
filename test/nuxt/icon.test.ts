import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Icon from '../../src/runtime/components/Icon.vue'

describe('icon', () => {
  it('renders the named icon at the default md size', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star' } })
    const el = wrapper.find('.iconify')
    expect(el.classes()).toContain('i-lucide:star')
    expect(el.classes()).toContain('size-5')
  })

  it('applies a size variant', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star', size: 'lg' } })
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
})
