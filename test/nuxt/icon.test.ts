import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Button from '../../src/runtime/components/Button.vue'
import Icon from '../../src/runtime/components/Icon.vue'
import Theme from '../../src/runtime/components/Theme.vue'

describe('icon', () => {
  it('binds a custom semantic role to the icon root', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star', color: 'premium' as any } })
    expect(wrapper.find('[data-selaras-color="premium"]').exists()).toBe(true)
    expect(wrapper.find('[data-selaras-color="premium"]').attributes('style') ?? '').not.toContain('--_selaras-color-fill')
    expect(wrapper.find('.iconify').classes()).toContain('text-[var(--_selaras-color-indicator)]')
  })

  it('passes a custom role to public recipe conditions', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { ui: { icon: {
        compoundVariants: [{ color: 'premium', class: { base: 'opacity-75' } }],
      } } }, () => h(Icon, { name: 'lucide:star', color: 'premium' })),
    }))

    expect(wrapper.find('.iconify').classes()).toContain('opacity-75')
  })

  it('applies the shared recipe to internal icons while the owner controls conflicting classes', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { ui: { icon: { slots: { base: 'size-8 opacity-75' } } } }, () =>
        h(Button, { icon: 'lucide:star', size: 'sm' })),
    }))

    const icon = wrapper.find('.iconify')
    expect(icon.classes()).toContain('opacity-75')
    expect(icon.classes()).toContain('size-4')
    expect(icon.classes()).not.toContain('size-8')
  })

  it('renders the named icon', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star' } })
    expect(wrapper.find('.iconify').classes()).toContain('i-lucide:star')
  })

  // No size prop by design - every internal consumer (Badge, Button, Chip,
  // Input, ...) needs its own precise size that doesn't map onto a shared
  // enum, so sizing is just whatever class a caller passes, merged in like
  // any other fallthrough class (see Badge's equivalent test).
  it('has no built-in size - a passed-in class applies directly', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star' }, attrs: { class: 'size-6' } })
    expect(wrapper.find('.iconify').classes()).toContain('size-6')
  })

  it('does not force a color by default, so it inherits currentColor', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star' } })
    const classes = wrapper.find('.iconify').classes()
    expect(classes.some(c => c.startsWith('text-'))).toBe(false)
  })

  it('applies a semantic color when given', async () => {
    const wrapper = await mountSuspended(Icon, { props: { name: 'lucide:star', color: 'danger' } })
    expect(wrapper.find('.iconify').classes()).toContain('text-[var(--_selaras-color-indicator)]')
  })

  it('lets a passed-in class override the color prop, same tailwind-merge as everywhere else', async () => {
    const wrapper = await mountSuspended(Icon, {
      props: { name: 'lucide:star', color: 'danger' },
      attrs: { class: 'text-[var(--_selaras-color-fill)]' },
    })
    const classes = wrapper.find('.iconify').classes()
    expect(classes).toContain('text-[var(--_selaras-color-fill)]')
  })
})
