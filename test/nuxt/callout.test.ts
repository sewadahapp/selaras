import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Callout from '../../src/runtime/components/Callout.vue'

describe('callout', () => {
  it('defaults to the note type\'s own icon', async () => {
    const wrapper = await mountSuspended(Callout, { props: {} })

    const icon = wrapper.find('.iconify')
    expect(icon.classes()).toContain('i-hugeicons:information-circle')
  })

  it('each type falls back to its own default icon', async () => {
    const tip = await mountSuspended(Callout, { props: { type: 'tip' } })
    expect(tip.find('.iconify').classes()).toContain('i-hugeicons:checkmark-circle-01')

    const warning = await mountSuspended(Callout, { props: { type: 'warning' } })
    expect(warning.find('.iconify').classes()).toContain('i-hugeicons:alert-circle')

    const danger = await mountSuspended(Callout, { props: { type: 'danger' } })
    expect(danger.find('.iconify').classes()).toContain('i-hugeicons:cancel-circle')
  })

  it('an explicit icon overrides the type\'s own default', async () => {
    const wrapper = await mountSuspended(Callout, { props: { type: 'tip', icon: 'lucide:bug' } })

    expect(wrapper.find('.iconify').classes()).toContain('i-lucide:bug')
  })

  it('icon={false} renders no icon at all', async () => {
    const wrapper = await mountSuspended(Callout, { props: { icon: false } })

    expect(wrapper.find('.iconify').exists()).toBe(false)
  })

  it('renders a title from the prop, and from the default slot body', async () => {
    const wrapper = await mountSuspended(Callout, {
      props: { title: 'Heads up' },
      slots: { default: () => 'Something worth noting.' },
    })

    expect(wrapper.text()).toContain('Heads up')
    expect(wrapper.text()).toContain('Something worth noting.')
  })

  it('the title slot overrides the title prop', async () => {
    const wrapper = await mountSuspended(Callout, {
      props: { title: 'Prop title' },
      slots: { title: () => 'Slot title' },
    })

    expect(wrapper.text()).toContain('Slot title')
    expect(wrapper.text()).not.toContain('Prop title')
  })

  it('renders no title paragraph at all with neither prop nor slot', async () => {
    const wrapper = await mountSuspended(Callout, {
      props: {},
      slots: { default: () => 'Just a body.' },
    })

    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('merges a string :ui.root override with the theme classes', async () => {
    const wrapper = await mountSuspended(Callout, { props: { ui: { root: 'custom-class' } } })

    expect(wrapper.classes()).toContain('custom-class')
  })
})
