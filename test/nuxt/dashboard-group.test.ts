import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'

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
})
