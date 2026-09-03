import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardSidebar from '../../src/runtime/components/DashboardSidebar.vue'

// DashboardSidebar's desktop branch is a real Reka SplitterPanel, which
// requires an actual SplitterGroup ancestor to inject its own context from
// (Reka throws otherwise) - mounted inside DashboardGroup here, the same
// requirement its own docs state ("must be a direct child of
// DashboardGroup").
describe('dashboardSidebar', () => {
  it('renders header/default/footer slots, desktop by default (no mobile match in this environment)', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => h(DashboardSidebar, {}, {
          header: () => 'Brand',
          default: () => 'Nav content',
          footer: () => 'User menu',
        }),
      },
    })

    expect(wrapper.text()).toContain('Brand')
    expect(wrapper.text()).toContain('Nav content')
    expect(wrapper.text()).toContain('User menu')
    expect(wrapper.find('[data-panel]').exists()).toBe(true)
  })

  it('omits the header/footer wrapper entirely when those slots are unset', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => h(DashboardSidebar, {}, { default: () => 'Nav content' }),
      },
    })

    // ScrollArea injects its own scrollbar-hiding <style> into the body it
    // wraps - real, harmless, unrelated to header/footer - so this checks
    // for their absence directly (via the theme's own border-b/border-t
    // classes, unique to the header/footer wrapper divs) rather than
    // asserting exact total text.
    expect(wrapper.text()).toContain('Nav content')
    expect(wrapper.find('.border-b').exists()).toBe(false)
    expect(wrapper.find('.border-t').exists()).toBe(false)
  })
})
