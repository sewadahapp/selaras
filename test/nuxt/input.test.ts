import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Input from '../../src/runtime/components/Input.vue'

describe('input', () => {
  it('renders the leading and trailing icons when given', async () => {
    const wrapper = await mountSuspended(Input, { props: { icon: 'lucide:search', trailingIcon: 'lucide:mic' } })
    const icons = wrapper.findAll('.iconify').map(el => el.classes().find(c => c.startsWith('i-')))
    expect(icons).toEqual(['i-lucide:search', 'i-lucide:mic'])
  })

  it('does not render a clear button without clearable', async () => {
    const wrapper = await mountSuspended(Input, { props: { modelValue: 'hello' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('does not render a clear button when clearable but empty', async () => {
    const wrapper = await mountSuspended(Input, { props: { clearable: true, modelValue: '' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('clears the value and emits an empty string when clicked', async () => {
    const wrapper = await mountSuspended(Input, { props: { clearable: true, modelValue: 'hello' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('takes over the trailing slot from trailingIcon while there is a value to clear', async () => {
    const wrapper = await mountSuspended(Input, { props: { clearable: true, trailingIcon: 'lucide:mic', modelValue: 'hello' } })
    const icons = wrapper.findAll('.iconify').map(el => el.classes().find(c => c.startsWith('i-')))
    expect(icons).toEqual(['i-lucide:x'])
  })

  it('hides the clear button while disabled even with a value', async () => {
    const wrapper = await mountSuspended(Input, { props: { clearable: true, disabled: true, modelValue: 'hello' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
