import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Card from '../../src/runtime/components/Card.vue'

describe('card', () => {
  it('renders the default slot as the body', async () => {
    const wrapper = await mountSuspended(Card, { slots: { default: () => 'Body content' } })
    expect(wrapper.text()).toBe('Body content')
  })

  it('omits the header region entirely when no header slot is given', async () => {
    const wrapper = await mountSuspended(Card, { slots: { default: () => 'Body' } })
    expect(wrapper.findAll('div').length).toBe(2) // root + body only
  })

  it('renders the header slot when given, alongside the body', async () => {
    const wrapper = await mountSuspended(Card, {
      slots: { header: () => 'Title', default: () => 'Body' },
    })
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Body')
  })

  it('omits the footer region entirely when no footer slot is given', async () => {
    const wrapper = await mountSuspended(Card, { slots: { default: () => 'Body' } })
    expect(wrapper.html()).not.toContain('border-t')
  })

  it('renders the footer slot when given, alongside the body', async () => {
    const wrapper = await mountSuspended(Card, {
      slots: { default: () => 'Body', footer: () => 'Actions' },
    })
    expect(wrapper.text()).toContain('Body')
    expect(wrapper.text()).toContain('Actions')
  })

  it('renders header, body and footer together in order', async () => {
    const wrapper = await mountSuspended(Card, {
      slots: { header: () => 'Title', default: () => 'Body', footer: () => 'Actions' },
    })
    expect(wrapper.text()).toBe('TitleBodyActions')
  })

  it('defaults to the outline variant', async () => {
    const wrapper = await mountSuspended(Card, { slots: { default: () => 'Body' } })
    expect(wrapper.classes()).toContain('ring-1')
  })

  it('applies the solid variant classes', async () => {
    const wrapper = await mountSuspended(Card, { props: { variant: 'solid' }, slots: { default: () => 'Body' } })
    expect(wrapper.classes()).toContain('shadow-[var(--ui-shadow-md)]')
  })

  it('applies the soft variant classes', async () => {
    const wrapper = await mountSuspended(Card, { props: { variant: 'soft' }, slots: { default: () => 'Body' } })
    expect(wrapper.classes()).toContain('bg-[var(--ui-bg-elevated)]')
    expect(wrapper.classes()).not.toContain('ring-1')
  })

  it('merges a fallthrough class attr with the theme root classes instead of dropping it', async () => {
    const wrapper = await mountSuspended(Card, {
      slots: { default: () => 'Body' },
      attrs: { class: 'mt-4' },
    })
    expect(wrapper.classes()).toContain('mt-4')
    expect(wrapper.classes().length).toBeGreaterThan(1)
  })

  it('merges a string :ui.root override with the theme root classes', async () => {
    const wrapper = await mountSuspended(Card, {
      props: { ui: { root: 'custom-class' } },
      slots: { default: () => 'Body' },
    })
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('applies non-class attrs from an object :ui.root override without tailwind-merging them', async () => {
    const wrapper = await mountSuspended(Card, {
      props: { ui: { root: { 'class': 'custom-class', 'data-testid': 'my-card' } } },
      slots: { default: () => 'Body' },
    })
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.attributes('data-testid')).toBe('my-card')
  })
})
