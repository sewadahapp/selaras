import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Autocomplete from '../../src/runtime/components/Autocomplete.vue'

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

describe('autocomplete', () => {
  it('does not render a dropdown button by default', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems },
    })
    expect(wrapper.find('[aria-haspopup="listbox"]').exists()).toBe(false)
  })

  it('renders a dropdown button that opens the popover and blanks the current filter', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems, dropdown: true, searchTerm: 'xyz' },
    })

    const dropdownButton = wrapper.find('[aria-haspopup="listbox"]')
    expect(dropdownButton.exists()).toBe(true)
    expect(dropdownButton.attributes('aria-expanded')).toBe('false')

    await dropdownButton.trigger('click')

    expect(dropdownButton.attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual([''])
  })

  it('selects the highlighted option on the first Enter press, not the second', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems },
    })

    const input = wrapper.find('input')
    await input.setValue('app')
    await nextTick()
    await nextTick()

    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple'])
  })

  it('clears the selection when clearable and something is picked', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
  })

  it('commits unmatched typed text as a new value by default (no forceSelection)', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems },
    })

    const input = wrapper.find('input')
    await input.setValue('zzz')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['zzz'])
  })

  it('reverts unmatched typed text on blur instead of committing it when forceSelection is on', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems, forceSelection: true },
    })

    const input = wrapper.find('input')
    await input.setValue('zzz')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual([''])
  })
})
