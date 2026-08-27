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

  it('gives the clear button an accessible label - an icon-only button otherwise has no name', async () => {
    const wrapper = await mountSuspended(Input, { props: { clearable: true, modelValue: 'hello' } })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Clear')
  })

  it('takes over the trailing slot from trailingIcon while there is a value to clear', async () => {
    const wrapper = await mountSuspended(Input, { props: { clearable: true, trailingIcon: 'lucide:mic', modelValue: 'hello' } })
    const icons = wrapper.findAll('.iconify').map(el => el.classes().find(c => c.startsWith('i-')))
    expect(icons).toEqual(['i-ph:x'])
  })

  it('hides the clear button while disabled even with a value', async () => {
    const wrapper = await mountSuspended(Input, { props: { clearable: true, disabled: true, modelValue: 'hello' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders the clear button as an actual <SButton>, with equal-width/height sizing for a true circle', async () => {
    // Regression: this used to be a raw <button> with no inline-flex - an
    // absolutely-positioned button with no explicit height inherits the
    // surrounding line-height, inflating its height above its width, so
    // rounded-full rendered an oval, not a circle. <SButton>'s own
    // inline-flex/items-center/justify-center base fixes that, but only if
    // this component actually renders through it rather than a bespoke tag.
    const wrapper = await mountSuspended(Input, { props: { clearable: true, modelValue: 'hello', size: 'md' } })
    const button = wrapper.find('button')
    const classes = button.classes()
    expect(classes).toContain('inline-flex')
    expect(classes).toContain('items-center')
    expect(classes).toContain('justify-center')
    // The theme's own fixed override for size="md" - equal on both axes.
    expect(classes).toContain('size-9')
  })

  it('replaces the clear icon via the clear-icon slot instead of the default ph:x', async () => {
    const wrapper = await mountSuspended(Input, {
      props: { clearable: true, modelValue: 'hello' },
      slots: { 'clear-icon': '<span class="my-custom-icon">×</span>' },
    })
    expect(wrapper.find('.my-custom-icon').exists()).toBe(true)
    expect(wrapper.find('.iconify').exists()).toBe(false)
  })
})
