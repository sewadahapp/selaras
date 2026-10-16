import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Checkbox from '../../src/runtime/components/Checkbox.vue'
import FormField from '../../src/runtime/components/FormField.vue'

describe('checkbox', () => {
  it('renders a controlled decorative indicator without inheriting field semantics or submitting values', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, h(FormField, { id: 'choice', name: 'choice', label: 'Choice', error: 'Required', size: 'lg' }, () =>
        h(Checkbox, { decorative: true, modelValue: true, color: 'success', size: 'sm' }))),
    }))
    const checkbox = wrapper.findComponent(Checkbox)
    expect(checkbox.element.tagName).toBe('SPAN')
    expect(checkbox.attributes('aria-hidden')).toBe('true')
    expect(checkbox.attributes('data-selaras-color')).toBe('success')
    expect(checkbox.find('[data-state=checked]').classes()).toContain('size-3.5')
    expect(checkbox.find('path').attributes('data-state')).toBe('checked')
    expect(checkbox.find('button, input, label, [role=checkbox], [tabindex], #choice, [aria-invalid], [aria-describedby]').exists()).toBe(false)
    await checkbox.find('[data-state=checked]').trigger('click')
    expect(checkbox.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('updates decorative checked and indeterminate visuals from its model', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { decorative: true, modelValue: false } })
    expect(wrapper.find('[data-state=unchecked]').exists()).toBe(true)
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.findAll('path').every(path => path.attributes('data-state') === 'checked')).toBe(true)
    await wrapper.setProps({ modelValue: 'indeterminate' })
    expect(wrapper.find('[data-state=indeterminate]').exists()).toBe(true)
    expect(wrapper.findAll('path').every(path => path.attributes('data-state') === 'indeterminate')).toBe(true)
    wrapper.unmount()
  })

  it('binds a custom semantic role to the label bridge', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { color: 'premium' } })
    expect(wrapper.attributes('data-selaras-color')).toBe('premium')
    expect(wrapper.attributes('style') ?? '').not.toContain('--_selaras-color-fill')
    expect(wrapper.find('button').attributes('class')).toContain('data-[state=checked]:bg-[var(--_selaras-color-fill)]')
  })

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
    expect(classes).toContain('data-[state=checked]:bg-[var(--_selaras-color-fill)]')
  })

  it('uses functional neutral tokens until the box is checked', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { color: 'danger' } })
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('ring-[var(--selaras-resolved-border-default)]')
    expect(classes).toContain('before:bg-[var(--selaras-resolved-border-hover)]')
    expect(classes).not.toContain('ring-[var(--_selaras-color-border)]')
  })

  it('invalid wins over a custom color for the checked-state ring, not the other way around', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { invalid: true, color: 'success', modelValue: true } })
    const classes = wrapper.find('button').classes().join(' ')
    expect(classes).toContain('data-[state=checked]:ring-[var(--_selaras-color-border)]')
    expect(classes).not.toContain('data-[state=checked]:ring-[var(--selaras-resolved-color-success-fill)]')
  })

  it('renders description as a second, muted line under the label', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: { label: 'Accept terms', description: 'Read the fine print.' },
    })
    expect(wrapper.text()).toContain('Accept terms')
    expect(wrapper.text()).toContain('Read the fine print.')

    // block, not the default inline span - otherwise it sits beside the
    // label instead of wrapping onto its own line underneath it.
    const description = Array.from(wrapper.findAll('span')).find(el => el.text() === 'Read the fine print.')
    expect(description?.classes()).toContain('block')
  })

  it('forwards required onto the underlying control', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { required: true } })
    expect(wrapper.find('button').attributes('aria-required')).toBe('true')
  })

  it('wraps in a bordered box that highlights when checked, with variant="card"', async () => {
    const wrapper = await mountSuspended(Checkbox, { props: { variant: 'card', modelValue: true } })
    const classes = wrapper.find('label').classes().join(' ')
    expect(classes).toContain('border')
    expect(classes).toContain('has-[[data-state=checked]]:border-[var(--_selaras-color-fill)]')
  })
})
