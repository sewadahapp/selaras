import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Kbd from '../../src/runtime/components/Kbd.vue'

describe('kbd', () => {
  it('renders a real <kbd> element', async () => {
    const wrapper = await mountSuspended(Kbd, { slots: { default: () => 'K' } })

    expect(wrapper.element.tagName).toBe('KBD')
    expect(wrapper.text()).toBe('K')
  })

  it('resolves a known key name to its symbol via the value prop', async () => {
    const wrapper = await mountSuspended(Kbd, { props: { value: 'meta' } })

    expect(wrapper.text()).toBe('⌘')
  })

  it('value resolution is case-insensitive', async () => {
    const wrapper = await mountSuspended(Kbd, { props: { value: 'Shift' } })

    expect(wrapper.text()).toBe('⇧')
  })

  it('falls back to the raw string when value has no known symbol', async () => {
    const wrapper = await mountSuspended(Kbd, { props: { value: 'K' } })

    expect(wrapper.text()).toBe('K')
  })

  it('the default slot overrides the value prop', async () => {
    const wrapper = await mountSuspended(Kbd, {
      props: { value: 'meta' },
      slots: { default: () => 'Custom' },
    })

    expect(wrapper.text()).toBe('Custom')
  })

  it('merges a string :ui.base override with the theme classes', async () => {
    const wrapper = await mountSuspended(Kbd, {
      props: { ui: { base: 'custom-class' } },
      slots: { default: () => 'K' },
    })

    expect(wrapper.classes()).toContain('custom-class')
  })
})
