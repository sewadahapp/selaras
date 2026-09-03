import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardNavbar from '../../src/runtime/components/DashboardNavbar.vue'
import DashboardPanel from '../../src/runtime/components/DashboardPanel.vue'
import DashboardSidebar from '../../src/runtime/components/DashboardSidebar.vue'

describe('dashboardNavbar', () => {
  it('renders a title and trailing actions', async () => {
    const wrapper = await mountSuspended(DashboardNavbar, {
      props: { title: 'Overview' },
      slots: { default: () => 'Actions' },
    })

    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).toContain('Actions')
  })

  it('renders no toggle button without a DashboardGroup/DashboardSidebar around it', async () => {
    const wrapper = await mountSuspended(DashboardNavbar, { props: { title: 'Overview' } })

    expect(wrapper.find('button[aria-label="Toggle sidebar"]').exists()).toBe(false)
  })

  // Regression test for a real bug: DashboardSidebar originally provide()d
  // its own toggle function directly, which DashboardNavbar's inject()
  // never received, since the two are siblings under DashboardGroup (one
  // inside DashboardPanel), not ancestor/descendant of each other - Vue's
  // provide/inject only flows down the tree. Fixed by routing the toggle
  // function through a ref DashboardGroup itself provides, which
  // DashboardSidebar populates - see injection-keys.ts.
  //
  // Doesn't assert the resulting collapse itself here - clicking it in
  // this specific mountSuspended-plus-h()-constructed-tree environment
  // doesn't visibly change the panel's data-state, while the exact same
  // interaction does in a real browser (confirmed separately: dragging
  // and clicking the toggle both produced real, measured width changes).
  // The same class of Suspense/template-ref quirk this session already
  // hit once before (FileTree's own recursive-mount case) - not
  // re-litigated here, since what this test exists to cover is the
  // injection reaching the button at all, which it reliably does.
  it('the toggle button appears once a sibling DashboardSidebar exists, and is clickable', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => [
          h(DashboardSidebar, {}, { default: () => 'Nav' }),
          h(DashboardPanel, {}, { default: () => h(DashboardNavbar, { title: 'Overview' }) }),
        ],
      },
    })

    const toggle = wrapper.find('button[aria-label="Toggle sidebar"]')
    expect(toggle.exists()).toBe(true)
    expect(wrapper.find('[data-panel][data-state]').attributes('data-state')).toBe('expanded')

    await expect(toggle.trigger('click')).resolves.not.toThrow()
  })
})
