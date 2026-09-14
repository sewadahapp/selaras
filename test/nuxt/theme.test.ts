import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Badge from '../../src/runtime/components/Badge.vue'
import Button from '../../src/runtime/components/Button.vue'
import Checkbox from '../../src/runtime/components/Checkbox.vue'
import ContextMenu from '../../src/runtime/components/ContextMenu.vue'
import Popover from '../../src/runtime/components/Popover.vue'
import Theme from '../../src/runtime/components/Theme.vue'

function withTheme(themeProps: Record<string, unknown>, children: any) {
  return defineComponent({
    render: () => h(Theme, themeProps, () => children),
  })
}

describe('theme', () => {
  it('inherits explicit mode and ownership through headless presentation providers', async () => {
    const mode = ref<'light' | 'dark'>('dark')
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { as: 'section', mode: mode.value }, () =>
        h(Theme, { defaults: { button: { size: 'lg' } } }, () => h(Button, () => 'Inherited'))),
    }))
    const button = wrapper.find('button')
    expect(button.attributes('data-selaras-theme')).toBe(wrapper.attributes('data-selaras-theme'))
    expect(button.attributes('data-selaras-mode')).toBe('dark')
    mode.value = 'light'
    await wrapper.vm.$nextTick()
    expect(button.attributes('data-selaras-mode')).toBe('light')
    expect(button.classes()).toContain('h-11')
    wrapper.unmount()
  })

  it('renders no DOM element of its own', async () => {
    const wrapper = await mountSuspended(Theme, { slots: { default: () => 'content' } })
    expect(wrapper.html()).toBe('content')
  })

  it('requires an explicit root to scope token overrides and isolates the descendant role', async () => {
    const wrapper = await mountSuspended(Theme, {
      props: { as: 'section', tokens: { light: { colors: { premium: { fill: '#5134a8' } } } } },
      slots: { default: () => h(Button, { color: 'premium' }, () => 'Scoped') },
    })
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('data-selaras-theme')).toMatch(/^s/)
    await new Promise(resolve => setTimeout(resolve, 50))
    const style = [...document.head.querySelectorAll('style')].find(node => node.textContent?.includes('[data-selaras-theme="'))
    expect(style?.textContent).toContain('--selaras-color-premium-fill: #5134a8;')
    expect(style?.textContent).toContain('[data-selaras-theme="')
    wrapper.unmount()
  })

  it('transports the theme marker onto portalled popover content', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { as: 'section', tokens: { light: { colors: { premium: { fill: '#5134a8' } } } } }, () =>
        h(Popover, { open: true }, {
          default: () => h('button', 'Open'),
          content: () => h('span', { 'data-testid': 'popover-content' }, 'Content'),
        })),
    }))
    await new Promise(resolve => setTimeout(resolve, 50))
    const scope = wrapper.find('[data-selaras-theme]')
    const content = document.querySelector('[data-testid="popover-content"]')
    expect(scope.exists()).toBe(true)
    expect(content?.closest('[data-selaras-theme]')?.getAttribute('data-selaras-theme')).toBe(scope.attributes('data-selaras-theme'))
    wrapper.unmount()
  })

  it('transports the theme marker onto context-menu content', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { as: 'section', tokens: { light: { colors: { premium: { fill: '#5134a8' } } } } }, () =>
        h(ContextMenu, { items: [[{ label: 'Inspect' }]] }, {
          default: () => h('button', { 'data-testid': 'context-target' }, 'Open'),
        })),
    }))
    await wrapper.find('[data-testid="context-target"]').trigger('contextmenu')
    await new Promise(resolve => setTimeout(resolve, 50))
    const scope = wrapper.find('[data-selaras-theme]')
    const content = document.body.querySelector('[role="menu"]')
    expect(content?.closest('[data-selaras-theme]')?.getAttribute('data-selaras-theme')).toBe(scope.attributes('data-selaras-theme'))
    wrapper.unmount()
  })

  it('isolates nested explicit scopes with distinct role selectors', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('div', [
        h(Theme, { as: 'section', tokens: { light: { colors: { premium: { fill: '#5134a8' } } } } }, () => h(Button, { color: 'premium' }, () => 'Outer')),
        h(Theme, { as: 'section', tokens: { light: { colors: { premium: { fill: '#0f766e' } } } } }, () => h(Button, { color: 'premium' }, () => 'Inner')),
      ]),
    }))
    await new Promise(resolve => setTimeout(resolve, 50))
    const scopes = wrapper.findAll('section[data-selaras-theme]')
    expect(scopes).toHaveLength(2)
    expect(scopes[0]!.attributes('data-selaras-theme')).not.toBe(scopes[1]!.attributes('data-selaras-theme'))
    const css = [...document.head.querySelectorAll('style')].map(node => node.textContent ?? '').join('\n')
    expect(css).toContain('--selaras-color-premium-fill: #5134a8;')
    expect(css).toContain('--selaras-color-premium-fill: #0f766e;')
    for (const scope of scopes)
      expect(css).toContain(`[data-selaras-theme="${scope.attributes('data-selaras-theme')}"]`)
    wrapper.unmount()
  })

  it('applies a scoped ui override to a descendant button, regardless of nesting depth', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: { button: { slots: { base: 'rounded-full' } } } }, [
      h('div', [h(Button, () => 'Click me')]),
    ]))
    expect(wrapper.find('button').classes()).toContain('rounded-full')
  })

  it('passes the registered custom role to recipe extension conditions', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: { button: {
      compoundVariants: [{ color: 'premium', variant: 'outline', class: { base: 'tracking-widest' } }],
    } } }, h(Button, { color: 'premium', variant: 'outline' }, () => 'Upgrade')))
    expect(wrapper.find('button').classes()).toContain('tracking-widest')
  })

  it('passes Badge custom roles to recipe extension conditions', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: { badge: {
      compoundVariants: [{ color: 'premium', variant: 'outline', class: { base: 'tracking-widest' } }],
    } } }, h(Badge, { color: 'premium', variant: 'outline', label: 'Upgrade' })))
    expect(wrapper.find('[data-selaras-color="premium"]').classes()).toContain('tracking-widest')
  })

  it('passes Checkbox custom roles to recipe extension conditions', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: { checkbox: {
      compoundVariants: [{ color: 'premium', variant: 'card', class: { root: 'tracking-widest' } }],
    } } }, h(Checkbox, { color: 'premium', variant: 'card', modelValue: true, label: 'Upgrade' })))
    expect(wrapper.find('[data-selaras-color="premium"]').classes()).toContain('tracking-widest')
  })

  it('does not affect a button outside the Theme boundary', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => [
        h(Theme, { ui: { button: { slots: { base: 'rounded-full' } } } }, () => h('div', { id: 'inside' })),
        h(Button, { id: 'outside' }, () => 'Click me'),
      ],
    }))
    expect(wrapper.find('#outside').classes()).not.toContain('rounded-full')
  })

  it('applies scoped defaults to a button with no own size, but not to one with an explicit size', async () => {
    const wrapper = await mountSuspended(withTheme({ defaults: { button: { size: 'lg' } } }, [
      h(Button, { id: 'default-size' }, () => 'A'),
      h(Button, { id: 'explicit-size', size: 'sm' }, () => 'B'),
    ]))
    expect(wrapper.find('#default-size').classes()).toContain('h-11')
    expect(wrapper.find('#explicit-size').classes()).toContain('h-8')
  })

  it('updates descendant defaults when the scoped configuration changes', async () => {
    const defaults = ref<{ button: { size: 'sm' | 'lg' } }>({ button: { size: 'lg' } })
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { defaults: defaults.value }, () => h(Button, () => 'A')),
    }))
    expect(wrapper.find('button').classes()).toContain('h-11')
    defaults.value = { button: { size: 'sm' } }
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').classes()).toContain('h-8')
    expect(wrapper.find('button').classes()).not.toContain('h-11')
  })

  it('nested Theme components: the inner one wins for settings it sets, while inheriting the outer one\'s unset settings', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { ui: { button: { slots: { base: 'rounded-full' } } }, defaults: { button: { color: 'danger' } } }, () =>
        h(Theme, { defaults: { button: { size: 'lg' } } }, () =>
          h(Button, () => 'Click me'))),
    }))
    const classes = wrapper.find('button').classes()
    expect(classes).toContain('rounded-full') // inherited from the outer Theme
    expect(classes).toContain('h-11') // set by the inner Theme (size=lg)
    expect(wrapper.find('button').attributes('data-selaras-color')).toBe('danger') // inherited color=danger
  })
})
