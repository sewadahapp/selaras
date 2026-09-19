import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import Input from '../../src/runtime/components/Input.vue'

describe('input', () => {
  it('binds a custom semantic role to the input root', async () => {
    const wrapper = await mountSuspended(Input, { props: { color: 'premium' as any } })
    expect(wrapper.attributes('data-selaras-color')).toBe('premium')
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('forwards native attributes and focus listeners to the actual input', async () => {
    const onFocus = vi.fn()
    const wrapper = await mountSuspended(Input, {
      attrs: { autocomplete: 'email', inputmode: 'email', readonly: true, onFocus },
    })
    const input = wrapper.find('input')
    expect(input.attributes('autocomplete')).toBe('email')
    expect(input.attributes('inputmode')).toBe('email')
    expect(input.attributes('readonly')).toBeDefined()
    expect(wrapper.element.getAttribute('autocomplete')).toBeNull()
    await input.trigger('focus')
    expect(onFocus).toHaveBeenCalled()
  })

  it('forwards accessible naming attributes to the actual input', async () => {
    const wrapper = await mountSuspended(Input, { attrs: { 'aria-label': 'Email address', 'aria-labelledby': 'email-label' } })
    const input = wrapper.find('input')
    expect(input.attributes('aria-label')).toBe('Email address')
    expect(input.attributes('aria-labelledby')).toBe('email-label')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
  })

  it('applies a public class to the positioned root so trailing affordances stay inside its width', async () => {
    const wrapper = await mountSuspended(Input, {
      attrs: { class: 'w-48 custom-input' },
      props: { modelValue: 'hello', clearable: true },
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['relative', 'w-48', 'custom-input']))
    expect(wrapper.find('input').classes()).not.toContain('custom-input')
    expect(wrapper.find('button').classes()).toContain('absolute')
  })

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
    expect(icons).toEqual(['i-hugeicons:cancel-01'])
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

  it('replaces the clear icon via the clear-icon slot instead of the default', async () => {
    const wrapper = await mountSuspended(Input, {
      props: { clearable: true, modelValue: 'hello' },
      slots: { 'clear-icon': '<span class="my-custom-icon">×</span>' },
    })
    expect(wrapper.find('.my-custom-icon').exists()).toBe(true)
    expect(wrapper.find('.iconify').exists()).toBe(false)
  })

  it('applies the color prop to the focus-ring class', async () => {
    const wrapper = await mountSuspended(Input, { props: { color: 'success' } })
    expect(wrapper.find('input').classes()).toContain('focus:ring-[var(--_selaras-color-focus)]')
  })

  it('invalid wins over a custom color for the focus ring, not the other way around', async () => {
    const wrapper = await mountSuspended(Input, { props: { color: 'success', invalid: true } })
    const classes = wrapper.find('input').classes()
    expect(classes).toContain('focus:ring-[var(--_selaras-color-focus)]')
    expect(classes).not.toContain('focus:ring-[var(--selaras-resolved-color-success-fill)]')
  })
})
