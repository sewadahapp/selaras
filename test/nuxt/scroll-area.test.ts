import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { updateAppConfig } from '#app'
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

  it('exposes the focusable scrolling element', async () => {
    const wrapper = await mountSuspended(ScrollArea)
    const viewport = wrapper.get('[data-reka-scroll-area-viewport]')

    expect(wrapper.vm.viewport).toBe(viewport.element)
    expect(viewport.attributes('tabindex')).toBe('0')
  })

  it('forwards configured defaults and gives explicit props precedence', async () => {
    updateAppConfig({ selaras: { defaults: { scrollArea: { type: 'always', scrollHideDelay: 100, dir: 'rtl' } } } })
    const wrapper = await mountSuspended(ScrollArea)
    try {
      const root = wrapper.getComponent(ScrollAreaRoot)
      expect(root.props()).toMatchObject({ type: 'always', scrollHideDelay: 100, dir: 'rtl' })

      await wrapper.setProps({ type: 'scroll', scrollHideDelay: 0, dir: 'ltr' })
      expect(root.props()).toMatchObject({ type: 'scroll', scrollHideDelay: 0, dir: 'ltr' })
    }
    finally {
      wrapper.unmount()
      updateAppConfig({ selaras: { defaults: { scrollArea: { type: 'hover', scrollHideDelay: 600, dir: undefined } } } })
    }
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
