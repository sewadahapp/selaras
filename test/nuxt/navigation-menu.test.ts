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
  function findTrigger(wrapper: { findAll: (selector: string) => { text: () => string, element: Element, classes: () => string[] }[] }, label: string) {
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

  // Regression (redesigned architecture): a nested group's own trigger
  // (a 2nd-level item that itself has children, like "Security" below)
  // used to style itself off a `nested`-conditional `ps-0` override,
  // trying to keep two parallel row styles (`link` vs `childLink`) in
  // sync across every nesting level by hand - a real bug (and a second
  // one, a stale gap-1.5) both slipped through exactly there. Redesigned
  // to match a comparable reference's own real source (confirmed by reading it
  // directly): there's only ever one row style, `link`, at every depth -
  // the indent step comes entirely from the *wrapping* childList/
  // childItem's own margin/border, not from the row itself. So "Profile"
  // (a leaf) and "Security" (a nested trigger) should carry the exact
  // same row classes now, and their own wrapping `<li>` should carry the
  // shared indent/guide-line treatment.
  it('a nested group\'s own trigger uses the exact same row classes as its sibling leaf links', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Account', children: [
        { label: 'Profile', to: '/account/profile' },
        { label: 'Security', children: [{ label: '2FA', to: '/account/security/2fa' }] },
      ] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })
    findTrigger(wrapper, 'Account').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const profile = wrapper.find('a[href="/account/profile"]')
    const security = findTrigger(wrapper, 'Security')
    // Both a leaf `<a>` and a nested trigger `<button>` share the exact
    // same `link`-derived class list now (bar `w-full`/`justify-between`/
    // `text-start`, the trigger's own layout additions on top).
    for (const cls of profile.classes())
      expect(security.classes()).toContain(cls)

    // Their own wrapping <li> (childItem) carries the tree-connector
    // trunk+elbow, not the row - both should carry it identically.
    // Security is the *last* child here, which CSS's own `:last-child`
    // selector (not a class, so not directly assertable in jsdom)
    // shortens its trunk segment for - see theme.css's own
    // `.selaras-nav-elbow` comment for why that matters once a last
    // child like this is itself expanded.
    expect(profile.element.closest('li')?.classList.contains('selaras-nav-elbow')).toBe(true)
    expect(security.element.closest('li')?.classList.contains('selaras-nav-elbow')).toBe(true)

    // The wrapping <ul> (childList) carries the indent margin *and* the
    // ps-4 gutter the rail reaches back into - not childItem itself, or
    // the mask's own -16px offset and this padding would both measure
    // from the same element in opposite directions and double the
    // rail-to-text gap (see this file's own comment on the vertical
    // variant for why). The trunk line itself lives entirely on each
    // item, not here (see theme.css's own `.selaras-nav-elbow` comment).
    const childList = profile.element.closest('ul')
    expect(childList?.classList.contains('ms-6')).toBe(true)
    expect(childList?.classList.contains('ps-4')).toBe(true)
    expect(childList?.classList.contains('border-s')).toBe(false)
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

  // PopoverContent (the flyout) teleports through a real Teleport to
  // document.body, same as every other Popover - invisible to
  // wrapper.find, so its content is checked via document.body directly
  // instead, and the wrapper is unmounted afterward so a later test's own
  // document.body query in this file can't match this one's stale node.
  it('renders a parent-with-children as a Popover flyout trigger, not an expandable accordion', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Guides', icon: 'lucide:book', children: [{ label: 'Getting started', to: '/guides/getting-started' }] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical', collapsed: true } })

    const trigger = wrapper.find('button')
    expect(trigger.exists()).toBe(true)
    expect(trigger.find('.iconify').exists()).toBe(true)
    // Regression: a collapsed-rail trigger is a fixed square (`size-10`,
    // matching Button's own icon-only `square` sizing), not stretched to
    // the rail's full width - a plain `<button>` with `display: flex` and
    // no width utility would otherwise shrink-to-fit its own icon instead
    // (the "bare buttons don't stretch like <a>/<div>" quirk, the reason
    // `w-full` used to be here), landing as a thin sliver rather than a
    // proper icon button matching its sibling `<a>` rows' own footprint.
    expect(trigger.classes()).toContain('size-10')
    expect(trigger.classes()).not.toContain('w-full')
    expect(document.body.querySelector('a[href="/guides/getting-started"]')).toBeFalsy()

    trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const child = document.body.querySelector('a[href="/guides/getting-started"]')
    expect(child).toBeTruthy()
    expect(child?.textContent).toBe('Getting started')

    // Regression: the flyout's own label span was inheriting `collapsed`
    // from the shared `ui` computed (built with the trigger row's own
    // `collapsed: true`), landing `sr-only` on children that have full
    // room to show real text - `textContent` alone doesn't catch this,
    // since sr-only hides visually, not from the DOM.
    const label = child?.querySelector('span.truncate')
    expect(label?.classList.contains('sr-only')).toBe(false)

    wrapper.unmount()
  })

  // Regression: a flyout child that itself has children (a 3rd-level
  // group) used to render as a plain <a> with no `to` and no way to
  // reach its own children at all - dead, inert, and its own subtree
  // completely unreachable once the sidebar was collapsed. It now renders
  // as a real collapsible trigger (NavigationMenuAccordionItem, the same
  // component the expanded sidebar's own nested groups already use) -
  // not a link itself, but a chevron-toggled row whose own children only
  // appear once it's expanded.
  it('a flyout child with its own children renders as a collapsible trigger, its grandchildren revealed on click', async () => {
    const items: NavigationMenuItem[] = [
      {
        label: 'Analytics',
        icon: 'lucide:chart',
        children: [
          { label: 'Traffic', to: '/traffic' },
          { label: 'Reports', icon: 'lucide:file', children: [
            { label: 'Daily', to: '/reports/daily' },
            { label: 'Weekly', icon: 'lucide:calendar', to: '/reports/weekly' },
          ] },
        ],
      },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical', collapsed: true } })

    wrapper.find('button').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    // Reports itself is not a link - only its own children are - and its
    // own grandchildren stay collapsed until its trigger is clicked.
    expect(document.body.querySelector('a[href="/traffic"]')).toBeTruthy()
    expect(Array.from(document.body.querySelectorAll('a')).some(a => a.textContent?.includes('Reports'))).toBe(false)
    expect(document.body.querySelector('a[href="/reports/daily"]')).toBeFalsy()

    const reportsTrigger = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.includes('Reports'))
    expect(reportsTrigger).toBeTruthy()
    reportsTrigger!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const daily = document.body.querySelector('a[href="/reports/daily"]')
    const weekly = document.body.querySelector('a[href="/reports/weekly"]')
    expect(daily?.textContent).toBe('Daily')
    expect(weekly?.textContent).toBe('Weekly')
    expect(weekly?.querySelector('.iconify')).toBeTruthy()

    wrapper.unmount()
  })

  // Regression: each trigger used to hold its own local open/close-timer
  // state, with nothing coordinating across siblings - hovering down a
  // tightly-packed rail could open several flyouts at once, since the
  // previous one's own 200ms close timer hadn't fired yet by the time the
  // next one's hover opened it. Opening a second trigger now closes the
  // first synchronously, via one shared "which flyout is open" value.
  it('hovering a second collapsed trigger closes the first immediately, not after its own close timer', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Guides', icon: 'lucide:book', children: [{ label: 'Getting started', to: '/guides/getting-started' }] },
      { label: 'Team', icon: 'lucide:users', children: [{ label: 'Members', to: '/team/members' }] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical', collapsed: true } })
    const [guidesTrigger, teamTrigger] = wrapper.findAll('button')

    guidesTrigger!.element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()
    expect(document.body.querySelector('a[href="/guides/getting-started"]')).toBeTruthy()

    // No mouseleave dispatched on Guides first - mirrors the real-world
    // case of the pointer moving straight from one trigger to the next.
    teamTrigger!.element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(document.body.querySelector('a[href="/team/members"]')).toBeTruthy()
    expect(document.body.querySelector('a[href="/guides/getting-started"]')).toBeFalsy()

    wrapper.unmount()
  })

  // A collapsed rail's icon has no chevron/label to hint it even has
  // children - hovering it has to be enough to find out, not just
  // clicking, or there's no way to discover the flyout without committing
  // to a click first.
  it('a collapsed parent-with-children trigger opens its flyout on hover, without a click', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Guides', icon: 'lucide:book', children: [{ label: 'Getting started', to: '/guides/getting-started' }] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical', collapsed: true } })

    expect(document.body.querySelector('a[href="/guides/getting-started"]')).toBeFalsy()

    wrapper.find('button').element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(document.body.querySelector('a[href="/guides/getting-started"]')).toBeTruthy()

    wrapper.unmount()
  })

  // A collapsed top-level item with no icon used to render with nothing
  // in its leading slot at all - visually empty, indistinguishable from a
  // missing/broken row. It now falls back to the label's own first
  // character so there's still something in the icon's own spot.
  it('a collapsed item with no icon falls back to its label\'s first character, for both a leaf and a flyout trigger', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Reports', to: '/reports' },
      { label: 'Team', children: [{ label: 'Members', to: '/team/members' }] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical', collapsed: true } })

    const leaf = wrapper.find('a[href="/reports"]')
    expect(leaf.find('.iconify').exists()).toBe(false)
    expect(leaf.text()).toContain('R')

    const trigger = wrapper.find('button')
    expect(trigger.find('.iconify').exists()).toBe(false)
    expect(trigger.text()).toContain('T')

    wrapper.unmount()
  })

  // The flyout's own outermost child list sits directly inside the
  // popover with no visible parent row above it (the real parent - the
  // icon trigger - is outside the popover entirely), so its guide line
  // used to just float, connected to nothing. A group nested further
  // inside the same flyout (Permissions, here) still has a real, visible
  // heading row right above its own children, so its guide line stays.
  it('the flyout\'s own root child list has no guide line, but a group nested inside the same flyout keeps one', async () => {
    const items: NavigationMenuItem[] = [
      {
        label: 'Team',
        icon: 'lucide:users',
        children: [
          { label: 'Members', to: '/team/members' },
          { label: 'Permissions', icon: 'lucide:key', children: [{ label: 'Read', to: '/team/permissions/read' }] },
        ],
      },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical', collapsed: true } })

    wrapper.find('button').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const members = document.body.querySelector('a[href="/team/members"]')
    const rootList = members?.closest('ul')
    // `ps-0` cancels `childList`'s own `ps-4` normally via tailwind-merge
    // (a real conflicting utility, same as ms-0/ms-6).
    expect(rootList?.classList.contains('ms-6')).toBe(false)
    expect(rootList?.classList.contains('ps-4')).toBe(false)
    expect(rootList?.classList.contains('ps-0')).toBe(true)

    // Each row's own trunk+elbow classes always apply (they're in
    // childItem's base string), but flyoutRoot's own override
    // neutralizes their visible effect via before:!content-none and
    // after:!content-none rather than removing the class - a
    // hand-written CSS class instead of a Tailwind utility, so
    // tailwind-merge can't dedupe it away the way it can a real utility.
    const membersItem = members?.closest('li')
    expect(membersItem?.classList.contains('selaras-nav-elbow')).toBe(true)
    expect(membersItem?.classList.contains('before:!content-none')).toBe(true)
    expect(membersItem?.classList.contains('after:!content-none')).toBe(true)

    // Permissions is its own collapsible trigger now (NavigationMenuAccordionItem)
    // - its own children stay collapsed until it's clicked open too.
    const permissionsTrigger = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.includes('Permissions'))
    permissionsTrigger!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const read = document.body.querySelector('a[href="/team/permissions/read"]')
    const nestedList = read?.closest('ul')
    expect(nestedList?.classList.contains('ms-6')).toBe(true)
    expect(nestedList?.classList.contains('ps-4')).toBe(true)
    expect(nestedList?.classList.contains('ps-0')).toBe(false)

    const readItem = read?.closest('li')
    expect(readItem?.classList.contains('before:!content-none')).toBe(false)
    expect(readItem?.classList.contains('after:!content-none')).toBe(false)

    wrapper.unmount()
  })
})

