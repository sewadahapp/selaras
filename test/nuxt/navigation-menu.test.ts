import type { NavigationMenuItem } from '../../src/runtime/utils/navigation-menu'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NavigationMenu from '../../src/runtime/components/NavigationMenu.vue'

function macrotask() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

describe('navigationMenu (horizontal)', () => {
  const items: NavigationMenuItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Docs', to: '/docs' },
    { label: 'Guides', children: [
      { label: 'Getting started', to: '/guides/getting-started' },
      { label: 'Advanced', to: '/guides/advanced' },
    ] },
  ]

  it('renders a leaf item as a real link to its path', async () => {
    const wrapper = await mountSuspended(NavigationMenu, { props: { items }, route: '/docs' })

    const link = wrapper.find('a[href="/docs"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Docs')
  })

  it('marks the item matching the current route active, via Reka\'s own aria-current', async () => {
    const wrapper = await mountSuspended(NavigationMenu, { props: { items }, route: '/docs' })

    const active = wrapper.find('a[href="/docs"]')
    const inactive = wrapper.find('a[href="/"]')
    expect(active.attributes('aria-current')).toBe('page')
    expect(inactive.attributes('aria-current')).toBeUndefined()
  })

  it('item.active overrides the auto-detected route match in both directions', async () => {
    const withOverride: NavigationMenuItem[] = [
      { label: 'Home', to: '/', active: false },
      { label: 'Docs', to: '/docs', active: true },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items: withOverride }, route: '/' })

    expect(wrapper.find('a[href="/"]').attributes('aria-current')).toBeUndefined()
    expect(wrapper.find('a[href="/docs"]').attributes('aria-current')).toBe('page')
  })

  it('an item with children renders a trigger that opens content containing the children', async () => {
    const wrapper = await mountSuspended(NavigationMenu, { props: { items } })

    const trigger = wrapper.find('button')
    expect(trigger.text()).toContain('Guides')

    // NavigationMenuContent teleports into this component's own rendered
    // NavigationMenuViewport (not document.body) since a Viewport is
    // always present here - it stays within `wrapper`'s own DOM subtree,
    // unlike Modal/Toast's teleport-to-document.body.
    trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const content = wrapper.find('a[href="/guides/getting-started"]')
    expect(content.exists()).toBe(true)
    expect(content.text()).toBe('Getting started')
  })

  it('a disabled item does not navigate and is marked aria-disabled', async () => {
    const disabled: NavigationMenuItem[] = [{ label: 'Docs', to: '/docs', disabled: true }]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items: disabled } })

    const link = wrapper.find('a[href="/docs"]')
    expect(link.attributes('aria-disabled')).toBe('true')
  })

  it('color/variant/highlight reach the rendered link classes', async () => {
    const wrapper = await mountSuspended(NavigationMenu, {
      props: { items: [{ label: 'Docs', to: '/docs' }], color: 'danger', variant: 'link', highlight: true },
      route: '/docs',
    })

    const link = wrapper.find('a[href="/docs"]')
    expect(link.classes()).toContain('text-[var(--ui-danger)]')
    expect(link.classes().some(c => c.includes('after:'))).toBe(true)
  })
})

describe('navigationMenu (vertical)', () => {
  const deepItems: NavigationMenuItem[] = [
    { label: 'Level 1', children: [
      { label: 'Level 2', children: [
        { label: 'Level 3', to: '/deep/level-3' },
      ] },
    ] },
  ]

  // Each accordion group starts collapsed by design (`:default-value="[]"`
  // in NavigationMenuAccordionItem.vue - a generic nested nav menu
  // shouldn't force every group open the way ContentNavigation's docs
  // sidebar does), so reaching a deep leaf means expanding every ancestor
  // group's trigger button by its label first.
  function findTrigger(wrapper: { findAll: (selector: string) => { text: () => string, element: Element }[] }, label: string) {
    return wrapper.findAll('button').find(b => b.text() === label)!
  }

  it('renders nested children inside an accordion, to arbitrary depth', async () => {
    const wrapper = await mountSuspended(NavigationMenu, { props: { items: deepItems, orientation: 'vertical' } })
    findTrigger(wrapper, 'Level 1').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()
    findTrigger(wrapper, 'Level 2').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const leaf = wrapper.find('a[href="/deep/level-3"]')
    expect(leaf.exists()).toBe(true)
    expect(leaf.text()).toBe('Level 3')
  })

  it('clicking a deep leaf link fires its onSelect callback', async () => {
    let selected = false
    const items: NavigationMenuItem[] = [
      { label: 'Level 1', children: [
        { label: 'Level 2', to: '/deep/level-2', onSelect: () => { selected = true } },
      ] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })
    findTrigger(wrapper, 'Level 1').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    wrapper.find('a[href="/deep/level-2"]').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()

    expect(selected).toBe(true)
  })

  it('a disabled leaf link in a nested tree does not fire onSelect', async () => {
    let selected = false
    const items: NavigationMenuItem[] = [
      { label: 'Level 1', children: [
        { label: 'Level 2', to: '/deep/level-2', disabled: true, onSelect: () => { selected = true } },
      ] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })
    findTrigger(wrapper, 'Level 1').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const leaf = wrapper.find('a[href="/deep/level-2"]')
    expect(leaf.attributes('aria-disabled')).toBe('true')
    leaf.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()

    expect(selected).toBe(false)
  })
})
