import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Autocomplete from '../../src/runtime/components/Autocomplete.vue'
import Input from '../../src/runtime/components/Input.vue'
import Select from '../../src/runtime/components/Select.vue'
import Textarea from '../../src/runtime/components/Textarea.vue'

for (const [name, component, props] of [
  ['Input', Input, { modelValue: 'secret' }],
  ['Textarea', Textarea, { modelValue: 'A note' }],
  ['Select', Select, { items: ['One', 'Two'], modelValue: 'One' }],
  ['Autocomplete', Autocomplete, { items: ['One', 'Two'], modelValue: 'One' }],
] as const) {
  describe(`${name} field adornments`, () => {
    it('keeps custom controls alongside clearing and does not nest them in the trigger', async () => {
      const action = vi.fn()
      const wrapper = await mountSuspended(component as any, {
        props: { ...props, clearable: true, size: 'lg' },
        slots: {
          leading: ({ size }: { size: string }) => h('span', { 'data-test': 'prefix' }, size),
          trailing: ({ disabled, buttonSize }: { disabled: boolean, buttonSize: string }) => h('button', { 'type': 'button', disabled, 'data-test': 'action', 'data-size': buttonSize, 'onClick': action }, 'Details'),
        },
      })
      expect(wrapper.find('[data-test=prefix]').text()).toBe('lg')
      expect(wrapper.find('[data-test=action]').attributes('data-size')).toBe('md')
      expect(wrapper.find('[aria-label=Clear]').exists()).toBe(true)
      expect(wrapper.find('[data-test=action]').element.parentElement?.closest('button')).toBeNull()
      await wrapper.find('[data-test=action]').trigger('click')
      expect(action).toHaveBeenCalledOnce()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('update:open')?.some(([open]) => open)).not.toBe(true)
      await wrapper.find('[aria-label=Clear]').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([name === 'Input' || name === 'Textarea' ? '' : undefined])
      expect(wrapper.find('[data-test=action]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('exposes disabled state, disables native controls, and accepts wrapper UI overrides', async () => {
      const wrapper = await mountSuspended(component as any, {
        props: { ...props, disabled: true, ui: { leading: { 'data-test': 'leading-wrapper' }, trailing: 'custom-trailing' } },
        slots: {
          leading: () => h('span', 'Prefix'),
          trailing: ({ disabled, size, buttonSize }: { disabled: boolean, size: string, buttonSize: string }) => h('button', { type: 'button', disabled }, `${size}:${buttonSize}`),
        },
      })
      expect(wrapper.find('[data-test=leading-wrapper]').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.custom-trailing').attributes('inert')).toBeDefined()
      expect(wrapper.find('.custom-trailing button').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.custom-trailing button').text()).toBe('md:sm')
      wrapper.unmount()
    })

    it('adds and removes conditional slots without leaving stale spacing', async () => {
      const visible = ref(true)
      const wrapper = await mountSuspended(defineComponent({
        setup: () => () => h(component as any, props, visible.value ? { trailing: () => h('span', { 'data-test': 'suffix' }, 'kg') } : {}),
      }))
      expect(wrapper.find('[data-test=suffix]').exists()).toBe(true)
      visible.value = false
      await nextTick()
      expect(wrapper.find('[data-test=suffix]').exists()).toBe(false)
      const field = wrapper.find('input:not([type=hidden]), textarea, button[aria-haspopup]')
      expect(field.attributes('style') ?? '').not.toContain('padding-inline-end')
      visible.value = true
      await nextTick()
      expect(wrapper.find('[data-test=suffix]').exists()).toBe(true)
      wrapper.unmount()
    })
  })
}

for (const component of [Input, Textarea]) {
  it(`replaces ${component.__name} decorative icons with custom content`, async () => {
    const wrapper = await mountSuspended(component as any, {
      props: { icon: 'hugeicons:search-01', trailingIcon: 'hugeicons:view' },
      slots: { leading: () => h('span', 'Prefix'), trailing: () => h('span', 'Suffix') },
    })
    expect(wrapper.findAll('.iconify')).toHaveLength(0)
    expect(wrapper.attributes('data-selaras-field-leading')).toBe('')
    wrapper.unmount()
  })
}
