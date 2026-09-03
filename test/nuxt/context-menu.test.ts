import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import ContextMenu from '../../src/runtime/components/ContextMenu.vue'

// ContextMenuContent renders through a real Teleport to document.body once
// opened (not stubbed in this test environment), same as Dropdown's own
// DropdownMenuContent - query document.body directly instead of wrapper.find.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

// Opened via a real `contextmenu` event (right-click), not a plain click -
// that's the whole behavioral difference from Dropdown.
async function openMenu() {
  const trigger = wrapper!.find('[data-testid="target"]')
  await trigger.trigger('contextmenu')
  await new Promise(resolve => setTimeout(resolve, 50))
}

describe('contextMenu', () => {
  it('opens the menu and lists every item across all groups on right-click', async () => {
    wrapper = await mountSuspended(ContextMenu, {
      props: {
        items: [
          [{ label: 'Edit' }, { label: 'Duplicate' }],
          [{ label: 'Delete' }],
        ],
      },
      slots: { default: () => h('div', { 'data-testid': 'target' }, 'Right-click me') },
    })
    await openMenu()

    const items = document.body.querySelectorAll('[role="menuitem"]')
    expect(Array.from(items).map(el => el.textContent?.trim())).toEqual(['Edit', 'Duplicate', 'Delete'])
  })

  it('renders a separator between groups but not before the first one', async () => {
    wrapper = await mountSuspended(ContextMenu, {
      props: { items: [[{ label: 'A' }], [{ label: 'B' }], [{ label: 'C' }]] },
      slots: { default: () => h('div', { 'data-testid': 'target' }, 'Right-click me') },
    })
    await openMenu()

    expect(document.body.querySelectorAll('[role="separator"]')).toHaveLength(2)
  })

  it('calls the item\'s onSelect handler when clicked', async () => {
    const onSelect = vi.fn()
    wrapper = await mountSuspended(ContextMenu, {
      props: { items: [[{ label: 'Archive', onSelect }]] },
      slots: { default: () => h('div', { 'data-testid': 'target' }, 'Right-click me') },
    })
    await openMenu()

    const item = document.body.querySelector<HTMLElement>('[role="menuitem"]')!
    item.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('marks a disabled item so it cannot be selected', async () => {
    const onSelect = vi.fn()
    wrapper = await mountSuspended(ContextMenu, {
      props: { items: [[{ label: 'Locked', disabled: true, onSelect }]] },
      slots: { default: () => h('div', { 'data-testid': 'target' }, 'Right-click me') },
    })
    await openMenu()

    const item = document.body.querySelector<HTMLElement>('[role="menuitem"]')!
    expect(item.getAttribute('data-disabled')).not.toBeNull()
  })

  it('the item slot replaces an item\'s label content, scoped with item', async () => {
    wrapper = await mountSuspended(ContextMenu, {
      props: { items: [[{ label: 'Edit' }]] },
      slots: {
        default: () => h('div', { 'data-testid': 'target' }, 'Right-click me'),
        item: '<template #item="{ item }">[{{ item.label }}]</template>',
      },
    })
    await openMenu()

    expect(document.body.querySelector('[role="menuitem"]')?.textContent?.trim()).toBe('[Edit]')
  })

  it('falls back to the plain label when the item slot is unset', async () => {
    wrapper = await mountSuspended(ContextMenu, {
      props: { items: [[{ label: 'Edit' }]] },
      slots: { default: () => h('div', { 'data-testid': 'target' }, 'Right-click me') },
    })
    await openMenu()

    expect(document.body.querySelector('[role="menuitem"]')?.textContent?.trim()).toBe('Edit')
  })

  it('applies the destructive variant\'s classes only to the item marked destructive', async () => {
    wrapper = await mountSuspended(ContextMenu, {
      props: { items: [[{ label: 'Edit' }, { label: 'Delete', destructive: true }]] },
      slots: { default: () => h('div', { 'data-testid': 'target' }, 'Right-click me') },
    })
    await openMenu()

    const items = document.body.querySelectorAll('[role="menuitem"]')
    expect(items[0]!.className).not.toContain('text-[var(--ui-danger)]')
    expect(items[1]!.className).toContain('text-[var(--ui-danger)]')
  })
})
