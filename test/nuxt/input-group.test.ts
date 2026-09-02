import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Button from '../../src/runtime/components/Button.vue'
import Input from '../../src/runtime/components/Input.vue'
import InputGroup from '../../src/runtime/components/InputGroup.vue'

describe('inputGroup', () => {
  it('renders every child', async () => {
    const wrapper = await mountSuspended(InputGroup, {
      slots: {
        default: () => [
          h(Input, { placeholder: 'One' }),
          h(Button, {}, () => 'Two'),
        ],
      },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('One')
    expect(wrapper.find('button').text()).toBe('Two')
  })

  it('wires the shallow (direct-child) corner-squaring classes onto the root', async () => {
    // Tailwind isn't compiled in this test environment - see
    // button-group.test.ts for why this only checks theme wiring, not the
    // resulting visual layout (that's verified in a real browser instead).
    const wrapper = await mountSuspended(InputGroup, {
      slots: { default: () => [h(Button, {}, () => 'One'), h(Button, {}, () => 'Two')] },
    })
    const rootClasses = wrapper.classes().join(' ')
    expect(rootClasses).toContain(':not(:first-child)]:rounded-s-none')
    expect(rootClasses).toContain(':not(:last-child)]:rounded-e-none')
  })

  it('wires the deep (data-ui-group-item descendant) corner-squaring classes onto the root', async () => {
    const wrapper = await mountSuspended(InputGroup, {
      slots: { default: () => [h(Input), h(Input)] },
    })
    const rootClasses = wrapper.classes().join(' ')
    expect(rootClasses).toContain(':not(:first-child)_[data-ui-group-item]]:rounded-s-none')
    expect(rootClasses).toContain(':not(:last-child)_[data-ui-group-item]]:rounded-e-none')
  })

  it('marks the real input element with data-ui-group-item', async () => {
    const wrapper = await mountSuspended(InputGroup, {
      slots: { default: () => [h(Input)] },
    })
    expect(wrapper.find('input').attributes('data-ui-group-item')).toBe('')
  })

  it('applies vertical corner-squaring when orientation is vertical', async () => {
    const wrapper = await mountSuspended(InputGroup, {
      props: { orientation: 'vertical' },
      slots: { default: () => [h(Input), h(Input)] },
    })
    const rootClasses = wrapper.classes().join(' ')
    expect(rootClasses).toContain('flex-col')
    expect(rootClasses).toContain(':not(:first-child)_[data-ui-group-item]]:rounded-t-none')
    expect(rootClasses).toContain(':not(:last-child)_[data-ui-group-item]]:rounded-b-none')
  })

  it('defaults to horizontal orientation', async () => {
    const wrapper = await mountSuspended(InputGroup, {
      slots: { default: () => [h(Input)] },
    })
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).not.toContain('flex-col')
  })

  it('merges a string :ui.root override with the theme root classes', async () => {
    const wrapper = await mountSuspended(InputGroup, {
      props: { ui: { root: 'custom-class' } },
      slots: { default: () => [h(Input)] },
    })
    expect(wrapper.classes()).toContain('custom-class')
  })
})
