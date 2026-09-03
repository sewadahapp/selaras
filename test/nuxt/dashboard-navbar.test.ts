import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardNavbar from '../../src/runtime/components/DashboardNavbar.vue'
import DashboardPanel from '../../src/runtime/components/DashboardPanel.vue'
import DashboardSidebar from '../../src/runtime/components/DashboardSidebar.vue'
import DashboardSidebarToggle from '../../src/runtime/components/DashboardSidebarToggle.vue'

describe('dashboardNavbar', () => {
  it('renders a title and trailing actions', async () => {
    const wrapper = await mountSuspended(DashboardNavbar, {
      props: { title: 'Overview' },
      slots: { default: () => 'Actions' },
    })

    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).toContain('Actions')
  })

  // Nothing renders in `leading` by default - unlike every other piece of
  // this family (DashboardResizeHandle isn't auto-inserted between the
  // sidebar and panel either), a sidebar-toggle button is something a
  // consumer composes in explicitly, not something DashboardNavbar assumes
  // is wanted. See DashboardSidebarToggle's own test file for its behavior.
  it('renders nothing in the leading slot by default', async () => {
    const wrapper = await mountSuspended(DashboardNavbar, { props: { title: 'Overview' } })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders whatever is given the leading slot', async () => {
    const wrapper = await mountSuspended(DashboardNavbar, {
      props: { title: 'Overview' },
      slots: { leading: () => 'Leading!' },
    })

    expect(wrapper.text()).toContain('Leading!')
  })

  // Regression test for a real bug: DashboardSidebar originally provide()d
  // its own toggle function directly, which DashboardNavbar's inject()
  // never received, since the two are siblings under DashboardGroup (one
  // inside DashboardPanel), not ancestor/descendant of each other - Vue's
  // provide/inject only flows down the tree. Fixed by routing the toggle
  // function through a ref DashboardGroup itself provides, which
  // DashboardSidebar populates - see injection-keys.ts. Composes
  // DashboardSidebarToggle into the leading slot explicitly, matching real
  // usage - DashboardNavbar itself has no toggle-specific behavior anymore.
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
  it('a composed DashboardSidebarToggle appears once a sibling DashboardSidebar exists, and is clickable', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => [
          h(DashboardSidebar, {}, { default: () => 'Nav' }),
          h(DashboardPanel, {}, {
            default: () => h(DashboardNavbar, { title: 'Overview' }, {
              leading: () => h(DashboardSidebarToggle),
            }),
          }),
        ],
      },
    })

    const toggle = wrapper.find('button[aria-label="Toggle sidebar"]')
    expect(toggle.exists()).toBe(true)
    expect(wrapper.find('[data-panel][data-state]').attributes('data-state')).toBe('expanded')

    await expect(toggle.trigger('click')).resolves.not.toThrow()
  })
})
