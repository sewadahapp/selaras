import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ScrollAreaCorner, ScrollAreaScrollbar } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import ScrollArea from '../../src/runtime/components/ScrollArea.vue'

// The scrollbar's own visible/hidden DOM (hover-triggered by default) isn't
// meaningfully reproducible in happy-dom, so these check which scrollbar/
// corner *components* the v-if in ScrollArea.vue actually instantiates,
// rather than their own internal rendered markup.
describe('scrollArea', () => {
  it('renders the default slot content inside the viewport', async () => {
    const wrapper = await mountSuspended(ScrollArea, { slots: { default: () => 'Scrollable content' } })
    expect(wrapper.text()).toContain('Scrollable content')
  })

  it('mounts a vertical scrollbar by default but not a horizontal one', async () => {
    const wrapper = await mountSuspended(ScrollArea)
    const scrollbars = wrapper.findAllComponents(ScrollAreaScrollbar)
    expect(scrollbars).toHaveLength(1)
    expect(scrollbars[0]!.props('orientation')).toBe('vertical')
  })

  it('mounts only a horizontal scrollbar when orientation is horizontal', async () => {
    const wrapper = await mountSuspended(ScrollArea, { props: { orientation: 'horizontal' } })
    const scrollbars = wrapper.findAllComponents(ScrollAreaScrollbar)
    expect(scrollbars).toHaveLength(1)
    expect(scrollbars[0]!.props('orientation')).toBe('horizontal')
  })

  it('mounts both scrollbars and a corner when orientation is both', async () => {
    const wrapper = await mountSuspended(ScrollArea, { props: { orientation: 'both' } })
    const scrollbars = wrapper.findAllComponents(ScrollAreaScrollbar)
    expect(scrollbars.map(s => s.props('orientation')).sort()).toEqual(['horizontal', 'vertical'])
    expect(wrapper.findComponent(ScrollAreaCorner).exists()).toBe(true)
  })

  it('mounts no corner when orientation is not both', async () => {
    const wrapper = await mountSuspended(ScrollArea)
    expect(wrapper.findComponent(ScrollAreaCorner).exists()).toBe(false)
  })
})
