import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Button from '../../src/runtime/components/Button.vue'
import ButtonGroup from '../../src/runtime/components/ButtonGroup.vue'

describe('buttonGroup', () => {
  it('renders every child button', async () => {
    const wrapper = await mountSuspended(ButtonGroup, {
      slots: {
        default: () => [
          h(Button, {}, () => 'One'),
          h(Button, {}, () => 'Two'),
          h(Button, {}, () => 'Three'),
        ],
      },
    })
    expect(wrapper.findAll('button').map(b => b.text())).toEqual(['One', 'Two', 'Three'])
  })

  it('wires the corner-squaring and overlap classes onto the root, targeting non-first/non-last children', async () => {
    // Tailwind's arbitrary-variant classes (e.g. `[&>*:not(:first-child)]:rounded-s-none`)
    // live on the root element as CSS selectors, not distributed onto each
    // child - Tailwind itself isn't compiled in this test environment, so
    // this only verifies the theme wiring, not the resulting visual layout.
    const wrapper = await mountSuspended(ButtonGroup, {
      slots: { default: () => [h(Button, {}, () => 'One'), h(Button, {}, () => 'Two')] },
    })
    const rootClasses = wrapper.classes().join(' ')
    expect(rootClasses).toContain(':not(:first-child)]:rounded-s-none')
    expect(rootClasses).toContain(':not(:last-child)]:rounded-e-none')
  })

  it('applies vertical corner-squaring when orientation is vertical', async () => {
    const wrapper = await mountSuspended(ButtonGroup, {
      props: { orientation: 'vertical' },
      slots: { default: () => [h(Button, {}, () => 'One'), h(Button, {}, () => 'Two')] },
    })
    const rootClasses = wrapper.classes().join(' ')
    expect(rootClasses).toContain('flex-col')
    expect(rootClasses).toContain(':not(:first-child)]:rounded-t-none')
    expect(rootClasses).toContain(':not(:last-child)]:rounded-b-none')
  })

  it('defaults to horizontal orientation', async () => {
    const wrapper = await mountSuspended(ButtonGroup, {
      slots: { default: () => [h(Button, {}, () => 'One')] },
    })
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).not.toContain('flex-col')
  })
})
