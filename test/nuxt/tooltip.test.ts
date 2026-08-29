import { mountSuspended } from '@nuxt/test-utils/runtime'
import { TooltipProvider } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Tooltip from '../../src/runtime/components/Tooltip.vue'

let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

// Tooltip no longer wraps its own TooltipProvider (that moved to SApp, once,
// alongside ToastProvider - matching how ToastRoot already required
// ToastProvider). TooltipRoot now requires a shared provider ancestor, so
// every test here supplies one, the same way a real app's <SApp> would.
function withProvider(children: any) {
  return defineComponent({
    render: () => h(TooltipProvider, null, { default: () => children }),
  })
}

describe('tooltip', () => {
  it('renders its trigger content and opens the content on focus, given a shared TooltipProvider', async () => {
    wrapper = await mountSuspended(withProvider(
      h(Tooltip, { text: 'Hello' }, { default: () => h('button', 'Hover me') }),
    ))

    expect(wrapper.text()).toContain('Hover me')

    // TooltipContent renders through a real Teleport to document.body (not
    // stubbed in this test environment) - invisible to wrapper.text().
    await wrapper.find('button').trigger('focus')
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(document.body.textContent).toContain('Hello')
  })

  it('renders a kbd badge per entry in kbds', async () => {
    wrapper = await mountSuspended(withProvider(
      h(Tooltip, { text: 'Save', kbds: ['⌘', 'S'] }, { default: () => h('button', 'Save') }),
    ))

    await wrapper.find('button').trigger('focus')
    await new Promise(resolve => setTimeout(resolve, 250))

    const kbds = document.body.querySelectorAll('kbd')
    expect(Array.from(kbds).map(el => el.textContent)).toEqual(['⌘', 'S'])
  })

  it('renders no kbd badges when kbds is unset', async () => {
    wrapper = await mountSuspended(withProvider(
      h(Tooltip, { text: 'Hello' }, { default: () => h('button', 'Hover me') }),
    ))

    await wrapper.find('button').trigger('focus')
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(document.body.querySelectorAll('kbd').length).toBe(0)
  })

  it('renders no arrow when arrow is false', async () => {
    wrapper = await mountSuspended(withProvider(
      h(Tooltip, { text: 'Hello', arrow: false }, { default: () => h('button', 'Hover me') }),
    ))

    await wrapper.find('button').trigger('focus')
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(document.body.querySelector('svg')).toBeFalsy()
  })

  it('never opens when disabled', async () => {
    wrapper = await mountSuspended(withProvider(
      h(Tooltip, { text: 'Hello', disabled: true }, { default: () => h('button', 'Hover me') }),
    ))

    await wrapper.find('button').trigger('focus')
    await new Promise(resolve => setTimeout(resolve, 250))

    expect(document.body.textContent).not.toContain('Hello')
  })
})
