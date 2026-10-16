import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { CalendarDate } from '@internationalized/date'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Autocomplete from '../../src/runtime/components/Autocomplete.vue'
import Button from '../../src/runtime/components/Button.vue'
import DatePicker from '../../src/runtime/components/DatePicker.vue'
import Input from '../../src/runtime/components/Input.vue'
import Select from '../../src/runtime/components/Select.vue'
import Textarea from '../../src/runtime/components/Textarea.vue'
import Theme from '../../src/runtime/components/Theme.vue'
import FieldClearButton from '../../src/runtime/internal/FieldClearButton.vue'

const wrappers: VueWrapper<any>[] = []
async function mount(component: Component, options: any = {}) {
  const wrapper = await mountSuspended(component, options)
  wrappers.push(wrapper)
  return wrapper as VueWrapper<any>
}
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))

const cases = [
  { name: 'Input', component: Input, props: { modelValue: 0 }, empty: '' },
  { name: 'Textarea', component: Textarea, props: { modelValue: 'Note' }, empty: '' },
  { name: 'Select', component: Select as Component, props: { items: [0, 1], modelValue: 0 }, empty: undefined },
  { name: 'Autocomplete', component: Autocomplete as Component, props: { items: [0, 1], modelValue: 0 }, empty: undefined },
  { name: 'DatePicker', component: DatePicker, props: { modelValue: new CalendarDate(2026, 10, 16) }, empty: undefined },
]

describe('shared field clear controls', () => {
  for (const entry of cases) {
    it(`${entry.name} uses a neutral ghost Button with independently sized icon and clears its value`, async () => {
      const wrapper = await mount(entry.component, { props: { ...entry.props, clearable: true, color: 'success', size: 'md' } })
      const clear = wrapper.findComponent(FieldClearButton)
      expect(clear.exists()).toBe(true)
      expect(clear.findComponent(Button).props()).toMatchObject({ variant: 'ghost', color: 'neutral' })
      expect(clear.classes()).toContain('size-7')
      expect(clear.find('.iconify').classes()).toContain('size-4.5')
      await clear.trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([entry.empty])
    })

    it.each([
      { clearable: false },
      { clearable: true, disabled: true },
      { clearable: true, readonly: true },
      { clearable: true, readonly: '' },
    ])(`${entry.name} suppresses clear for %j`, async (attributes) => {
      const wrapper = await mount(entry.component, { props: { ...entry.props, ...attributes } })
      expect(wrapper.findComponent(FieldClearButton).exists()).toBe(false)
    })

    it(`${entry.name} allows shared theme and local clear overrides without changing the icon slot contract`, async () => {
      const wrapper = await mount(defineComponent({
        render: () => h(Theme, { ui: { fieldClearButton: { slots: { base: 'rounded-none' }, compoundVariants: [{ size: 'md', class: { icon: 'size-6' } }] } } }, () =>
          h(entry.component, { ...entry.props, clearable: true, ui: { clear: { 'class': 'opacity-75', 'data-custom-clear': 'true' } } })),
      }))
      const clear = wrapper.findComponent(FieldClearButton)
      expect(clear.classes()).toEqual(expect.arrayContaining(['rounded-none', 'opacity-75']))
      expect(clear.attributes('data-custom-clear')).toBe('true')
      expect(clear.find('.iconify').classes()).toContain('size-6')
    })

    it(`${entry.name} updates clear visibility when readonly changes`, async () => {
      const wrapper = await mount(entry.component, { props: { ...entry.props, clearable: true, readonly: false } })
      expect(wrapper.findComponent(FieldClearButton).exists()).toBe(true)
      await wrapper.setProps({ readonly: true })
      expect(wrapper.findComponent(FieldClearButton).exists()).toBe(false)
      await wrapper.setProps({ readonly: false })
      expect(wrapper.findComponent(FieldClearButton).exists()).toBe(true)
    })
  }

  it('clears Autocomplete draft text even when no option has been selected', async () => {
    const wrapper = await mount(Autocomplete as Component, { props: { items: ['One'], clearable: true } })
    expect(wrapper.findComponent(FieldClearButton).exists()).toBe(false)
    await wrapper.find('input[role=combobox]').setValue('Draft')
    expect(wrapper.findComponent(FieldClearButton).exists()).toBe(true)
    await wrapper.findComponent(FieldClearButton).trigger('click')
    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
    expect(wrapper.find('input[role=combobox]').element).toHaveProperty('value', '')
  })

  it.each([Select as Component, Autocomplete as Component])('retains clear during loading and alongside custom trailing content', async (component) => {
    const wrapper = await mount(component, {
      props: { items: [0, 1], modelValue: 0, clearable: true, loading: true },
      slots: { trailing: '<span data-suffix>Suffix</span>' },
    })
    expect(wrapper.findComponent(FieldClearButton).exists()).toBe(true)
    expect(wrapper.find('[data-suffix]').text()).toBe('Suffix')
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('can clear a partial date range with only an end value', async () => {
    const wrapper = await mount(DatePicker, { props: { range: true, clearable: true, modelValue: { start: undefined, end: new CalendarDate(2026, 10, 16) } } })
    await wrapper.findComponent(FieldClearButton).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ start: undefined, end: undefined }])
  })
})
