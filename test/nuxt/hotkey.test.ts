import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'
import { vHotkey } from '../../src/runtime/directives/hotkey'

let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function press(key: string, init: KeyboardEventInit = {}, target: EventTarget = document) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }))
}

describe('v-hotkey', () => {
  it('clicks the bound element for a matching mod chord', async () => {
    const clicked = vi.fn()
    wrapper = await mountSuspended(defineComponent({
      setup: () => () => withDirectives(h('button', { onClick: clicked }, 'Open'), [[vHotkey, 'mod+k']]),
    }))

    press('k', { ctrlKey: true })
    expect(clicked).toHaveBeenCalledOnce()
  })

  it('uses the supplied handler and prevents the browser default', async () => {
    const handler = vi.fn()
    wrapper = await mountSuspended(defineComponent({
      setup: () => () => withDirectives(h('button', 'Save'), [[vHotkey, { keys: 'mod+s', handler }]]),
    }))

    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true, cancelable: true })
    document.dispatchEvent(event)
    expect(handler).toHaveBeenCalledOnce()
    expect(event.defaultPrevented).toBe(true)
  })

  it('does not fire a bare printable key unless the bound element is focused', async () => {
    const clicked = vi.fn()
    wrapper = await mountSuspended(defineComponent({
      setup: () => () => withDirectives(h('button', { onClick: clicked }, 'Run'), [[vHotkey, 'k']]),
    }))

    press('k')
    expect(clicked).not.toHaveBeenCalled()
    const button = wrapper.find('button').element as HTMLButtonElement
    document.body.append(button)
    button.focus()
    expect(document.activeElement).toBe(button)
    press('k', {}, button)
    expect(clicked).toHaveBeenCalledOnce()
    button.remove()
  })

  it('ignores editable targets by default', async () => {
    const handler = vi.fn()
    wrapper = await mountSuspended(defineComponent({
      setup: () => () => h('div', [
        withDirectives(h('button', 'Save'), [[vHotkey, { keys: 'mod+s', handler }]]),
        h('input', { 'data-testid': 'input' }),
      ]),
    }))

    ;(wrapper.find('input').element as HTMLInputElement).focus()
    press('s', { ctrlKey: true }, wrapper.find('input').element)
    expect(handler).not.toHaveBeenCalled()
  })

  it('obeys a live when condition and removes its listener on unmount', async () => {
    const active = ref(false)
    const handler = vi.fn()
    wrapper = await mountSuspended(defineComponent({
      setup: () => () => withDirectives(h('button', 'Save'), [[vHotkey, { keys: 'mod+s', handler, when: () => active.value }]]),
    }))

    press('s', { ctrlKey: true })
    expect(handler).not.toHaveBeenCalled()
    active.value = true
    await wrapper.vm.$nextTick()
    press('s', { ctrlKey: true })
    expect(handler).toHaveBeenCalledOnce()
    wrapper.unmount()
    wrapper = undefined
    press('s', { ctrlKey: true })
    expect(handler).toHaveBeenCalledOnce()
  })
})
