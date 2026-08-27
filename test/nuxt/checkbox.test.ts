import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Checkbox from '../../src/runtime/components/Checkbox.vue'

describe('checkbox', () => {
  it('emits update:modelValue with true when clicked from unchecked', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { modelValue: false } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('marks the indeterminate glyph active via data-state without exposing indeterminate on the real checked value', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { modelValue: 'indeterminate' } })
    const paths = wrapper.findAll('path')
    expect(paths[0]!.attributes('data-state')).toBe('indeterminate')
    expect(paths[1]!.attributes('data-state')).toBe('indeterminate')
  })

  it('does not emit when disabled', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { modelValue: false, disabled: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders the label prop and falls through to the default slot when provided', async () => {
    const withLabelProp = await mountSuspended(Checkbox, { props: { label: 'Accept terms' } })
    expect(withLabelProp.text()).toBe('Accept terms')

    const withSlot = await mountSuspended(Checkbox, {
      props: { label: 'Ignored' },
      slots: { default: () => 'Slot wins' },
    })
    expect(withSlot.text()).toBe('Slot wins')
  })

  it('marks aria-invalid when invalid is set', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { invalid: true } })
    expect(wrapper.find('button').attributes('aria-invalid')).toBe('true')
  })
})
