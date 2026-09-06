import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Button from '../../src/runtime/components/Button.vue'
import Theme from '../../src/runtime/components/Theme.vue'

function withTheme(themeProps: Record<string, unknown>, children: any) {
  return defineComponent({
    render: () => h(Theme, themeProps, () => children),
  })
}

describe('theme', () => {
  it('renders no DOM element of its own', async () => {
    const wrapper = await mountSuspended(Theme, { slots: { default: () => 'content' } })
    expect(wrapper.html()).toBe('content')
  })

  it('applies a scoped ui override to a descendant button, regardless of nesting depth', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: { button: { base: 'rounded-full' } } }, [
      h('div', [h(Button, () => 'Click me')]),
    ]))
    expect(wrapper.find('button').classes()).toContain('rounded-full')
  })

  it('does not affect a button outside the Theme boundary', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => [
        h(Theme, { ui: { button: { base: 'rounded-full' } } }, () => h('div', { id: 'inside' })),
        h(Button, { id: 'outside' }, () => 'Click me'),
      ],
    }))
    expect(wrapper.find('#outside').classes()).not.toContain('rounded-full')
  })

  it('applies a scoped props default to a button with no own size, but not to one with an explicit size', async () => {
    const wrapper = await mountSuspended(withTheme({ props: { button: { size: 'lg' } } }, [
      h(Button, { id: 'default-size' }, () => 'A'),
      h(Button, { id: 'explicit-size', size: 'sm' }, () => 'B'),
    ]))
    expect(wrapper.find('#default-size').classes()).toContain('h-11')
    expect(wrapper.find('#explicit-size').classes()).toContain('h-8')
  })

  it('nested Theme components: the inner one wins for settings it sets, while inheriting the outer one\'s unset settings', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { ui: { button: { base: 'rounded-full' } }, props: { button: { color: 'danger' } } }, () =>
        h(Theme, { props: { button: { size: 'lg' } } }, () =>
          h(Button, () => 'Click me'))),
    }))
    const classes = wrapper.find('button').classes()
    expect(classes).toContain('rounded-full') // inherited from the outer Theme
    expect(classes).toContain('h-11') // set by the inner Theme (size=lg)
    expect(classes.some(c => c.includes('danger'))).toBe(true) // inherited color=danger
  })
})
