import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import FormField from '../../src/runtime/components/FormField.vue'
import TransferListComponent from '../../src/runtime/components/TransferList.vue'

const TransferList = TransferListComponent as Component
const wrappers: { unmount: () => void }[] = []
async function mount(...args: Parameters<typeof mountSuspended>) {
  const wrapper = await mountSuspended(...args)
  wrappers.push(wrapper)
  return wrapper as VueWrapper<any>
}
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))
const items = [{ label: 'One', value: 1 }, { label: 'Two', value: 2 }, { label: 'Locked', value: 3, disabled: true }]

describe('transfer list', () => {
  it('partitions the collection by destination values and names both panels', async () => {
    const wrapper = await mount(TransferList, { props: { items, defaultValue: [2], sourceLabel: 'Available users', targetLabel: 'Team' } })
    const lists = wrapper.findAll('[role=listbox]')
    expect(lists[0]!.attributes('aria-label')).toBe('Available users')
    expect(lists[1]!.attributes('aria-label')).toBe('Team')
    expect(lists[0]!.text()).toContain('One')
    expect(lists[0]!.text()).not.toContain('Two')
    expect(lists[1]!.text()).toBe('Two')
  })

  it('checks without assigning, then transfers in both directions without mutating items', async () => {
    const wrapper = await mount(TransferList, { props: { items, defaultValue: [2] } })
    await wrapper.findAll('[role=listbox]')[0]!.find('[role=option]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('update:checked')?.at(-1)).toEqual([[1]])
    await wrapper.findAll('button').find(button => button.attributes('aria-label') === 'Add selected')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[2, 1]])
    expect(wrapper.emitted('transfer')?.at(-1)).toEqual([{ direction: 'to-target', items: [items[0]], values: [1] }])
    expect(wrapper.find('[role=status]').text()).toBe('1 item moved to Assigned')
    expect(wrapper.findAll('[role=listbox]')[1]!.findAll('[role=option]').map(option => option.text())).toEqual(['One', 'Two'])
    await wrapper.findAll('[role=listbox]')[1]!.find('[role=option]').trigger('click')
    await wrapper.findAll('button').find(button => button.attributes('aria-label') === 'Remove selected')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[2]])
    expect(wrapper.emitted('transfer')?.at(-1)?.[0]).toMatchObject({ direction: 'to-source', values: [1] })
    expect(items.map(item => item.value)).toEqual([1, 2, 3])
  })

  it('preserves numeric and string identities and unresolved destination values', async () => {
    const wrapper = await mount(TransferList, { props: { items: [0, '0'], defaultValue: [0, 99] } })
    await wrapper.findAll('[role=listbox]')[0]!.find('[role=option]').trigger('click')
    await wrapper.findAll('button').find(button => button.attributes('aria-label') === 'Add selected')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[0, 99, '0']])
    await wrapper.setProps({ items: [0, '0', 99] })
    expect(wrapper.findAll('[role=listbox]')[1]!.findAll('[role=option]')).toHaveLength(3)
  })

  it('does not change destination membership when a controlled parent rejects a transfer', async () => {
    const wrapper = await mount(TransferList, { props: { items: ['a', 'b'], modelValue: undefined } })
    await wrapper.find('[role=option]').trigger('click')
    await wrapper.findAll('button').find(button => button.attributes('aria-label') === 'Add selected')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a']])
    expect(wrapper.findAll('[role=listbox]')[0]!.findAll('[role=option]')).toHaveLength(2)
    expect(wrapper.findAll('[role=listbox]')[1]!.findAll('[role=option]')).toHaveLength(0)
    expect(wrapper.find('[role=status]').text()).toBe('')
  })

  it('keeps checked rows controlled independently of destination membership', async () => {
    const wrapper = await mount(TransferList, { props: { items: ['a', 'b'], checked: [] } })
    await wrapper.find('[role=option]').trigger('click')
    expect(wrapper.emitted('update:checked')?.at(-1)).toEqual([['a']])
    expect(wrapper.findAll('[aria-selected=true]')).toHaveLength(0)
    await wrapper.setProps({ checked: ['b'] })
    expect(wrapper.findAll('[aria-selected=true]')).toHaveLength(1)
  })

  it('excludes disabled rows from bulk checking and transfer even when externally checked', async () => {
    const wrapper = await mount(TransferList, { props: { items, checked: [1, 3] } })
    await wrapper.findAll('button').find(button => button.attributes('aria-label') === 'Add selected')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[1]])
    expect(wrapper.emitted('update:checked')?.at(-1)).toEqual([[3]])
    await wrapper.setProps({ disabled: true })
    expect(wrapper.findAll('button').filter(button => button.attributes('aria-label')?.includes('selected')).every(button => button.attributes('disabled') !== undefined)).toBe(true)
  })

  it('filters panels independently and selects all only within each filtered panel', async () => {
    const wrapper = await mount(TransferList, { props: { items: ['Apple', 'Apricot', 'Berry'], defaultValue: ['Berry'], searchable: true } })
    const searches = wrapper.findAll('input[role=combobox]')
    await searches[0]!.setValue('Apple')
    await searches[1]!.setValue('Missing')
    expect(wrapper.findAll('[role=listbox]')[0]!.findAll('[role=option]')).toHaveLength(1)
    expect(wrapper.findAll('[role=listbox]')[1]!.text()).toBe('No results found')
    await wrapper.findAll('button[role=checkbox]')[0]!.trigger('click')
    expect(wrapper.emitted('update:checked')?.at(-1)).toEqual([['Apple']])
    expect(wrapper.emitted('update:sourceSearchTerm')?.at(-1)).toEqual(['Apple'])
    expect(wrapper.emitted('update:targetSearchTerm')?.at(-1)).toEqual(['Missing'])
  })

  it('supports whole objects, custom keys, groups, and raw item slot metadata', async () => {
    const row = { id: 7, title: 'Seven' }
    const whole = await mount(TransferList, { props: { items: [row], labelKey: 'title' } })
    await whole.find('[role=option]').trigger('click')
    await whole.findAll('button').find(button => button.attributes('aria-label') === 'Add selected')!.trigger('click')
    expect(whole.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([row])
    const keyed = await mount(TransferList, { props: { items: [{ label: 'Group', items: [row] }], valueKey: 'id', defaultValue: [7] }, slots: { item: ({ item, side }: any) => `${item.title}:${side}` } })
    expect(keyed.findAll('[role=listbox]')[1]!.text()).toContain('Seven:target')
    expect(keyed.findAll('[role=listbox]')[1]!.text()).toContain('Group')
  })

  it('submits destination values once, not checked panel values, and resets all internal state', async () => {
    const wrapper = await mount(defineComponent({ render: () => h('form', {}, h(FormField, { id: 'assignment', name: 'members', label: 'Members' }, { default: () => h(TransferList, { items: [0, 1], defaultValue: [0], searchable: true }) })) }), { attachTo: document.body })
    await wrapper.findAll('[role=listbox]')[0]!.find('[role=option]').trigger('click')
    const form = wrapper.find('form').element as HTMLFormElement
    expect(new FormData(form).getAll('members')).toEqual(['0'])
    await wrapper.findAll('button').find(button => button.attributes('aria-label') === 'Add selected')!.trigger('click')
    expect(new FormData(form).getAll('members')).toEqual(['0', '1'])
    await wrapper.findAll('input[role=combobox]')[0]!.setValue('missing')
    form.dispatchEvent(new Event('reset', { cancelable: true }))
    await nextTick()
    await nextTick()
    expect(new FormData(form).getAll('members')).toEqual(['0'])
    expect(wrapper.findAll('[aria-selected=true]')).toHaveLength(0)
    expect(wrapper.findAll('input[role=combobox]')[0]!.element).toHaveProperty('value', '')
  })
})
