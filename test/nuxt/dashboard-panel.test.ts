import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardPanel from '../../src/runtime/components/DashboardPanel.vue'

// A real Reka SplitterPanel underneath, which requires an actual
// SplitterGroup ancestor - mounted inside DashboardGroup, matching
// DashboardPanel's own documented usage.
describe('dashboardPanel', () => {
  it('renders its default slot content as a real splitter panel (desktop by default)', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => h(DashboardPanel, {}, { default: () => 'Main content' }),
      },
    })

    expect(wrapper.text()).toContain('Main content')
    expect(wrapper.find('[data-panel]').exists()).toBe(true)
  })
})
