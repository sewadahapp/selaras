import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Dropdown from '../../src/runtime/components/Dropdown.vue'

// DropdownMenuContent renders through a real Teleport to document.body once
// opened (not stubbed in this test environment), same as Modal's
// DialogContent - query document.body directly instead of wrapper.find.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

async function openMenu() {
  const trigger = wrapper!.find('button')
  await trigger.trigger('click')
  await new Promise(resolve => setTimeout(resolve, 50))
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
})
