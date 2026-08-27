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
})
