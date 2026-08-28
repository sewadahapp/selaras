import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import FormField from '../../src/runtime/components/FormField.vue'
import InputNumber from '../../src/runtime/components/InputNumber.vue'

function buttons(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  const all = wrapper.findAll('button')
  return { decrement: all[0], increment: all[1] }
}

describe('inputNumber', () => {
  it('renders the current value in the input', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 5 } })
    expect(wrapper.find('input').element.value).toBe('5')
  })

  it('increments and decrements by step on button click', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 5, step: 2 } })
    const { decrement, increment } = buttons(wrapper)

    await increment.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([7])

    await decrement.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3])
  })

  it('clamps at min/max and disables the button at the boundary', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 9, min: 0, max: 10 } })
    const { increment } = buttons(wrapper)

    await increment.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])

    // Clicking only emits - re-feed the value back in, same as a real
    // v-model consumer would, before checking the boundary disables.
    await wrapper.setProps({ modelValue: 10 })
    expect(buttons(wrapper).increment.attributes('disabled')).toBeDefined()

    await wrapper.setProps({ modelValue: 0 })
    expect(buttons(wrapper).decrement.attributes('disabled')).toBeDefined()
  })

  it('commits a typed value on blur, clamped to min/max', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 5, min: 0, max: 10 } })
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.setValue('99')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])
  })

  it('commits an empty typed value as undefined', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 5 } })
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.setValue('')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
  })

  it('steps by step on ArrowUp/ArrowDown while focused', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 5, step: 5 } })
    const input = wrapper.find('input')

    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
  })

  it('formats the blurred display via formatOptions but shows the raw value while editing', async () => {
    const wrapper = await mountSuspended(InputNumber, {
      props: { modelValue: 5, formatOptions: { minimumIntegerDigits: 2 } },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('05')

    await input.trigger('focus')
    expect(input.element.value).toBe('5')
  })

  it('disables the input and both buttons when disabled', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 5, disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    const { decrement, increment } = buttons(wrapper)
    expect(decrement.attributes('disabled')).toBeDefined()
    expect(increment.attributes('disabled')).toBeDefined()
  })

  it('gives the increment/decrement buttons accessible names', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 5 } })
    const { decrement, increment } = buttons(wrapper)
    expect(decrement.attributes('aria-label')).toBe('Decrement')
    expect(increment.attributes('aria-label')).toBe('Increment')
  })

  it('orientation="vertical" renders a single compact up/down pair instead of two full-height buttons', async () => {
    const wrapper = await mountSuspended(InputNumber, { props: { modelValue: 5, orientation: 'vertical' } })
    const all = wrapper.findAll('button')
    expect(all).toHaveLength(2)

    // Order in the DOM is increment-then-decrement (stacked up/down), unlike
    // horizontal's decrement-then-increment (flanking left/right).
    expect(all[0]!.attributes('aria-label')).toBe('Increment')
    expect(all[1]!.attributes('aria-label')).toBe('Decrement')

    await all[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([6])
  })

  it('wires id/aria-describedby/aria-invalid through FormField', async () => {
    const wrapper = await mountSuspended(FormField, {
      props: { label: 'Quantity', error: 'Required' },
      slots: { default: () => h(InputNumber) },
    })
    const label = wrapper.find('label')
    const input = wrapper.find('input')
    const error = wrapper.find('[role="alert"]')

    expect(label.attributes('for')).toBe(input.attributes('id'))
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
  })
})
