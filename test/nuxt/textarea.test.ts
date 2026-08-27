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
})
