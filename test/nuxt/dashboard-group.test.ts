import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import Splitter from '../../src/runtime/components/Splitter.vue'

describe('dashboardGroup', () => {
  it('renders its default slot content', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: { default: () => 'Shell content' },
    })

    expect(wrapper.text()).toContain('Shell content')
  })

  it('renders a real splitter group by default (desktop, no matchMedia match in this environment)', async () => {
    const wrapper = await mountSuspended(DashboardGroup, { props: {} })

    expect(wrapper.find('[data-panel-group]').exists()).toBe(true)
  })

  it('keeps cookie-backed storage as the default', async () => {
    const wrapper = await mountSuspended(DashboardGroup, { props: {} })
    const storage = wrapper.findComponent(Splitter).props('storage')

    expect(storage).toEqual(expect.objectContaining({
      getItem: expect.any(Function),
      setItem: expect.any(Function),
    }))
  })

  it('passes caller-provided storage to the splitter', async () => {
    const storage = { getItem: () => null, setItem: () => {} }
    const wrapper = await mountSuspended(DashboardGroup, { props: { storage } })

    expect(wrapper.findComponent(Splitter).props('storage')).toBe(storage)
  })
})
