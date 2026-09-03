import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Splitter from '../../src/runtime/components/Splitter.vue'
import SplitterPanel from '../../src/runtime/components/SplitterPanel.vue'
import SplitterResizeHandle from '../../src/runtime/components/SplitterResizeHandle.vue'

describe('splitter', () => {
  it('renders every panel\'s own content', async () => {
    const wrapper = await mountSuspended(Splitter, {
      slots: {
        default: () => [
          h(SplitterPanel, {}, () => 'Panel one'),
          h(SplitterResizeHandle),
          h(SplitterPanel, {}, () => 'Panel two'),
        ],
      },
    })

    expect(wrapper.text()).toContain('Panel one')
    expect(wrapper.text()).toContain('Panel two')
  })

  it('merges a string :ui.root override with the theme classes', async () => {
    const wrapper = await mountSuspended(Splitter, { props: { ui: { root: 'custom-class' } } })

    expect(wrapper.classes()).toContain('custom-class')
  })
})

describe('splitterPanel', () => {
  // collapse()/expand() are exposed via defineExpose() for a real parent
  // template ref to call - DashboardSidebar's own toggle button does
  // exactly this, verified end to end in a real browser (drag-resize and
  // collapse/expand both produced real, correct width changes). VTU's
  // findComponent().vm doesn't surface a defineExpose()'d method the same
  // way a genuine template ref does, so that specific call path isn't
  // re-verified here - this covers the plain prop-driven rendering
  // instead.
  it('a collapsible panel starts expanded', async () => {
    const wrapper = await mountSuspended(Splitter, {
      slots: {
        default: () => [
          h(SplitterPanel, { collapsible: true, collapsedSize: 0, minSize: 10 }, () => 'Content'),
        ],
      },
    })

    expect(wrapper.find('[data-panel]').attributes('data-state')).toBe('expanded')
  })

  it('a non-collapsible panel renders no data-state at all', async () => {
    const wrapper = await mountSuspended(Splitter, {
      slots: {
        default: () => [
          h(SplitterPanel, { minSize: 10 }, () => 'Content'),
        ],
      },
    })

    expect(wrapper.find('[data-panel]').attributes('data-state')).toBeUndefined()
  })
})
