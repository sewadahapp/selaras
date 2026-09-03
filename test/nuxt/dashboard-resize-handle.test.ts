import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardResizeHandle from '../../src/runtime/components/DashboardResizeHandle.vue'

// A real Reka SplitterResizeHandle underneath, which requires an actual
// SplitterGroup ancestor - mounted inside DashboardGroup, matching
// DashboardResizeHandle's own documented usage.
describe('dashboardResizeHandle', () => {
  it('renders a real splitter resize handle by default (desktop, no mobile match in this environment)', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: { default: () => h(DashboardResizeHandle) },
    })

    expect(wrapper.find('[data-panel-resize-handle-id]').exists()).toBe(true)
  })
})
