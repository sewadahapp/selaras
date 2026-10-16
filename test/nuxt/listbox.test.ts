import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Checkbox from '../../src/runtime/components/Checkbox.vue'
import FormField from '../../src/runtime/components/FormField.vue'
import ListboxComponent from '../../src/runtime/components/Listbox.vue'
import Theme from '../../src/runtime/components/Theme.vue'

const Listbox = ListboxComponent as Component
const wrappers: { unmount: () => void }[] = []
async function mount(...args: Parameters<typeof mountSuspended>) {
  const wrapper = await mountSuspended(...args)
  wrappers.push(wrapper)
  return wrapper as VueWrapper<any>
}
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))

describe('listbox', () => {
  it('renders inline options with an accessible name and numeric primitive identities', async () => {
    const wrapper = await mount(Listbox, { props: { items: [0, 1, '1'], label: 'Choices' } })
    expect(wrapper.find('[role=listbox]').attributes('aria-label')).toBe('Choices')
    expect(wrapper.findAll('[role=option]').map(option => option.text())).toEqual(['0', '1', '1'])
    await wrapper.findAll('[role=option]')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
    expect(wrapper.find('[role=option]').attributes('aria-selected')).toBe('true')
  })

  it('keeps explicitly undefined controlled values empty when the parent rejects selection', async () => {
    const wrapper = await mount(Listbox, { props: { items: ['a', 'b'], modelValue: undefined, defaultValue: 'a' } })
    await wrapper.findAll('[role=option]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
    expect(wrapper.findAll('[aria-selected=true]')).toHaveLength(0)
  })

  it('uses an object value field and honors explicit identity and label keys', async () => {
    const row = { value: 'incidental', id: 7, title: 'Seven' }
    const automatic = await mount(Listbox, { props: { items: [row] } })
    await automatic.find('[role=option]').trigger('click')
    expect(automatic.emitted('update:modelValue')?.at(-1)).toEqual(['incidental'])
    const keyed = await mount(Listbox, { props: { items: [row], valueKey: 'id', labelKey: 'title' } })
    expect(keyed.find('[role=option]').text()).toBe('Seven')
    await keyed.find('[role=option]').trigger('click')
    expect(keyed.emitted('update:modelValue')?.at(-1)).toEqual([7])
  })

  it('returns whole objects and keeps structurally equal object options distinct', async () => {
    const rows = [{ label: 'Same' }, { label: 'Same' }]
    const wrapper = await mount(Listbox, { props: { items: rows, multiple: true } })
    await wrapper.findAll('[role=option]')[0]!.trigger('click')
    expect(wrapper.findAll('[aria-selected=true]')).toHaveLength(1)
    await wrapper.findAll('[role=option]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(rows)
    expect(wrapper.findAll('[aria-selected=true]')).toHaveLength(2)
  })

  it('toggles multiple options without modifier keys and omits nested interactive checkboxes', async () => {
    const wrapper = await mount(Listbox, { props: { items: ['a', 'b'], multiple: true, checkbox: true } })
    await wrapper.findAll('[role=option]')[0]!.trigger('click')
    await wrapper.findAll('[role=option]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
    await wrapper.findAll('[role=option]')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b']])
    expect(wrapper.find('[role=option] button').exists()).toBe(false)
    expect(wrapper.find('[role=option] [role=checkbox], [role=option] input, [role=option] [tabindex]').exists()).toBe(false)
    expect(wrapper.findAllComponents(Checkbox).every(checkbox => checkbox.props('decorative'))).toBe(true)
  })

  it('uses the shared Checkbox theme, size, and color for row indicators and select all', async () => {
    const wrapper = await mount(defineComponent({
      render: () => h(Theme, { ui: { checkbox: { slots: { box: 'rounded-none' } } } }, () =>
        h(Listbox, { items: ['a', 'b'], defaultValue: ['a'], multiple: true, checkbox: true, selectAll: true, size: 'lg', color: 'success' })),
    }))
    const checkboxes = wrapper.findAllComponents(Checkbox)
    expect(checkboxes).toHaveLength(3)
    for (const checkbox of checkboxes) {
      expect(checkbox.props('size')).toBe('lg')
      expect(checkbox.attributes('data-selaras-color')).toBe('success')
      expect(checkbox.find('.rounded-none').classes()).toContain('size-5.5')
    }
    const options = wrapper.findAll('[role=option]')
    expect(options[0]!.findComponent(Checkbox).attributes('data-state')).toBe('checked')
    expect(options[1]!.findComponent(Checkbox).attributes('data-state')).toBe('unchecked')
    expect(options[0]!.find('path').attributes('data-state')).toBe('checked')
    expect(options[1]!.find('path').attributes('data-state')).toBe('unchecked')
    await options[1]!.trigger('click')
    expect(options[1]!.find('path').attributes('data-state')).toBe('checked')
    expect(wrapper.findComponent(Listbox).emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
  })

  it('filters groups and selects only visible enabled items while preserving hidden values', async () => {
    const wrapper = await mount(Listbox, { props: { items: [{ label: 'Group', items: [{ label: 'Apple', value: 1 }, { label: 'Apricot', value: 2, disabled: true }, { label: 'Berry', value: 3 }] }], multiple: true, defaultValue: [3, 99], searchable: true, selectAll: true } })
    await wrapper.find('input[role=combobox]').setValue('Ap')
    expect(wrapper.findAll('[role=option]')).toHaveLength(2)
    const all = wrapper.find('button[role=checkbox]')
    await all.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[3, 99, 1]])
    expect(all.attributes('aria-checked')).toBe('true')
    await all.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[3, 99]])
    expect(wrapper.text()).toContain('Group')
  })

  it('prevents individual and global disabled selection', async () => {
    const wrapper = await mount(Listbox, { props: { items: [{ label: 'Locked', value: 1, disabled: true }, { label: 'Open', value: 2 }] } })
    await wrapper.find('[role=option]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ disabled: true })
    await wrapper.findAll('[role=option]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('distinguishes empty collections from unmatched filters', async () => {
    const wrapper = await mount(Listbox, { props: { items: [], searchable: true }, slots: { 'empty': 'No items yet', 'empty-filter': 'Try another search' } })
    expect(wrapper.text()).toContain('No items yet')
    await wrapper.setProps({ items: ['a'] })
    await wrapper.find('input[role=combobox]').setValue('z')
    expect(wrapper.text()).toContain('Try another search')
  })

  it('preserves missing async values as options arrive and are removed', async () => {
    const wrapper = await mount(Listbox, { props: { items: [], modelValue: [0, 99], multiple: true } })
    await wrapper.setProps({ items: [0, 1] })
    expect(wrapper.find('[role=option]').attributes('aria-selected')).toBe('true')
    await wrapper.findAll('[role=option]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[0, 99, 1]])
    await wrapper.setProps({ items: [] })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('adapts uncontrolled selection when multiple changes', async () => {
    const wrapper = await mount(Listbox, { props: { items: [0, 1], defaultValue: 0 } })
    await wrapper.setProps({ multiple: true })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[0]])
    await wrapper.findAll('[role=option]')[1]!.trigger('click')
    await wrapper.setProps({ multiple: false })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
  })

  it('passes raw metadata and selection state into custom item and group slots', async () => {
    const row = { id: 1, label: 'Row', note: 'Metadata' }
    const wrapper = await mount(Listbox, { props: { items: [{ label: 'Group', items: [row] }], valueKey: 'id', defaultValue: 1 }, slots: { item: ({ item, selected }: any) => `${item.note}:${selected}`, group: ({ group }: any) => `Header:${group.label}` } })
    expect(wrapper.text()).toContain('Metadata:true')
    expect(wrapper.text()).toContain('Header:Group')
  })

  it('routes field accessibility to the listbox and submits only selected values', async () => {
    const wrapper = await mount(defineComponent({ render: () => h('form', {}, h(FormField, { id: 'list-choice', name: 'choice', label: 'Choices', error: 'Required' }, { default: () => h(Listbox, { items: [0, 1], multiple: true, checkbox: true, defaultValue: [0], selectAll: true }) })) }), { attachTo: document.body })
    const list = wrapper.find('[role=listbox]')
    expect(list.attributes('id')).toBe('list-choice')
    expect(list.attributes('aria-labelledby')).toBe('list-choice-label')
    expect(list.attributes('aria-describedby')).toBe('list-choice-error')
    expect(list.attributes('aria-invalid')).toBe('true')
    expect(new FormData(wrapper.find('form').element as HTMLFormElement).getAll('choice')).toEqual(['0'])
    expect(wrapper.findAll('#list-choice')).toHaveLength(1)
  })

  it('resets to the mount-captured default and respects canceled resets', async () => {
    const wrapper = await mount(defineComponent({ render: () => h('form', {}, h(Listbox, { items: ['a', 'b'], defaultValue: 'a', searchable: true, name: 'choice' })) }), { attachTo: document.body })
    await wrapper.findAll('[role=option]')[1]!.trigger('click')
    await wrapper.find('input[role=combobox]').setValue('b')
    wrapper.find('form').element.dispatchEvent(new Event('reset', { cancelable: true }))
    await nextTick()
    await nextTick()
    expect(wrapper.find('input[role=combobox]').element).toHaveProperty('value', '')
    expect(wrapper.find('[role=option]').attributes('aria-selected')).toBe('true')
    await wrapper.findAll('[role=option]')[1]!.trigger('click')
    const canceled = new Event('reset', { cancelable: true })
    canceled.preventDefault()
    wrapper.find('form').element.dispatchEvent(canceled)
    await nextTick()
    expect(wrapper.findAll('[role=option]')[1]!.attributes('aria-selected')).toBe('true')
  })

  it('resolves custom colors and merges per-slot overrides', async () => {
    const wrapper = await mount(Listbox, { props: { items: ['a'], color: 'premium', ui: { root: 'rounded-none', item: { 'class': 'px-6', 'data-custom': 'row' } } } })
    expect(wrapper.attributes('data-selaras-color')).toBe('premium')
    expect(wrapper.classes()).toContain('rounded-none')
    expect(wrapper.find('[role=option]').attributes('data-custom')).toBe('row')
  })
})
