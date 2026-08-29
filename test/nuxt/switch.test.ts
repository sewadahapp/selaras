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

  it('scales track height per size', async () => {
    const sm = await mountSuspended(Switch, { props: { size: 'sm' } })
    const lg = await mountSuspended(Switch, { props: { size: 'lg' } })
    expect(sm.find('button').classes()).toContain('h-3.5')
    expect(lg.find('button').classes()).toContain('h-5.5')
  })

  it('applies the color prop to the checked-state track/thumb classes', async () => {
    const wrapper = await mountSuspended(Switch, { props: { color: 'danger' } })
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('data-[state=checked]:bg-[var(--ui-danger)]')
  })

  it('renders a spinning loading icon in the thumb when loading is set', async () => {
    const wrapper = await mountSuspended(Switch, { props: { loading: true } })
    const icon = wrapper.find('.iconify')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('animate-spin')
  })

  it('renders checkedIcon/uncheckedIcon based on modelValue', async () => {
    const on = await mountSuspended(Switch, {
      props: { modelValue: true, checkedIcon: 'ph:check', uncheckedIcon: 'ph:x' },
    })
    expect(on.find('.iconify').classes()).toContain('i-ph:check')

    const off = await mountSuspended(Switch, {
      props: { modelValue: false, checkedIcon: 'ph:check', uncheckedIcon: 'ph:x' },
    })
    expect(off.find('.iconify').classes()).toContain('i-ph:x')
  })

  it('renders description as a second, muted line under the label', async () => {
    const wrapper = await mountSuspended(Switch, {
      props: { label: 'Marketing emails', description: 'Occasional updates.' },
    })
    expect(wrapper.text()).toContain('Marketing emails')
    expect(wrapper.text()).toContain('Occasional updates.')
  })

  it('forwards required onto the underlying control', async () => {
    const wrapper = await mountSuspended(Switch, { props: { required: true } })
    expect(wrapper.find('button').attributes('aria-required')).toBe('true')
  })
})
