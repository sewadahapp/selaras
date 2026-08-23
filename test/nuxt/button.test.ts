import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Button from '../../src/runtime/components/Button.vue'

describe('button', () => {
  it('renders as a plain button by default', async () => {
    const wrapper = await mountSuspended(Button, { slots: { default: () => 'Click me' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('accepts a component reference for `as`, not just a tag-name string - e.g. NuxtLink via resolveComponent', async () => {
    const FakeLink = defineComponent({
      props: { to: String },
      setup: (props, { slots }) => () => h('a', { href: props.to }, slots.default?.()),
    })
    const wrapper = await mountSuspended(Button, {
      props: { as: FakeLink, to: '/components/button' } as any,
      slots: { default: () => 'Browse components' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/components/button')
  })

  it('shows the given icon in place of a spinner when not loading', async () => {
    const wrapper = await mountSuspended(Button, { props: { icon: 'lucide:save' } })
    const icon = wrapper.find('.iconify')
    expect(icon.classes()).toContain('i-lucide:save')
  })

  it('replaces the leading icon with a spinner when loading, without disabling the button', async () => {
    const wrapper = await mountSuspended(Button, { props: { icon: 'lucide:save', loading: true } })
    const icons = wrapper.findAll('.iconify')
    expect(icons).toHaveLength(1)
    expect(icons[0]!.classes()).toContain('i-lucide:loader-2')
    expect(icons[0]!.classes()).toContain('animate-spin')
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('adds the raised shadow independently of variant', async () => {
    const wrapper = await mountSuspended(Button, { props: { raised: true, variant: 'ghost' } })
    expect(wrapper.classes().some(c => c.includes('shadow-'))).toBe(true)
  })
})
