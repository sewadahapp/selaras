import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import PinInput from '../../src/runtime/components/PinInput.vue'

// Focus/backspace-navigation assertions need a real document.activeElement,
// which requires the wrapper actually attached to document.body - see
// popover.test.ts for the same pattern. Each test unmounts its own wrapper
// so a later test's query can't match a previous test's stale node.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function attachedContainer() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return container
}

describe('pinInput', () => {
  it('renders 5 boxes by default', async () => {
    wrapper = await mountSuspended(PinInput)
    expect(wrapper.findAll('input[aria-label^="pin input"]')).toHaveLength(5)
  })

  it('renders `length` boxes', async () => {
    wrapper = await mountSuspended(PinInput, { props: { length: 4 } })
    expect(wrapper.findAll('input[aria-label^="pin input"]')).toHaveLength(4)
  })

  it('typing a character advances focus to the next box', async () => {
    wrapper = await mountSuspended(PinInput, { attachTo: attachedContainer() })
    const inputs = wrapper.findAll('input[aria-label^="pin input"]')

    await inputs[0]!.setValue('1')
    await nextTick()

    expect(document.activeElement).toBe(inputs[1]!.element)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['1']])
  })

  it('backspace on an empty box moves focus to and clears the previous one', async () => {
    wrapper = await mountSuspended(PinInput, { attachTo: attachedContainer() })
    const inputs = wrapper.findAll('input[aria-label^="pin input"]')

    // Typing into box 0 auto-advances focus to box 1, which is still
    // empty - backspace there should move focus back to box 0 and clear it.
    await inputs[0]!.setValue('1')
    await nextTick()
    await inputs[1]!.trigger('keydown', { key: 'Backspace' })
    await nextTick()

    expect(document.activeElement).toBe(inputs[0]!.element)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('pasting a multi-character value fills multiple boxes at once', async () => {
    wrapper = await mountSuspended(PinInput, { props: { length: 4 } })
    const inputs = wrapper.findAll('input[aria-label^="pin input"]')

    await inputs[0]!.trigger('paste', {
      clipboardData: { getData: () => '1234' },
    })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['1', '2', '3', '4']])
  })

  it('fires complete once every box has a value', async () => {
    wrapper = await mountSuspended(PinInput, { props: { length: 2 } })
    const inputs = wrapper.findAll('input[aria-label^="pin input"]')

    await inputs[0]!.setValue('1')
    await inputs[1]!.setValue('2')
    await nextTick()

    expect(wrapper.emitted('complete')?.at(-1)).toEqual([['1', '2']])
  })

  it('does not fire complete while a box is still empty', async () => {
    wrapper = await mountSuspended(PinInput, { props: { length: 2 } })
    const inputs = wrapper.findAll('input[aria-label^="pin input"]')

    await inputs[0]!.setValue('1')
    await nextTick()

    expect(wrapper.emitted('complete')).toBeUndefined()
  })

  it('renders password-type inputs when mask is set', async () => {
    wrapper = await mountSuspended(PinInput, { props: { mask: true } })
    expect(wrapper.find('input[aria-label^="pin input"]').attributes('type')).toBe('password')
  })

  it('sets autocomplete=one-time-code when otp is set', async () => {
    wrapper = await mountSuspended(PinInput, { props: { otp: true } })
    expect(wrapper.find('input[aria-label^="pin input"]').attributes('autocomplete')).toBe('one-time-code')
  })

  it('blocks input while disabled', async () => {
    wrapper = await mountSuspended(PinInput, { props: { disabled: true } })
    expect(wrapper.find('input[aria-label^="pin input"]').attributes('disabled')).toBeDefined()
  })

  it('merges a string :ui.input override with the theme classes', async () => {
    wrapper = await mountSuspended(PinInput, { props: { ui: { input: 'custom-class' } } })
    expect(wrapper.find('input[aria-label^="pin input"]').classes()).toContain('custom-class')
  })
})
