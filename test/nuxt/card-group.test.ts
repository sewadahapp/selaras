import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import CardGroup from '../../src/runtime/components/CardGroup.vue'

describe('cardGroup', () => {
  it('renders its default slot content', async () => {
    const wrapper = await mountSuspended(CardGroup, {
      slots: { default: () => '<div>First</div><div>Second</div>' },
    })

    expect(wrapper.text()).toContain('First')
    expect(wrapper.text()).toContain('Second')
  })

  it('defaults to a 2-column grid at the sm breakpoint', async () => {
    const wrapper = await mountSuspended(CardGroup, { props: {} })

    expect(wrapper.classes().join(' ')).toContain('sm:grid-cols-2')
  })

  it('cols=4 applies the wider breakpoint classes instead', async () => {
    const wrapper = await mountSuspended(CardGroup, { props: { cols: 4 } })

    expect(wrapper.classes().join(' ')).toContain('lg:grid-cols-4')
  })

  it('merges a string :ui.root override with the theme classes', async () => {
    const wrapper = await mountSuspended(CardGroup, { props: { ui: { root: 'custom-class' } } })

    expect(wrapper.classes()).toContain('custom-class')
  })
})
