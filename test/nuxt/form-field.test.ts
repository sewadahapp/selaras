import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import FormField from '../../src/runtime/components/FormField.vue'
import Input from '../../src/runtime/components/Input.vue'

describe('formField', () => {
  it('renders no error paragraph and no aria-describedby when neither error nor hint is set', async () => {
    const wrapper = await mountSuspended(FormField, {
      slots: { default: () => h(Input) },
    })
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()
  })

  it('renders an error paragraph and wires aria-describedby/aria-invalid to it when error is a string', async () => {
    const wrapper = await mountSuspended(FormField, {
      props: { error: 'Required' },
      slots: { default: () => h(Input) },
    })
    const error = wrapper.find('[role="alert"]')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Required')

    const input = wrapper.find('input')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
    expect(input.attributes('aria-invalid')).toBe('true')
  })

  it('marks invalid but renders no error paragraph when error is boolean true with no message - an easy-to-regress edge case', async () => {
    const wrapper = await mountSuspended(FormField, {
      props: { error: true, hint: 'Must be at least 8 characters' },
      slots: { default: () => h(Input) },
    })
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)

    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')

    // falls through to the hint, since there's no error message to point at
    const hint = wrapper.find('p')
    expect(hint.text()).toBe('Must be at least 8 characters')
    expect(input.attributes('aria-describedby')).toBe(hint.attributes('id'))
  })

  it('wires aria-describedby to the hint when only a hint is set', async () => {
    const wrapper = await mountSuspended(FormField, {
      props: { hint: 'Optional' },
      slots: { default: () => h(Input) },
    })
    const hint = wrapper.find('p')
    expect(hint.text()).toBe('Optional')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe(hint.attributes('id'))
  })

  it('gives the label\'s for attribute and the input the same generated id', async () => {
    const wrapper = await mountSuspended(FormField, {
      props: { label: 'Email' },
      slots: { default: () => h(Input) },
    })
    const label = wrapper.find('label')
    const input = wrapper.find('input')
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('updates a descendant\'s invalid/describedby reactively when error changes', async () => {
    const wrapper = await mountSuspended(FormField, {
      props: { error: false, hint: 'Optional' },
      slots: { default: () => h(Input) },
    })
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()

    await wrapper.setProps({ error: 'Now invalid' })

    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('[role="alert"]').text()).toBe('Now invalid')
  })
})
