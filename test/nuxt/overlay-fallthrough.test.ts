import { mountSuspended } from '@nuxt/test-utils/runtime'
import { TooltipProvider } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import AlertDialog from '../../src/runtime/components/AlertDialog.vue'
import ContextMenu from '../../src/runtime/components/ContextMenu.vue'
import Drawer from '../../src/runtime/components/Drawer.vue'
import Dropdown from '../../src/runtime/components/Dropdown.vue'
import Modal from '../../src/runtime/components/Modal.vue'
import Popover from '../../src/runtime/components/Popover.vue'
import Slideover from '../../src/runtime/components/Slideover.vue'
import Tooltip from '../../src/runtime/components/Tooltip.vue'

let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function withTooltipProvider(child: any) {
  return defineComponent({ render: () => h(TooltipProvider, null, { default: () => child }) })
}

describe('overlay class fallthrough', () => {
  it('routes dialog component classes to the visible panel', async () => {
    const cases = [
      { component: Modal, props: { open: true, title: 'Modal', description: 'Details' }, selector: '[role="dialog"]' },
      { component: Slideover, props: { open: true, title: 'Slideover', description: 'Details' }, selector: '[role="dialog"]' },
      { component: Drawer, props: { open: true, title: 'Drawer', description: 'Details' }, selector: '[role="dialog"]' },
      { component: AlertDialog, props: { open: true, title: 'Alert', description: 'Details' }, selector: '[role="alertdialog"]' },
    ]

    for (const [index, item] of cases.entries()) {
      wrapper = await mountSuspended(item.component, {
        attrs: { class: `panel-marker-${index}` },
        props: item.props,
      })
      expect(document.body.querySelector(item.selector)?.classList.contains(`panel-marker-${index}`)).toBe(true)
      wrapper.unmount()
      wrapper = undefined
    }
  })

  it('routes trigger-based overlay classes to the trigger element', async () => {
    const cases = [
      { component: Popover, props: {}, slots: { default: () => h('button', 'Popover trigger') } },
      { component: Dropdown, props: { items: [[{ label: 'Edit' }]] }, slots: { default: () => h('button', 'Dropdown trigger') } },
      { component: ContextMenu, props: { items: [[{ label: 'Edit' }]] }, slots: { default: () => h('button', 'Context menu trigger') } },
    ]

    for (const [index, item] of cases.entries()) {
      wrapper = await mountSuspended(item.component, {
        attrs: { class: `trigger-marker-${index}` },
        props: item.props,
        slots: item.slots,
      })
      expect(wrapper.find('button').classes()).toContain(`trigger-marker-${index}`)
      wrapper.unmount()
      wrapper = undefined
    }

    wrapper = await mountSuspended(withTooltipProvider(
      h(Tooltip, { text: 'Hint', class: 'trigger-marker-tooltip' }, { default: () => h('button', 'Tooltip trigger') }),
    ))
    expect(wrapper.find('button').classes()).toContain('trigger-marker-tooltip')
  })
})