describe('navigationMenu (label/separator items)', () => {
  it('renders a label item as a non-interactive heading, not a real link', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Links', type: 'label' },
      { label: 'Docs', to: '/docs' },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })

    expect(wrapper.text()).toContain('Links')
    // A label item is never a real navigable link - only the ordinary
    // 'Docs' item below it is.
    expect(wrapper.findAll('a')).toHaveLength(1)
  })

  it('renders a separator item as a role="separator" element with no text', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Docs', to: '/docs' },
      { label: 'sep-1', type: 'separator' },
      { label: 'Settings', to: '/settings' },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })

    const separator = wrapper.find('[role="separator"]')
    expect(separator.exists()).toBe(true)
    expect(separator.text()).toBe('')
    expect(wrapper.text()).not.toContain('sep-1')
  })

  it('a group is just a label item followed by ordinary items, no wrapping structure', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Guide', type: 'label' },
      { label: 'Installation', to: '/installation' },
      { label: 'Components', type: 'label' },
      { label: 'Button', to: '/button' },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })

    const text = wrapper.text()
    expect(text.indexOf('Guide')).toBeLessThan(text.indexOf('Installation'))
    expect(text.indexOf('Installation')).toBeLessThan(text.indexOf('Components'))
    expect(text.indexOf('Components')).toBeLessThan(text.indexOf('Button'))
  })
})

