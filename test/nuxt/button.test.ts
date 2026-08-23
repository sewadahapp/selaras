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
})
