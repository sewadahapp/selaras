import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Textarea from '../../src/runtime/components/Textarea.vue'

describe('textarea', () => {
  it('emits update:modelValue with the typed value', async () => {
    const wrapper = await mountSuspended(Textarea)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Hello world')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Hello world'])
  })

  it('defaults rows to 3 and honors an explicit override', async () => {
    const defaultRows = await mountSuspended(Textarea)
    expect(defaultRows.find('textarea').attributes('rows')).toBe('3')

    const customRows = await mountSuspended(Textarea, { props: { rows: 8 } })
    expect(customRows.find('textarea').attributes('rows')).toBe('8')
  })

  it('marks aria-invalid when invalid is set', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { invalid: true } })
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
  })

  it('disables the field when disabled is set', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { disabled: true } })
    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
  })

  it('renders the leading and trailing icons when given', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { icon: 'lucide:search', trailingIcon: 'lucide:mic' } })
    const icons = wrapper.findAll('.iconify').map(el => el.classes().find(c => c.startsWith('i-')))
    expect(icons).toEqual(['i-lucide:search', 'i-lucide:mic'])
  })

  it('does not render a clear button without clearable', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { modelValue: 'hello' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('does not render a clear button when clearable but empty', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { clearable: true, modelValue: '' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('clears the value and emits an empty string when clicked', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { clearable: true, modelValue: 'hello' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('takes over the trailing slot from trailingIcon while there is a value to clear', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { clearable: true, trailingIcon: 'lucide:mic', modelValue: 'hello' } })
    const icons = wrapper.findAll('.iconify').map(el => el.classes().find(c => c.startsWith('i-')))
    expect(icons).toEqual(['i-ph:x'])
  })

  it('hides the clear button while disabled even with a value', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { clearable: true, disabled: true, modelValue: 'hello' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('autoresize sets an inline height on mount', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { autoresize: true, modelValue: 'hello' } })
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.find('textarea').attributes('style')).toContain('height')
  })

  it('maxrows caps the inline height and switches on overflow-y', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { autoresize: true, maxrows: 2, modelValue: 'hello' } })
    await new Promise(resolve => setTimeout(resolve, 0))
    const style = wrapper.find('textarea').attributes('style')
    expect(style).toContain('height')
    expect(style).toMatch(/overflow-y/)
  })

  it('does not set any inline height when autoresize is unset', async () => {
    const wrapper = await mountSuspended(Textarea, { props: { modelValue: 'hello' } })
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.find('textarea').attributes('style')).toBeUndefined()
  })
})