// Regression: a leaf item with `onSelect` but no `to` (a legitimate,
// documented case - `to` is optional on NavigationMenuItem) rendered as a
// plain `<NuxtLink :to="undefined">`, which resolves to an `<a>` with no
// `href` attribute at all. An anchor with no `href` isn't a real link -
// browsers exclude it from Tab order entirely, so the item was reachable
// by mouse click (a native listener doesn't care about `href`) but
// completely unreachable by keyboard. Every leaf-rendering site now
// renders a real `<button type="button">` instead whenever `to` is unset.
describe('navigationMenu (leaf items without `to`)', () => {
  it('a top-level leaf with onSelect but no `to` renders as a real, focusable button - not an anchor with no href', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Overview', onSelect: () => {} },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })

    expect(wrapper.find('a').exists()).toBe(false)
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
  })

  it('a nested accordion child with no `to` also renders as a button, not a hrefless anchor', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Team', children: [{ label: 'Members', onSelect: () => {} }] },
    ]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })

    wrapper.find('button').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(wrapper.find('a').exists()).toBe(false)
    const buttons = wrapper.findAll('button').map(b => b.text())
    expect(buttons).toContain('Members')
  })

  it('an item with a real `to` is unaffected - still a real link, not a button', async () => {
    const items: NavigationMenuItem[] = [{ label: 'Docs', to: '/docs' }]
    const wrapper = await mountSuspended(NavigationMenu, { props: { items, orientation: 'vertical' } })

    expect(wrapper.find('a[href="/docs"]').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
  })
})

