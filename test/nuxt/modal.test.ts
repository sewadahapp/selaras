import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import Modal from '../../src/runtime/components/Modal.vue'

function macrotask() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

// DialogContent renders through a real Teleport to document.body (not
// stubbed in this test environment), so its content is invisible to
// `wrapper.find`/`findAll` - query document.body directly instead. Nothing
// auto-unmounts a teleported node between tests here, so each test unmounts
// its own wrapper - otherwise a later test's document.body query can match
// a previous test's stale, already-torn-down button.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('modal', () => {
  it('renders the close button as a real, focusable button with an accessible label', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeTruthy()
    expect(closeButton!.tagName).toBe('BUTTON')
  })

  it('closing via the close button emits update:modelValue with false', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item' } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!
    closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()
    await macrotask()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('forwards escapeKeyDown so a consumer can preventDefault it', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item' } })

    const dialog = document.body.querySelector('[role=dialog]')!
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('escapeKeyDown')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toBeInstanceOf(Event)
  })

  it('applies the full-viewport layout instead of the centered card when fullscreen is set', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item', fullscreen: true } })

    const dialog = document.body.querySelector('[role=dialog]')!
    expect(dialog.className).toContain('rounded-none')
    expect(dialog.className).not.toContain('max-w-md')
  })

  it('renders no close button when close is false', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Delete item', close: false } })

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeFalsy()
  })

  it('still emits escapeKeyDown when dismissible is false, but does not close', async () => {
    wrapper = await mountSuspended(Modal, { props: { modelValue: true, title: 'Confirm', dismissible: false } })

    const dialog = document.body.querySelector('[role=dialog]')!
    // cancelable: true matters here - a real browser keydown is cancelable
    // by default, but the synthetic KeyboardEvent above (deliberately not
    // cancelable, since that test never calls preventDefault) is not. A
    // preventDefault() call on a non-cancelable event is a silent no-op per
    // spec, which would make this test pass for the wrong reason.
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('escapeKeyDown')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
