import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Accordion from '../../src/runtime/components/Accordion.vue'
import Autocomplete from '../../src/runtime/components/Autocomplete.vue'
import Avatar from '../../src/runtime/components/Avatar.vue'
import AvatarGroup from '../../src/runtime/components/AvatarGroup.vue'
import Badge from '../../src/runtime/components/Badge.vue'
import Breadcrumb from '../../src/runtime/components/Breadcrumb.vue'
import Button from '../../src/runtime/components/Button.vue'
import ButtonGroup from '../../src/runtime/components/ButtonGroup.vue'
import Card from '../../src/runtime/components/Card.vue'
import CardGroup from '../../src/runtime/components/CardGroup.vue'
import Checkbox from '../../src/runtime/components/Checkbox.vue'
import Collapsible from '../../src/runtime/components/Collapsible.vue'
import ColorPicker from '../../src/runtime/components/ColorPicker.vue'
import Container from '../../src/runtime/components/Container.vue'
import ContextMenu from '../../src/runtime/components/ContextMenu.vue'
import FileUpload from '../../src/runtime/components/FileUpload.vue'
import Header from '../../src/runtime/components/Header.vue'
import InputGroup from '../../src/runtime/components/InputGroup.vue'
import PageAside from '../../src/runtime/components/PageAside.vue'
import PageHeader from '../../src/runtime/components/PageHeader.vue'
import Pagination from '../../src/runtime/components/Pagination.vue'
import Popover from '../../src/runtime/components/Popover.vue'
import ScrollArea from '../../src/runtime/components/ScrollArea.vue'
import Select from '../../src/runtime/components/Select.vue'
import Skeleton from '../../src/runtime/components/Skeleton.vue'
import Stepper from '../../src/runtime/components/Stepper.vue'
import Tabs from '../../src/runtime/components/Tabs.vue'
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

  it('applies a scoped UI override to a portalled Popover without granting it prop defaults', async () => {
    const popover = h(Popover, { open: true }, {
      default: () => h('button', 'Open'),
      content: () => h('span', { 'data-testid': 'typed-popover-content' }, 'Content'),
    })
    const wrapper = await mountSuspended(withTheme({ ui: { popover: { slots: { content: 'max-w-[17rem]' } } } }, popover))
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(document.querySelector('[data-testid="typed-popover-content"]')?.parentElement?.classList).toContain('max-w-[17rem]')
    wrapper.unmount()
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

  it('passes custom roles to disclosure and navigation recipe conditions', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: {
      accordion: { compoundVariants: [{ color: 'premium', variant: 'pill', class: { root: 'outline-dashed' } }] },
      collapsible: { compoundVariants: [{ color: 'premium', direction: 'up', class: { root: 'outline-dotted' } }] },
      stepper: { compoundVariants: [{ color: 'premium', orientation: 'vertical', class: { root: 'outline-double' } }] },
      tabs: { compoundVariants: [{ color: 'premium', variant: 'pill', class: { root: 'outline-solid' } }] },
    } }, [
      h(Accordion, { items: [{ value: 'one', label: 'One' }], color: 'premium', variant: 'pill' }),
      h(Collapsible, { color: 'premium', direction: 'up' }, { trigger: () => 'Toggle', default: () => 'Content' }),
      h(Stepper, { items: [{ title: 'One' }], color: 'premium', orientation: 'vertical' }),
      h(Tabs, { items: [{ label: 'One', value: 'one' }], color: 'premium', variant: 'pill', defaultValue: 'one' }),
    ]))

    const roots = wrapper.findAll('[data-selaras-color="premium"]')
    expect(roots[0]?.classes()).toContain('outline-dashed')
    expect(roots[1]?.classes()).toContain('outline-dotted')
    expect(roots[2]?.classes()).toContain('outline-double')
    expect(roots[3]?.classes()).toContain('outline-solid')
  })

  it('keeps Breadcrumb and Pagination recipes separate from their composed components', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: {
      breadcrumb: { compoundVariants: [{ color: 'premium', class: { root: 'outline-offset-2' } }] },
      pagination: { compoundVariants: [{ size: 'sm', class: { root: 'outline-offset-4' } }] },
      button: { slots: { base: 'font-mono' } },
    } }, [
      h(Breadcrumb, {
        id: 'themed-breadcrumb',
        items: [{ label: 'Home', to: '/' }, { label: 'Current' }],
        color: 'premium',
      }),
      h(Pagination, {
        id: 'themed-pagination',
        total: 20,
        itemsPerPage: 10,
        size: 'sm',
        color: 'premium',
        activeColor: 'premium',
      }),
    ]))

    expect(wrapper.find('#themed-breadcrumb').classes()).toContain('outline-offset-2')
    const pagination = wrapper.find('#themed-pagination')
    expect(pagination.classes()).toContain('outline-offset-4')
    expect(pagination.findAll('button').every(button => button.classes().includes('font-mono'))).toBe(true)
  })

  it('applies scoped recipes to foundation layout components', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: {
      card: { compoundVariants: [{ variant: 'solid', class: { root: 'outline-dashed' } }] },
      cardGroup: { compoundVariants: [{ cols: 3, class: { root: 'outline-dotted' } }] },
      container: { compoundVariants: [{ size: 'sm', class: { base: 'outline-double' } }] },
      header: { slots: { root: 'outline-solid' } },
      pageHeader: { slots: { root: 'outline-offset-2' } },
      skeleton: { compoundVariants: [{ animation: 'shimmer', class: { base: 'outline-offset-4' } }] },
    } }, [
      h(Card, { id: 'themed-card', variant: 'solid' }, () => 'Card'),
      h(CardGroup, { id: 'themed-card-group', cols: 3 }),
      h(Container, { id: 'themed-container', size: 'sm' }),
      h(Header, { id: 'themed-header' }),
      h(PageHeader, { id: 'themed-page-header', title: 'Heading' }),
      h(Skeleton, { id: 'themed-skeleton', animation: 'shimmer' }),
    ]))

    expect(wrapper.find('#themed-card').classes()).toContain('outline-dashed')
    expect(wrapper.find('#themed-card-group').classes()).toContain('outline-dotted')
    expect(wrapper.find('#themed-container').classes()).toContain('outline-double')
    expect(wrapper.find('#themed-header').classes()).toContain('outline-solid')
    expect(wrapper.find('#themed-page-header').classes()).toContain('outline-offset-2')
    expect(wrapper.find('#themed-skeleton').classes()).toContain('outline-offset-4')
  })

  it('keeps composition wrapper recipes separate from nested component recipes', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: {
      avatar: { slots: { base: 'font-mono' } },
      avatarGroup: { compoundVariants: [{ size: 'lg', class: { root: 'outline-dashed' } }] },
      button: { slots: { base: 'font-mono' } },
      buttonGroup: { compoundVariants: [{ orientation: 'vertical', class: { root: 'outline-dotted' } }] },
      inputGroup: { compoundVariants: [{ orientation: 'vertical', class: { root: 'outline-double' } }] },
      pageAside: { slots: { root: 'outline-solid', scrollArea: 'max-h-40' } },
      scrollArea: { slots: { root: 'font-mono' } },
    } }, [
      h(AvatarGroup, { id: 'themed-avatar-group', size: 'lg' }, () => h(Avatar, { text: 'A' })),
      h(ButtonGroup, { id: 'themed-button-group', orientation: 'vertical' }, () => h(Button, () => 'Button')),
      h(InputGroup, { id: 'themed-input-group', orientation: 'vertical' }, () => h('input')),
      h(PageAside, { id: 'themed-page-aside' }, () => 'Aside'),
      h(ScrollArea, { id: 'themed-scroll-area' }, () => 'Area'),
    ]))

    expect(wrapper.find('#themed-avatar-group').classes()).toContain('outline-dashed')
    expect(wrapper.find('#themed-avatar-group').find('[data-selaras-color]').classes()).toContain('font-mono')
    expect(wrapper.find('#themed-button-group').classes()).toContain('outline-dotted')
    expect(wrapper.find('#themed-button-group').find('button').classes()).toContain('font-mono')
    expect(wrapper.find('#themed-input-group').classes()).toContain('outline-double')
    expect(wrapper.find('#themed-page-aside').classes()).toContain('outline-solid')
    expect(wrapper.find('#themed-page-aside').findComponent(ScrollArea).classes()).toContain('max-h-40')
    expect(wrapper.find('#themed-scroll-area').classes()).toContain('font-mono')
  })

  it('uses one Select recipe extension for Select and Autocomplete custom roles', async () => {
    const items = [{ label: 'One', value: 'one' }]
    const wrapper = await mountSuspended(withTheme({ ui: { select: {
      compoundVariants: [{ color: 'premium', class: { trigger: 'tracking-widest' } }],
    } } }, [
      h(Select<(typeof items)[number]>, { id: 'themed-select', items, color: 'premium' }),
      h(Autocomplete<(typeof items)[number]>, { id: 'themed-autocomplete', items, color: 'premium' }),
    ]))

    const selectTrigger = wrapper.find('#themed-select')
    const autocompleteTrigger = wrapper.find('#themed-autocomplete').element.parentElement
    expect(selectTrigger.classes()).toContain('tracking-widest')
    expect(autocompleteTrigger?.classList).toContain('tracking-widest')
    expect(selectTrigger.classes()).toContain('focus:ring-[var(--_selaras-color-focus)]')
    expect(autocompleteTrigger?.classList).toContain('focus-within:ring-[var(--_selaras-color-focus)]')
  })

  it('passes custom roles to typed Avatar, ColorPicker, and FileUpload recipe conditions', async () => {
    const wrapper = await mountSuspended(withTheme({ ui: {
      avatar: { compoundVariants: [{ color: 'premium', class: { base: 'tracking-tight' } }] },
      colorPicker: { compoundVariants: [{ color: 'premium', class: { trigger: 'tracking-wide' } }] },
      fileUpload: { compoundVariants: [{ color: 'premium', class: { dropzone: 'tracking-widest' } }] },
    } }, [
      h(Avatar, { text: 'P', color: 'premium' }),
      h(ColorPicker, { color: 'premium' }),
      h(FileUpload, { color: 'premium' }),
    ]))

    const roleRoots = wrapper.findAll('[data-selaras-color="premium"]')
    expect(roleRoots[0]?.classes()).toContain('tracking-tight')
    expect(roleRoots[1]?.classes()).toContain('tracking-wide')
    expect(roleRoots[2]?.find('button').classes()).toContain('tracking-widest')
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