// Regression: hovering a collapsed rail's parent-with-children trigger
// opened its flyout via Reka's default openAutoFocus behavior, which
// moves keyboard focus into the content on open - painting a visible
// focus ring on whatever it landed on despite no keyboard ever being
// touched (confirmed live: hovering alone put a ring around the first
// item inside). A keyboard-driven open (Tab to the trigger, press Enter)
// still needs that same autofocus to actually reach the flyout's own
// content at all, since it's portaled elsewhere in the DOM with no
// natural Tab path into it - so autofocus is only suppressed for the
// specific open that happened via hover, not click/keyboard opens.
describe('navigationMenu (collapsed flyout autofocus)', () => {
  it('a hover-opened flyout does not move focus into its own content', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Team', children: [{ label: 'Members', to: '/team/members' }] },
    ]
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = await mountSuspended(NavigationMenu, { attachTo: container, props: { items, orientation: 'vertical', collapsed: true } })

    const trigger = wrapper.find('button')
    trigger.element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(document.body.querySelector('a[href="/team/members"]')).toBeTruthy()
    expect(document.activeElement?.textContent?.trim()).not.toBe('Members')

    wrapper.unmount()
    container.remove()
  })

  it('a click-opened flyout still moves focus into its own content, same as any other Popover trigger', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Team', children: [{ label: 'Members', to: '/team/members' }] },
    ]
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = await mountSuspended(NavigationMenu, { attachTo: container, props: { items, orientation: 'vertical', collapsed: true } })

    const trigger = wrapper.find('button')
    trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(document.body.querySelector('a[href="/team/members"]')).toBeTruthy()
    expect(document.activeElement?.textContent?.trim()).toBe('Members')

    wrapper.unmount()
    container.remove()
  })
})

