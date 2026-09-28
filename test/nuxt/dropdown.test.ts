import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { useRouter } from '#app'
import Dropdown from '../../src/runtime/components/Dropdown.vue'
import './helpers/adaptive-breakpoint'

// DropdownMenuContent renders through a real Teleport to document.body once
// opened (not stubbed in this test environment), same as Modal's
// DialogContent - query document.body directly instead of wrapper.find.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined
let restoreMatchMedia: (() => void) | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  restoreMatchMedia?.()
  restoreMatchMedia = undefined
})

async function openMenu() {
  const trigger = wrapper!.find('button')
  await trigger.trigger('click')
  await new Promise(resolve => setTimeout(resolve, 50))
}

function mockMatchMedia(matches: boolean) {
  const original = window.matchMedia
  const mediaQuery = {
    matches,
    media: '(width < 48rem)',
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList
  window.matchMedia = (() => mediaQuery) as unknown as typeof window.matchMedia
  return () => window.matchMedia = original
}

function mockResponsiveMatchMedia(matches: boolean) {
  const original = window.matchMedia
  let current = matches
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mediaQuery = {
    get matches() { return current },
    media: '(width < 48rem)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList
  window.matchMedia = (() => mediaQuery) as unknown as typeof window.matchMedia
  return {
    setMatches(value: boolean) {
      current = value
      listeners.forEach(listener => listener({ matches: value } as MediaQueryListEvent))
    },
    restore: () => window.matchMedia = original,
  }
}

describe('dropdown', () => {
  it('keeps the default portal and allows inline positioning', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    expect(wrapper.find('[role=menu]').exists()).toBe(false)
    expect(document.body.querySelector('[role=menu]')).toBeTruthy()
    wrapper.unmount()
    wrapper = undefined

    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, portal: false, positioning: { side: 'top', align: 'end' }, items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    expect(wrapper.find('[role=menu]').attributes('data-side')).toBe('top')
  })

  it('supports defaultOpen for uncontrolled menus', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { defaultOpen: true, items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })

    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('lets a controlled parent veto a close request', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })

    const trigger = wrapper.find('button')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    await trigger.trigger('click')

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(trigger.attributes('aria-expanded')).toBe('true')
  })

  it('opens the menu and lists every item across all groups when the trigger is clicked', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: {
        items: [
          [{ label: 'Edit' }, { label: 'Duplicate' }],
          [{ label: 'Delete' }],
        ],
      },
      slots: { default: () => h('button', 'Open menu') },
    })
    await openMenu()

    const items = document.body.querySelectorAll('[role="menuitem"]')
    expect(Array.from(items).map(el => el.textContent?.trim())).toEqual(['Edit', 'Duplicate', 'Delete'])
  })

  it('renders a separator between groups but not before the first one', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { items: [[{ label: 'A' }], [{ label: 'B' }], [{ label: 'C' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await openMenu()

    expect(document.body.querySelectorAll('[role="separator"]')).toHaveLength(2)
  })

  it('calls the item\'s onSelect handler when clicked', async () => {
    const onSelect = vi.fn()
    wrapper = await mountSuspended(Dropdown, {
      props: { items: [[{ label: 'Archive', onSelect }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await openMenu()

    const item = document.body.querySelector<HTMLElement>('[role="menuitem"]')!
    item.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('marks a disabled item so it cannot be selected', async () => {
    const onSelect = vi.fn()
    wrapper = await mountSuspended(Dropdown, {
      props: { items: [[{ label: 'Locked', disabled: true, onSelect }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await openMenu()

    const item = document.body.querySelector<HTMLElement>('[role="menuitem"]')!
    expect(item.getAttribute('data-disabled')).not.toBeNull()
  })

  it('renders a Nuxt link item with its destination and target', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Documentation', to: '/docs', target: '_blank', shortcut: 'mod+d' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })

    const link = document.body.querySelector<HTMLAnchorElement>('[role="menuitem"]')!
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/docs')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.textContent).toContain('Documentation')
    expect(link.textContent).toContain('⌃')
    expect(link.textContent).toContain('d')
  })

  it('activates a link item shortcut through the link and item selection path', async () => {
    const onSelect = vi.fn()
    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Documentation', to: '/docs', shortcut: 'mod+d', hotkey: true, onSelect }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await new Promise(resolve => setTimeout(resolve, 50))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', ctrlKey: true, bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('does not activate a disabled item shortcut', async () => {
    const onSelect = vi.fn()
    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Locked', shortcut: 'mod+l', hotkey: true, disabled: true, onSelect }]] },
      slots: { default: () => h('button', 'Open menu') },
    })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', ctrlKey: true, bubbles: true, cancelable: true }))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('fires an opted-in item shortcut through the normal selection path', async () => {
    const onSelect = vi.fn()
    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Archive', shortcut: 'mod+e', hotkey: true, onSelect }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await new Promise(resolve => setTimeout(resolve, 50))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', ctrlKey: true, bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('keeps a displayed shortcut inactive unless hotkey is enabled', async () => {
    const onSelect = vi.fn()
    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Archive', shortcut: 'mod+e', onSelect }]] },
      slots: { default: () => h('button', 'Open menu') },
    })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', ctrlKey: true, bubbles: true, cancelable: true }))
    expect(onSelect).not.toHaveBeenCalled()
    expect(document.body.querySelector('[role="menuitem"]')?.textContent).toContain('Archive')
  })

  it('the item slot replaces an item\'s label content, scoped with item', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { items: [[{ label: 'Edit' }]] },
      slots: {
        default: () => h('button', 'Open menu'),
        item: '<template #item="{ item }">[{{ item.label }}]</template>',
      },
    })
    await openMenu()

    expect(document.body.querySelector('[role="menuitem"]')?.textContent?.trim()).toBe('[Edit]')
  })

  it('shows the shortcut hint by default, and leaves a custom item slot in full control of it', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Archive', shortcut: 'mod+e' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    expect(document.body.querySelectorAll('[role="menuitem"] kbd').length).toBeGreaterThan(0)
    wrapper.unmount()

    wrapper = await mountSuspended(Dropdown, {
      props: { open: true, items: [[{ label: 'Archive', shortcut: 'mod+e' }]] },
      slots: {
        default: () => h('button', 'Open menu'),
        item: '<template #item="{ item }">{{ item.label }} ({{ item.shortcut }})</template>',
      },
    })
    const item = document.body.querySelector('[role="menuitem"]')!
    expect(item.querySelectorAll('kbd')).toHaveLength(0)
    expect(item.textContent?.trim()).toBe('Archive (mod+e)')
  })

  it('falls back to the plain label when the item slot is unset', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await openMenu()

    expect(document.body.querySelector('[role="menuitem"]')?.textContent?.trim()).toBe('Edit')
  })

  it('applies the destructive variant\'s classes only to the item marked destructive', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { items: [[{ label: 'Edit' }, { label: 'Delete', destructive: true }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await openMenu()

    const items = document.body.querySelectorAll('[role="menuitem"]')
    expect(items[0]!.className).not.toContain('text-[var(--selaras-resolved-color-danger-text)]')
    expect(items[1]!.className).toContain('text-[var(--selaras-resolved-color-danger-text)]')
    expect(items[1]!.className).toContain('data-[highlighted]:text-[var(--selaras-resolved-color-danger-on-subtle)]')
  })

  it('renders no arrow element by default', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await openMenu()

    expect(document.body.querySelector('.fill-\\[var\\(--selaras-resolved-surface-default\\)\\]')).toBeFalsy()
  })

  it('arrow renders the pointer triangle', async () => {
    wrapper = await mountSuspended(Dropdown, {
      props: { items: [[{ label: 'Edit' }]], arrow: { width: 16, height: 8, rounded: true, padding: 12 } },
      slots: { default: () => h('button', 'Open menu') },
    })
    await openMenu()

    const arrow = document.body.querySelector('.fill-\\[var\\(--selaras-resolved-surface-default\\)\\]')
    expect(arrow?.getAttribute('width')).toBe('16')
    expect(arrow?.getAttribute('height')).toBe('8')
  })

  it('adaptive stays an anchored menu on desktop', async () => {
    restoreMatchMedia = mockMatchMedia(false)
    wrapper = await mountSuspended(Dropdown, {
      props: { adaptive: true, items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await wrapper.find('button').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role="menu"]')).toBeTruthy()
    expect(document.body.querySelector('[role="dialog"]')).toBeFalsy()
  })

  it('adaptive opens a mobile action dialog and runs action items', async () => {
    restoreMatchMedia = mockMatchMedia(true)
    const onSelect = vi.fn()
    wrapper = await mountSuspended(Dropdown, {
      props: { adaptive: true, items: [[{ label: 'Edit', onSelect }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    const trigger = wrapper.find('button')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    await trigger.trigger('click')
    await nextTick()

    expect(document.body.querySelector('[role="dialog"]')?.textContent).toContain('Edit')
    expect(document.body.querySelector('[role="menu"]')).toBeFalsy()
    document.body.querySelector<HTMLButtonElement>('[role="dialog"] button:not([aria-label])')?.click()
    await nextTick()

    expect(onSelect).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('adaptive renders a disabled link item as an inert control that cannot navigate', async () => {
    restoreMatchMedia = mockMatchMedia(true)
    const onSelect = vi.fn()
    wrapper = await mountSuspended(Dropdown, {
      props: { adaptive: true, items: [[{ label: 'Docs', to: '/disabled-destination', disabled: true, onSelect }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await wrapper.find('button').trigger('click')
    await nextTick()

    const dialog = document.body.querySelector('[role="dialog"]')!
    expect(dialog.querySelector('a[href="/disabled-destination"]')).toBeFalsy()
    const item = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button')).find(button => button.textContent?.includes('Docs'))!
    expect(item.disabled).toBe(true)
    item.click()
    await nextTick()

    expect(onSelect).not.toHaveBeenCalled()
    expect(useRouter().currentRoute.value.path).not.toBe('/disabled-destination')
  })

  it('adaptive keeps the trigger describing the surface it opens across a resize', async () => {
    const media = mockResponsiveMatchMedia(false)
    restoreMatchMedia = media.restore
    wrapper = await mountSuspended(Dropdown, {
      props: { adaptive: true, items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    const trigger = wrapper.find('button')
    await nextTick()
    expect(trigger.attributes('aria-haspopup')).toBe('menu')

    media.setMatches(true)
    await nextTick()
    await nextTick()
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')

    media.setMatches(false)
    await nextTick()
    await nextTick()
    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('adaptive items merge their mobile sizing over the desktop item classes', async () => {
    restoreMatchMedia = mockMatchMedia(true)
    wrapper = await mountSuspended(Dropdown, {
      props: { adaptive: true, items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('button', 'Open menu') },
    })
    await wrapper.find('button').trigger('click')
    await nextTick()

    const item = Array.from(document.body.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')).find(button => button.textContent?.includes('Edit'))!
    const classes = item.className.split(/\s+/)
    expect(classes).toEqual(expect.arrayContaining(['min-h-11', 'px-3', 'py-2', 'text-base']))
    expect(classes).not.toContain('px-2')
    expect(classes).not.toContain('text-sm')
  })
})
