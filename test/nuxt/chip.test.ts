import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Chip from '../../src/runtime/components/Chip.vue'

describe('chip', () => {
  it('renders the label prop by default', async () => {
    const wrapper = await mountSuspended(Chip, { props: { label: 'Apple' } })
    expect(wrapper.text()).toBe('Apple')
  })

  it('renders default slot content, overriding the label prop', async () => {
    const wrapper = await mountSuspended(Chip, {
      props: { label: 'Apple' },
      slots: { default: () => 'Custom' },
    })
    expect(wrapper.text()).toBe('Custom')
  })

  it('renders a leading icon when given', async () => {
    const wrapper = await mountSuspended(Chip, { props: { label: 'Apple', icon: 'lucide:apple' } })
    expect(wrapper.find('.iconify').classes()).toContain('i-lucide:apple')
  })

  it('does not render a remove button by default', async () => {
    const wrapper = await mountSuspended(Chip, { props: { label: 'Apple' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders a real <button> for remove - the root is a <span>, so nesting one is valid HTML', async () => {
    const wrapper = await mountSuspended(Chip, { props: { label: 'Apple', removable: true } })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('emits remove when the remove button is clicked', async () => {
    const wrapper = await mountSuspended(Chip, { props: { label: 'Apple', removable: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('derives the remove button\'s accessible label from the chip label by default', async () => {
    const wrapper = await mountSuspended(Chip, { props: { label: 'Apple', removable: true } })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Remove Apple')
  })

  it('falls back to a plain "Remove" label when there is no label prop', async () => {
    const wrapper = await mountSuspended(Chip, {
      props: { removable: true },
      slots: { default: () => 'Custom' },
    })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Remove')
  })

  it('lets removeLabel override the derived accessible label', async () => {
    const wrapper = await mountSuspended(Chip, { props: { label: 'Apple', removable: true, removeLabel: 'Delete fruit' } })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Delete fruit')
  })

  it('replaces the remove icon via the remove-icon slot', async () => {
    const wrapper = await mountSuspended(Chip, {
      props: { label: 'Apple', removable: true },
      slots: { 'remove-icon': '<span class="my-remove-icon">x</span>' },
    })
    expect(wrapper.find('.my-remove-icon').exists()).toBe(true)
    expect(wrapper.find('.iconify').exists()).toBe(false)
  })

  it('disables the remove button and stops emitting remove when disabled', async () => {
    const wrapper = await mountSuspended(Chip, { props: { label: 'Apple', removable: true, disabled: true } })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    await button.trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('merges a fallthrough class attr with the theme root classes instead of dropping it', async () => {
    const wrapper = await mountSuspended(Chip, {
      props: { label: 'Apple' },
      attrs: { class: 'mt-4' },
    })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('mt-4')
    expect(span.classes().length).toBeGreaterThan(1)
  })
})
