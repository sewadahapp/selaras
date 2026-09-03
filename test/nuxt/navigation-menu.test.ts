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

  it('the dropdown spans the full width of the nav bar - regression, it used to size itself to the narrowest possible content (120px for a short child list)', async () => {
    const wrapper = await mountSuspended(NavigationMenu, { props: { items } })

    const trigger = wrapper.find('button')
    trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const viewport = wrapper.find('a[href="/guides/getting-started"]').element.closest('[class*="z-\\[var(--ui-z-dropdown)\\]"]')
    expect(viewport?.className).toContain('w-full')
  })
})

describe('navigationMenu (slots)', () => {
  const items: NavigationMenuItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Guides', children: [
      { label: 'Getting started', to: '/guides/getting-started' },
    ] },
  ]

  async function openGuides(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
    wrapper.find('button').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()
  }

  it('the generic item-content slot replaces a dropdown\'s entire body', async () => {
    const wrapper = await mountSuspended(NavigationMenu, {
      props: { items },
      slots: { 'item-content': '<template #item-content="{ item }">Custom for {{ item.label }}</template>' },
    })
    await openGuides(wrapper)

    expect(wrapper.text()).toContain('Custom for Guides')
    expect(wrapper.find('a[href="/guides/getting-started"]').exists()).toBe(false)
  })

  it('item.slot + a matching named -content slot wins over the generic item-content slot', async () => {
    const named: NavigationMenuItem[] = [
      { label: 'Guides', slot: 'guidesMenu', children: [{ label: 'Getting started', to: '/guides/getting-started' }] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, {
      props: { items: named },
      slots: {
        'item-content': '<template #item-content>Generic</template>',
        'guidesMenu-content': '<template #guidesMenu-content="{ item }">Named for {{ item.label }}</template>',
      },
    })
    await openGuides(wrapper)

    expect(wrapper.text()).toContain('Named for Guides')
    expect(wrapper.text()).not.toContain('Generic')
  })

  it('item-leading/item-label/item-trailing each independently replace just their own piece', async () => {
    const wrapper = await mountSuspended(NavigationMenu, {
      props: { items: [{ label: 'Docs', icon: 'lucide:book', to: '/docs' }] },
      slots: {
        'item-leading': '<template #item-leading>[icon]</template>',
        'item-label': '<template #item-label="{ item }">[{{ item.label }}]</template>',
      },
    })

    const link = wrapper.find('a[href="/docs"]')
    expect(link.text()).toBe('[icon][Docs]')
  })

  it('list-leading and list-trailing render outside the item list', async () => {
    const wrapper = await mountSuspended(NavigationMenu, {
      props: { items: [{ label: 'Docs', to: '/docs' }] },
      slots: {
        'list-leading': '<template #list-leading><span class="my-logo">Logo</span></template>',
        'list-trailing': '<template #list-trailing><button class="my-cta">Sign up</button></template>',
      },
    })

    expect(wrapper.find('.my-logo').exists()).toBe(true)
    expect(wrapper.find('.my-cta').exists()).toBe(true)
  })

  it('the item-content override also works in vertical mode, through the recursive accordion relay', async () => {
    const wrapper = await mountSuspended(NavigationMenu, {
      props: { items, orientation: 'vertical' },
      slots: { 'item-content': '<template #item-content="{ item }">Custom for {{ item.label }}</template>' },
    })
    const trigger = wrapper.findAll('button').find(b => b.text() === 'Guides')!
    trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(wrapper.text()).toContain('Custom for Guides')
    expect(wrapper.find('a[href="/guides/getting-started"]').exists()).toBe(false)
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

  it('the nested list stays a normal single-column, in-flow list - regression, horizontal\'s own absolute-positioned multi-column dropdown styling leaked into vertical\'s accordion content too', async () => {
    const wrapper = await mountSuspended(NavigationMenu, {
      props: { items: [{ label: 'Level 1', children: [{ label: 'Level 2', to: '/deep/level-2' }] }], orientation: 'vertical' },
    })
    findTrigger(wrapper, 'Level 1').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    // max-h-[70vh] is a unique marker only ever added by the horizontal
    // variant of the `content` slot - its presence anywhere in a vertical
    // render means the two got merged again.
    expect(wrapper.html()).not.toContain('max-h-[70vh]')
    const list = wrapper.find('a[href="/deep/level-2"]').element.closest('ul')
    expect(list?.className).not.toContain('grid-cols-[repeat(auto-fill')
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

describe('navigationMenu (collapsed)', () => {
  it('visually hides a leaf item\'s label (sr-only, not removed) while keeping its icon', async () => {
    const items: NavigationMenuItem[] = [{ label: 'Docs', icon: 'lucide:book', to: '/docs' }]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical', collapsed: true } })

    const link = wrapper.find('a[href="/docs"]')
    expect(link.text()).toBe('Docs')
    const label = link.findAll('span').find(s => s.text() === 'Docs')
    expect(label?.classes()).toContain('sr-only')
    expect(link.find('.iconify').exists()).toBe(true)
  })

  it('renders a parent-with-children as a plain inert item, not an expandable accordion trigger', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Guides', icon: 'lucide:book', children: [{ label: 'Getting started', to: '/guides/getting-started' }] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical', collapsed: true } })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('.iconify').exists()).toBe(true)
    expect(wrapper.find('a[href="/guides/getting-started"]').exists()).toBe(false)
  })
})
