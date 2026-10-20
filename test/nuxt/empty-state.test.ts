import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import EmptyState from '../../src/runtime/components/EmptyState.vue'
import Theme from '../../src/runtime/components/Theme.vue'

describe('empty state', () => {
  it('renders provided copy without imposing live-region or heading semantics', async () => {
    const wrapper = await mountSuspended(EmptyState, { props: { title: 'No projects', description: 'Create your first project.' } })
    expect(wrapper.text()).toContain('No projects')
    expect(wrapper.text()).toContain('Create your first project.')
    expect(wrapper.find('[role], [aria-live], h1, h2, h3, button, .iconify').exists()).toBe(false)
    wrapper.unmount()
  })

  it('allows heading markup, rich descriptions, additional content, and actionable slots', async () => {
    const wrapper = await mountSuspended(EmptyState, {
      props: { title: 'Fallback title', description: 'Fallback description' },
      slots: {
        title: () => h('h2', { id: 'empty-title' }, 'No results'),
        description: () => h('p', 'Try a different query.'),
        default: () => h('p', 'Search includes archived projects.'),
        actions: () => h('button', { type: 'button' }, 'Clear filters'),
      },
      attrs: { 'role': 'region', 'aria-labelledby': 'empty-title' },
    })
    expect(wrapper.get('h2').text()).toBe('No results')
    expect(wrapper.text()).not.toContain('Fallback')
    expect(wrapper.get('button').text()).toBe('Clear filters')
    expect(wrapper.text()).toContain('Search includes archived projects.')
    expect(wrapper.attributes('aria-labelledby')).toBe('empty-title')
    wrapper.unmount()
  })

  it('hides decorative icons and lets a custom illustration replace the icon prop', async () => {
    const wrapper = await mountSuspended(EmptyState, {
      props: { icon: 'hugeicons:folder-01' },
      slots: { icon: () => h('svg', { 'data-illustration': '', 'viewBox': '0 0 24 24' }) },
    })
    expect(wrapper.find('.iconify').exists()).toBe(false)
    expect(wrapper.get('[data-illustration]').element.parentElement!.getAttribute('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('omits unused wrappers and supports an action-only state', async () => {
    const empty = await mountSuspended(EmptyState)
    expect(empty.element.children).toHaveLength(0)
    empty.unmount()
    const actions = await mountSuspended(EmptyState, { slots: { actions: () => h('button', 'Create') } })
    expect(actions.element.children).toHaveLength(1)
    expect(actions.get('button').text()).toBe('Create')
    actions.unmount()
  })

  it('merges scoped recipes with instance slot classes and attributes', async () => {
    const wrapper = await mountSuspended(defineComponent({
      setup: () => () => h(Theme, { ui: { emptyState: { slots: { root: 'py-6', title: 'font-medium' } } } }, () => h(EmptyState, {
        title: 'No projects',
        ui: { root: { 'class': 'py-4', 'data-empty': '' }, title: 'font-bold' },
      })),
    }))
    const state = wrapper.get('[data-empty]')
    expect(state.classes()).toContain('py-4')
    expect(state.classes()).not.toContain('py-6')
    expect(state.classes()).not.toContain('py-12')
    expect(state.get('.font-bold').text()).toBe('No projects')
    wrapper.unmount()
  })
})