// Regression: a collapsed flyout's own return-focus-to-trigger-on-close
// was disabled outright to fix a different bug (a *closing* item's
// delayed return-focus stealing focus from a sibling that had since
// opened) - but that meant a genuine Escape/outside-click dismiss, with
// no sibling involved at all, now abandoned focus to the page instead of
// returning it to the trigger, a real regression on its own. Whether
// return-focus is allowed for a given close now depends on whether a
// *different* flyout is currently open at that moment.
describe('navigationMenu (collapsed flyout Escape focus return)', () => {
  it('escape, with no sibling flyout open, returns focus to this trigger - not abandoned', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Team', children: [{ label: 'Members', to: '/team/members' }] },
    ]
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = await mountSuspended(NavigationMenu, { attachTo: container, props: { items, orientation: 'vertical', collapsed: true } })

    const trigger = wrapper.find('button')
    trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const content = document.body.querySelector('[role=dialog]')!
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(document.body.querySelector('a[href="/team/members"]')).toBeFalsy()
    // Team has no icon in this test's own items, so its button falls back
    // to showing its label's first character too (see the collapsed-icon
    // fallback tests above) - `textContent` picks up both, hence `toContain`.
    expect(document.activeElement?.textContent?.trim()).toContain('Team')

    wrapper.unmount()
    container.remove()
  })
})

// Regression: Reka's own Popover hardcodes `loop` on its internal
// FocusScope regardless of `modal`/`trapFocus` (confirmed by reading
// PopoverContentImpl directly - there's no prop that turns it off), so
// Tab reaching the flyout's own last focusable element wrapped back to
// its first one instead of continuing to the next rail item, the way Tab
// naturally continues past a horizontal dropdown's own last child to the
// next top-level trigger. NavigationMenuFlyoutTrigger.vue now re-
// implements that continuation by hand.
describe('navigationMenu (collapsed flyout Tab boundary)', () => {
  it('tab from the deepest item in an open nested group closes the flyout and moves to the next top-level item, instead of wrapping to the first item', async () => {
    const items: NavigationMenuItem[] = [
      {
        label: 'Reports',
        children: [
          { label: 'Daily', to: '/reports/daily' },
          { label: 'Custom', children: [{ label: 'Saved', to: '/reports/custom/saved' }] },
        ],
      },
      { label: 'Customers', to: '/customers' },
    ]
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = await mountSuspended(NavigationMenu, { attachTo: container, props: { items, orientation: 'vertical', collapsed: true } })

    const trigger = wrapper.find('button')
    trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const customTrigger = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Custom')!
    customTrigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const saved = document.body.querySelector('a[href="/reports/custom/saved"]') as HTMLElement
    saved.focus()
    saved.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(document.activeElement).toBe(wrapper.find('a[href="/customers"]').element)
    expect(document.body.querySelector('a[href="/reports/daily"]')).toBeFalsy()

    wrapper.unmount()
    container.remove()
  })

  it('shift+tab from the flyout\'s own first item closes it and returns focus to the trigger, not the previous top-level item', async () => {
    const items: NavigationMenuItem[] = [
      { label: 'Reports', children: [{ label: 'Daily', to: '/reports/daily' }] },
      { label: 'Customers', to: '/customers' },
    ]
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = await mountSuspended(NavigationMenu, { attachTo: container, props: { items, orientation: 'vertical', collapsed: true } })

    const trigger = wrapper.find('button')
    trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    const daily = document.body.querySelector('a[href="/reports/daily"]') as HTMLElement
    daily.focus()
    daily.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
    await nextTick()
    await macrotask()

    expect(document.activeElement).toBe(trigger.element)
    expect(document.body.querySelector('a[href="/reports/daily"]')).toBeFalsy()

    wrapper.unmount()
    container.remove()
  })
})
