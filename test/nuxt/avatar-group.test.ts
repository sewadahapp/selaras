import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { Comment, Fragment, h, nextTick, ref, Text } from 'vue'
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

  it('counts nested list fragments as individual avatars and ignores placeholders', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      props: { max: 2 },
      slots: {
        default: () => [
          h(Comment),
          h(Text, ' '),
          h(Fragment, [
            h(Fragment, [h(Avatar, { key: 'A', text: 'A' })]),
            h(Fragment, [h(Avatar, { key: 'B', text: 'B' })]),
            h(Fragment, [h(Avatar, { key: 'C', text: 'C' })]),
          ]),
        ],
      },
    })
    expect(wrapper.text()).toContain('+1')
    expect(wrapper.findAllComponents(Avatar).map(avatar => avatar.props('text'))).toEqual(['A', 'B'])
    const items = wrapper.findAll(':scope > span').filter(item => item.classes().includes('-me-1.5') && !item.classes().includes('size-8'))
    expect(items).toHaveLength(2)
    for (const item of items)
      expect(item.findAllComponents(Avatar)).toHaveLength(1)
  })

  it('updates the visible list and overflow count when list fragments change', async () => {
    const people = ref(['A', 'B', 'C'])
    const wrapper = await mountSuspended(AvatarGroup, {
      props: { max: 2 },
      slots: { default: () => [h(Fragment, people.value.map(text => h(Avatar, { key: text, text })))] },
    })
    expect(wrapper.text()).toContain('+1')
    const firstAvatar = wrapper.findAllComponents(Avatar)[0]!.element
    people.value = ['C', 'A', 'D', 'E']
    await nextTick()
    expect(wrapper.findAllComponents(Avatar).map(avatar => avatar.props('text'))).toEqual(['C', 'A'])
    expect(wrapper.findAllComponents(Avatar)[1]!.element).toBe(firstAvatar)
    expect(wrapper.text()).toContain('+2')
    await wrapper.setProps({ max: 3 })
    expect(wrapper.findAllComponents(Avatar).map(avatar => avatar.props('text'))).toEqual(['C', 'A', 'D'])
    expect(wrapper.text()).toContain('+1')
    people.value = []
    await nextTick()
    expect(wrapper.findAllComponents(Avatar)).toHaveLength(0)
    expect(wrapper.text()).toBe('')
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
