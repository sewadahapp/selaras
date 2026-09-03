import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ContentSurround from '../../src/runtime/components/ContentSurround.vue'

describe('contentSurround', () => {
  it('renders nothing when neither prev nor next is given', async () => {
    const wrapper = await mountSuspended(ContentSurround, { props: {} })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('renders only a next link when prev is absent', async () => {
    const wrapper = await mountSuspended(ContentSurround, {
      props: { next: { title: 'Installation', path: '/overview/installation' } },
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]!.attributes('href')).toBe('/overview/installation')
    expect(links[0]!.text()).toContain('Installation')
  })

  it('renders only a prev link when next is absent', async () => {
    const wrapper = await mountSuspended(ContentSurround, {
      props: { prev: { title: 'Introduction', path: '/overview/introduction' } },
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]!.attributes('href')).toBe('/overview/introduction')
    expect(links[0]!.text()).toContain('Introduction')
  })

  it('renders both links, each pointing at its own page', async () => {
    const wrapper = await mountSuspended(ContentSurround, {
      props: {
        prev: { title: 'Badge', path: '/components/elements/badge' },
        next: { title: 'AvatarGroup', path: '/components/elements/avatar-group' },
      },
    })
    const links = wrapper.findAll('a')
    expect(links.map(l => l.attributes('href'))).toEqual([
      '/components/elements/badge',
      '/components/elements/avatar-group',
    ])
    expect(links[0]!.text()).toContain('Badge')
    expect(links[1]!.text()).toContain('AvatarGroup')
  })
})
