import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ContentToc from '../../src/runtime/components/ContentToc.vue'

// The root instance's own active-heading tracking depends on real layout
// (getBoundingClientRect/offsetTop against elements with matching ids in the
// document, driven by a scroll listener) - not meaningfully reproducible in
// happy-dom, which doesn't do real box layout. These tests instead cover
// what's actually testable without it: link/nesting structure, and how an
// already-known active id renders - by driving the isNested+activeIds path
// nested recursive calls use, which is plain prop-in/class-out with no
// layout dependency of its own.
describe('contentToc', () => {
  it('renders a link per top-level heading, defaulting the title to "On this page"', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: { links: [{ id: 'intro', text: 'Introduction', depth: 2 }, { id: 'usage', text: 'Usage', depth: 2 }] },
    })
    expect(wrapper.find('p').text()).toBe('On this page')
    const links = wrapper.findAll('a')
    expect(links.map(l => l.text())).toEqual(['Introduction', 'Usage'])
    expect(links.map(l => l.attributes('href'))).toEqual(['#intro', '#usage'])
  })

  it('accepts a custom title via prop or the title slot', async () => {
    const withProp = await mountSuspended(ContentToc, { props: { links: [], title: 'Contents' } })
    expect(withProp.find('p').text()).toBe('Contents')

    const withSlot = await mountSuspended(ContentToc, {
      props: { links: [] },
      slots: { title: () => 'Custom title' },
    })
    expect(withSlot.find('p').text()).toBe('Custom title')
  })

  it('nests a child heading\'s own link list under its parent item', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: {
        links: [{ id: 'parent', text: 'Parent', depth: 2, children: [{ id: 'child', text: 'Child', depth: 3 }] }],
      },
    })
    const nestedLink = wrapper.findAll('a').find(a => a.text() === 'Child')
    expect(nestedLink).toBeTruthy()
    expect(nestedLink!.attributes('href')).toBe('#child')
  })

  it('marks a link active (via the isNested+activeIds path recursive calls use) with the theme\'s active class', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: {
        links: [{ id: 'intro', text: 'Introduction', depth: 2 }],
        isNested: true,
        activeIds: new Set(['intro']),
      },
    })
    const link = wrapper.find('a')
    expect(link.classes().join(' ')).toContain('text-[var(--ui-primary)]')
  })

  it('does not apply the active class to a link whose id is absent from activeIds', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: {
        links: [{ id: 'intro', text: 'Introduction', depth: 2 }],
        isNested: true,
        activeIds: new Set(['other']),
      },
    })
    expect(wrapper.find('a').classes().join(' ')).not.toContain('text-[var(--ui-primary)]')
  })

  it('renders a nested instance as a plain div rather than a nav, with no title', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: { links: [{ id: 'a', text: 'A', depth: 2 }], isNested: true, activeIds: new Set<string>() },
    })
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('the link slot replaces a link\'s content, scoped with link and active', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: {
        links: [{ id: 'intro', text: 'Introduction', depth: 2 }],
        isNested: true,
        activeIds: new Set(['intro']),
      },
      slots: { link: '<template #link="{ link, active }">[{{ link.text }}:{{ active }}]</template>' },
    })
    expect(wrapper.find('a').text()).toBe('[Introduction:true]')
  })

  it('the link slot also applies to a nested child link', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: {
        links: [{ id: 'parent', text: 'Parent', depth: 2, children: [{ id: 'child', text: 'Child', depth: 3 }] }],
      },
      slots: { link: '<template #link="{ link }">[{{ link.text }}]</template>' },
    })
    const nestedLink = wrapper.findAll('a').find(a => a.text() === '[Child]')
    expect(nestedLink).toBeTruthy()
  })

  it('falls back to the plain text when the link slot is unset', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: { links: [{ id: 'intro', text: 'Introduction', depth: 2 }] },
    })
    expect(wrapper.find('a').text()).toBe('Introduction')
  })

  it('gives the active link aria-current="location", and no aria-current on an inactive one', async () => {
    const wrapper = await mountSuspended(ContentToc, {
      props: {
        links: [{ id: 'intro', text: 'Introduction', depth: 2 }, { id: 'usage', text: 'Usage', depth: 2 }],
        isNested: true,
        activeIds: new Set(['intro']),
      },
    })
    const links = wrapper.findAll('a')
    expect(links[0]!.attributes('aria-current')).toBe('location')
    expect(links[1]!.attributes('aria-current')).toBeUndefined()
  })
})
