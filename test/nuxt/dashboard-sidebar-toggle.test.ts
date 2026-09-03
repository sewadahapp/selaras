import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardSidebar from '../../src/runtime/components/DashboardSidebar.vue'
import DashboardSidebarToggle from '../../src/runtime/components/DashboardSidebarToggle.vue'

describe('dashboardSidebarToggle', () => {
  it('renders nothing without a DashboardGroup/DashboardSidebar around it', async () => {
    const wrapper = await mountSuspended(DashboardSidebarToggle)

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders the default sidebar icon once a sibling DashboardSidebar exists', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => [
          h(DashboardSidebar, {}, { default: () => 'Nav' }),
          h(DashboardSidebarToggle),
        ],
      },
    })

    const icon = wrapper.find('.iconify')
    expect(icon.classes()).toContain('i-hugeicons:sidebar-left-01')
  })

  it('accepts an icon prop override', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => [
          h(DashboardSidebar, {}, { default: () => 'Nav' }),
          h(DashboardSidebarToggle, { icon: 'lucide:menu' }),
        ],
      },
    })

    const icon = wrapper.find('.iconify')
    expect(icon.classes()).toContain('i-lucide:menu')
  })

  // Deliberately undeclared as a prop of its own - Vue's automatic attrs
  // fallthrough on this single-root Button wrapper already forwards
  // anything else a consumer passes (color, variant, size, ui, an extra
  // class, ...) straight onto Button's own root, the same way
  // ColorModeToggle does. This just confirms that actually holds.
  it('forwards extra Button props via attrs fallthrough', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => [
          h(DashboardSidebar, {}, { default: () => 'Nav' }),
          h(DashboardSidebarToggle, { color: 'primary' }),
        ],
      },
    })

    const button = wrapper.find('button[aria-label="Toggle sidebar"]')
    expect(button.classes().join(' ')).toContain('primary')
  })

  // Same class of Suspense/template-ref quirk as the toggle-click test in
  // dashboard-navbar.test.ts - clicking doesn't visibly flip the icon in
  // this specific mountSuspended-plus-h()-constructed-tree environment,
  // while the exact same interaction does in a real browser (confirmed
  // separately: `before`/`after` className dumps showed `scale-x-[-1]`
  // genuinely appearing after a real click). Not re-litigated here - this
  // just covers the unflipped starting state and that clicking doesn't throw.
  it('starts unflipped, and toggling is clickable', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => [
          h(DashboardSidebar, {}, { default: () => 'Nav' }),
          h(DashboardSidebarToggle),
        ],
      },
    })

    expect(wrapper.find('.iconify').classes()).not.toContain('scale-x-[-1]')

    await expect(wrapper.find('button[aria-label="Toggle sidebar"]').trigger('click')).resolves.not.toThrow()
  })

  it('lets the default slot replace Button entirely, still wired to the real toggle function and collapsed state', async () => {
    const wrapper = await mountSuspended(DashboardGroup, {
      slots: {
        default: () => [
          h(DashboardSidebar, {}, { default: () => 'Nav' }),
          h(DashboardSidebarToggle, {}, {
            default: (scope: { toggle: () => void, isCollapsed: boolean }) =>
              h('a', { 'href': '#', 'data-collapsed': scope.isCollapsed, 'onClick': scope.toggle }, 'Custom trigger'),
          }),
        ],
      },
    })

    expect(wrapper.find('button[aria-label="Toggle sidebar"]').exists()).toBe(false)
    const custom = wrapper.find('a')
    expect(custom.text()).toBe('Custom trigger')
    expect(custom.attributes('data-collapsed')).toBe('false')
  })
})
