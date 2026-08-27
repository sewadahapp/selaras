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
    expect(icons[0]!.classes()).toContain('i-ph:spinner')
    expect(icons[0]!.classes()).toContain('animate-spin')
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('adds the raised shadow independently of variant', async () => {
    const wrapper = await mountSuspended(Button, { props: { raised: true, variant: 'ghost' } })
    expect(wrapper.classes().some(c => c.includes('shadow-'))).toBe(true)
  })

  it('sets aria-busy and an sr-only announcement while loading, neither when not', async () => {
    const idle = await mountSuspended(Button, { slots: { default: () => 'Save' } })
    expect(idle.attributes('aria-busy')).toBeUndefined()
    expect(idle.find('.sr-only').exists()).toBe(false)

    const busy = await mountSuspended(Button, { props: { loading: true }, slots: { default: () => 'Save' } })
    expect(busy.attributes('aria-busy')).toBe('true')
    expect(busy.find('.sr-only').text()).toBe('Loading')
  })

  it('adds an active (press) class alongside hover for every color/variant combination', async () => {
    const wrapper = await mountSuspended(Button, { props: { color: 'danger', variant: 'outline' } })
    expect(wrapper.classes().some(c => c.startsWith('active:'))).toBe(true)
  })

  it('lets the icon slot replace the icon prop\'s glyph entirely, still receiving the same size-driven class', async () => {
    const wrapper = await mountSuspended(Button, {
      props: { icon: 'lucide:save', size: 'lg' },
      slots: { icon: '<template #default="{ class: klass }"><span class="my-icon" :class="klass">*</span></template>' },
    })
    expect(wrapper.find('.iconify').exists()).toBe(false)
    const custom = wrapper.find('.my-icon')
    expect(custom.exists()).toBe(true)
    expect(custom.classes()).toContain('size-5')
  })

  it('stays square (icon-only) when only the icon slot is used, with no default slot content', async () => {
    const wrapper = await mountSuspended(Button, {
      props: { size: 'sm' },
      slots: { icon: '<span class="my-icon">*</span>' },
    })
    expect(wrapper.classes()).toContain('w-8')
    expect(wrapper.classes()).not.toContain('px-3')
  })

  it('shapes itself square when there is no default slot content (icon-only), matching size for width and height', async () => {
    const iconOnly = await mountSuspended(Button, { props: { icon: 'lucide:x', size: 'sm' } })
    expect(iconOnly.classes()).toContain('w-8')
    expect(iconOnly.classes()).not.toContain('px-3')

    const withLabel = await mountSuspended(Button, { props: { icon: 'lucide:save', size: 'sm' }, slots: { default: () => 'Save' } })
    expect(withLabel.classes()).not.toContain('w-8')
    expect(withLabel.classes()).toContain('px-3')
  })
})
