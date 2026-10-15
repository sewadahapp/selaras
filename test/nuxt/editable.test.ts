import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Editable from '../../src/runtime/components/Editable.vue'
import FormField from '../../src/runtime/components/FormField.vue'
import Theme from '../../src/runtime/components/Theme.vue'

const button = (name: string) => `button[aria-label="${name}"]`

describe('editable', () => {
  it('keeps typed text in a draft and discards it on cancel', async () => {
    const wrapper = await mountSuspended(Editable, { props: { defaultValue: 'Original' } })
    await wrapper.get(button('Edit')).trigger('click')
    await wrapper.get('input').setValue('Draft')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.get(button('Cancel')).trigger('click')
    expect(wrapper.text()).toContain('Original')
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.emitted('cancel')).toEqual([['Original']])
    wrapper.unmount()
  })

  it('commits once through the save control', async () => {
    const wrapper = await mountSuspended(Editable, { props: { defaultValue: 'Original' } })
    await wrapper.get(button('Edit')).trigger('click')
    await wrapper.get('input').setValue('Saved')
    await wrapper.get(button('Save')).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Saved']])
    expect(wrapper.emitted('submit')).toEqual([['Saved']])
    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.vm.submit()).toBe(false)
    wrapper.unmount()
  })

  it('supports controlled editing with no automatic activation or built-in controls', async () => {
    const value = ref('Title')
    const editing = ref(false)
    const wrapper = await mountSuspended(defineComponent({
      setup: () => () => h(Editable, {
        'modelValue': value.value,
        'editing': editing.value,
        'activationMode': 'none',
        'submitMode': 'none',
        'controls': false,
        'onUpdate:modelValue': next => value.value = next,
        'onUpdate:editing': next => editing.value = next,
      }),
    }))
    const editable = wrapper.findComponent(Editable)
    expect(wrapper.find('button').exists()).toBe(false)
    await wrapper.get('span').trigger('click')
    expect(wrapper.find('input').exists()).toBe(false)
    editing.value = true
    await nextTick()
    await wrapper.get('input').setValue('Uncommitted')
    editing.value = false
    await nextTick()
    expect(value.value).toBe('Title')
    expect(editable.emitted('cancel')).toEqual([['Title']])
    editing.value = true
    await nextTick()
    await wrapper.get('input').setValue('Committed')
    expect(editable.vm.submit()).toBe(true)
    await nextTick()
    expect(value.value).toBe('Committed')
    expect(editing.value).toBe(false)
    wrapper.unmount()
  })

  it('leaves a controlled editing prop authoritative', async () => {
    const wrapper = await mountSuspended(Editable, { props: { editing: false } })
    await wrapper.get(button('Edit')).trigger('click')
    expect(wrapper.emitted('update:editing')).toEqual([[true]])
    expect(wrapper.find('input').exists()).toBe(false)
    wrapper.unmount()
  })

  for (const activationMode of ['focus', 'dblclick', 'none'] as const) {
    it(`honors ${activationMode} activation`, async () => {
      const wrapper = await mountSuspended(Editable, { props: { activationMode, controls: false } })
      const preview = wrapper.find('button, span')
      await preview.trigger('focus')
      expect(wrapper.find('input').exists()).toBe(activationMode === 'focus')
      if (activationMode !== 'focus') {
        await preview.trigger('dblclick')
        expect(wrapper.find('input').exists()).toBe(activationMode === 'dblclick')
      }
      wrapper.unmount()
    })
  }

  for (const submitMode of ['enter', 'blur', 'both', 'none'] as const) {
    it(`honors ${submitMode} submission for Enter`, async () => {
      const wrapper = await mountSuspended(Editable, { props: { defaultValue: 'Original', defaultEditing: true, submitMode } })
      await wrapper.get('input').setValue('Edited')
      await wrapper.get('input').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('submit')?.length ?? 0).toBe(submitMode === 'enter' || submitMode === 'both' ? 1 : 0)
      wrapper.unmount()
    })
  }

  it('cancels on Escape and does not commit an IME confirmation', async () => {
    const wrapper = await mountSuspended(Editable, { props: { defaultEditing: true, defaultValue: 'Original' } })
    await wrapper.get('input').setValue('Draft')
    await wrapper.get('input').trigger('compositionstart')
    await wrapper.get('input').trigger('keydown', { key: 'Enter', isComposing: true })
    expect(wrapper.emitted('submit')).toBeUndefined()
    await wrapper.get('input').trigger('compositionend')
    await wrapper.get('input').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('cancel')).toEqual([['Original']])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('preserves multiline Enter and commits with a modifier', async () => {
    const wrapper = await mountSuspended(Editable, { props: { multiline: true, defaultEditing: true } })
    await wrapper.get('textarea').setValue('First\nSecond')
    await wrapper.get('textarea').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toBeUndefined()
    await wrapper.get('textarea').trigger('keydown', { key: 'Enter', ctrlKey: true })
    expect(wrapper.emitted('submit')).toEqual([['First\nSecond']])
    wrapper.unmount()
  })

  for (const prop of ['disabled', 'readonly', 'loading'] as const) {
    it(`blocks edit() while ${prop}`, async () => {
      const wrapper = await mountSuspended(Editable, { props: { [prop]: true } })
      wrapper.vm.edit()
      await nextTick()
      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.get(button('Edit')).attributes('disabled')).toBeDefined()
      wrapper.unmount()
    })
  }

  it('retains a draft while loading but cancels when made readonly', async () => {
    const wrapper = await mountSuspended(Editable, { props: { defaultEditing: true, defaultValue: 'Original' } })
    await wrapper.get('input').setValue('Draft')
    await wrapper.setProps({ loading: true })
    expect(wrapper.get('input').element.value).toBe('Draft')
    expect(wrapper.vm.submit()).toBe(false)
    await wrapper.setProps({ loading: false, readonly: true })
    expect(wrapper.text()).toContain('Original')
    expect(wrapper.emitted('cancel')).toEqual([['Original']])
    wrapper.unmount()
  })

  it('uses external value updates as the authoritative draft', async () => {
    const wrapper = await mountSuspended(Editable, { props: { modelValue: 'Before', defaultEditing: true } })
    await wrapper.get('input').setValue('Local')
    await wrapper.setProps({ modelValue: 'Remote' })
    expect(wrapper.get('input').element.value).toBe('Remote')
    wrapper.unmount()
  })

  it('inherits field identity, descriptions, invalid state, size and committed form value', async () => {
    const wrapper = await mountSuspended(FormField, {
      props: { id: 'project-title', label: 'Project title', name: 'title', description: 'A short title', error: 'Check the title', size: 'lg' },
      slots: { default: () => h(Editable, { defaultValue: 'Original', defaultEditing: true }) },
    })
    const input = wrapper.get('#project-title')
    expect(input.attributes('aria-labelledby')).toBe('project-title-label')
    expect(input.attributes('aria-describedby')).toBe('project-title-description project-title-error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.classes()).toContain('h-11')
    await input.setValue('Draft')
    expect(wrapper.get<HTMLInputElement>('input[name=title]').element.value).toBe('Original')
    wrapper.unmount()
  })

  it('forwards native attributes and supports theme recipes and per-instance overrides', async () => {
    const wrapper = await mountSuspended(Theme, {
      props: { defaults: { editable: { size: 'lg', color: 'secondary' } }, ui: { editable: { slots: { preview: 'themed-preview' } } } },
      slots: { default: () => h(Editable, { 'aria-label': 'Title', 'autocomplete': 'off', 'ui': { input: 'instance-input' } }) },
    })
    const editable = wrapper.findComponent(Editable)
    expect(editable.attributes('data-selaras-color')).toBe('secondary')
    expect(editable.find('.themed-preview').exists()).toBe(true)
    await editable.get(button('Edit')).trigger('click')
    expect(editable.get('input').attributes('aria-label')).toBe('Title')
    expect(editable.get('input').attributes('autocomplete')).toBe('off')
    expect(editable.get('input').classes()).toEqual(expect.arrayContaining(['instance-input', 'h-11']))
    wrapper.unmount()
  })
})
