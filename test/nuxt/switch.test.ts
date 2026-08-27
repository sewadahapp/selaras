import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Switch from '../../src/runtime/components/Switch.vue'

describe('switch', () => {
  it('emits update:modelValue with the toggled value when clicked', async () => {
    const wrapper = await mountSuspended(Switch, { props: { modelValue: false } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('does not emit when disabled', async () => {
    const wrapper = await mountSuspended(Switch, { props: { modelValue: false, disabled: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders the label prop and falls through to the default slot when provided', async () => {
    const withLabelProp = await mountSuspended(Switch, { props: { label: 'Enable notifications' } })
    expect(withLabelProp.text()).toBe('Enable notifications')

    const withSlot = await mountSuspended(Switch, {
      props: { label: 'Ignored' },
      slots: { default: () => 'Slot wins' },
    })
    expect(withSlot.text()).toBe('Slot wins')
  })

  it('marks aria-invalid when invalid is set', async () => {
    const wrapper = await mountSuspended(Switch, { props: { invalid: true } })
    expect(wrapper.find('button').attributes('aria-invalid')).toBe('true')
  })

  it('reflects the checked state via data-state', async () => {
    const wrapper = await mountSuspended(Switch, { props: { modelValue: true } })
    expect(wrapper.find('button').attributes('data-state')).toBe('checked')
  })
})
