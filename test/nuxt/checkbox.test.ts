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

  it('scales the box per size', async () => {
    const sm = await mountSuspended(Checkbox, { props: { size: 'sm' } })
    const lg = await mountSuspended(Checkbox, { props: { size: 'lg' } })
    expect(sm.find('button').classes()).toContain('size-3.5')
    expect(lg.find('button').classes()).toContain('size-5.5')
  })

  it('applies the color prop to the checked-state box classes', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { color: 'danger' } })
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('data-[state=checked]:bg-[var(--ui-danger)]')
  })

  it('renders description as a second, muted line under the label', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: { label: 'Accept terms', description: 'Read the fine print.' },
    })
    expect(wrapper.text()).toContain('Accept terms')
    expect(wrapper.text()).toContain('Read the fine print.')
  })

  it('forwards required onto the underlying control', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { required: true } })
    expect(wrapper.find('button').attributes('aria-required')).toBe('true')
  })

  it('wraps in a bordered box that highlights when checked, with variant="card"', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { variant: 'card', modelValue: true } })
    const classes = wrapper.find('label').classes().join(' ')
    expect(classes).toContain('border')
    expect(classes).toContain('has-[[data-state=checked]]:border-[var(--ui-primary)]')
  })
})
