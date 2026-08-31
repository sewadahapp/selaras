import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Avatar from '../../src/runtime/components/Avatar.vue'
import AvatarGroup from '../../src/runtime/components/AvatarGroup.vue'

describe('avatarGroup', () => {
  it('renders every child avatar', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      slots: {
        default: () => [
          h(Avatar, { text: 'AB' }),
          h(Avatar, { text: 'CD' }),
          h(Avatar, { text: 'EF' }),
        ],
      },
    })
    expect(wrapper.text()).toContain('AB')
    expect(wrapper.text()).toContain('CD')
    expect(wrapper.text()).toContain('EF')
  })

  it('shows all avatars when max is not set', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      slots: {
        default: () => [
          h(Avatar, { text: 'A' }),
          h(Avatar, { text: 'B' }),
          h(Avatar, { text: 'C' }),
        ],
      },
    })
    expect(wrapper.text()).not.toContain('+')
  })

  it('limits visible avatars and shows a count when max is set', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      props: { max: 2 },
      slots: {
        default: () => [
          h(Avatar, { text: 'A' }),
          h(Avatar, { text: 'B' }),
          h(Avatar, { text: 'C' }),
          h(Avatar, { text: 'D' }),
        ],
      },
    })
    expect(wrapper.text()).toContain('+2')
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
    expect(wrapper.text()).not.toContain('C')
    expect(wrapper.text()).not.toContain('D')
  })

  it('shows no count when the number of avatars equals max', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      props: { max: 3 },
      slots: {
        default: () => [
          h(Avatar, { text: 'A' }),
          h(Avatar, { text: 'B' }),
          h(Avatar, { text: 'C' }),
        ],
      },
    })
    expect(wrapper.text()).not.toContain('+')
  })

  it('applies the overlap ring classes to each avatar wrapper', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      slots: {
        default: () => [h(Avatar, { text: 'A' }), h(Avatar, { text: 'B' })],
      },
    })
    const items = wrapper.findAll('span').filter(sp =>
      sp.classes().includes('rounded-full')
      && sp.classes().some(c => c.startsWith('ring-'))
      && sp.classes().some(c => c.startsWith('-me-')),
    )
    expect(items.length).toBe(2)
  })

  it('applies size classes to the group', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      props: { size: 'lg' },
      slots: {
        default: () => [h(Avatar, { text: 'A' })],
      },
    })
    const items = wrapper.findAll('span').filter(sp => sp.classes().includes('ring-2') && sp.classes().includes('-me-2'))
    expect(items.length).toBeGreaterThanOrEqual(1)
  })

  it('propagates size to child avatars via inject', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      props: { size: 'lg' },
      slots: {
        default: () => [h(Avatar, { text: 'A' })],
      },
    })
    // The child avatar should pick up the group's lg size (size-10)
    expect(wrapper.find('.size-10').exists()).toBe(true)
  })

  it('lets an explicit avatar size override the group size', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      props: { size: 'lg' },
      slots: {
        default: () => [h(Avatar, { text: 'A', size: 'sm' })],
      },
    })
    // The child avatar should use its own sm size (size-6), not the group's lg
    expect(wrapper.find('.size-6').exists()).toBe(true)
    expect(wrapper.find('.size-10').exists()).toBe(false)
  })

  it('merges a fallthrough class with the root theme classes', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      attrs: { class: 'gap-2' },
      slots: {
        default: () => [h(Avatar, { text: 'A' })],
      },
    })
    expect(wrapper.classes()).toContain('gap-2')
    expect(wrapper.classes()).toContain('inline-flex')
  })
})
